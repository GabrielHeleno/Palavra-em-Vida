/**
 * Utilitários para resolução de assets estáticos e persistência no cliente (LocalStorage + GitHub Pages)
 */

const BASE_URL = import.meta.env.BASE_URL || '/';

export function resolveAssetUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanPath = url.replace(/^\/+/, '');
  const cleanBase = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  return `${cleanBase}${cleanPath}`;
}

export const DEFAULT_BACKGROUND_URL = resolveAssetUrl('background_sao_caetano.jpg');
export const DEFAULT_PARISH_LOGO_URL = resolveAssetUrl('uploads/logos/1790185907674_copia_de_paroquia__3_.jpg');

// Converte URL estática para Data URL (base64) para garantir compatibilidade com jsPDF e Canvas
export async function urlToDataUrl(url: string): Promise<string> {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('Falha ao converter imagem para DataURL:', err);
    return url;
  }
}

// Chaves do LocalStorage para modo estático (GitHub Pages / Vercel / Offline)
const LS_LOGO_KEY = 'palavra_em_vida_custom_logo';
const LS_BG_KEY = 'palavra_em_vida_custom_bg';
const LS_LOGOS_HISTORY_KEY = 'palavra_em_vida_logos_history';

export interface LocalSavedLogo {
  id: string;
  originalName: string;
  filename: string;
  url: string;
  uploadedAt: string;
  fileSizeBytes: number;
  mimeType: string;
  isDefault: boolean;
}

export function getStoredLogo(): string | null {
  try {
    return localStorage.getItem(LS_LOGO_KEY);
  } catch {
    return null;
  }
}

export function setStoredLogo(dataUrl: string | null): void {
  try {
    if (dataUrl) {
      localStorage.setItem(LS_LOGO_KEY, dataUrl);
    } else {
      localStorage.removeItem(LS_LOGO_KEY);
    }
  } catch (err) {
    console.warn('Falha ao salvar logo no localStorage:', err);
  }
}

export function getStoredBackground(): string | null {
  try {
    return localStorage.getItem(LS_BG_KEY);
  } catch {
    return null;
  }
}

export function setStoredBackground(dataUrl: string | null): void {
  try {
    if (dataUrl) {
      localStorage.setItem(LS_BG_KEY, dataUrl);
    } else {
      localStorage.removeItem(LS_BG_KEY);
    }
  } catch (err) {
    console.warn('Falha ao salvar background no localStorage:', err);
  }
}

export function getStoredLogosHistory(): LocalSavedLogo[] {
  try {
    const raw = localStorage.getItem(LS_LOGOS_HISTORY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Falha ao carregar histórico local:', err);
  }

  // Lista padrão de logos com o logotipo oficial da paróquia
  return [
    {
      id: 'logo_paroquia_oficial',
      originalName: 'Cópia de paroquia (3).jpg',
      filename: '1790185907674_copia_de_paroquia__3_.jpg',
      url: DEFAULT_PARISH_LOGO_URL,
      uploadedAt: '2026-09-23T17:51:47.675Z',
      fileSizeBytes: 121356,
      mimeType: 'image/jpeg',
      isDefault: true,
    },
  ];
}

export function addStoredLogoHistory(logo: LocalSavedLogo): LocalSavedLogo[] {
  try {
    const list = getStoredLogosHistory();
    const updated = [logo, ...list.filter(l => l.id !== logo.id)];
    localStorage.setItem(LS_LOGOS_HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [logo];
  }
}
