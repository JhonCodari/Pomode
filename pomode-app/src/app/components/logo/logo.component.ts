import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

export type LogoSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-logo',
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div [class]="logoClasses">
      <a *ngIf="linkToHome; else logoText"
         routerLink="/"
         class="logo-link"
         [attr.aria-label]="'NAV.GO_HOME' | translate">
        <h1 class="logo-title">
          <span aria-hidden="true" class="logo-emoji">🍅</span>
          {{ titleKey | translate }}
        </h1>
        <p *ngIf="showSubtitle" class="logo-subtitle">
          {{ subtitleKey | translate }}
        </p>
      </a>

      <ng-template #logoText>
        <h1 class="logo-title">
          <span aria-hidden="true" class="logo-emoji">🍅</span>
          {{ titleKey | translate }}
        </h1>
        <p *ngIf="showSubtitle" class="logo-subtitle">
          {{ subtitleKey | translate }}
        </p>
      </ng-template>
    </div>
  `,
  styleUrl: './logo.component.scss'
})
export class LogoComponent {
  @Input() size: LogoSize = 'md';
  @Input() linkToHome: boolean = false;
  @Input() showSubtitle: boolean = true;
  @Input() titleKey: string = 'APP.TITLE';
  @Input() subtitleKey: string = 'APP.SUBTITLE';

  get logoClasses(): string {
    const classes = ['logo'];
    classes.push(`logo-${this.size}`);
    return classes.join(' ');
  }
}
