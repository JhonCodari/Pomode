import { Injectable, signal, computed, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'pomode-theme';

  // Signal do tema escolhido pelo utilizador ('light' | 'dark' | 'auto')
  public readonly theme = signal<Theme>(this.getStoredTheme());

  // Signal privado da preferência do sistema (atualizado pelo MediaQuery listener)
  private readonly _systemTheme = signal<'light' | 'dark'>(this.getSystemTheme());

  // Computed signal: resolve 'auto' consultando _systemTheme
  // Não escreve em nenhum signal — seguro de ler em efeitos e templates
  public readonly effectiveTheme = computed<'light' | 'dark'>(() => {
    const t = this.theme();
    return t === 'auto' ? this._systemTheme() : t;
  });

  // Signal booleano derivado — para uso direto em templates sem método wrapper
  public readonly isDarkSignal = computed(() => this.effectiveTheme() === 'dark');

  constructor() {
    // Effect responsável apenas por manipulação de DOM
    // Não escreve em nenhum signal: sem violação do modelo reativo do Angular
    effect(() => {
      this.applyThemeToDom(this.effectiveTheme());
    });

    // Listener para mudanças na preferência do sistema operacional
    if (typeof window !== 'undefined' && window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addEventListener('change', (e) => {
        this._systemTheme.set(e.matches ? 'dark' : 'light');
      });
    }
  }

  /**
   * Define o tema
   */
  public setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.storeTheme(theme);
  }

  /**
   * Alterna entre light e dark (ignora auto)
   */
  public toggleTheme(): void {
    const current = this.effectiveTheme();
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }

  /**
   * Verifica se o tema atual é escuro
   * @deprecated Prefira consumir isDarkSignal diretamente no template
   */
  public isDark(): boolean {
    return this.effectiveTheme() === 'dark';
  }

  /**
   * Aplica o tema efetivo ao DOM (chamado apenas pelo effect — sem signal writes)
   */
  private applyThemeToDom(effective: 'light' | 'dark'): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    body.classList.remove('dark-mode', 'light-mode');
    root.removeAttribute('data-theme');

    if (effective === 'dark') {
      body.classList.add('dark-mode');
      root.setAttribute('data-theme', 'dark');
    } else {
      body.classList.add('light-mode');
      root.setAttribute('data-theme', 'light');
    }
  }

  /**
   * Obtém o tema do sistema
   */
  private getSystemTheme(): 'light' | 'dark' {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Obtém o tema armazenado ou usa 'auto' como padrão
   */
  private getStoredTheme(): Theme {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 'auto';
    }

    const stored = localStorage.getItem(this.THEME_STORAGE_KEY);

    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      return stored;
    }

    return 'auto';
  }

  /**
   * Armazena o tema no localStorage
   */
  private storeTheme(theme: Theme): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    }
  }
}
