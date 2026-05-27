import { Component, signal, inject, HostListener, effect, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import {
  ContainerComponent,
  ThemeToggleComponent,
  ButtonComponent,
  SettingsModalComponent,
  MobileMenuComponent,
  ToastComponent,
  LanguageSelectorComponent,
  LogoComponent,
  IconComponent,
  MusicPlayerComponent,
  FooterComponent
} from './components';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PomodoroService, LanguageService, ResponsiveService, TouchDetectionService, AnalyticsService } from './services';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ContainerComponent,
    ThemeToggleComponent,
    ButtonComponent,
    SettingsModalComponent,
    MobileMenuComponent,
    ToastComponent,
    LanguageSelectorComponent,
    LogoComponent,
    IconComponent,
    MusicPlayerComponent,
    FooterComponent,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private pomodoroService = inject(PomodoroService);
  private languageService = inject(LanguageService); // Inicializa o serviço de idioma
  private responsiveService = inject(ResponsiveService);
  private touchService = inject(TouchDetectionService);
  private themeService = inject(ThemeService);
  private analyticsService = inject(AnalyticsService);
  private router = inject(Router);

  title = 'Pomode';
  showSettings = signal(false);
  showMobileMenu = signal(false);

  // Propriedades responsivas computadas
  readonly isMobile = this.responsiveService.isMobile;
  readonly isTablet = this.responsiveService.isTablet;
  readonly isDesktop = this.responsiveService.isDesktop;
  readonly screenSize = this.responsiveService.screenSize;
  readonly isTouchDevice = this.touchService.isTouchDevice;

  constructor() {
    // Efeito para automaticamente fechar o menu mobile quando mudando para desktop
    effect(() => {
      if (this.isDesktop() && this.showMobileMenu()) {
        this.showMobileMenu.set(false);
      }
    });

    // Efeito para aplicar classes CSS baseadas no dispositivo
    effect(() => {
      if (typeof document !== 'undefined') {
        const body = document.body;

        // Classes baseadas no tamanho da tela
        body.classList.toggle('screen-mobile', this.isMobile());
        body.classList.toggle('screen-tablet', this.isTablet());
        body.classList.toggle('screen-desktop', this.isDesktop());

        // Classes baseadas no tipo de dispositivo
        body.classList.toggle('touch-device', this.isTouchDevice());
        body.classList.toggle('mouse-device', !this.isTouchDevice());
      }
    });
  }

  ngOnInit() {
    // Rastrear mudanças de rota no Google Analytics
    this.router.events.subscribe((event: any) => {
      if (event.urlAfterRedirects) {
        this.analyticsService.trackPageView(event.urlAfterRedirects);
      }
    });

    // Definir preferências iniciais como user properties
    this.analyticsService.setUserProperty('preferred_theme', this.themeService.effectiveTheme());
    this.analyticsService.setUserProperty('preferred_language', this.languageService.currentLanguage());
  }

  // Atalhos de teclado globais
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Ignora se estiver em um input ou textarea
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    // Ignora se o modal de configurações estiver aberto (exceto ESC)
    if (this.showSettings() && event.key !== 'Escape') {
      return;
    }

    switch (event.key.toLowerCase()) {
      case ' ': // Espaço - Play/Pause
        event.preventDefault();
        this.analyticsService.trackKeyboardShortcutUsed(
          'space',
          this.pomodoroService.state() === 'running' ? 'pause' : 'start'
        );
        this.toggleTimer();
        break;
      case 'r': // R - Reset
        event.preventDefault();
        this.analyticsService.trackKeyboardShortcutUsed('r', 'reset');
        this.pomodoroService.reset();
        break;
      case 's': // S - Skip
        event.preventDefault();
        this.analyticsService.trackKeyboardShortcutUsed('s', 'skip');
        this.pomodoroService.skipToNext();
        break;
    }
  }

  openSettings(): void {
    this.showSettings.set(true);
    this.analyticsService.trackSettingsOpened();
  }

  closeSettings(): void {
    this.showSettings.set(false);
  }

  toggleMobileMenu(): void {
    this.showMobileMenu.set(!this.showMobileMenu());
  }

  closeMobileMenu(): void {
    this.showMobileMenu.set(false);
  }

  private toggleTimer(): void {
    const state = this.pomodoroService.state();
    if (state === 'running') {
      this.pomodoroService.pause();
    } else {
      this.pomodoroService.start();
    }
  }
}
