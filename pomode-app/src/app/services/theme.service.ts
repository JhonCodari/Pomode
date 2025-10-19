import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'pomode-theme';

  // Signal para o tema atual
  public theme = signal<Theme>(this.getStoredTheme());

  // Signal computado para o tema efetivo (resolve 'auto')
  public effectiveTheme = signal<'light' | 'dark'>('light');

  constructor() {
    // Inicializa o tema
    this.applyTheme(this.theme());

    // Effect para aplicar o tema quando mudar
    effect(() => {
      const currentTheme = this.theme();
      this.applyTheme(currentTheme);
    });

    // Listener para mudanças na preferência do sistema
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addEventListener('change', (e) => {
        if (this.theme() === 'auto') {
          this.updateEffectiveTheme();
        }
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
   */
  public isDark(): boolean {
    return this.effectiveTheme() === 'dark';
  }

  /**
   * Aplica o tema ao documento
   */
  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    const body = document.body;

    // Remove classes antigas
    body.classList.remove('dark-mode', 'light-mode');
    root.removeAttribute('data-theme');

    let effectiveTheme: 'light' | 'dark';

    if (theme === 'auto') {
      // Usa preferência do sistema
      effectiveTheme = this.getSystemTheme();
    } else {
      effectiveTheme = theme;
    }

    // Aplica o tema
    if (effectiveTheme === 'dark') {
      body.classList.add('dark-mode');
      root.setAttribute('data-theme', 'dark');
    } else {
      body.classList.add('light-mode');
      root.setAttribute('data-theme', 'light');
    }

    this.effectiveTheme.set(effectiveTheme);
  }

  /**
   * Atualiza o tema efetivo (útil quando sistema muda)
   */
  private updateEffectiveTheme(): void {
    this.applyTheme(this.theme());
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
