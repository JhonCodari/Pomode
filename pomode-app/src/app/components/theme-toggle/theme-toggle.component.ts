import { Component, inject, computed } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-theme-toggle',
  imports: [IconComponent],
  template: `
    <button
      class="theme-toggle"
      (click)="toggleTheme()"
      [attr.aria-label]="isDark() ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
      [title]="isDark() ? 'Tema escuro' : 'Tema claro'"
    >
      <app-icon
        [name]="isDark() ? 'moon' : 'sun'"
        [variant]="'outline'"
        [size]="'md'"
      ></app-icon>
    </button>
  `,
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  // Computed signal — Angular rastreia a dependência no template automaticamente
  readonly isDark = computed(() => this.themeService.isDarkSignal());

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
