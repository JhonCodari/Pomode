import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-section',
  imports: [CommonModule, TranslateModule],
  template: `
    <section
      [class]="sectionClasses"
      [id]="sectionId"
      [attr.aria-labelledby]="titleId"
    >
      <header *ngIf="title" class="section-header">
        <h2
          [id]="titleId"
          class="section-title"
          [innerHTML]="title | translate"
        ></h2>
        <p *ngIf="subtitle" class="section-subtitle">
          {{ subtitle | translate }}
        </p>
      </header>

      <div class="section-content">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styleUrl: './section.component.scss'
})
export class SectionComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() sectionId?: string;
  @Input() variant: 'default' | 'highlight' | 'cta' = 'default';

  get sectionClasses(): string {
    const classes = ['section'];

    if (this.variant !== 'default') {
      classes.push(`section-${this.variant}`);
    }

    return classes.join(' ');
  }

  get titleId(): string {
    return this.sectionId ? `${this.sectionId}-title` : 'section-title';
  }
}
