import { ScripturePassage, CardLayoutMetrics } from '../types/bible';

export const CARD_WIDTH_MM = 91;
export const CARD_HEIGHT_MM = 46.5;
export const CARD_MARGIN_X_MM = 4;
export const CARD_MARGIN_Y_MM = 4;
export const DEFAULT_LOGO_SIZE_MM = 17;
export const LOGO_WIDTH_MM = 17;
export const LOGO_HEIGHT_MM = 17;

export type LogoCorner = 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';

export interface CardMeasurementOptions {
  fontSizePt: number;
  hasLogo: boolean;
  logoPosition?: LogoCorner;
  logoSizeMm?: number;
  userCustomFontSize?: number;
}

/**
 * Divide o texto em linhas respeitando quebras de palavras e largura disponível
 */
export function wrapText(
  text: string,
  maxWidthMm: number,
  fontSizePt: number
): string[] {
  // 1 pt = 0.352777 mm
  // Estimativa média de largura de caractere com tipografia Nexa (sans-serif geométrica):
  // Em média 0.44 * fontSizePt * 0.3528 mm por caractere
  const charWidthMm = fontSizePt * 0.352777 * 0.44;
  const maxCharsPerLine = Math.floor(maxWidthMm / charWidthMm);

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Avalia o ajuste do texto de uma passagem dentro do cartão
 */
export function measurePassageInCard(
  passage: ScripturePassage,
  options: CardMeasurementOptions
): CardLayoutMetrics {
  const fontSizePt = options.userCustomFontSize || options.fontSizePt || 12;
  const lineHeightPt = fontSizePt * 1.22;
  const lineHeightMm = lineHeightPt * 0.352777;

  const logoSize = options.logoSizeMm || DEFAULT_LOGO_SIZE_MM;
  // Largura útil para o texto com logo de 17mm à direita
  const availableWidthMm = options.hasLogo
    ? CARD_WIDTH_MM - (CARD_MARGIN_X_MM * 2 + logoSize + 3) // ~63 mm
    : CARD_WIDTH_MM - CARD_MARGIN_X_MM * 2; // ~83 mm

  // Altura útil para o corpo do texto bíblico
  // Altura do cartão: 46.5mm
  // Margens superior e inferior: 8mm
  // Referência do topo: ~5.5mm
  // Altura livre máxima útil: ~32mm
  const availableHeightMm = 32.0;

  const lines = wrapText(passage.text, availableWidthMm, fontSizePt);
  const textHeightMm = lines.length * lineHeightMm;

  const overflows = textHeightMm > availableHeightMm;
  const fitsComfortably = textHeightMm <= availableHeightMm * 0.95;

  return {
    fontSizePt,
    lineHeightPt,
    lines,
    textHeightMm,
    totalCardHeightMm: CARD_HEIGHT_MM,
    availableHeightMm,
    fitsComfortably,
    overflows,
  };
}
