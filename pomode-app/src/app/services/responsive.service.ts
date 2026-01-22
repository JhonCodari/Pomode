import { Injectable, inject } from '@angular/core';
import { signal, computed } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

export interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private readonly _breakpoints = {
    mobile: 767,
    tablet: 1023
  };

  // Signals para estado responsivo
  private _width = signal(typeof window !== 'undefined' ? window.innerWidth : 1024);
  private _height = signal(typeof window !== 'undefined' ? window.innerHeight : 768);

  // Estados computados
  readonly isMobile = computed(() => this._width() <= this._breakpoints.mobile);
  readonly isTablet = computed(() =>
    this._width() > this._breakpoints.mobile && this._width() <= this._breakpoints.tablet
  );
  readonly isDesktop = computed(() => this._width() > this._breakpoints.tablet);

  readonly screenSize = computed<'mobile' | 'tablet' | 'desktop'>(() => {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  });

  readonly width = this._width.asReadonly();
  readonly height = this._height.asReadonly();

  readonly breakpointState = computed<BreakpointState>(() => ({
    isMobile: this.isMobile(),
    isTablet: this.isTablet(),
    isDesktop: this.isDesktop(),
    screenSize: this.screenSize(),
    width: this.width(),
    height: this.height()
  }));

  constructor() {
    if (typeof window !== 'undefined') {
      // Observar mudanças no tamanho da janela
      fromEvent(window, 'resize').pipe(
        debounceTime(150), // Debounce para performance
        distinctUntilChanged(),
        startWith(null)
      ).subscribe(() => {
        this._width.set(window.innerWidth);
        this._height.set(window.innerHeight);
      });

      // Observar mudanças na orientação
      fromEvent(window, 'orientationchange').pipe(
        debounceTime(100)
      ).subscribe(() => {
        // Timeout para dar tempo da orientação ser aplicada
        setTimeout(() => {
          this._width.set(window.innerWidth);
          this._height.set(window.innerHeight);
        }, 100);
      });
    }
  }

  /**
   * Verifica se a largura está dentro de um range específico
   */
  isInRange(min: number, max: number): boolean {
    const width = this.width();
    return width >= min && width <= max;
  }

  /**
   * Verifica se é uma tela muito pequena (< 375px)
   */
  isExtraSmall(): boolean {
    return this.width() < 375;
  }

  /**
   * Verifica se é uma tela muito grande (> 1440px)
   */
  isExtraLarge(): boolean {
    return this.width() > 1440;
  }
}
