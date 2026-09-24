export interface PresetLogo {
  id: string;
  name: string;
  description: string;
  svg: string;
}

export const PRESET_LOGOS: PresetLogo[] = [
  {
    id: 'cruz-jerusalem',
    name: 'Cruz de Jerusalém',
    description: 'Símbolo histórico das quatro extremidades da terra e dos evangelhos',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <!-- Cruz central -->
      <path d="M43 12h14v28h28v14H57v28H43V54H15V40h28V12z" fill="#064E3B"/>
      <!-- Quatro cruzetas nos cantos -->
      <path d="M22 17h6v7h7v6h-7v7h-6v-7h-7v-6h7v-7z" fill="#D97706"/>
      <path d="M72 17h6v7h7v6h-7v7h-6v-7h-7v-6h7v-7z" fill="#D97706"/>
      <path d="M22 67h6v7h7v6h-7v7h-6v-7h-7v-6h7v-7z" fill="#D97706"/>
      <path d="M72 67h6v7h7v6h-7v7h-6v-7h-7v-6h7v-7z" fill="#D97706"/>
    </svg>`,
  },
  {
    id: 'espirito-santo',
    name: 'Espírito Santo',
    description: 'A Pomba da Paz com raios da graça divina',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" stroke="#D97706" stroke-width="2" stroke-dasharray="3 3" opacity="0.6"/>
      <!-- Raios de luz -->
      <path d="M50 8v16M50 76v16M8 50h16M76 50h16M21 21l12 12M67 67l12 12M21 79l12-12M67 33l12-12" stroke="#D97706" stroke-width="2" stroke-linecap="round"/>
      <!-- Pomba estilizada -->
      <path d="M50 28c3 4 8 7 14 5-3 5-7 8-12 9 6 3 14 2 20-1-5 8-13 11-22 10-1 4-3 10-6 16-3-6-5-12-6-16-9 1-17-2-22-10 6 3 14 4 20 1-5-1-9-4-12-9 6 2 11-1 14-5 1 2 2 3 4 3s3-1 4-3z" fill="#064E3B"/>
    </svg>`,
  },
  {
    id: 'ihs-eucaristia',
    name: 'IHS Eucarístico',
    description: 'Monograma do Santo Nome de Jesus com a Cruz',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <!-- Resplendor solar -->
      <circle cx="50" cy="50" r="44" stroke="#D97706" stroke-width="1.5" stroke-dasharray="2 4"/>
      <!-- Cruz central encimada -->
      <path d="M47 18h6v12h12v6H53v10h-6V36H35v-6h12V18z" fill="#064E3B"/>
      <!-- Iniciais IHS -->
      <text x="50" y="66" text-anchor="middle" font-family="'Nexa', sans-serif" font-size="22" font-weight="bold" fill="#064E3B" letter-spacing="1.5">IHS</text>
      <!-- Três cravos na base -->
      <path d="M44 73l6 14 6-14h-12z" fill="#D97706"/>
    </svg>`,
  },
  {
    id: 'cruz-latina',
    name: 'Cruz Sagrada Clássica',
    description: 'Cruz latina sóbria com feixe dourado',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="38" r="22" stroke="#D97706" stroke-width="2.5" opacity="0.75"/>
      <path d="M44 14h12v22h22v12H56v42H44V48H22V36h22V14z" fill="#064E3B"/>
    </svg>`,
  },
  {
    id: 'peixe-ictis',
    name: 'Peixe Ictis (Cristão)',
    description: 'Símbolo dos primeiros discípulos de Cristo',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <!-- Curvas do peixe que se cruzam na cauda -->
      <path d="M12 50 C 32 25, 70 25, 92 68 M12 50 C 32 75, 70 75, 92 32" stroke="#064E3B" stroke-width="5" stroke-linecap="round"/>
      <!-- Olho / Cruz pequena no centro -->
      <circle cx="28" cy="48" r="4" fill="#D97706"/>
      <path d="M50 42v16M42 50h16" stroke="#D97706" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'alfa-omega',
    name: 'Alfa e Ômega',
    description: 'Cristo, princípio e fim de todas as coisas',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <!-- Cruz central -->
      <path d="M47 18h6v20h20v6H53v38h-6V44H27v-6h20V18z" fill="#064E3B"/>
      <!-- Letra Alfa à esquerda -->
      <text x="24" y="68" text-anchor="middle" font-family="'Nexa', sans-serif" font-size="20" font-weight="bold" fill="#D97706">A</text>
      <!-- Letra Ômega à direita -->
      <text x="76" y="68" text-anchor="middle" font-family="'Nexa', sans-serif" font-size="20" font-weight="bold" fill="#D97706">Ω</text>
    </svg>`,
  },
];

/**
 * Converte uma string SVG em Data URL PNG de alta resolução para uso no Canvas, Imagem e jsPDF
 */
export function svgToPngDataUrl(svgString: string, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);
          return;
        }
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const pngUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        resolve(pngUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        // Fallback para o data URL do svg
        resolve(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);
      };
      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}
