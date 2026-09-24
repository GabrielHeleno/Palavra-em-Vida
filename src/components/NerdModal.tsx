import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Cpu,
  X,
  Database,
  Layers,
  Shield,
  Key,
  Download,
  Upload,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  FileText,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { TranslationMetadata } from '../types/bible';

interface NerdModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata?: TranslationMetadata | null;
  onDatabaseImported?: () => void;
}

const CATHOLIC_BOOKS = [
  { name: 'Gênesis', testament: 'AT', group: 'Pentateuco' },
  { name: 'Êxodo', testament: 'AT', group: 'Pentateuco' },
  { name: 'Levítico', testament: 'AT', group: 'Pentateuco' },
  { name: 'Números', testament: 'AT', group: 'Pentateuco' },
  { name: 'Deuteronômio', testament: 'AT', group: 'Pentateuco' },
  { name: 'Josué', testament: 'AT', group: 'Históricos' },
  { name: 'Juízes', testament: 'AT', group: 'Históricos' },
  { name: 'Rute', testament: 'AT', group: 'Históricos' },
  { name: '1 Samuel', testament: 'AT', group: 'Históricos' },
  { name: '2 Samuel', testament: 'AT', group: 'Históricos' },
  { name: '1 Reis', testament: 'AT', group: 'Históricos' },
  { name: '2 Reis', testament: 'AT', group: 'Históricos' },
  { name: '1 Crônicas', testament: 'AT', group: 'Históricos' },
  { name: '2 Crônicas', testament: 'AT', group: 'Históricos' },
  { name: 'Esdras', testament: 'AT', group: 'Históricos' },
  { name: 'Neemias', testament: 'AT', group: 'Históricos' },
  { name: 'Tobias', testament: 'AT', group: 'Deuterocanônicos Católicos' },
  { name: 'Judite', testament: 'AT', group: 'Deuterocanônicos Católicos' },
  { name: 'Ester (+ adições católicas)', testament: 'AT', group: 'Históricos' },
  { name: '1 Macabeus', testament: 'AT', group: 'Deuterocanônicos Católicos' },
  { name: '2 Macabeus', testament: 'AT', group: 'Deuterocanônicos Católicos' },
  { name: 'Jó', testament: 'AT', group: 'Sapienciais' },
  { name: 'Salmos', testament: 'AT', group: 'Sapienciais' },
  { name: 'Provérbios', testament: 'AT', group: 'Sapienciais' },
  { name: 'Eclesiastes (Coélet)', testament: 'AT', group: 'Sapienciais' },
  { name: 'Cântico dos Cânticos', testament: 'AT', group: 'Sapienciais' },
  { name: 'Sabedoria', testament: 'AT', group: 'Deuterocanônicos Católicos' },
  { name: 'Eclesiástico (Sirácida)', testament: 'AT', group: 'Deuterocanônicos Católicos' },
  { name: 'Isaías', testament: 'AT', group: 'Profetas' },
  { name: 'Jeremias', testament: 'AT', group: 'Profetas' },
  { name: 'Lamentações', testament: 'AT', group: 'Profetas' },
  { name: 'Baruc (+ Carta de Jeremias)', testament: 'AT', group: 'Deuterocanônicos Católicos' },
  { name: 'Ezequiel', testament: 'AT', group: 'Profetas' },
  { name: 'Daniel (+ adições católicas)', testament: 'AT', group: 'Profetas' },
  { name: 'Oseias', testament: 'AT', group: 'Profetas Menores' },
  { name: 'Joel', testament: 'AT', group: 'Profetas Menores' },
  { name: 'Amós', testament: 'AT', group: 'Profetas Menores' },
  { name: 'Obadias', testament: 'AT', group: 'Profetas Menores' },
  { name: 'Jonas', testament: 'AT', group: 'Profetas Menores' },
  { name: 'Miqueias', testament: 'AT', group: 'Profetas Menores' },
  { name: 'Naum', testament: 'AT', group: 'Profetas Menores' },
  { name: 'Habacuc', testament: 'AT', group: 'Profetas Menores' },
  { name: 'Sofonias', testament: 'AT', group: 'Profetas Menores' },
  { name: 'Ageu', testament: 'AT', group: 'Profetas Menores' },
  { name: 'Zacarias', testament: 'AT', group: 'Profetas Menores' },
  { name: 'Malaquias', testament: 'AT', group: 'Profetas Menores' },
  { name: 'Mateus', testament: 'NT', group: 'Evangelhos' },
  { name: 'Marcos', testament: 'NT', group: 'Evangelhos' },
  { name: 'Lucas', testament: 'NT', group: 'Evangelhos' },
  { name: 'João', testament: 'NT', group: 'Evangelhos' },
  { name: 'Atos dos Apóstolos', testament: 'NT', group: 'História do NT' },
  { name: 'Romanos', testament: 'NT', group: 'Cartas Paulinas' },
  { name: '1 Coríntios', testament: 'NT', group: 'Cartas Paulinas' },
  { name: '2 Coríntios', testament: 'NT', group: 'Cartas Paulinas' },
  { name: 'Gálatas', testament: 'NT', group: 'Cartas Paulinas' },
  { name: 'Efésios', testament: 'NT', group: 'Cartas Paulinas' },
  { name: 'Filipenses', testament: 'NT', group: 'Cartas Paulinas' },
  { name: 'Colossenses', testament: 'NT', group: 'Cartas Paulinas' },
  { name: '1 Tessalonicenses', testament: 'NT', group: 'Cartas Paulinas' },
  { name: '2 Tessalonicenses', testament: 'NT', group: 'Cartas Paulinas' },
  { name: '1 Timóteo', testament: 'NT', group: 'Cartas Pastorais' },
  { name: '2 Timóteo', testament: 'NT', group: 'Cartas Pastorais' },
  { name: 'Tito', testament: 'NT', group: 'Cartas Pastorais' },
  { name: 'Filemon', testament: 'NT', group: 'Cartas Paulinas' },
  { name: 'Hebreus', testament: 'NT', group: 'Cartas' },
  { name: 'Tiago', testament: 'NT', group: 'Cartas Católicas' },
  { name: '1 Pedro', testament: 'NT', group: 'Cartas Católicas' },
  { name: '2 Pedro', testament: 'NT', group: 'Cartas Católicas' },
  { name: '1 João', testament: 'NT', group: 'Cartas Católicas' },
  { name: '2 João', testament: 'NT', group: 'Cartas Católicas' },
  { name: '3 João', testament: 'NT', group: 'Cartas Católicas' },
  { name: 'Judas', testament: 'NT', group: 'Cartas Católicas' },
  { name: 'Apocalipse', testament: 'NT', group: 'Profecia do NT' },
];

