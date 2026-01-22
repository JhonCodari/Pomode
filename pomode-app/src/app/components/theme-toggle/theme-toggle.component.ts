import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-theme-toggle',
  imports: [CommonModule, IconComponent],
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
  private themeService = inject(ThemeService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDark(): boolean {
    return this.themeService.isDark();
  }
}
