import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent } from './components/container/container.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { ButtonComponent } from './components/button/button.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ContainerComponent,
    ThemeToggleComponent,
    ButtonComponent,
    SettingsModalComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Pomode';
  showSettings = signal(false);

  openSettings() {
    this.showSettings.set(true);
  }

  closeSettings() {
    this.showSettings.set(false);
  }
}
