import { Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy, HostListener, effect, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button.component';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-mobile-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ButtonComponent,
    LanguageSelectorComponent,
    ThemeToggleComponent,
    IconComponent
  ],
  template: `
    <!-- Backdrop -->
    @if (isOpen()) {
      <div
        class="mobile-menu-backdrop"
        (click)="closeMenu()"
        [attr.aria-hidden]="true"
      ></div>
    }

    <!-- Menu Drawer -->
    <nav
      #menuDrawer
      tabindex="-1"
      class="mobile-menu"
      [class.mobile-menu--open]="isOpen()"
      [attr.aria-hidden]="!isOpen()"
      role="navigation"
    >
      <!-- Header do Menu -->
      <header class="mobile-menu__header">
        <h2 class="mobile-menu__title">
          <span aria-hidden="true">🍅</span>
          {{ 'APP.TITLE' | translate }}
        </h2>
        <app-button
          (click)="closeMenu()"
          [ariaLabel]="'NAV.CLOSE_MENU' | translate"
          variant="ghost"
          class="mobile-menu__close"
        >
          <app-icon name="close" [size]="'sm'" [ariaHidden]="true"></app-icon>
        </app-button>
      </header>

      <!-- Links de Navegação -->
      <ul class="mobile-menu__nav" role="list">
        <li class="mobile-menu__item">
          <a
            routerLink="/"
            routerLinkActive="active"
            class="mobile-menu__link"
            (click)="closeMenu()"
            [routerLinkActiveOptions]="{exact: true}"
          >
            <span class="mobile-menu__icon" aria-hidden="true"><app-icon name="home" [size]="'sm'"></app-icon></span>
            {{ 'NAV.HOME' | translate }}
          </a>
        </li>
        <li class="mobile-menu__item">
          <a
            routerLink="/sobre-pomodoro"
            routerLinkActive="active"
            class="mobile-menu__link"
            (click)="closeMenu()"
          >
            <span class="mobile-menu__icon" aria-hidden="true"><app-icon name="help-circle" [size]="'sm'"></app-icon></span>
            {{ 'NAV.WHAT_IS_POMODORO' | translate }}
          </a>
        </li>
      </ul>

      <!-- Seção de Configurações -->
      <div class="mobile-menu__settings">
        <h3 class="mobile-menu__section-title">
          {{ 'NAV.SETTINGS' | translate }}
        </h3>

        <div class="mobile-menu__controls">
          <app-button
            (click)="openSettings()"
            variant="outline"
            class="mobile-menu__setting-btn"
          >
            <app-icon name="settings" [size]="'sm'" [ariaHidden]="true"></app-icon>
            {{ 'NAV.APP_SETTINGS' | translate }}
          </app-button>

          <div class="mobile-menu__toggles">
            <app-language-selector></app-language-selector>
            <app-theme-toggle></app-theme-toggle>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrl: './mobile-menu.component.scss'
})
export class MobileMenuComponent {
  @Input() isOpen = signal(false);
  @Output() close = new EventEmitter<void>();
  @Output() settingsOpen = new EventEmitter<void>();

  @ViewChild('menuDrawer') private menuDrawerRef!: ElementRef<HTMLElement>;
  private previousFocus: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.previousFocus = document.activeElement as HTMLElement;
        setTimeout(() => this.menuDrawerRef?.nativeElement.focus(), 0);
      }
    });
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMenu();
      return;
    }
    if (event.key === 'Tab') {
      const drawer = this.menuDrawerRef?.nativeElement;
      if (!drawer) return;
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  closeMenu(): void {
    this.previousFocus?.focus();
    this.close.emit();
  }

  openSettings(): void {
    this.settingsOpen.emit();
    this.closeMenu();
  }
}
