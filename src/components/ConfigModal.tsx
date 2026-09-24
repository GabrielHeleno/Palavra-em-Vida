import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  Cpu,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Code,
  Sparkles,
} from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose }) => {
  const [generatedKey, setGeneratedKey] = useState('');
  const [copiedAdminKey, setCopiedAdminKey] = useState(false);
  const [copiedEnvSnippet, setCopiedEnvSnippet] = useState(false);

  const [serverHealth, setServerHealth] = useState<{
    model?: string;
    hasApiKey?: boolean;
    hasAdminKey?: boolean;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/health')
        .then(res => res.json())
        .then(data => setServerHealth(data))
        .catch(() => setServerHealth(null));
      
      // Auto-gerar uma chave inicial para conveniência
      if (!generatedKey) {
        generateRandomKey();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function generateRandomKey() {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    setGeneratedKey(key);
    setCopiedAdminKey(false);
  }

  const handleCopyAdminKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopiedAdminKey(true);
    setTimeout(() => setCopiedAdminKey(false), 2000);
  };

  const handleCopyEnvSnippet = () => {
    const snippet = `GEMINI_MODEL="gemini-3.8-flash"\nGEMINI_API_KEY="AIzaSySuaChaveAqui"\nADMIN_IMPORT_KEY="${generatedKey || 'sua_chave_admin'}"`;
    navigator.clipboard.writeText(snippet);
    setCopiedEnvSnippet(true);
    setTimeout(() => setCopiedEnvSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 rounded-t-xl">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif-sacred">
                Chaves de Acesso & Modelo Gemini
              </h3>
              <p className="text-xs text-stone-500">
                Gere sua API Key do Google e a chave de administração do servidor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Status Bar */}
          <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-800" />
              <span className="text-xs text-stone-600">Modelo Atual:</span>
              <span className="font-mono text-xs font-bold text-emerald-950 bg-white px-2 py-0.5 rounded border border-emerald-200">
                {serverHealth?.model || 'gemini-3.8-flash'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-stone-500">Status Gemini:</span>
              {serverHealth?.hasApiKey ? (
                <span className="text-emerald-700 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> API Ativa
                </span>
              ) : (
                <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Modo Pastoral Católico Local (Offline)
                </span>
              )}
            </div>
          </div>

          {/* SEÇÃO 1: GEMINI API KEY */}
          <div className="p-4 sm:p-5 rounded-xl border-2 border-emerald-600/30 bg-emerald-50/30 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                    1
                  </span>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                    Como Obter a Chave de API do Gemini (Gratuita)
                  </h4>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  As chaves de API do Gemini são geradas diretamente na plataforma do <strong>Google AI Studio</strong>.
                </p>
              </div>
            </div>

            <div className="pt-1">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-xs text-xs sm:text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Abrir Google AI Studio para Criar API Key</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-1.5 text-xs text-stone-700">
              <span className="font-semibold text-stone-900 block">Passo a passo no site do Google:</span>
              <ol className="list-decimal list-inside space-y-1 text-stone-600">
                <li>Acesse o link acima e faça login com sua conta Google.</li>
                <li>Clique no botão azul <strong>"Create API key"</strong> (Criar chave de API).</li>
                <li>Selecione um projeto Google Cloud ou use o padrão gerado.</li>
                <li>Copie a chave gerada (iniciada com <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-900">AIzaSy...</code>).</li>
              </ol>
            </div>
          </div>

          {/* SEÇÃO 2: ADMIN_IMPORT_KEY */}
          <div className="p-4 sm:p-5 rounded-xl border border-stone-200 bg-white space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-stone-800 text-white font-bold flex items-center justify-center text-xs">
                2
              </span>
              <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                Gerador da Chave ADMIN_IMPORT_KEY
              </h4>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              O <strong>ADMIN_IMPORT_KEY</strong> é um código aleatório que serve para proteger o servidor caso alguém tente enviar um novo acervo para a rota de importação.
            </p>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
              <span className="text-xs font-semibold text-stone-800 block">
                Sua chave gerada para o servidor:
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={generatedKey}
                  className="w-full text-xs font-mono p-2 rounded border border-stone-300 bg-white text-stone-900 font-semibold"
                />
                <button
                  type="button"
                  onClick={generateRandomKey}
                  className="px-3 py-2 bg-stone-700 hover:bg-stone-800 text-white rounded text-xs font-medium transition flex items-center space-x-1 shrink-0"
                  title="Gerar outro código aleatório"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Outra</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyAdminKey}
                  className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-medium transition flex items-center space-x-1 shrink-0"
                >
                  {copiedAdminKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAdminKey ? 'Copiada!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: ONDE COLOCAR AS CHAVES (.env) */}
          <div className="p-4 sm:p-5 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-stone-800 text-white font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                  Onde colocar as chaves (Arquivo .env)
                </h4>
              </div>
              <button
                type="button"
                onClick={handleCopyEnvSnippet}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-medium flex items-center space-x-1"
              >
                {copiedEnvSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEnvSnippet ? 'Copiado!' : 'Copiar Modelo'}</span>
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Cole essas linhas no arquivo <code>.env</code> na raiz do projeto:
            </p>

            <pre className="p-3 rounded-lg bg-stone-900 text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`# Modelo Gemini recomendado (rápido e preciso):
GEMINI_MODEL="gemini-3.8-flash"

# Chave gerada no Google AI Studio (aistudio.google.com):
GEMINI_API_KEY="AIzaSySuaChaveAqui"

# Chave de segurança para importações no servidor:
ADMIN_IMPORT_KEY="${generatedKey}"`}
            </pre>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            💡 <strong>Você precisa configurar isso obrigatoriamente?</strong> Não! Se preferir não mexer em chaves, o aplicativo funciona imediatamente com o motor pastoral católico embutido e a Bíblia completa já disponível.
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between rounded-b-xl">
          <span className="text-[11px] text-stone-500">
            Palavra em Vida • Configurações de IA e Servidor
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-lg transition"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
