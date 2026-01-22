import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';

export interface DeviceCapabilities {
  hasHover: boolean;
  hasPointer: boolean;
  isOnline: boolean;
  supportsServiceWorker: boolean;
  supportsWebWorkers: boolean;
  supportsLocalStorage: boolean;
  supportsNotifications: boolean;
  deviceMemory?: number;
  connectionType?: string;
  effectiveType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceCapabilityService {
  private _capabilities = signal<DeviceCapabilities>({
    hasHover: false,
    hasPointer: false,
    isOnline: true,
    supportsServiceWorker: false,
    supportsWebWorkers: false,
    supportsLocalStorage: false,
    supportsNotifications: false
  });

  readonly capabilities = this._capabilities.asReadonly();

  // Propriedades computadas para facilitar o uso
  readonly hasHover = computed(() => this.capabilities().hasHover);
  readonly hasPointer = computed(() => this.capabilities().hasPointer);
  readonly isOnline = computed(() => this.capabilities().isOnline);
  readonly supportsServiceWorker = computed(() => this.capabilities().supportsServiceWorker);
  readonly supportsWebWorkers = computed(() => this.capabilities().supportsWebWorkers);
  readonly supportsLocalStorage = computed(() => this.capabilities().supportsLocalStorage);
  readonly supportsNotifications = computed(() => this.capabilities().supportsNotifications);

  constructor() {
    if (typeof window !== 'undefined') {
      this.detectCapabilities();
      this.setupNetworkListener();
    }
  }

  private detectCapabilities(): void {
    const capabilities: DeviceCapabilities = {
      // Detecta se o dispositivo tem capacidade de hover preciso
      hasHover: window.matchMedia('(hover: hover)').matches,

      // Detecta se tem ponteiro fino (mouse)
      hasPointer: window.matchMedia('(pointer: fine)').matches,

      // Estado da conexão
      isOnline: navigator.onLine,

      // Service Workers
      supportsServiceWorker: 'serviceWorker' in navigator,

      // Web Workers
      supportsWebWorkers: typeof Worker !== 'undefined',

      // LocalStorage
      supportsLocalStorage: this.testLocalStorage(),

      // Notifications API
      supportsNotifications: 'Notification' in window && 'serviceWorker' in navigator,

      // Device Memory (experimental)
      deviceMemory: (navigator as any).deviceMemory,

      // Connection info (experimental)
      connectionType: (navigator as any).connection?.type,
      effectiveType: (navigator as any).connection?.effectiveType
    };

    this._capabilities.set(capabilities);
  }

  private testLocalStorage(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private setupNetworkListener(): void {
    const updateOnlineStatus = () => {
      this._capabilities.update(caps => ({
        ...caps,
        isOnline: navigator.onLine
      }));
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Listener para mudanças na capacidade de hover (modo tablet/desktop)
    const hoverQuery = window.matchMedia('(hover: hover)');
    const pointerQuery = window.matchMedia('(pointer: fine)');

    const updateInputCapabilities = () => {
      this._capabilities.update(caps => ({
        ...caps,
        hasHover: hoverQuery.matches,
        hasPointer: pointerQuery.matches
      }));
    };

    hoverQuery.addEventListener('change', updateInputCapabilities);
    pointerQuery.addEventListener('change', updateInputCapabilities);
  }

  /**
   * Verifica se o dispositivo tem boa performance
   * Baseado em memória e tipo de conexão
   */
  hasGoodPerformance(): boolean {
    const caps = this.capabilities();
    const memory = caps.deviceMemory || 4; // Assume 4GB se não disponível
    const connection = caps.effectiveType;

    return memory >= 4 && (!connection || ['4g'].includes(connection));
  }

  /**
   * Verifica se deve usar animações complexas
   */
  shouldUseComplexAnimations(): boolean {
    return this.hasGoodPerformance() &&
           !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Verifica se deve fazer pré-carregamento de recursos
   */
  shouldPreload(): boolean {
    const caps = this.capabilities();
    return caps.isOnline &&
           this.hasGoodPerformance() &&
           !['slow-2g', '2g'].includes(caps.effectiveType || '');
  }
}
