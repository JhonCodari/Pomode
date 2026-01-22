import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, SupportedLanguage } from '../../services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="language-selector">
      <button
        class="language-btn"
        [class.active]="isOpen"
        (click)="toggleDropdown()"
        [attr.aria-expanded]="isOpen"
        aria-haspopup="listbox"
        [attr.aria-label]="'SETTINGS.LANGUAGE.SELECT' | translate"
      >
        <span class="current-flag">{{ getCurrentFlag() }}</span>
        <span class="current-lang">{{ getCurrentCode() }}</span>
        <span class="dropdown-arrow" aria-hidden="true">▼</span>
      </button>

      @if (isOpen) {
        <ul class="language-dropdown" role="listbox">
          @for (lang of languages; track lang.code) {
            <li
              role="option"
              [attr.aria-selected]="lang.code === currentLang()"
              [class.selected]="lang.code === currentLang()"
              (click)="selectLanguage(lang.code)"
            >
              <span class="lang-flag">{{ lang.flag }}</span>
              <span class="lang-name">{{ lang.name }}</span>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    .language-selector {
      position: relative;
      z-index: var(--z-tooltip);
      isolation: isolate;
    }

    .language-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.75rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md, 8px);
      color: var(--text-primary);
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .language-btn:hover {
      background: var(--bg-tertiary);
      border-color: var(--primary);
    }

    .language-btn.active {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-alpha, rgba(var(--primary-rgb), 0.2));
    }

    .current-flag {
      font-size: 1.125rem;
    }

    .current-lang {
      text-transform: uppercase;
      font-weight: 500;
    }

    .dropdown-arrow {
      font-size: 0.625rem;
      transition: transform 0.2s ease;
    }

    .language-btn.active .dropdown-arrow {
      transform: rotate(180deg);
    }

    .language-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      padding: 0.5rem 0;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md, 8px);
      box-shadow: var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.15));
      list-style: none;
      min-width: 160px;
      z-index: 9999 !important;
      animation: fadeIn 0.15s ease;
      pointer-events: auto;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .language-dropdown li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 1rem;
      cursor: pointer;
      transition: background 0.15s ease;
      pointer-events: auto;
    }

    .language-dropdown li:hover {
      background: var(--bg-secondary);
    }

    .language-dropdown li.selected {
      background: var(--primary-alpha, rgba(var(--primary-rgb), 0.1));
      color: var(--primary);
    }

    .lang-flag {
      font-size: 1.25rem;
    }

    .lang-name {
      font-size: 0.875rem;
    }
  `]
})
export class LanguageSelectorComponent {
  private languageService = inject(LanguageService);

  languages = this.languageService.supportedLanguages;
  currentLang = this.languageService.currentLanguage;
  isOpen = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-selector')) {
      this.isOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectLanguage(code: SupportedLanguage): void {
    this.languageService.setLanguage(code);
    this.isOpen = false;
  }

  getCurrentFlag(): string {
    const lang = this.languages.find(l => l.code === this.currentLang());
    return lang?.flag || '🇺🇸';
  }

  getCurrentCode(): string {
    return this.currentLang().toUpperCase();
  }
}
