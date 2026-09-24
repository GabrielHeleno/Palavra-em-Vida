import { jsPDF } from 'jspdf';
import { ScripturePassage } from '../types/bible';
import {
  CARD_WIDTH_MM,
  CARD_HEIGHT_MM,
  CARD_MARGIN_X_MM,
  CARD_MARGIN_Y_MM,
  DEFAULT_LOGO_SIZE_MM,
  LogoCorner,
} from './cardMeasurement';
import { registerNexaFonts } from './nexaFontData';

export interface PDFGenerationConfig {
  passages: ScripturePassage[];
  logoDataUrl?: string;
  logoAspectRatio?: number; // width / height
  parishName?: string;
  fontSizePt: number;
}

export function generateBibleCardsPDF(config: PDFGenerationConfig): { doc: jsPDF; filename: string } {
  const {
    passages,
    logoDataUrl,
    logoAspectRatio = 1,
    parishName,
    fontSizePt,
  } = config;

  if (passages.length !== 12) {
    throw new Error('A folha de impressão requer exatamente 12 passagens bíblicas.');
  }

  // Cria documento A4 Paisagem (297 mm x 210 mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // Registra e ativa a família tipográfica Nexa (TrueType)
  registerNexaFonts(doc);
  const fontName = doc.getFontList()['Nexa'] ? 'Nexa' : 'helvetica';

  const pageMarginX = 12;
  const pageMarginY = 12;

  // Tamanho fixo da logo: 17 mm, preservando proporção
  const FIXED_LOGO_SIZE_MM = 17;
  let finalLogoW = FIXED_LOGO_SIZE_MM;
  let finalLogoH = FIXED_LOGO_SIZE_MM;
  if (logoDataUrl) {
    if (logoAspectRatio > 1) {
      finalLogoW = FIXED_LOGO_SIZE_MM;
      finalLogoH = FIXED_LOGO_SIZE_MM / logoAspectRatio;
    } else {
      finalLogoH = FIXED_LOGO_SIZE_MM;
      finalLogoW = FIXED_LOGO_SIZE_MM * logoAspectRatio;
    }
  }

  const hasLogo = !!logoDataUrl;
  const textAvailableWidth = hasLogo
    ? CARD_WIDTH_MM - (CARD_MARGIN_X_MM * 2 + finalLogoW + 3)
    : CARD_WIDTH_MM - CARD_MARGIN_X_MM * 2;

  // Itera pelas 4 linhas e 3 colunas (12 cartões)
  for (let index = 0; index < 12; index++) {
    const passage = passages[index];
    const col = index % 3;
    const row = Math.floor(index / 3);

    const cardX = pageMarginX + col * CARD_WIDTH_MM;
    const cardY = pageMarginY + row * CARD_HEIGHT_MM;

    // 1. Linha de corte discreta (0.2 mm / ~0.5 pt)
    doc.setDrawColor(190, 190, 185);
    doc.setLineWidth(0.2);
    doc.rect(cardX, cardY, CARD_WIDTH_MM, CARD_HEIGHT_MM);

    // 2. Traço decorativo dourado pastoral sutil no topo do cartão
    doc.setDrawColor(217, 119, 6); // Dourado âmbar
    doc.setLineWidth(0.3);
    doc.line(cardX + CARD_MARGIN_X_MM, cardY + 9, cardX + CARD_MARGIN_X_MM + 20, cardY + 9);

    // 3. Referência bíblica destacada (Verde profundo #064E3B)
    doc.setFont(fontName, 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(6, 78, 59);
    doc.text(passage.displayRef, cardX + CARD_MARGIN_X_MM, cardY + 7);

    // 4. Inclusão da logo da paróquia: tamanho 17mm, à direita e centralizada verticalmente
    if (logoDataUrl) {
      const logoX = cardX + CARD_WIDTH_MM - CARD_MARGIN_X_MM - finalLogoW;
      const logoY = cardY + (CARD_HEIGHT_MM - finalLogoH) / 2;

      try {
        const format = logoDataUrl.includes('image/png') ? 'PNG' : 'JPEG';
        doc.addImage(logoDataUrl, format, logoX, logoY, finalLogoW, finalLogoH);
      } catch (err) {
        console.warn('Não foi possível renderizar imagem do logotipo no cartão:', err);
      }
    }

    // 5. Texto bíblico literal ipsis litteris (Tipografia Nexa a 12pt)
    doc.setFont(fontName, 'normal');
    let effectiveFontSize = fontSizePt;
    doc.setFontSize(effectiveFontSize);
    doc.setTextColor(35, 35, 35);

    // Altura vertical útil para o corpo do texto antes do rodapé
    const topBoundaryMm = cardY + 11.5;
    const bottomBoundaryMm = cardY + CARD_HEIGHT_MM - (parishName && parishName.trim() ? 5.0 : 2.5);
    const availableHeightMm = bottomBoundaryMm - topBoundaryMm;
    const lineHeightFactor = 1.22;

    let lines = doc.splitTextToSize(passage.text, textAvailableWidth);
    let textHeightMm = lines.length * (effectiveFontSize * 0.352777 * lineHeightFactor);

    // Se uma passagem for muito extensa para caber no cartão com a logo de 17mm,
    // escala suavemente para que nenhum versículo seja cortado
    while (textHeightMm > availableHeightMm && effectiveFontSize > 8.5) {
      effectiveFontSize -= 0.5;
      doc.setFontSize(effectiveFontSize);
      lines = doc.splitTextToSize(passage.text, textAvailableWidth);
      textHeightMm = lines.length * (effectiveFontSize * 0.352777 * lineHeightFactor);
    }

    // Centralização vertical exata do bloco de versículo dentro do box
    const verticalPaddingMm = Math.max(0, (availableHeightMm - textHeightMm) / 2);
    const textStartX = cardX + CARD_MARGIN_X_MM;
    const textStartY = topBoundaryMm + verticalPaddingMm + (effectiveFontSize * 0.352777 * 0.82);

    // Renderiza linhas centralizadas verticalmente
    doc.text(lines, textStartX, textStartY, {
      lineHeightFactor,
      maxWidth: textAvailableWidth,
    });

    // 6. Rodapé: texto 'Bíblia de Jerusalém' retirado conforme solicitação.
    // Exibe apenas o nome da Paróquia se configurado.
    if (parishName && parishName.trim()) {
      doc.setFont(fontName, 'italic');
      doc.setFontSize(6.5);
      doc.setTextColor(115, 115, 110);
      const parishText = parishName.trim();
      doc.text(parishText, cardX + CARD_MARGIN_X_MM, cardY + CARD_HEIGHT_MM - 2.8);
    }
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `palavra-em-vida-cartoes-${dateStr}.pdf`;

  return { doc, filename };
}

export function downloadBibleCardsPDF(config: PDFGenerationConfig): void {
  const { doc, filename } = generateBibleCardsPDF(config);
  doc.save(filename);
}

/**
  * Abre o PDF em aba cheia diretamente no navegador do usuário com autoPrint configurado,
  * sem passar por modais intermediários e sem ser bloqueado por bloqueadores de pop-up.
  */
export function openBibleCardsPDFInNewTab(config: PDFGenerationConfig): {
  doc: jsPDF;
  filename: string;
  blobUrl: string;
} {
  const { doc, filename } = generateBibleCardsPDF(config);
  doc.autoPrint();

  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);

  // Criação síncrona de âncora disparada diretamente pelo clique do usuário
  const link = document.createElement('a');
  link.href = blobUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Limpeza de memória
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 120000);

  return { doc, filename, blobUrl };
}

// Alias de conveniência
export const printBibleCardsPDF = openBibleCardsPDFInNewTab;


