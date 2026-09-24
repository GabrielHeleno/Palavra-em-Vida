const fs = require('fs');
const path = require('path');

// Gera uma representação SVG rica e detalhada de São Caetano segurando o Menino Jesus à direita
// com raios celestes dourados e névoa verde-esmeralda/turquesa suave
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <!-- Gradiente do Céu Místico -->
    <radialGradient id="skyGrad" cx="65%" cy="10%" r="90%">
      <stop offset="0%" stop-color="#fff8db" stop-opacity="1" />
      <stop offset="25%" stop-color="#cbe6dc" stop-opacity="0.95" />
      <stop offset="55%" stop-color="#7ea89b" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#4a7c72" stop-opacity="1" />
    </radialGradient>

    <!-- Brilho Dourado Superior -->
    <radialGradient id="divineLight" cx="62%" cy="0%" r="55%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="20%" stop-color="#fef08a" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#d97706" stop-opacity="0" />
    </radialGradient>

    <!-- Halo Menino Jesus -->
    <radialGradient id="haloJesus" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fffbeb" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#fbbf24" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#d97706" stop-opacity="0" />
    </radialGradient>

    <!-- Textura de Nuvens -->
    <filter id="cloudBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="40" />
    </filter>
  </defs>

  <!-- Fundo Celestial Base -->
  <rect width="1920" height="1080" fill="url(#skyGrad)" />

  <!-- Feixes de Luz Divina irradiando do topo direito -->
  <g opacity="0.45">
    <polygon points="1150,0 1250,0 1450,1080 1200,1080" fill="#fef9c3" opacity="0.25" />
    <polygon points="1200,0 1320,0 1680,1080 1480,1080" fill="#fef08a" opacity="0.35" />
    <polygon points="1280,0 1380,0 1850,1080 1650,1080" fill="#fde047" opacity="0.2" />
    <polygon points="1050,0 1150,0 1100,1080 900,1080" fill="#fef9c3" opacity="0.15" />
  </g>

  <!-- Nuvens Suaves Etéreas na esquerda e base -->
  <g filter="url(#cloudBlur)" opacity="0.55">
    <ellipse cx="250" cy="850" rx="350" ry="180" fill="#cbe6dc" />
    <ellipse cx="600" cy="920" rx="420" ry="160" fill="#a7cbbe" />
    <ellipse cx="1000" cy="950" rx="500" ry="200" fill="#88b5a7" />
    <ellipse cx="150" cy="450" rx="300" ry="250" fill="#d8ece4" opacity="0.4" />
    <ellipse cx="350" cy="200" rx="250" ry="150" fill="#e8f5f0" opacity="0.3" />
  </g>

  <!-- Brilho celestial concentrado -->
  <rect width="1920" height="1080" fill="url(#divineLight)" />

  <!-- FIGURA SACRA DE SÃO CAETANO E O MENINO JESUS (Lado Direito) -->
  <g transform="translate(1120, 160)">
    <!-- Auréola / Glória dourada atrás das cabeças -->
    <circle cx="360" cy="240" r="280" fill="url(#haloJesus)" />
    <circle cx="340" cy="210" r="160" fill="#fef08a" opacity="0.4" />

    <!-- Traje Sacerdotal / Batina Preta e Capa de São Caetano -->
    <!-- Corpo e Ombros -->
    <path d="M 120,550 Q 200,320 320,290 Q 420,290 520,380 L 680,920 L -60,920 Z" fill="#18181b" />
    
    <!-- Manto Dourado Ornado com Brocado nas Costas/Ombro Direito -->
    <path d="M 450,390 Q 560,420 620,560 Q 670,720 700,920 L 530,920 Q 510,700 440,550 Z" fill="#b45309" opacity="0.85" />
    <path d="M 470,410 Q 570,450 610,600 Q 640,750 670,920 L 580,920 Q 550,750 490,560 Z" fill="#d97706" opacity="0.7" />

    <!-- Renda Branca nos Punhos e Gola Sacerdotal -->
    <path d="M 310,285 L 350,285 L 345,310 L 315,310 Z" fill="#ffffff" />
    <!-- Manga com Renda Clássica Branca -->
    <path d="M 380,520 Q 480,540 470,620 Q 420,640 370,580 Z" fill="#f4f4f5" stroke="#e4e4e7" stroke-width="3" />
    <path d="M 400,535 Q 470,550 460,610 Q 425,625 385,580 Z" fill="#ffffff" opacity="0.9" />

    <!-- Braços e Mãos de São Caetano acolhendo com ternura o Menino Jesus -->
    <path d="M 280,480 Q 290,540 390,560 Q 420,570 410,540 Q 320,510 300,470 Z" fill="#fbcfe8" opacity="0.8" />
    <ellipse cx="290" cy="510" rx="35" ry="18" fill="#e2b997" transform="rotate(-15, 290, 510)" />
    <ellipse cx="330" cy="530" rx="40" ry="16" fill="#dfb18c" transform="rotate(5, 330, 530)" />
    <ellipse cx="270" cy="580" rx="32" ry="16" fill="#d7a47d" transform="rotate(-25, 270, 580)" />

    <!-- ROSTO DE SÃO CAETANO -->
    <!-- Cabeça e Pescoço -->
    <path d="M 280,180 Q 330,150 380,180 Q 410,250 380,310 Q 330,340 280,300 Q 260,240 280,180 Z" fill="#e5bba0" />
    <!-- Barba Negra Venerável e Cabelo -->
    <path d="M 270,230 Q 275,320 330,345 Q 380,335 395,260 Q 385,290 350,310 Q 310,310 285,260 Z" fill="#1c1917" />
    <!-- Barrete Eclesiástico Preto Tradicional no topo -->
    <polygon points="260,165 340,110 420,160 390,195 280,195" fill="#09090b" />
    <circle cx="340" cy="110" r="18" fill="#18181b" />

    <!-- Traços Faciais São Caetano (olhar contemplativo de devoção) -->
    <ellipse cx="320" cy="225" rx="7" ry="5" fill="#292524" />
    <ellipse cx="365" cy="235" rx="7" ry="5" fill="#292524" />
    <path d="M 335,215 L 345,250 L 335,255" stroke="#a8715a" stroke-width="3" fill="none" />
    <path d="M 325,275 Q 345,280 360,275" stroke="#7c2d12" stroke-width="2.5" fill="none" />

    <!-- MENINO JESUS NOS BRAÇOS DE SÃO CAETANO -->
    <!-- Veste Branca Rendada do Menino Jesus -->
    <path d="M 330,360 Q 480,380 500,520 Q 510,680 470,820 L 260,800 Q 290,620 330,360 Z" fill="#ffffff" stroke="#f1f5f9" stroke-width="2" />
    <path d="M 310,720 Q 380,750 490,730 L 480,820 Q 370,840 250,810 Z" fill="#f8fafc" opacity="0.95" />
    <!-- Barrado de Renda no Vestido do Menino Jesus -->
    <path d="M 250,805 Q 370,835 480,815" stroke="#cbd5e1" stroke-width="6" stroke-dasharray="8,6" fill="none" />

    <!-- Rosto do Divino Menino Jesus -->
    <circle cx="430" cy="320" r="48" fill="#fed7aa" />
    <!-- Cabelinhos Castanhos Encaracolados -->
    <path d="M 385,300 Q 430,265 475,300 Q 485,340 475,360 Q 470,300 425,285 Q 390,300 385,300 Z" fill="#78350f" />
    <!-- Olhar Celeste e Sorriso Suave -->
    <ellipse cx="420" cy="315" rx="5" ry="4" fill="#1e293b" />
    <ellipse cx="448" cy="320" rx="5" ry="4" fill="#1e293b" />
    <path d="M 432,322 L 436,333 L 430,336" stroke="#c2410c" stroke-width="2" fill="none" />
    <path d="M 425,346 Q 435,353 445,348" stroke="#be123c" stroke-width="2.5" fill="none" />
    <circle cx="415" cy="330" r="8" fill="#fda4af" opacity="0.4" />
    <circle cx="452" cy="335" r="8" fill="#fda4af" opacity="0.4" />

    <!-- Coroa Dourada Real do Menino Jesus -->
    <path d="M 405,275 L 415,230 L 430,255 L 445,225 L 460,255 L 475,235 L 465,280 Z" fill="#eab308" stroke="#ca8a04" stroke-width="2" />
    <circle cx="415" cy="230" r="5" fill="#fef08a" />
    <circle cx="445" cy="225" r="6" fill="#ffffff" />
    <circle cx="475" cy="235" r="5" fill="#fef08a" />
    <!-- Pequena Cruz no topo da Coroa -->
    <line x1="445" y1="210" x2="445" y2="225" stroke="#ca8a04" stroke-width="3" />
    <line x1="440" y1="216" x2="450" y2="216" stroke="#ca8a04" stroke-width="3" />

    <!-- Bracinhos e Mãozinhas do Menino Jesus estendidas abençoando -->
    <ellipse cx="365" cy="420" rx="22" ry="14" fill="#fed7aa" transform="rotate(-30, 365, 420)" />
    <ellipse cx="485" cy="430" rx="20" ry="14" fill="#fed7aa" transform="rotate(25, 485, 430)" />
  </g>
</svg>`;

const publicDir = path.resolve(__dirname, '..', 'public');
const distDir = path.resolve(__dirname, '..', 'dist');

fs.writeFileSync(path.join(publicDir, 'background_sao_caetano.svg'), svgContent);
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'background_sao_caetano.svg'), svgContent);
}

console.log('SVG background generated successfully at public/background_sao_caetano.svg');
