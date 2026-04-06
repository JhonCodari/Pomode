import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout, retry, map, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

// ─── Tipo esperado da API ────────────────────────────────────────────────────
interface HitsResponse {
  daily: number;
  total: number;
}

// ─── Constantes de segurança ─────────────────────────────────────────────────
// URL hardcoded — nunca aceitar de fontes externas/dinâmicas
const HITS_API_URL = 'https://hits.sh/www.pomode.com.br.json';

const TIMEOUT_MS    = 5_000;   // Máximo de espera pela resposta
const MAX_RETRIES   = 1;        // Apenas 1 retry para não gerar flood na API
const MAX_COUNT     = 1e8;      // Clamp: 100 milhões de visitas máximo

/**
 * Valida e sanitiza a resposta da API externa.
 * Nunca confia no shape da resposta — protege contra supply-chain attacks.
 */
function validateResponse(response: unknown): number {
  if (
    typeof response !== 'object' ||
    response === null ||
    !('total' in response)
  ) {
    throw new Error('visitor: resposta inválida — shape inesperado');
  }

  const raw = (response as Record<string, unknown>)['total'];
  const value = Number(raw);

  if (!Number.isFinite(value) || value < 0) {
    throw new Error('visitor: resposta inválida — total não é número positivo');
  }

  // Garante inteiro não-negativo com clamp superior
  return Math.floor(Math.min(value, MAX_COUNT));
}

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private readonly http = inject(HttpClient);

  // ── Signals públicos ──────────────────────────────────────────────────────
  readonly visitCount = signal<number | null>(null);
  readonly isLoading  = signal<boolean>(true);
  readonly hasError   = signal<boolean>(false);

  constructor() {
    this.load();
  }

  private load(): void {
    this.http
      .get<HitsResponse>(HITS_API_URL, {
        // Nunca enviar cookies/credenciais para domínio externo
        withCredentials: false,
      })
      .pipe(
        // Aborta se a API não responder em 5s (proteção contra hanging request)
        timeout(TIMEOUT_MS),
        // 1 retry em caso de falha de rede transitória
        retry(MAX_RETRIES),
        // Valida e sanitiza a resposta antes de usar
        map(validateResponse),
        // Captura qualquer erro — falha silenciosa para não comprometer o footer
        catchError(() => {
          this.isLoading.set(false);
          this.hasError.set(true);
          return EMPTY;
        })
      )
      .subscribe((count) => {
        this.visitCount.set(count);
        this.isLoading.set(false);
      });
  }
}
