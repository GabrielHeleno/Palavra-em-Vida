import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  FileCode,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface JsonImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (jsonString: string, sourceName?: string) => boolean | void;
}

const TEMPLATES = [
  {
    title: 'Referência e Texto',
    desc: 'Formato padrão recomendado',
    json: `[
  {
    "referencia": "Jo 3, 16",
    "texto": "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
  },
  {
    "referencia": "Sl 23, 1",
    "texto": "O Senhor é o meu pastor, nada me faltará."
  },
  {
    "referencia": "Fl 4, 13",
    "texto": "Tudo posso naquele que me fortalece."
  },
  {
    "referencia": "Mt 11, 28",
    "texto": "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei."
  },
  {
    "referencia": "Jr 29, 11",
    "texto": "Porque sou eu que conheço os planos que tenho para vós, diz o Senhor, planos de paz e não de mal, para vos dar um futuro e uma esperança."
  },
  {
    "referencia": "1Cor 13, 4-7",
    "texto": "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Tudo sofre, tudo crê, tudo espera, tudo suporta."
  },
  {
    "referencia": "Is 41, 10",
    "texto": "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça."
  },
  {
    "referencia": "Rm 8, 28",
    "texto": "Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito."
  },
  {
    "referencia": "Sl 91, 1-2",
    "texto": "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará. Direi do Senhor: Ele é o meu refúgio e a minha fortaleza, o meu Deus, em quem confio."
  },
  {
    "referencia": "Mt 6, 33",
    "texto": "Buscai, pois, em primeiro lugar, o seu reino e a sua justiça, e todas estas coisas vos serão acrescentadas."
  },
  {
    "referencia": "Josué 1, 9",
    "texto": "Não to mandei eu? Sê forte e corajoso; não temas, nem te espantes, porque o Senhor, teu Deus, é contigo por onde quer que andares."
  },
  {
    "referencia": "Lc 1, 37",
    "texto": "Porque para Deus nada é impossível."
  }
]`,
  },
  {
    title: 'Lista de Frases Simples',
    desc: 'Apenas texto com referência entre parênteses',
    json: `[
  "O Senhor é o meu pastor, nada me faltará. (Sl 23, 1)",
  "Tudo posso naquele que me fortalece. (Fl 4, 13)",
  "Porque para Deus nada é impossível. (Lc 1, 37)",
  "Vinde a mim, todos os que estais cansados e oprimidos. (Mt 11, 28)",
  "O amor jamais acaba. (1Cor 13, 8)",
  "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará. (Sl 37, 5)",
  "O Senhor é a minha luz e a minha salvação; de quem terei medo? (Sl 27, 1)",
  "Se Deus é por nós, quem será contra nós? (Rm 8, 31)",
  "Buscai primeiro o Reino de Deus e a sua justiça. (Mt 6, 33)",
  "Mil cairão ao teu lado, e dez mil à tua direita, mas tu não serás atingido. (Sl 91, 7)",
  "Alegrai-vos sempre no Senhor; outra vez digo: alegrai-vos. (Fl 4, 4)",
  "Eu sou o caminho, a verdade e a vida. (Jo 14, 6)"
]`,
  },
  {
    title: 'Dicionário (Ref: Texto)',
    desc: 'Chaves como referências e valores como citações',
    json: `{
  "Jo 3, 16": "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito...",
  "Sl 23, 1": "O Senhor é o meu pastor, nada me faltará.",
  "Fl 4, 13": "Tudo posso naquele que me fortalece.",
  "Mt 11, 28": "Vinde a mim todos vós que estais cansados...",
  "Is 40, 31": "Os que esperam no Senhor renovarão as suas forças...",
  "1Cor 13, 13": "Agora, pois, permanecem a fé, a esperança e o amor...",
  "Sl 46, 1": "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.",
  "Rm 8, 38-39": "Nem a morte nem a vida poderão nos separar do amor de Deus...",
  "Tg 1, 5": "Se algum de vós tem falta de sabedoria, peça-a a Deus...",
  "Pv 3, 5": "Confia no Senhor de todo o teu coração...",
  "Mt 5, 3": "Bem-aventurados os pobres em espírito, porque deles é o reino dos céus.",
  "Ap 21, 4": "E Deus limpará de seus olhos toda lágrima..."
}`,
  },
];

