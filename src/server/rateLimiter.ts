import { Request, Response, NextFunction } from 'express';

interface ClientRecord {
  timestamps: number[];
}

export class RateLimiter {
  private clients: Map<string, ClientRecord> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 30, windowMs = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Limpeza periódica de clientes inativos a cada 5 minutos
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [ip, record] of this.clients.entries()) {
      record.timestamps = record.timestamps.filter(t => now - t < this.windowMs);
      if (record.timestamps.length === 0) {
        this.clients.delete(ip);
      }
    }
  }

  public middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Extrai IP com consideração para proxies (Cloud Run / AI Studio)
      const forwarded = req.headers['x-forwarded-for'];
      const rawIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress || '127.0.0.1';
      
      const now = Date.now();
      let record = this.clients.get(rawIp);
      if (!record) {
        record = { timestamps: [] };
        this.clients.set(rawIp, record);
      }

      // Remove timestamps fora da janela deslizante
      record.timestamps = record.timestamps.filter(t => now - t < this.windowMs);

      if (record.timestamps.length >= this.maxRequests) {
        return res.status(429).json({
          status: 'error',
          message: 'Limite temporário de requisições atingido. Por favor, aguarde alguns instantes antes de gerar uma nova seleção.',
        });
      }

      record.timestamps.push(now);
      next();
    };
  }
}

export const rateLimiter = new RateLimiter();
