/**
 * Assets oficiais empacotados pelo Vite (garantia de 100% de funcionamento no GitHub Pages, Vercel e Local)
 */
import defaultBgImage from '../assets/background_sao_caetano.jpg';
import defaultParishLogo from '../assets/paroquia_logo.jpg';

export const DEFAULT_BACKGROUND_URL = defaultBgImage;
export const DEFAULT_PARISH_LOGO_URL = defaultParishLogo;

export function resolveAssetUrl(url: string | undefined | null): string {
  if (!url) return DEFAULT_PARISH_LOGO_URL;
  if (
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('http://') ||
    url.startsWith('https://')
  ) {
    return url;
  }
  // Se for o caminho padrão do background
  if (url.includes('background_sao_caetano')) {
    return defaultBgImage;
  }
  // Se for o caminho padrão do logo
  if (url.includes('paroquia') || url.includes('1790185907674')) {
    return defaultParishLogo;
  }
  return url;
}

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

  // Lista padrão de logos com o logotipo oficial da paróquia empacotado
  return [
    {
      id: 'logo_paroquia_oficial',
      originalName: 'Logotipo Paróquia São Caetano.jpg',
      filename: 'paroquia_logo.jpg',
      url: DEFAULT_PARISH_LOGO_URL,
      uploadedAt: '2026-09-23T17:51:47.675Z',
      fileSizeBytes: 66000,
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
