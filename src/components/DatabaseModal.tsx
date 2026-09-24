import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Download,
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  BookCheck,
  Key,
  Cpu,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { TranslationMetadata } from '../types/bible';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: TranslationMetadata | null;
  onDatabaseImported: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  metadata,
  onDatabaseImported,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'bible_txt' | 'config' | 'import'>('bible_txt');
  const [adminKey, setAdminKey] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{
    success?: boolean;
    message?: string;
    errors?: string[];
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Helper for generating admin key
  const [generatedKey, setGeneratedKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  // Health / Server config info
  const [serverHealth, setServerHealth] = useState<{
    model?: string;
    hasApiKey?: boolean;
    hasAdminKey?: boolean;
  } | null>(null);

  // Bible search/query state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/health')
        .then(res => res.json())
        .then(data => setServerHealth(data))
        .catch(() => setServerHealth(null));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadTxt = () => {
    const link = document.createElement('a');
    link.href = '/biblia_sagrada_completa.txt';
    link.download = 'biblia_sagrada_completa.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadBackup = () => {
    const link = document.createElement('a');
    link.href = '/api/database/export';
    link.download = 'biblia-catolica-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateRandomKey = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    setGeneratedKey(key);
    setCopiedKey(false);
  };

  const handleCopyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleExecuteImport = async () => {
    setImportStatus(null);
    setIsImporting(true);

    try {
      let parsed: unknown;
      try {
        parsed = JSON.parse(importJsonText);
      } catch (e) {
        setImportStatus({
          success: false,
          message: 'O texto inserido não é um JSON válido.',
        });
        setIsImporting(false);
        return;
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (adminKey.trim()) {
        headers['x-admin-key'] = adminKey.trim();
      }

      const res = await fetch('/api/database/import', {
        method: 'POST',
        headers,
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      setImportStatus(data);

      if (data.success) {
        onDatabaseImported();
      }
    } catch (err: any) {
      setImportStatus({
        success: false,
        message: 'Falha de comunicação com o servidor ao importar acervo.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
              <BookCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif-sacred">
                Acervo Bíblico & Consulta Permanente
              </h3>
              <p className="text-xs text-stone-500">
                Texto integral em arquivo simples, chaves de administração e modelo de IA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 px-4 sm:px-5 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('bible_txt')}
            className={`py-3 px-3 border-b-2 mr-3 whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'bible_txt'
                ? 'border-emerald-800 text-emerald-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Bíblia Completa (.TXT)</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 px-3 border-b-2 mr-3 whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'config'
                ? 'border-emerald-800 text-emerald-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Chaves & Modelo Gemini</span>
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3 border-b-2 mr-3 whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'info'
                ? 'border-emerald-800 text-emerald-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cânon Católico (73 Livros)</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'import'
                ? 'border-emerald-800 text-emerald-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importação / Backup</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          {/* TAB 1: BÍBLIA COMPLETA EM TXT */}
          {activeTab === 'bible_txt' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-emerald-900 text-sm">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Bíblia Sagrada Completa em Arquivo de Texto Simples (.txt)</span>
                </div>
                <p className="text-xs text-emerald-900/90 leading-relaxed">
                  O arquivo <strong>biblia_sagrada_completa.txt</strong> já está gerado e disponível na raiz do projeto e na pasta pública. Ele contém <strong>todos os 1.189 capítulos e 31.104 versículos</strong> de todos os livros, além da seção pastoral com os livros deuterocanônicos católicos da Bíblia de Jerusalém.
                </p>
                <div className="p-2.5 bg-white/80 rounded-md border border-emerald-200/80 text-[11px] text-emerald-800">
                  ✨ <strong>Autossuficiência total:</strong> Você <strong>nunca precisa alimentar ou recadastrar o acervo manualmente</strong>. Todas as passagens e versículos já estão integrados para uso imediato pelo sistema e para consulta direta.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/70">
                  <span className="text-stone-500 block text-[11px]">Total de Livros</span>
                  <span className="font-bold text-stone-900 text-base">66 + 7 Católicos</span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">Antigo e Novo Testamento</span>
                </div>
                <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/70">
                  <span className="text-stone-500 block text-[11px]">Capítulos & Versículos</span>
                  <span className="font-bold text-stone-900 text-base">1.189 / 31.104</span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">Texto integral sem cortes</span>
                </div>
                <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/70">
                  <span className="text-stone-500 block text-[11px]">Tamanho do Arquivo</span>
                  <span className="font-bold text-emerald-900 text-base">4,28 MB</span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">Texto puro UTF-8 (.txt)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                      Baixar Arquivo Completo para seu Computador ou Celular
                    </h4>
                    <p className="text-xs text-stone-500">
                      Abra em qualquer bloco de notas, Word, VS Code ou aplicativo de leitura offline.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleDownloadTxt}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg transition flex items-center space-x-2 text-xs shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>Baixar .TXT (4,28 MB)</span>
                    </button>
                    <a
                      href="/biblia_sagrada_completa.txt"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg transition text-xs flex items-center space-x-1"
                      title="Visualizar no navegador"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Abrir</span>
                    </a>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200/80">
                  <span className="text-xs font-semibold text-stone-700 block mb-1">
                    Como o arquivo está estruturado por versículo:
                  </span>
                  <pre className="p-3 rounded-lg bg-stone-900 text-stone-100 text-[11px] overflow-x-auto leading-relaxed">
{`[Gênesis 1:1] No princípio criou Deus os céus e a terra.
[Gênesis 1:2] A terra era sem forma e vazia; e havia trevas sobre a face do abismo...
...
[João 3:16] Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito...
...
[Apocalipse 22:21] A graça do Senhor Jesus seja com todos.`}
                  </pre>
                  <p className="text-[11px] text-stone-500 mt-1.5">
                    Você pode usar o atalho <kbd className="px-1.5 py-0.5 bg-stone-200 rounded text-stone-700 font-mono text-[10px]">Ctrl + F</kbd> para buscar qualquer livro, capítulo ou palavra-chave instantaneamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHAVES E MODELO GEMINI */}
          {activeTab === 'config' && (
            <div className="space-y-4">
              {/* Status Bar */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-emerald-800" />
                  <span className="text-xs text-stone-600">Modelo Gemini Ativo:</span>
                  <span className="font-mono text-xs font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-300">
                    {serverHealth?.model || 'gemini-3.8-flash'}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center space-x-1">
                    <span className="text-stone-500">Chave Gemini:</span>
                    {serverHealth?.hasApiKey ? (
                      <span className="text-emerald-700 font-semibold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" /> Configurada
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">Modo Pastoral Local (Offline)</span>
                    )}
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="text-stone-500">Admin Key:</span>
                    {serverHealth?.hasAdminKey ? (
                      <span className="text-emerald-700 font-semibold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" /> Protegida
                      </span>
                    ) : (
                      <span className="text-stone-500">Aberta (Dev)</span>
                    )}
                  </span>
                </div>
              </div>

              {/* COMO GERAR ADMIN IMPORT KEY */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3 shadow-2xs">
                <div className="flex items-center space-x-2 font-bold text-stone-900">
                  <Key className="w-4 h-4 text-emerald-800" />
                  <h4>1. Como Gerar e Usar o ADMIN_IMPORT_KEY</h4>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  O <strong>ADMIN_IMPORT_KEY</strong> é um token de senha escolhido pelo administrador para proteger a importação de novas bases contra alterações acidentais.
                </p>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                  <span className="text-xs font-semibold text-stone-800 block">
                    Gerador Rápido de Chave Segura:
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedKey || 'Clique ao lado para gerar uma chave...'}
                      className="w-full text-xs font-mono p-2 rounded border border-stone-300 bg-white text-stone-800"
                    />
                    <button
                      type="button"
                      onClick={generateRandomKey}
                      className="px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded text-xs font-medium transition flex items-center space-x-1 shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Gerar</span>
                    </button>
                    {generatedKey && (
                      <button
                        type="button"
                        onClick={handleCopyKey}
                        className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-medium transition flex items-center space-x-1 shrink-0"
                      >
                        {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-stone-600 space-y-1.5">
                  <p><strong>Onde colocar a chave:</strong></p>
                  <pre className="p-2.5 rounded bg-stone-900 text-stone-100 font-mono text-[11px] leading-relaxed">
{`# No arquivo .env ou nas variáveis de ambiente do servidor:
ADMIN_IMPORT_KEY="${generatedKey || 'sua_chave_secreta_aqui'}"`}
                  </pre>
                  <p className="text-[11px] text-stone-500">
                    💡 Se você não precisar alterar ou importar novas bases de dados, a configuração do <code>ADMIN_IMPORT_KEY</code> é <strong>opcional</strong>.
                  </p>
                </div>
              </div>

              {/* COMO CONFIGURAR O GEMINI MODEL */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3 shadow-2xs">
                <div className="flex items-center space-x-2 font-bold text-stone-900">
                  <Cpu className="w-4 h-4 text-emerald-800" />
                  <h4>2. Como Configurar o GEMINI_MODEL e a API Key</h4>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  O <strong>GEMINI_MODEL</strong> especifica qual modelo de Inteligência Artificial do Google realizará a curadoria pastoral dos 12 cartões bíblicos a partir dos temas católicos solicitados.
                </p>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-stone-800 block">
                    Modelos recomendados no arquivo <code>.env</code>:
                  </span>
                  <pre className="p-2.5 rounded bg-stone-900 text-stone-100 font-mono text-[11px] leading-relaxed">
{`# Modelo padrão rápido e eficiente (Recomendado):
GEMINI_MODEL="gemini-3.8-flash"

# Ou modelo estável padrão do Google AI Studio:
GEMINI_MODEL="gemini-2.5-flash"

# Chave de API do Google AI Studio (aistudio.google.com):
GEMINI_API_KEY="AIzaSy..."`}
                  </pre>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900 leading-relaxed">
                  🛡️ <strong>Garantia de Funcionamento Ininterrupto:</strong> Mesmo se você não tiver uma chave da API do Gemini ou ela expirar, o sistema possui um motor determinístico pastoral integrado que seleciona as 12 passagens bíblicas perfeitamente. O aplicativo <strong>nunca para de funcionar</strong>!
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CÂNON CATÓLICO (73 LIVROS) */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 space-y-1">
                <div className="flex items-center space-x-1.5 font-semibold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Cânon Católico Completo de 73 Livros</span>
                </div>
                <p className="text-xs text-emerald-900/90 leading-relaxed">
                  O aplicativo opera com fidelidade à Bíblia de Jerusalém (BJ), comportando os 46 livros do Antigo Testamento (incluindo os deuterocanônicos: Tobias, Judite, 1 e 2 Macabeus, Sabedoria, Eclesiástico/Ben Sirá e Baruc) e os 27 do Novo Testamento.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-500 block text-[11px]">Tradução Oficial de Referência</span>
                  <span className="font-semibold text-stone-800 text-sm">
                    {metadata?.name || 'Bíblia de Jerusalém'} ({metadata?.id || 'BJ'})
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-500 block text-[11px]">Editora / Fonte</span>
                  <span className="font-semibold text-stone-800 text-sm">
                    {metadata?.publisher || 'Edições Paulus'}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-500 block text-[11px]">Convenção de Numeração</span>
                  <span className="font-semibold text-stone-800">
                    {metadata?.numberingConvention || 'Numeração litúrgica católica tradicional'}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/50">
                  <span className="text-stone-500 block text-[11px]">Condição do Acervo Pastoral</span>
                  <span className="font-semibold text-stone-800">
                    {metadata?.isLimitedInitialSet
                      ? `Acervo pastoral conferido: ${metadata?.totalPassages} passagens`
                      : `${metadata?.totalPassages} passagens ativas`}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/30 text-xs text-stone-600">
                <span className="font-semibold text-stone-700 block mb-1">Nota de uso pastoral:</span>
                <p>{metadata?.licenseNote || 'Uso pastoral e celebrativo em comunidade; citação ipsis litteris com atribuição canônica.'}</p>
              </div>
            </div>
          )}

          {/* TAB 4: IMPORTAÇÃO E BACKUP */}
          {activeTab === 'import' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <div>
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                    Backup e Exportação do Acervo Pastoral
                  </h4>
                  <p className="text-xs text-stone-500">
                    Baixe em JSON todas as passagens pastorais catalogadas com seus temas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium rounded-md transition flex items-center space-x-1.5 text-xs shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar JSON</span>
                </button>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Chave de Administração (ADMIN_IMPORT_KEY)
                </label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={e => setAdminKey(e.target.value)}
                  placeholder="Informe a chave configurada no .env (se houver)..."
                  className="w-full text-xs p-2 rounded-md border border-stone-300 focus:border-emerald-700 bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Conteúdo JSON da Base Bíblica para Importar
                </label>
                <textarea
                  rows={6}
                  value={importJsonText}
                  onChange={e => setImportJsonText(e.target.value)}
                  placeholder="Cole aqui o objeto JSON com metadata e array passages..."
                  className="w-full font-mono text-[11px] p-2.5 rounded-md border border-stone-300 focus:border-emerald-700 bg-stone-50 resize-y"
                />
              </div>

              {importStatus && (
                <div
                  className={`p-3 rounded-md text-xs border flex items-start space-x-2 ${
                    importStatus.success
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-red-50 text-red-900 border-red-200'
                  }`}
                >
                  {importStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  <div>
                    <p className="font-semibold">{importStatus.message}</p>
                    {importStatus.errors && importStatus.errors.length > 0 && (
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                        {importStatus.errors.slice(0, 5).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleExecuteImport}
                  disabled={isImporting || !importJsonText.trim()}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-400 text-white rounded-md text-xs font-semibold transition flex items-center space-x-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isImporting ? 'Validando e importando...' : 'Validar e Importar Base'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            Palavra em Vida • Bíblia Sagrada Completa em Texto Simples (.txt)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-200 rounded-md transition ml-auto"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
