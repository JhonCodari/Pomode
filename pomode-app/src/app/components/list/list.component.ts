import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface ListItem {
  text: string;
  icon?: string;
  link?: {
    url: string;
    text: string;
    external?: boolean;
  };
}

export type ListVariant = 'bulleted' | 'numbered' | 'checked' | 'referenced';

@Component({
  selector: 'app-list',
  imports: [CommonModule, TranslateModule],
  template: `
    <ul [class]="listClasses" [attr.aria-label]="ariaLabel | translate">
      <li *ngFor="let item of items; trackBy: trackItem" class="list-item">
        <span class="list-content" [innerHTML]="item.text | translate"></span>
        <ng-container *ngIf="item.link">
          —
          <a
            [href]="item.link.url"
            [target]="item.link.external ? '_blank' : '_self'"
            [rel]="item.link.external ? 'noopener noreferrer' : ''"
            class="list-link"
          >
            {{ item.link.text | translate }}
          </a>
        </ng-container>
      </li>
    </ul>
  `,
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input() items: ListItem[] = [];
  @Input() variant: ListVariant = 'bulleted';
  @Input() ariaLabel?: string;

  get listClasses(): string {
    const classes = ['custom-list'];
    classes.push(`list-${this.variant}`);
    return classes.join(' ');
  }

  trackItem(index: number, item: ListItem): string {
    return item.text;
  }
}
