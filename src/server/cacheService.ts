import crypto from 'crypto';
import { SelectionResponse } from '../types/bible';
import { normalizeText } from './fullBibleService';

interface CacheEntry {
  response: SelectionResponse;
  expiresAt: number;
  lastAccessed: number;
}

export class SelectionCacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private inFlightRequests: Map<string, Promise<SelectionResponse>> = new Map();
  private maxEntries = 500;
  private defaultTtlMs = 7 * 24 * 60 * 60 * 1000; // 7 dias
  private promptVersion = 'v2.0-pure-ai-pastoral';

  public generateCacheKey(
    themes: string[],
    pastoralGuidance: string | undefined,
    translationId: string,
    dbVersion: string,
    modelName: string,
    lockedIds: string[] = [],
    useGemini = true
  ): string {
    const normThemes = themes.map(normalizeText).sort().join(';');
    const normGuidance = pastoralGuidance ? normalizeText(pastoralGuidance) : '';
    const normLocked = [...lockedIds].sort().join(';');

    const rawKey = [
      normThemes,
      normGuidance,
      translationId,
      dbVersion,
      this.promptVersion,
      modelName,
      normLocked,
    ].join('||');

    return crypto.createHash('sha256').update(rawKey).digest('hex');
  }

  public get(key: string): SelectionResponse | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    entry.lastAccessed = Date.now();
    return {
      ...entry.response,
      meta: {
        ...entry.response.meta,
        cacheHit: true,
      },
    };
  }

  public set(key: string, response: SelectionResponse, ttlMs = this.defaultTtlMs): void {
    // Descarte LRU se atingir capacidade
    if (this.cache.size >= this.maxEntries) {
      let oldestKey: string | null = null;
      let oldestTime = Infinity;

      for (const [k, v] of this.cache.entries()) {
        if (v.lastAccessed < oldestTime) {
          oldestTime = v.lastAccessed;
          oldestKey = k;
        }
      }

      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      response,
      expiresAt: Date.now() + ttlMs,
      lastAccessed: Date.now(),
    });
  }

  /**
   * Coalescência de requisições simultâneas em voo
   */
  public async coalesce<T extends SelectionResponse>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const cached = this.get(key);
    if (cached) {
      return cached as T;
    }

    const inFlight = this.inFlightRequests.get(key);
    if (inFlight) {
      return (await inFlight) as T;
    }

    const promise = (async () => {
      try {
        const result = await fn();
        if (result.status === 'ok') {
          this.set(key, result);
        }
        return result;
      } finally {
        this.inFlightRequests.delete(key);
      }
    })();

    this.inFlightRequests.set(key, promise);
    return promise;
  }

  public getStats() {
    return {
      entries: this.cache.size,
      maxEntries: this.maxEntries,
      inFlight: this.inFlightRequests.size,
    };
  }
}

export const cacheService = new SelectionCacheService();
