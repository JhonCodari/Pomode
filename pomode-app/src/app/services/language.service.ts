import { Injectable, signal, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type SupportedLanguage = 'en' | 'pt' | 'es';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'pomodoro-language';

  readonly supportedLanguages: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  readonly currentLanguage = signal<SupportedLanguage>(this.loadLanguage());

  constructor(private translate: TranslateService) {
    // Configura idiomas disponíveis
    this.translate.addLangs(['en', 'pt', 'es']);
    this.translate.setDefaultLang('en');

    // Efeito para persistir mudanças de idioma
    effect(() => {
      const lang = this.currentLanguage();
      this.saveLanguage(lang);
      this.translate.use(lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
      }
    });
  }

  /**
   * Altera o idioma atual
   */
  setLanguage(lang: SupportedLanguage): void {
    this.currentLanguage.set(lang);
  }

  /**
   * Retorna o nome do idioma atual
   */
  getCurrentLanguageName(): string {
    const lang = this.supportedLanguages.find(l => l.code === this.currentLanguage());
    return lang?.name || 'English';
  }

  /**
   * Carrega o idioma salvo ou detecta do navegador
   */
  private loadLanguage(): SupportedLanguage {
    // Tenta carregar do localStorage
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved && this.isValidLanguage(saved)) {
      return saved as SupportedLanguage;
    }

    // Detecta idioma do navegador
    const browserLang = navigator.language.split('-')[0];
    if (this.isValidLanguage(browserLang)) {
      return browserLang as SupportedLanguage;
    }

    // Fallback para inglês
    return 'en';
  }

  /**
   * Salva o idioma no localStorage
   */
  private saveLanguage(lang: SupportedLanguage): void {
    localStorage.setItem(this.STORAGE_KEY, lang);
  }

  /**
   * Verifica se o idioma é suportado
   */
  private isValidLanguage(lang: string): boolean {
    return ['en', 'pt', 'es'].includes(lang);
  }
}
