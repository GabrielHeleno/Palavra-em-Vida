import React, { useState, useEffect, useRef } from 'react';
import {
  FileDown,
  Printer,
  Grid,
  FileText,
  Upload,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronDown,
  SlidersHorizontal,
  Bot,
} from 'lucide-react';
import { Header } from './components/Header';
import { ThemeSelector } from './components/ThemeSelector';
import { CardItem } from './components/CardItem';
import { A4SheetPreview } from './components/A4SheetPreview';
import { SwapModal } from './components/SwapModal';
import { LogoModal } from './components/LogoModal';
import { AdvancedModal } from './components/AdvancedModal';
import { NerdModal } from './components/NerdModal';
import { ArtisticQuote } from './components/ArtisticQuote';
import { ScripturePassage, TranslationMetadata, SelectionResponse } from './types/bible';
import { measurePassageInCard } from './client/cardMeasurement';
import { downloadBibleCardsPDF, openBibleCardsPDFInNewTab } from './client/pdfGenerator';
import { PRESET_LOGOS, svgToPngDataUrl } from './client/presetLogos';

export default function App() {
  const [metadata, setMetadata] = useState<TranslationMetadata | null>(null);
  // Campo de temas iniciado vazio (sem preenchimento padrão nem spans)
  const [themeInput, setThemeInput] = useState<string>('');
  const [pastoralGuidance, setPastoralGuidance] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');

  // 12 cartões ativos selecionados
  const [selectedPassages, setSelectedPassages] = useState<ScripturePassage[]>([]);
  // Alternativas disponíveis
  const [alternatePassages, setAlternates] = useState<ScripturePassage[]>([]);
  // IDs de cartões fixados pelo usuário
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set());

  // Configurações de layout
  const [fontSizePt, setFontSizePt] = useState<number>(12);
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined);
  const [logoAspectRatio, setLogoAspectRatio] = useState<number>(1);
  const [parishName, setParishName] = useState<string>('');
  const [backgroundUrl, setBackgroundUrl] = useState<string>('/background_sao_caetano.svg');

  // Modais
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isNerdModalOpen, setIsNerdModalOpen] = useState(false);
  const [swapModalState, setSwapModalState] = useState<{
    isOpen: boolean;
    cardIndex: number | null;
  }>({ isOpen: false, cardIndex: null });

  // Mensagens e alertas
  const [uncoveredThemes, setUncoveredThemes] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [selectionMeta, setSelectionMeta] = useState<{
    engine: 'gemini' | 'local';
    themes: string[];
    evaluatedCount: number;
    processingTimeMs?: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carrega metadados
  const fetchMetadata = async () => {
    try {
      const metaRes = await fetch('/api/database/metadata');
      if (metaRes.ok) {
        const meta = await metaRes.json();
        setMetadata(meta);
      }
    } catch (err) {
      console.error('Erro ao conectar com servidor:', err);
    }
  };

  // Atualiza o logotipo ativo (salvo no servidor/arquivo do app)
  const handleSelectLogo = (url: string | undefined, aspect: number) => {
    setLogoDataUrl(url);
    setLogoAspectRatio(aspect);
    if (url) {
      setSuccessToast('Logotipo atualizado com sucesso nos cartões e no PDF!');
      setTimeout(() => setSuccessToast(null), 3500);
    }
  };

  useEffect(() => {
    fetchMetadata();

    // Carrega o status do background salvo
    fetch('/api/background/status')
      .then(r => (r.ok ? r.json() : null))
      .then(res => {
        if (res && res.url) {
          setBackgroundUrl(res.url);
        }
      })
      .catch(console.error);

    // Carrega o logotipo padrão salvo nos arquivos do aplicativo no servidor (/api/logos)
    fetch('/api/logos')
      .then(r => (r.ok ? r.json() : null))
      .then(res => {
        if (res && res.defaultLogoUrl) {
          setLogoDataUrl(res.defaultLogoUrl);
          const img = new Image();
          img.onload = () => setLogoAspectRatio(img.width / img.height);
          img.src = res.defaultLogoUrl;
        } else {
          // Se ainda não houver nenhum arquivo carregado no servidor, inicializa com o preset oficial
          svgToPngDataUrl(PRESET_LOGOS[0].svg, 300)
            .then(pngData => {
              setLogoDataUrl(pngData);
              setLogoAspectRatio(1);
            })
            .catch(console.error);
        }
      })
      .catch(() => {
        svgToPngDataUrl(PRESET_LOGOS[0].svg, 300)
          .then(pngData => {
            setLogoDataUrl(pngData);
            setLogoAspectRatio(1);
          })
          .catch(console.error);
      });
  }, []);

  const handlePerformSelection = async (customThemes?: string[]) => {
    setIsLoading(true);
    setErrorMessage(null);
    setUncoveredThemes([]);
    setLoadingStep('Raciocinando temas e contexto pastoral com IA Gemini...');

    const parsedThemes = customThemes !== undefined
      ? customThemes
      : themeInput
          .split(/[,;\n]+/)
          .map(t => t.trim())
          .filter(Boolean);

    const timer1 = setTimeout(() => {
      setLoadingStep('Raciocinando o tema teológico, anseios da alma e sinônimos pastorais...');
    }, 500);

    const timer2 = setTimeout(() => {
      setLoadingStep('Discernindo as 12 vozes bíblicas em todo o cânon de 73 livros (Evangelhos, Salmos, Epístolas, Sapienciais, Profetas)...');
    }, 1800);

    try {
      const payload = {
        themes: parsedThemes,
        pastoralGuidance: pastoralGuidance.trim() || undefined,
        lockedPassageIds: Array.from(lockedIds),
      };

      const res = await fetch('/api/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const data: SelectionResponse = await res.json();

      if (data.status === 'ok') {
        setSelectedPassages(data.selectedPassages);
        setAlternates(data.alternatePassages || []);
        setUncoveredThemes(data.uncoveredThemes || []);
        setSelectionMeta({
          engine: 'gemini',
          themes: parsedThemes,
          evaluatedCount: 31104,
          processingTimeMs: data.meta?.processingTimeMs,
        });

        if (parsedThemes.length > 0) {
          setSuccessToast(`12 passagens bíblicas selecionadas dinamicamente pelo Gemini.`);
          setTimeout(() => setSuccessToast(null), 5000);
        }
      } else if (data.status === 'insufficient_candidates') {
        setUncoveredThemes(data.uncoveredThemes || parsedThemes);
        setErrorMessage(
          data.message ||
            'Não foram encontradas 12 passagens adequadas para cobrir integralmente os temas informados. Você pode acrescentar ou ajustar os termos.'
        );
      } else {
        setErrorMessage(data.message || 'Falha ao processar a seleção bíblica por IA.');
      }
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setErrorMessage('Erro de comunicação com o servidor: ' + err.message);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Gerenciamento de cartões fixados
  const handleToggleLock = (passageId: string) => {
    setLockedIds(prev => {
      const next = new Set(prev);
      if (next.has(passageId)) {
        next.delete(passageId);
      } else {
        if (next.size >= 11) {
          setErrorMessage('É permitido fixar no máximo 11 cartões.');
          return prev;
        }
        next.add(passageId);
      }
      return next;
    });
  };

  // Troca de passagem por uma alternativa
  const handleSwapPassage = (targetIndex: number, newPassage: ScripturePassage) => {
    const oldPassage = selectedPassages[targetIndex];
    if (!oldPassage) return;

    setSelectedPassages(prev => {
      const next = [...prev];
      next[targetIndex] = newPassage;
      return next;
    });

    // Remove nova passagem das alternativas e adiciona a antiga
    setAlternates(prev => {
      const filtered = prev.filter(p => p.id !== newPassage.id);
      return [oldPassage, ...filtered];
    });

    // Se o cartão estava travado, transfere a trava para o novo ID
    if (lockedIds.has(oldPassage.id)) {
      setLockedIds(prev => {
        const next = new Set(prev);
        next.delete(oldPassage.id);
        next.add(newPassage.id);
        return next;
      });
    }

    setSuccessToast(`Cartão #${targetIndex + 1} substituído por ${newPassage.displayRef}.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Reordenação de cartões
  const handleMoveCard = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= selectedPassages.length) return;
    setSelectedPassages(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  // Upload do logotipo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('png') && !file.type.includes('jpeg') && !file.type.includes('jpg')) {
      setErrorMessage('Por favor, envie uma imagem no formato PNG ou JPEG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const result = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setLogoAspectRatio(img.width / img.height);
        setLogoDataUrl(result);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Importação e formatação direta de arquivo JSON com frases prontas
  const handleImportJSONFile = async (file: File) => {
    try {
      const text = await file.text();
      let rawData: any;
      try {
        rawData = JSON.parse(text);
      } catch (parseErr) {
        setErrorMessage('O arquivo selecionado não é um JSON válido. Verifique a formatação do arquivo.');
        return;
      }

      // Função auxiliar para remover acentos e normalizar chaves
      const normalizeKey = (k: string) =>
        k
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '');

      // Normaliza itens de diferentes estruturas de JSON
      let items: any[] = [];
      if (Array.isArray(rawData)) {
        items = rawData;
      } else if (rawData && typeof rawData === 'object') {
        // Verifica se há alguma propriedade que seja um array
        const arrayKey = Object.keys(rawData).find(k => Array.isArray(rawData[k]));
        if (arrayKey && Array.isArray(rawData[arrayKey])) {
          items = rawData[arrayKey];
        } else {
          // Se for um dicionário de objetos ou chaves (ex: { "Jo 3, 16": "Porque Deus amou..." } ou { "1": {...}, "2": {...} })
          const entries = Object.entries(rawData);
          const looksLikeKeyValueQuotes = entries.every(
            ([_, val]) => typeof val === 'string' || (typeof val === 'object' && val !== null)
          );
          if (looksLikeKeyValueQuotes) {
            items = entries.map(([key, val]) => {
              if (typeof val === 'string') {
                return { referencia: key, texto: val };
              }
              return { ...(val as object), _entryKey: key };
            });
          } else {
            items = Object.values(rawData).filter(
              v => typeof v === 'string' || (typeof v === 'object' && v !== null)
            );
          }
        }
      }

      if (items.length === 0) {
        setErrorMessage('Nenhuma frase ou passagem encontrada no arquivo JSON.');
        return;
      }

      const parsedPassages: ScripturePassage[] = items.map((item: any, idx: number) => {
        // Se o item for diretamente uma string (ex: "Porque Deus amou o mundo... (Jo 3, 16)")
        if (typeof item === 'string') {
          const str = item.trim();
          // Tenta extrair referência entre parênteses no final ou após hífen
          const parenMatch = str.match(/^(.*?)\s*[\(\[]([^\)\]]+)[\)\]]\s*$/s);
          const dashMatch = !parenMatch ? str.match(/^(.*?)\s*[-—–]\s*([A-Za-z0-9À-ÿ\s,.:;]+)$/s) : null;

          let passageText = str;
          let displayRef = `Cartão #${idx + 1}`;

          if (parenMatch && parenMatch[1].trim() && parenMatch[2].trim()) {
            passageText = parenMatch[1].trim();
            displayRef = parenMatch[2].trim();
          } else if (dashMatch && dashMatch[1].trim() && dashMatch[2].trim() && dashMatch[2].length < 40) {
            passageText = dashMatch[1].trim();
            displayRef = dashMatch[2].trim();
          }

          // Remove aspas externas se houver
          passageText = passageText.replace(/^["'“«]+|["'”»]+$/g, '').trim();

          return {
            id: `json-imported-${Date.now()}-${idx}`,
            translationId: 'JSON',
            book: 'Sagrada Escritura',
            bookAbbr: 'SE',
            chapter: 1,
            verseStart: idx + 1,
            displayRef,
            text: passageText,
            themes: ['Importado via JSON'],
            dbVersion: '2.0.0-json-import',
            testament: 'NT',
          };
        }

        // Se for um objeto, normalizamos todas as chaves
        const normObj: Record<string, any> = {};
        const originalKeys = Object.keys(item);
        for (const k of originalKeys) {
          normObj[normalizeKey(k)] = item[k];
        }

        // Possíveis chaves para texto / citação da frase
        const textCandidates = [
          normObj.citacao,
          normObj.texto,
          normObj.text,
          normObj.frase,
          normObj.quote,
          normObj.quotetext,
          normObj.textobiblico,
          normObj.passagem,
          normObj.passage,
          normObj.passagetext,
          normObj.mensagem,
          normObj.message,
          normObj.conteudo,
          normObj.content,
          normObj.corpo,
          normObj.body,
          normObj.trecho,
          normObj.excerpt,
          normObj.palavra,
          normObj.versiculotexto,
          normObj.desc,
          normObj.descricao,
        ];

        let foundText = textCandidates.find(
          v => typeof v === 'string' && v.trim().length > 0
        );

        // Possíveis chaves para referência bíblica / autor / citação
        const refCandidates = [
          normObj.referencia,
          normObj.reference,
          normObj.displayref,
          normObj.ref,
          normObj.citacaoref,
          normObj.versiculo,
          normObj.verse,
          normObj.fonte,
          normObj.source,
          normObj.autor,
          normObj.author,
          normObj.endereco,
          normObj.livro,
          normObj.book,
          item._entryKey,
        ];

        let foundRef = refCandidates.find(
          v => typeof v === 'string' && v.trim().length > 0
        );

        // Se encontrou referência mas não encontrou texto:
        // Pode ser que o campo 'citacao' ou 'versiculo' estivesse em foundRef, ou haja apenas uma string longa no objeto
        if (!foundText) {
          // Procura qualquer propriedade do tipo string que não seja a referência já encontrada
          const stringValues = Object.entries(item)
            .filter(([_, val]) => typeof val === 'string' && val.trim().length > 0)
            .map(([_, val]) => (val as string).trim());

          if (stringValues.length > 0) {
            // Se já temos a referência, pega a maior string restante
            const remaining = stringValues.filter(s => s !== foundRef);
            if (remaining.length > 0) {
              // A maior string é o texto da citação
              remaining.sort((a, b) => b.length - a.length);
              foundText = remaining[0];
            } else {
              foundText = stringValues[0];
            }
          }
        }

        // Se encontrou texto e referência, mas a "referência" é um texto longo (> 50 caracteres) e o "texto" é curto (< 35 caracteres),
        // eles podem estar invertidos (ex: alguém chamou o campo de citação de "ref" e a sigla de "texto")
        if (foundText && foundRef && typeof foundText === 'string' && typeof foundRef === 'string') {
          if (foundRef.length > 50 && foundText.length < 35) {
            const temp = foundText;
            foundText = foundRef;
            foundRef = temp;
          }
        }

        let passageText = (foundText ? String(foundText) : '').trim();
        // Remove aspas externas desnecessárias que possam vir no JSON
        passageText = passageText.replace(/^["'“«]+|["'”»]+$/g, '').trim();

        let displayRef = (foundRef ? String(foundRef) : '').trim();

        // Se ainda não temos displayRef, tenta montar com Livro/Capítulo/Versículo
        if (!displayRef) {
          const bookVal = normObj.livro || normObj.book;
          const chapVal = normObj.capitulo || normObj.chapter;
          const versVal = normObj.versiculo || normObj.verse || normObj.versiculoinicio || normObj.versestart;
          const versEndVal = normObj.versiculofim || normObj.verseend;

          if (bookVal) {
            displayRef = `${bookVal} ${chapVal || 1}, ${versVal || 1}${versEndVal ? '-' + versEndVal : ''}`;
          } else {
            displayRef = `Cartão #${idx + 1}`;
          }
        }

        // Extrai ou estima o livro
        const book = (normObj.livro || normObj.book || displayRef.split(/\s+\d/)[0] || 'Sagrada Escritura').trim();

        return {
          id: item.id || `json-imported-${Date.now()}-${idx}`,
          translationId: item.translationId || 'JSON',
          book: book || 'Sagrada Escritura',
          bookAbbr: normObj.bookabbr || normObj.sigla || 'SE',
          chapter: Number(normObj.chapter || normObj.capitulo) || 1,
          verseStart: Number(normObj.versestart || normObj.versiculoinicio || normObj.versiculo || normObj.verse) || (idx + 1),
          verseEnd: normObj.verseend || normObj.versiculofim ? Number(normObj.verseend || normObj.versiculofim) : undefined,
          displayRef: displayRef || `Cartão #${idx + 1}`,
          text: passageText,
          themes: Array.isArray(normObj.themes || normObj.temas)
            ? (normObj.themes || normObj.temas)
            : [normObj.tema || normObj.theme || 'Importado via JSON'],
          pastoralContext: normObj.pastoralcontext || normObj.contexto || normObj.explicacao,
          dbVersion: '2.0.0-json-import',
          testament: normObj.testament || normObj.testamento || 'NT',
        };
      });

      // Garantir 12 cartões para o layout A4
      let finalPassages = [...parsedPassages];
      if (finalPassages.length < 12) {
        const originalCount = finalPassages.length;
        while (finalPassages.length < 12) {
          const clone = { ...finalPassages[finalPassages.length % originalCount] };
          clone.id = `${clone.id}-pad-${finalPassages.length}`;
          finalPassages.push(clone);
        }
      }

      const active12 = finalPassages.slice(0, 12);
      const alternates = finalPassages.slice(12);

      setSelectedPassages(active12);
      setAlternates(alternates);
      setLockedIds(new Set());
      setErrorMessage(null);
      setSelectionMeta({
        engine: 'local',
        themes: [file.name.replace(/\.json$/i, '') || 'Arquivo JSON'],
        evaluatedCount: items.length,
      });

      setSuccessToast(`12 cartões formatados com sucesso a partir de "${file.name}"!`);
      setTimeout(() => setSuccessToast(null), 4500);

      // Rola a tela até os cartões
      setTimeout(() => {
        document.getElementById('cards-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setErrorMessage('Erro ao importar JSON: ' + (err.message || 'Formato inválido'));
    }
  };

  const handleRemoveLogo = () => {
    setLogoDataUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Verificação de overflow em qualquer um dos 12 cartões (com logo de 17mm à direita)
  const overflowedCards = selectedPassages
    .map((passage, index) => {
      const metrics = measurePassageInCard(passage, {
        fontSizePt,
        hasLogo: !!logoDataUrl,
        logoSizeMm: 17,
      });
      return metrics.overflows ? { index, passage } : null;
    })
    .filter(Boolean) as { index: number; passage: ScripturePassage }[];

  const hasAnyOverflow = overflowedCards.length > 0;

  // Geração e download do PDF
  const handleDownloadPDF = () => {
    if (selectedPassages.length !== 12) {
      setErrorMessage('Aguarde as 12 passagens bíblicas para gerar o PDF.');
      return;
    }
    if (hasAnyOverflow) {
      setErrorMessage(
        `Não é possível gerar o PDF: ${overflowedCards.length} cartão(ões) extrapolam a altura física máxima de 46,5 mm (#${overflowedCards
          .map(c => c.index + 1)
          .join(', ')}). Reduza o tamanho da fonte (ex: 10 pt) ou substitua o cartão por uma passagem mais curta.`
      );
      return;
    }

    try {
      downloadBibleCardsPDF({
        passages: selectedPassages,
        logoDataUrl,
        logoAspectRatio,
        parishName: parishName.trim() || undefined,
        fontSizePt,
      });
      setSuccessToast('PDF gerado e baixado com sucesso!');
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: any) {
      setErrorMessage('Falha ao gerar PDF: ' + err.message);
    }
  };

  const handlePrint = () => {
    if (selectedPassages.length !== 12) {
      setErrorMessage('Aguarde o carregamento das 12 passagens antes de imprimir.');
      return;
    }
    if (hasAnyOverflow) {
      setErrorMessage(
        `Atenção: ${overflowedCards.length} cartão(ões) ultrapassam a altura física de 46,5 mm (#${overflowedCards
          .map(c => c.index + 1)
          .join(', ')}). Reduza a fonte para 10pt ou substitua antes de imprimir.`
      );
      return;
    }

    try {
      openBibleCardsPDFInNewTab({
        passages: selectedPassages,
        logoDataUrl,
        logoAspectRatio,
        parishName: parishName.trim() || undefined,
        fontSizePt,
      });
      setSuccessToast('PDF de 12 cartões aberto em aba cheia para impressão direta!');
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: any) {
      console.error('Falha ao abrir PDF para impressão:', err);
      window.print();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col text-stone-900 bg-sao-caetano bg-fixed"
      style={{
        backgroundImage: `url('${backgroundUrl}')`,
      }}
    >
      {/* Barra de Navegação Superior com efeito Glass */}
      <Header />

      <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Hero do primeiro carregamento: trecho bíblico artístico e painel de digitação no rodapé */}
        <section className="no-print min-h-[calc(100dvh-5rem)] flex flex-col justify-end md:justify-between pt-2 sm:pt-6 pb-4 sm:pb-6">
          {/* Trecho Bíblico Artístico: oculto em telas pequenas para não cobrir a arte, exibido no espaço negativo à esquerda em telas médias/grandes */}
          <div className="hidden md:flex flex-1 items-center justify-start py-4 md:py-8 max-w-xl md:max-w-2xl">
            <ArtisticQuote />
          </div>

          {/* Painel no rodapé da primeira tela */}
          <div className="w-full">
            <ThemeSelector
              themeInput={themeInput}
              onChangeThemeInput={setThemeInput}
              onSubmit={() => handlePerformSelection()}
              onOpenAdvanced={() => setIsAdvancedModalOpen(true)}
              onImportJSONFile={handleImportJSONFile}
              isLoading={isLoading}
              loadingStepText={loadingStep}
              hasAdvancedConfig={Boolean(pastoralGuidance || parishName || logoDataUrl)}
              onPrint={handlePrint}
              onDownloadPDF={handleDownloadPDF}
              canPrint={selectedPassages.length === 12}
              canDownloadPDF={selectedPassages.length === 12 && !hasAnyOverflow}
              hasAnyOverflow={hasAnyOverflow}
            />
          </div>
        </section>

        {/* Notificações e alertas */}
        {errorMessage && (
          <div className="no-print p-4 rounded-2xl bg-amber-500/20 backdrop-blur-xl border border-amber-300/60 text-amber-950 flex flex-col sm:flex-row items-start justify-between gap-3 text-xs sm:text-sm animate-fadeIn shadow-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">{errorMessage}</p>
                {uncoveredThemes.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-amber-900 font-semibold">
                      Termos consultados:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {uncoveredThemes.map(t => (
                        <span key={t} className="text-xs bg-amber-100/70 backdrop-blur-xs text-amber-950 px-2 py-0.5 rounded-md border border-amber-300/70 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <a
              href="https://share.gemini.google/hWvKtqOnLAPP"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center space-x-2 px-3.5 py-2 bg-emerald-900 text-amber-200 hover:bg-emerald-950 font-semibold rounded-xl border border-emerald-500/50 shadow-xs transition active:scale-[0.98] cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Abrir Assistente Gemini</span>
            </a>
          </div>
        )}

        {successToast && (
          <div className="no-print p-3.5 rounded-xl bg-emerald-600/20 backdrop-blur-xl border border-emerald-300/70 text-emerald-950 text-xs sm:text-sm flex items-center space-x-2 animate-fadeIn shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
            <span className="font-bold">{successToast}</span>
          </div>
        )}

        {/* Aviso se houver cartões com overflow com opção de diminuir a fonte */}
        {selectedPassages.length > 0 && hasAnyOverflow && (
          <div className="no-print p-3.5 rounded-xl bg-red-500/20 backdrop-blur-xl border border-red-300 text-red-950 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-fadeIn">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
              <span>
                <strong>Atenção:</strong> {overflowedCards.length} cartão(ões) (
                {overflowedCards.map(c => `#${c.index + 1}`).join(', ')}) ultrapassam o limite do quadrante no tamanho atual ({fontSizePt}pt).
              </span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setFontSizePt(prev => Math.max(10, prev - 1))}
                className="px-3 py-1.5 bg-red-700/80 hover:bg-red-800 backdrop-blur-md border border-white/40 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                Diminuir fonte ({fontSizePt > 11 ? '11 pt' : '10 pt'})
              </button>
              {fontSizePt < 12 && (
                <button
                  type="button"
                  onClick={() => setFontSizePt(12)}
                  className="px-2.5 py-1.5 border border-red-300/70 bg-white/40 hover:bg-white/70 backdrop-blur-md text-red-950 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Restaurar 12pt
                </button>
              )}
            </div>
          </div>
        )}

        {/* Grade de Edição Direta dos 12 Cartões (renderizada apenas quando houver seleção realizada) */}
        {selectedPassages.length > 0 && (
          <section id="cards-section" className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {selectedPassages.map((passage, index) => (
                <CardItem
                  key={passage.id + index}
                  index={index}
                  passage={passage}
                  fontSizePt={fontSizePt}
                  hasLogo={!!logoDataUrl}
                  logoDataUrl={logoDataUrl}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Rodapé Glassmorphism */}
      <footer className="no-print mt-12 border-t border-white/50 glass-panel bg-white/70 py-6 text-center text-xs text-stone-600 space-y-2">
        <p className="text-stone-800 font-medium font-serif-sacred">
          Palavra em Vida • Paróquia de São Caetano • Cipotânea - MG
        </p>
        <div>
          <button
            type="button"
            onClick={() => setIsNerdModalOpen(true)}
            className="text-[11px] text-stone-400 hover:text-emerald-900 hover:underline cursor-pointer transition font-mono"
          >
            Para nerds
          </button>
        </div>
      </footer>

      {/* Modal de Configurações Avançadas (orientação pastoral, logotipo e movimento) */}
      <AdvancedModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        pastoralGuidance={pastoralGuidance}
        onChangeGuidance={setPastoralGuidance}
        parishName={parishName}
        onChangeParishName={setParishName}
        logoDataUrl={logoDataUrl}
        onSelectLogo={handleSelectLogo}
      />

      {/* Modal Para Nerds (contendo diagnósticos, acervo .txt e chaves gemini) */}
      <NerdModal
        isOpen={isNerdModalOpen}
        onClose={() => setIsNerdModalOpen(false)}
        metadata={metadata}
        onDatabaseImported={fetchMetadata}
      />

      {/* Modal de Gestão e Posição do Logotipo */}
      <LogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        logoDataUrl={logoDataUrl}
        onSelectLogo={(url, aspect) => {
          handleSelectLogo(url, aspect);
        }}
      />

      {/* Modal de Substituição de Cartão */}
      <SwapModal
        isOpen={swapModalState.isOpen}
        onClose={() => setSwapModalState({ isOpen: false, cardIndex: null })}
        targetCardIndex={swapModalState.cardIndex}
        currentPassage={
          swapModalState.cardIndex !== null
            ? selectedPassages[swapModalState.cardIndex] || null
            : null
        }
        alternates={alternatePassages}
        onSwap={handleSwapPassage}
        fontSizePt={fontSizePt}
        hasLogo={!!logoDataUrl}
      />

      {/* Folha pronta para @media print do navegador caso a impressão nativa seja acionada */}
      <div className="hidden print:block">
        <A4SheetPreview
          passages={selectedPassages}
          logoDataUrl={logoDataUrl}
          parishName={parishName}
          fontSizePt={fontSizePt}
        />
      </div>
    </div>
  );
}