export const NerdModal: React.FC<NerdModalProps> = ({
  isOpen,
  onClose,
  metadata,
  onDatabaseImported,
}) => {
  const [activeTab, setActiveTab] = useState<'system' | 'acervo' | 'keys'>('system');

  // Chaves e Gemini State
  const [generatedKey, setGeneratedKey] = useState('');
  const [copiedAdminKey, setCopiedAdminKey] = useState(false);
  const [copiedEnvSnippet, setCopiedEnvSnippet] = useState(false);
  const [serverHealth, setServerHealth] = useState<{
    model?: string;
    hasApiKey?: boolean;
    hasAdminKey?: boolean;
  } | null>(null);

  // Acervo / Import State
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/health')
        .then(res => res.json())
        .then(data => setServerHealth(data))
        .catch(() => setServerHealth(null));

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

  const handleExecuteImport = async () => {
    setImportStatus(null);
    setIsImporting(true);

    try {
      let parsed: unknown;
      try {
        parsed = JSON.parse(importJsonText);
      } catch (err) {
        setImportStatus({
          success: false,
          message: 'JSON inválido. Certifique-se de colar uma estrutura de acervo válida.',
        });
        setIsImporting(false);
        return;
      }

      const res = await fetch('/api/database/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKeyInput.trim(),
        },
        body: JSON.stringify({ database: parsed }),
      });

      const data = await res.json();
      if (!res.ok) {
        setImportStatus({
          success: false,
          message: data.error || 'Falha ao importar. Verifique a chave de administração.',
        });
      } else {
        setImportStatus({
          success: true,
          message: `Acervo importado com sucesso! ${data.importedCount || 0} versículos registrados.`,
        });
        if (onDatabaseImported) onDatabaseImported();
      }
    } catch (err: any) {
      setImportStatus({
        success: false,
        message: 'Erro na comunicação com o servidor: ' + err.message,
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#18181B] text-zinc-100 rounded-xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-zinc-700/80 font-mono text-xs">
        {/* Terminal Header */}
        <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900 rounded-t-xl">
          <div className="flex items-center space-x-2.5">
            <div className="flex space-x-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-zinc-200">palavra-em-vida // para_nerds.sh</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition cursor-pointer"
            title="Fechar terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-Header Navigation Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/60 px-3 overflow-x-auto text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`py-2 px-3 border-b-2 font-medium transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'system'
                ? 'border-emerald-400 text-emerald-400 bg-zinc-800/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>01_diagnostico.sys</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('acervo')}
            className={`py-2 px-3 border-b-2 font-medium transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'acervo'
                ? 'border-emerald-400 text-emerald-400 bg-zinc-800/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>02_acervo_biblico.db</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('keys')}
            className={`py-2 px-3 border-b-2 font-medium transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'keys'
                ? 'border-emerald-400 text-emerald-400 bg-zinc-800/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>03_chaves_gemini.env</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* TAB 1: DIAGNÓSTICO DO SISTEMA */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="p-3 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-300 space-y-1">
                <p className="text-emerald-400 font-bold flex items-center space-x-1.5">
                  <span>$ system_info --verbose</span>
                </p>
                <p className="text-zinc-400 text-[11px]">
                  Aplicação: Palavra em Vida • Paróquia de São Caetano (Cipotânea - MG)
                </p>
                <p className="text-zinc-400 text-[11px]">
                  Motor: Express + Vite + React 18 + Tailwind CSS + jsPDF Vector Engine
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-900/60 rounded border border-zinc-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                    <Database className="w-3.5 h-3.5" />
                    <span>Cânon Católico Integral</span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    73 Livros (46 Antigo + 27 Novo Testamento), 1.189 capítulos e 31.104 versículos carregados na memória.
                  </p>
                </div>

                <div className="p-3 bg-zinc-900/60 rounded border border-zinc-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Geometria de Impressão A4</span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Folha Paisagem: 297 x 210 mm. Grade 3x4 = 12 cartões de 91,0 x 46,5 mm cada. Guias de corte vetoriais de 0.15 mm.
                  </p>
                </div>

                <div className="p-3 bg-zinc-900/60 rounded border border-zinc-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Seleção Algorítmica</span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Quotas balanceadas por tema, garantia de 12 itens distintos, suporte a Gemini Flash para curadoria com fallback local.
                  </p>
                </div>

                <div className="p-3 bg-zinc-900/60 rounded border border-zinc-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Detecção de Overflow</span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Cálculo em tempo real de altura física de texto e logo, impedindo cortes ao imprimir com guilhotina ou tesoura.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACERVO BÍBLICO (.TXT, CÂNON E BACKUP) */}
          {activeTab === 'acervo' && (
            <div className="space-y-4">
              <div className="p-3 rounded bg-zinc-900/90 border border-zinc-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-emerald-400 font-bold flex items-center space-x-1.5">
                      <FileText className="w-4 h-4" />
                      <span>Bíblia Sagrada Completa em Texto Puro (.txt)</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      Contém todos os 1.189 capítulos e 31.104 versículos integrais com a seção deuterocanônica católica.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleDownloadTxt}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar .TXT (4,28 MB)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadBackup}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded flex items-center space-x-1.5 cursor-pointer transition"
                      title="Exportar base completa em JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Backup .JSON</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabela dos 73 Livros Católicos */}
              <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="font-bold text-emerald-400">
                    Cânon Católico Completo (73 Livros)
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    46 Antigo Testamento + 27 Novo Testamento
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto border border-zinc-800 rounded bg-zinc-950 p-2 grid grid-cols-2 sm:grid-cols-3 gap-1 text-[11px]">
                  {CATHOLIC_BOOKS.map(b => (
                    <div
                      key={b.name}
                      className={`px-2 py-1 rounded flex items-center justify-between ${
                        b.group.includes('Deuterocanônicos')
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                          : 'text-zinc-300'
                      }`}
                    >
                      <span className="truncate">{b.name}</span>
                      <span className="text-[9px] text-zinc-500 shrink-0 ml-1">{b.testament}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-emerald-400/80">
                  * Destaque em verde: Livros deuterocanônicos e adições gregas católicas (Tobias, Judite, Sabedoria, Eclesiástico, Baruc, 1 e 2 Macabeus, adições de Ester e Daniel).
                </p>
              </div>

              {/* Importação / Restauração com Chave Admin */}
              <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800 space-y-2">
                <span className="font-bold text-zinc-200 flex items-center space-x-1.5">
                  <Upload className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Restauração / Importação via API</span>
                </span>
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Chave de Administração (ADMIN_IMPORT_KEY)"
                    value={adminKeyInput}
                    onChange={e => setAdminKeyInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-hidden text-xs"
                  />
                  <textarea
                    rows={3}
                    placeholder="Cole aqui o payload JSON de versículos para restauração direta..."
                    value={importJsonText}
                    onChange={e => setImportJsonText(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-hidden text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleExecuteImport}
                    disabled={isImporting || !adminKeyInput || !importJsonText}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 rounded font-bold cursor-pointer transition"
                  >
                    {isImporting ? 'Executando importação...' : 'Importar JSON para Servidor'}
                  </button>
                  {importStatus && (
                    <p
                      className={`text-[11px] ${
                        importStatus.success ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {importStatus.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHAVES E GEMINI (.ENV) */}
          {activeTab === 'keys' && (
            <div className="space-y-4">
              {/* Status do Servidor */}
              <div className="p-3 rounded bg-zinc-900/90 border border-zinc-800 space-y-2">
                <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                  <Key className="w-3.5 h-3.5" />
                  <span>Status do Backend & Conexão de IA</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Modelo Ativo</span>
                    <span className="font-bold text-zinc-200">
                      {serverHealth?.model || 'gemini-3.8-flash'}
                    </span>
                  </div>
                  <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">GEMINI_API_KEY</span>
                    <span
                      className={`font-bold ${
                        serverHealth?.hasApiKey ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {serverHealth?.hasApiKey ? 'Configurada' : 'Local Fallback'}
                    </span>
                  </div>
                  <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">ADMIN_KEY</span>
                    <span
                      className={`font-bold ${
                        serverHealth?.hasAdminKey ? 'text-emerald-400' : 'text-zinc-500'
                      }`}
                    >
                      {serverHealth?.hasAdminKey ? 'Ativa' : 'Não definida'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gerador de Chave Mestra */}
              <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-200">Chave Mestra de Administração</span>
                  <button
                    type="button"
                    onClick={generateRandomKey}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Gerar nova chave</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-emerald-400 select-all font-mono text-xs overflow-x-auto">
                    {generatedKey || '3f8a9e2c4b7d1a5e9f0c2b4d6a8e1f3c'}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyAdminKey}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded flex items-center space-x-1 cursor-pointer transition"
                  >
                    {copiedAdminKey ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Snippet do arquivo .env */}
              <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-200">Snippet para arquivo .env</span>
                  <button
                    type="button"
                    onClick={handleCopyEnvSnippet}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedEnvSnippet ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar snippet</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-2.5 bg-zinc-950 border border-zinc-800 rounded text-[11px] text-zinc-300 overflow-x-auto">
{`GEMINI_MODEL="gemini-3.8-flash"
GEMINI_API_KEY="AIzaSySuaChaveAqui"
ADMIN_IMPORT_KEY="${generatedKey || 'sua_chave_admin'}"`}
                </pre>
                <div className="text-[10px] text-zinc-500 flex items-center space-x-1">
                  <span>Obtenha sua chave gratuita do Gemini em:</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline inline-flex items-center space-x-0.5"
                  >
                    <span>aistudio.google.com</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900 rounded-b-xl">
          <span className="text-[11px] text-zinc-500">status: 200 OK • dev_ready</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-bold text-xs transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
