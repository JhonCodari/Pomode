import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { AnalyticsService } from '../../services';
import { IconComponent } from '../icon/icon.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-theme-toggle',
  imports: [IconComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="theme-toggle"
      (click)="toggleTheme()"
      [attr.aria-label]="(isDark() ? 'THEME.TOGGLE_TO_LIGHT' : 'THEME.TOGGLE_TO_DARK') | translate"
      [title]="(isDark() ? 'THEME.LABEL_DARK' : 'THEME.LABEL_LIGHT') | translate"
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
  private readonly analyticsService = inject(AnalyticsService);

  // Computed signal — Angular rastreia a dependência no template automaticamente
  readonly isDark = computed(() => this.themeService.isDarkSignal());

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.analyticsService.trackThemeChanged(this.themeService.effectiveTheme());
  }
}
