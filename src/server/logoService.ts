import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

export interface AppLogoItem {
  id: string;
  originalName: string;
  filename: string;
  url: string;
  uploadedAt: string;
  fileSizeBytes: number;
  mimeType: string;
  isDefault: boolean;
}

export interface AppLogoRegistry {
  defaultLogoUrl: string | null;
  logos: AppLogoItem[];
}

const PUBLIC_UPLOADS_DIR = path.resolve(rootDir, 'public', 'uploads', 'logos');
const REGISTRY_FILE = path.resolve(rootDir, 'public', 'uploads', 'logos.json');

function ensureDirectories() {
  if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
    fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
  }
}

export function getLogoRegistry(): AppLogoRegistry {
  ensureDirectories();
  if (!fs.existsSync(REGISTRY_FILE)) {
    const initial: AppLogoRegistry = {
      defaultLogoUrl: null,
      logos: [],
    };
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  try {
    const data = fs.readFileSync(REGISTRY_FILE, 'utf-8');
    const registry: AppLogoRegistry = JSON.parse(data);
    return registry;
  } catch (err) {
    console.error('Erro ao ler registro de logos:', err);
    return { defaultLogoUrl: null, logos: [] };
  }
}

export function saveLogoRegistry(registry: AppLogoRegistry) {
  ensureDirectories();
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2), 'utf-8');

  // Se existir pasta dist, espelha para o build de produção
  const distUploads = path.resolve(rootDir, 'dist', 'uploads');
  if (fs.existsSync(distUploads)) {
    try {
      fs.writeFileSync(path.resolve(distUploads, 'logos.json'), JSON.stringify(registry, null, 2), 'utf-8');
    } catch {
      // ignore
    }
  }
}

export function saveUploadedLogo(
  dataUrl: string,
  originalName: string = 'logo-paroquia.jpg',
  setAsDefault: boolean = true
): AppLogoItem {
  ensureDirectories();

  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Formato de imagem inválido (dataUrl corrompido ou mal formatado)');
  }

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const timestamp = Date.now();

  let extension = '.jpg';
  if (mimeType.includes('png')) extension = '.png';
  else if (mimeType.includes('svg')) extension = '.svg';
  else if (mimeType.includes('webp')) extension = '.webp';
  else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = '.jpg';

  // Sanitiza nome de arquivo
  const safeName = originalName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();

  const filename = `${timestamp}_${safeName.endsWith(extension) ? safeName : `${safeName}${extension}`}`;
  const filePath = path.resolve(PUBLIC_UPLOADS_DIR, filename);

  fs.writeFileSync(filePath, buffer);

  // Espelha no dist se houver
  const distDir = path.resolve(rootDir, 'dist', 'uploads', 'logos');
  if (fs.existsSync(distDir)) {
    try {
      fs.writeFileSync(path.resolve(distDir, filename), buffer);
    } catch {
      // ignore
    }
  }

  const url = `/uploads/logos/${filename}`;
  const registry = getLogoRegistry();

  if (setAsDefault) {
    registry.logos.forEach(l => {
      l.isDefault = false;
    });
    registry.defaultLogoUrl = url;
  }

  const newLogo: AppLogoItem = {
    id: `logo_${timestamp}`,
    originalName: originalName || 'Logotipo da Paróquia',
    filename,
    url,
    uploadedAt: new Date().toISOString(),
    fileSizeBytes: buffer.length,
    mimeType,
    isDefault: setAsDefault,
  };

  // Se já existir imagem com mesmo nome ou URL, substitui ou adiciona no início
  registry.logos.unshift(newLogo);
  saveLogoRegistry(registry);

  return newLogo;
}

export function setDefaultLogo(idOrUrl: string): { success: boolean; defaultLogoUrl: string } {
  const registry = getLogoRegistry();
  const target = registry.logos.find(l => l.id === idOrUrl || l.url === idOrUrl);
  if (!target) {
    throw new Error('Logotipo não encontrado no histórico do aplicativo');
  }

  registry.logos.forEach(l => {
    l.isDefault = l.id === target.id;
  });
  registry.defaultLogoUrl = target.url;
  saveLogoRegistry(registry);

  return { success: true, defaultLogoUrl: target.url };
}

export function deleteLogo(id: string): { success: boolean; newDefaultUrl: string | null } {
  const registry = getLogoRegistry();
  const index = registry.logos.findIndex(l => l.id === id);
  if (index === -1) {
    throw new Error('Logotipo não encontrado');
  }

  const [removed] = registry.logos.splice(index, 1);
  const filePath = path.resolve(PUBLIC_UPLOADS_DIR, removed.filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.warn('Não foi possível remover arquivo físico do disco:', err);
    }
  }

  if (removed.isDefault) {
    if (registry.logos.length > 0) {
      registry.logos[0].isDefault = true;
      registry.defaultLogoUrl = registry.logos[0].url;
    } else {
      registry.defaultLogoUrl = null;
    }
  }

  saveLogoRegistry(registry);
  return { success: true, newDefaultUrl: registry.defaultLogoUrl };
}
