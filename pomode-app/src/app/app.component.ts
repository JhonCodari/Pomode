import { Component, signal, inject, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ContainerComponent } from './components/container/container.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { ButtonComponent } from './components/button/button.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { ToastComponent } from './components/toast/toast.component';
import { CommonModule } from '@angular/common';
import { PomodoroService } from './services/pomodoro.service';

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
    ToastComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private pomodoroService = inject(PomodoroService);

  title = 'Pomode';
  showSettings = signal(false);

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

  private toggleTimer(): void {
    const state = this.pomodoroService.state();
    if (state === 'running') {
      this.pomodoroService.pause();
    } else {
      this.pomodoroService.start();
    }
  }
}