export const JsonImportModal: React.FC<JsonImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'file'>('paste');
  const [jsonText, setJsonText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<{
    valid: boolean;
    count: number;
    sampleItems: { ref: string; text: string }[];
    errorMsg?: string;
  } | null>(null);
  const [isCopiedTemplate, setIsCopiedTemplate] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Analisa o JSON em tempo real para feedback visual amigável
  useEffect(() => {
    const trimmed = jsonText.trim();
    if (!trimmed) {
      setParsedPreview(null);
      return;
    }

    try {
      const data = JSON.parse(trimmed);
      let items: any[] = [];

      if (Array.isArray(data)) {
        items = data;
      } else if (data && typeof data === 'object') {
        const arrayKey = Object.keys(data).find(k => Array.isArray(data[k]));
        if (arrayKey && Array.isArray(data[arrayKey])) {
          items = data[arrayKey];
        } else {
          const entries = Object.entries(data);
          items = entries.map(([k, v]) => {
            if (typeof v === 'string') return { referencia: k, texto: v };
            return { ...(v as object), _entryKey: k };
          });
        }
      }

      if (items.length === 0) {
        setParsedPreview({
          valid: false,
          count: 0,
          sampleItems: [],
          errorMsg: 'O JSON é válido, mas nenhuma lista de frases foi encontrada.',
        });
        return;
      }

      const sampleItems = items.slice(0, 3).map((item, idx) => {
        if (typeof item === 'string') {
          return { ref: `Item #${idx + 1}`, text: item };
        }
        const text =
          item.citacao ||
          item.texto ||
          item.text ||
          item.frase ||
          item.mensagem ||
          item.conteudo ||
          item.quote ||
          JSON.stringify(item);
        const ref =
          item.referencia ||
          item.reference ||
          item.displayRef ||
          item.ref ||
          item.versiculo ||
          item._entryKey ||
          `Cartão #${idx + 1}`;
        return { ref: String(ref), text: String(text) };
      });

      setParsedPreview({
        valid: true,
        count: items.length,
        sampleItems,
      });
    } catch (err: any) {
      setParsedPreview({
        valid: false,
        count: 0,
        sampleItems: [],
        errorMsg: 'Sintaxe JSON incompleta ou inválida.',
      });
    }
  }, [jsonText]);

  if (!isOpen) return null;

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    try {
      const text = await file.text();
      setJsonText(text);
      setSelectedFileName(file.name);
      setActiveTab('paste');
    } catch (err) {
      console.error('Erro ao ler arquivo:', err);
    }
  };

  const handleApplyTemplate = (tmpl: (typeof TEMPLATES)[0]) => {
    setJsonText(tmpl.json);
    setSelectedFileName(null);
    setIsCopiedTemplate(tmpl.title);
    setTimeout(() => setIsCopiedTemplate(null), 2500);
  };

  const handleSubmit = () => {
    if (!jsonText.trim()) return;
    const ok = onImport(jsonText, selectedFileName || 'Código JSON colado');
    if (ok !== false) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
      <div
        className="glass-panel w-full max-w-3xl max-h-[92vh] rounded-3xl border border-white/80 bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden text-stone-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="json-modal-title"
      >
        {/* Cabeçalho */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 flex items-center justify-between bg-gradient-to-r from-emerald-50/90 to-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-emerald-100 flex items-center justify-center shadow-md">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 id="json-modal-title" className="text-lg sm:text-xl font-bold text-emerald-950 font-serif-sacred">
                Importar Frases e Passagens (JSON)
              </h2>
              <p className="text-xs text-stone-600">
                Cole o código JSON diretamente ou anexe um arquivo para preencher os 12 cartões
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas Alternadoras: Colar Código / Anexar Arquivo */}
        <div className="px-4 sm:px-6 pt-3 pb-1 flex items-center justify-between border-b border-stone-100 bg-stone-50/50">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Colar Código JSON</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                activeTab === 'file'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Anexar Arquivo .json</span>
            </button>
          </div>

          {selectedFileName && (
            <span className="text-[11px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md font-medium truncate max-w-[200px]">
              Arquivo: {selectedFileName}
            </span>
          )}
        </div>

        {/* Corpo do Modal */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'file' ? (
            /* Área de Upload / Dropzone */
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-600 rounded-2xl p-8 text-center bg-emerald-50/30 hover:bg-emerald-50/60 transition cursor-pointer flex flex-col items-center justify-center space-y-3 group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json,application/json"
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-800">
                  Clique para selecionar um arquivo .json ou arraste aqui
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Formatos aceitos: JSON padrão com lista de versículos ou frases bíblicas
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs group-hover:bg-emerald-950 transition"
              >
                Procurar Arquivo no Computador
              </button>
            </div>
          ) : (
            /* Área de Colar Código JSON */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <label htmlFor="json-paste-area" className="font-semibold text-stone-800 flex items-center space-x-1.5">
                  <span>Código JSON:</span>
                  {jsonText && (
                    <span className="text-[11px] font-normal text-stone-500">
                      ({jsonText.length} caracteres)
                    </span>
                  )}
                </label>
                {jsonText && (
                  <button
                    type="button"
                    onClick={() => {
                      setJsonText('');
                      setSelectedFileName(null);
                    }}
                    className="text-stone-500 hover:text-red-700 font-medium transition cursor-pointer"
                  >
                    Limpar texto
                  </button>
                )}
              </div>

              <div className="relative">
                <textarea
                  id="json-paste-area"
                  rows={8}
                  value={jsonText}
                  onChange={e => setJsonText(e.target.value)}
                  placeholder={`Cole aqui o código JSON. Exemplo:\n[\n  {\n    "referencia": "Jo 3, 16",\n    "texto": "Porque Deus amou o mundo de tal maneira..."\n  }\n]`}
                  className="w-full font-mono text-xs p-3.5 rounded-2xl border border-stone-300 bg-stone-50/80 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition resize-y"
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {/* Modelos / Exemplos Prontos para Testar e Preencher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Exemplos e Modelos de Formato:</span>
              </span>
              {isCopiedTemplate && (
                <span className="text-xs text-emerald-800 font-semibold animate-fadeIn">
                  ✓ Modelo aplicado!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TEMPLATES.map(tmpl => (
                <button
                  key={tmpl.title}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50/70 hover:border-emerald-400 text-left transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 group-hover:text-emerald-950">
                      {tmpl.title}
                    </span>
                    <Copy className="w-3 h-3 text-stone-400 group-hover:text-emerald-700" />
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                    {tmpl.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback de Validação do JSON */}
          {parsedPreview && (
            <div
              className={`p-3 rounded-2xl border text-xs transition animate-fadeIn ${
                parsedPreview.valid
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50/90 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-start space-x-2">
                {parsedPreview.valid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>
                      {parsedPreview.valid
                        ? `✓ JSON válido! ${parsedPreview.count} frase(s) identificada(s)`
                        : 'Atenção no formato JSON'}
                    </span>
                    {parsedPreview.valid && (
                      <span className="text-[11px] font-normal text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                        {parsedPreview.count < 12
                          ? `Será completado até 12 cartões`
                          : parsedPreview.count === 12
                          ? `Exatamente 12 cartões`
                          : `12 principais + ${parsedPreview.count - 12} alternativas`}
                      </span>
                    )}
                  </div>
                  {parsedPreview.errorMsg && (
                    <p className="text-amber-800">{parsedPreview.errorMsg}</p>
                  )}

                  {/* Prévia dos primeiros itens */}
                  {parsedPreview.valid && parsedPreview.sampleItems.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-emerald-200/60 space-y-1">
                      <span className="text-[11px] text-emerald-900 font-semibold block">
                        Prévia dos primeiros itens detectados:
                      </span>
                      {parsedPreview.sampleItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="text-[11px] bg-white/70 px-2 py-1 rounded-md border border-emerald-100 flex items-center space-x-2 truncate"
                        >
                          <span className="font-bold text-emerald-900 shrink-0">
                            {item.ref}:
                          </span>
                          <span className="text-stone-700 truncate">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé de Ações */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-200/60 font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!parsedPreview?.valid}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition ${
              parsedPreview?.valid
                ? 'btn-neon-liturgical cursor-pointer text-white shadow-md active:scale-[0.98]'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Formatar e Carregar 12 Cartões</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
