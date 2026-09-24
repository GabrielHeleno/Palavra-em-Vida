# Guia de Configuração: Chaves, Modelo Gemini e Bíblia Completa

Este documento explica como funcionam o **ADMIN_IMPORT_KEY**, o **GEMINI_MODEL** e onde consultar a **Bíblia Sagrada Completa em Texto Simples (.txt)**.

---

## 1. Bíblia Sagrada Completa em Arquivo de Texto (.txt)

O arquivo com o texto integral de todos os livros e versículos da Bíblia Sagrada está salvo em:

- **Na raiz do projeto:** `/biblia_sagrada_completa.txt`
- **Na pasta pública web:** `/public/biblia_sagrada_completa.txt`
- **URL direta para download no navegador:** `https://seu-app.applet/biblia_sagrada_completa.txt`

### Detalhes do Arquivo:
- **Total de Livros:** 66 livros canônicos do Antigo e Novo Testamento + Seção Pastoral dos Livros Deuterocanônicos Católicos da Bíblia de Jerusalém (Tobias, Judite, Sabedoria, Eclesiástico/Ben Sirá, Baruc, 1 e 2 Macabeus).
- **Total de Capítulos:** 1.189 capítulos.
- **Total de Versículos:** 31.104 versículos.
- **Formato:** Texto simples UTF-8 (.txt) de 4,28 MB.
- **Busca Fácil:** Cada versículo está etiquetado no padrão `[Livro Capítulo:Versículo] Texto` (ex: `[Gênesis 1:1]`, `[João 3:16]`), permitindo pesquisa instantânea por qualquer leitor de texto (Bloco de Notas, Word, VS Code, celular ou `grep`).

> **Importante:** Você **nunca precisa alimentar o acervo manualmente**. O sistema já vem com a base pastoral integral conferida e ativa para gerar os 12 cartões imediatamente.

---

## 2. Como Gerar e Usar o ADMIN_IMPORT_KEY

O `ADMIN_IMPORT_KEY` é uma chave/senha secreta opcional criada pelo administrador para proteger a rota de importação (`POST /api/database/import`) contra sobrescritas não autorizadas da base bíblica.

### Se você NÃO pretende trocar a base de dados:
Você **não precisa fazer nada**. O aplicativo funciona perfeitamente sem o `ADMIN_IMPORT_KEY`.

### Se desejar configurar uma chave de proteção:
1. Gere uma chave segura aleatória executando no terminal:
   ```bash
   openssl rand -hex 16
   ```
   *Ou gere diretamente dentro do aplicativo na aba "Acervo & Chaves" -> "Chaves & Modelo Gemini" clicando no botão "Gerar".*

2. Copie a chave gerada e adicione ao seu arquivo `.env`:
   ```env
   ADMIN_IMPORT_KEY="e178a9c3b88b4885848bb22fe907dc21"
   ```

3. Ao enviar requisições de importação para `/api/database/import`, inclua o cabeçalho HTTP:
   ```http
   x-admin-key: e178a9c3b88b4885848bb22fe907dc21
   ```

---

## 3. Como Configurar o GEMINI_MODEL e a API Key

O `GEMINI_MODEL` define qual modelo do Google Gemini é utilizado no servidor para a curadoria pastoral dos 12 cartões.

### Modelos Disponíveis e Recomendados:
- **`gemini-3.8-flash`** *(Padrão configurado)*: Modelo ultrarrápido, ideal para classificação temática e equilíbrio canônico.
- **`gemini-2.5-flash`**: Modelo estável amplamente disponível.
- **`gemini-2.5-pro`**: Modelo com raciocínio profundo para diretrizes pastorais complexas.

### Onde Configurar:
No arquivo `.env` (ou no painel de Segredos/Variáveis de Ambiente da sua hospedagem):

```env
# Modelo a ser utilizado:
GEMINI_MODEL="gemini-3.8-flash"

# Chave de API do Google AI Studio (obtenha gratuitamente em https://aistudio.google.com):
GEMINI_API_KEY="sua_chave_aqui"
```

### Funcionamento Offline / Sem Chave:
Se você **não configurar** o `GEMINI_API_KEY` ou não tiver acesso à internet, o aplicativo ativa automaticamente o **Motor Determinístico Pastoral Católico**. Ele busca e seleciona as 12 passagens bíblicas usando algoritmos locais de relevância teológica e cânon católico, sem nunca quebrar ou falhar.
