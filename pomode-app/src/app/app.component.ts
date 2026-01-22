import { Component, signal, inject, HostListener, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import {
  ContainerComponent,
  ThemeToggleComponent,
  ButtonComponent,
  SettingsModalComponent,
  MobileMenuComponent,
  ToastComponent,
  LanguageSelectorComponent,
  LogoComponent,
  IconComponent
} from './components';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PomodoroService, LanguageService, ResponsiveService, TouchDetectionService } from './services';

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
    CommonModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private pomodoroService = inject(PomodoroService);
  private languageService = inject(LanguageService); // Inicializa o serviço de idioma
  private responsiveService = inject(ResponsiveService);
  private touchService = inject(TouchDetectionService);

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
        this.toggleTimer();
        break;
      case 'r': // R - Reset
        event.preventDefault();
        this.pomodoroService.reset();
        break;
      case 's': // S - Skip
        event.preventDefault();
        this.pomodoroService.skipToNext();
        break;
    }
  }

  openSettings(): void {
    this.showSettings.set(true);
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
