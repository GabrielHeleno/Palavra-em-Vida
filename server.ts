import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { processSelection } from './src/server/selectionPipeline.ts';
import { bibleRepository } from './src/server/bibleRepository.ts';
import { rateLimiter } from './src/server/rateLimiter.ts';
import {
  getLogoRegistry,
  saveUploadedLogo,
  setDefaultLogo,
  deleteLogo,
} from './src/server/logoService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // Serve uploads estáticos com headers corretos em dev e prod
  const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
  app.use('/uploads', express.static(uploadsDir));

  // API Routes
  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'Palavra em Vida API',
      timestamp: new Date().toISOString(),
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
      hasAdminKey: !!process.env.ADMIN_IMPORT_KEY && process.env.ADMIN_IMPORT_KEY !== 'sua_chave_de_administracao_aqui',
    });
  });

  app.get('/api/database/metadata', (_req, res) => {
    res.json(bibleRepository.getMetadata());
  });

  app.get('/api/database/export', (_req, res) => {
    res.json({
      metadata: bibleRepository.getMetadata(),
      passages: bibleRepository.getAllPassages(),
    });
  });

  // Endpoints do Histórico de Logos do Aplicativo (Arquivos salvos no servidor)
  app.get('/api/logos', (_req, res) => {
    try {
      const registry = getLogoRegistry();
      res.json(registry);
    } catch (err: any) {
      console.error('Erro ao buscar histórico de logos:', err);
      res.status(500).json({ error: 'Falha ao recuperar histórico de logos' });
    }
  });

  app.post('/api/logos/upload', (req, res) => {
    try {
      const { dataUrl, name, setAsDefault } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ error: 'Arquivo ou dataUrl não informado' });
      }

      const newLogo = saveUploadedLogo(
        dataUrl,
        name || 'Cópia de paroquia (3).jpg',
        setAsDefault !== false
      );
      const registry = getLogoRegistry();

      return res.json({
        success: true,
        logo: newLogo,
        defaultLogoUrl: registry.defaultLogoUrl,
      });
    } catch (err: any) {
      console.error('Erro no upload de logo:', err);
      return res.status(500).json({ error: err.message || 'Falha ao salvar logo no arquivo do app' });
    }
  });

  app.post('/api/logos/set-default', (req, res) => {
    try {
      const { id, url } = req.body;
      const target = id || url;
      if (!target) {
        return res.status(400).json({ error: 'ID ou URL do logotipo não informado' });
      }

      const result = setDefaultLogo(target);
      return res.json(result);
    } catch (err: any) {
      console.error('Erro ao definir logo padrão:', err);
      return res.status(400).json({ error: err.message || 'Falha ao definir logo padrão' });
    }
  });

  app.delete('/api/logos/:id', (req, res) => {
    try {
      const { id } = req.params;
      const result = deleteLogo(id);
      return res.json(result);
    } catch (err: any) {
      console.error('Erro ao excluir logo:', err);
      return res.status(400).json({ error: err.message || 'Falha ao excluir logo' });
    }
  });

  // Rota legada para retrocompatibilidade
  app.get('/api/logo/status', (_req, res) => {
    const registry = getLogoRegistry();
    if (registry.defaultLogoUrl) {
      return res.json({ exists: true, url: registry.defaultLogoUrl });
    }
    const legacyPath = path.resolve(__dirname, 'public', 'paroquia_logo_padrao.jpg');
    res.json({
      exists: fs.existsSync(legacyPath),
      url: '/paroquia_logo_padrao.jpg',
    });
  });

  // Endpoints para Imagem de Background de São Caetano
  app.get('/api/background/status', (_req, res) => {
    const publicBgPath = path.resolve(__dirname, 'public', 'background_sao_caetano.jpg');
    const exists = fs.existsSync(publicBgPath);
    let mtime = 0;
    if (exists) {
      mtime = fs.statSync(publicBgPath).mtimeMs;
    }
    res.json({ exists, url: `/background_sao_caetano.jpg?v=${mtime}` });
  });

  app.post('/api/background/upload', (req, res) => {
    try {
      const { dataUrl } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ error: 'DataUrl da imagem não fornecido' });
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Formato de dataUrl inválido' });
      }

      const buffer = Buffer.from(matches[2], 'base64');
      const publicDir = path.resolve(__dirname, 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const bgPath = path.resolve(publicDir, 'background_sao_caetano.jpg');
      fs.writeFileSync(bgPath, buffer);

      const distDir = path.resolve(__dirname, 'dist');
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.resolve(distDir, 'background_sao_caetano.jpg'), buffer);
      }

      const mtime = Date.now();
      return res.json({ success: true, url: `/background_sao_caetano.jpg?v=${mtime}` });
    } catch (err: any) {
      console.error('Erro ao salvar imagem de fundo:', err);
      return res.status(500).json({ error: err.message || 'Falha ao salvar imagem de fundo' });
    }
  });

  // Rota para upload e persistência do logotipo oficial (sem nenhuma alteração gráfica)
  app.post('/api/logo/upload', (req, res) => {
    try {
      const { dataUrl } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ error: 'DataUrl da imagem não fornecido' });
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Formato de dataUrl inválido' });
      }

      const buffer = Buffer.from(matches[2], 'base64');
      const publicDir = path.resolve(__dirname, 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const filePath = path.resolve(publicDir, 'paroquia_logo_padrao.jpg');
      fs.writeFileSync(filePath, buffer);

      const distDir = path.resolve(__dirname, 'dist');
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.resolve(distDir, 'paroquia_logo_padrao.jpg'), buffer);
      }

      return res.json({ success: true, url: '/paroquia_logo_padrao.jpg' });
    } catch (err: any) {
      console.error('Erro ao salvar logo:', err);
      return res.status(500).json({ error: 'Falha ao salvar logo' });
    }
  });

  app.post('/api/database/import', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_IMPORT_KEY;
    if (expectedKey && adminKey !== expectedKey) {
      return res.status(403).json({
        success: false,
        message: 'Chave de administração inválida ou não informada.',
      });
    }

    const result = bibleRepository.importDatabase(req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json(result);
  });

  app.post('/api/select', rateLimiter.middleware(), async (req, res) => {
    try {
      const response = await processSelection(req.body);
      res.json(response);
    } catch (err: any) {
      console.error('Erro na rota /api/select:', err);
      res.status(500).json({
        status: 'error',
        message: 'Falha interna ao processar seleção pastoral bíblica.',
      });
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Servidor Palavra em Vida operando na porta ${PORT} (${isProduction ? 'Produção' : 'Desenvolvimento'})`);
  });
}

startServer().catch(err => {
  console.error('Erro fatal ao inicializar servidor:', err);
  process.exit(1);
});
