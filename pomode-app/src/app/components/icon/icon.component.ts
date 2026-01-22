import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconName = 'home' | 'settings' | 'sun' | 'moon' | 'menu' | 'close' | 'check' | 'info';
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  template: `
    <svg
      [class]="iconClasses"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      [attr.fill]="variant === 'outline' ? 'none' : 'currentColor'"
      [attr.stroke]="variant === 'outline' ? 'currentColor' : 'none'"
      [attr.stroke-width]="variant === 'outline' ? '2' : '0'"
      [attr.aria-hidden]="ariaHidden"
      [attr.aria-label]="ariaLabel"
      role="img"
    >
      <!-- Home -->
      <path *ngIf="name === 'home' && variant === 'solid'"
            d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>

      <path *ngIf="name === 'home' && variant === 'outline'"
            d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline *ngIf="name === 'home' && variant === 'outline'"
                points="9,22 9,12 15,12 15,22"/>

      <!-- Settings -->
      <path *ngIf="name === 'settings' && variant === 'solid'"
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
      <path *ngIf="name === 'settings' && variant === 'solid'"
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>

      <circle *ngIf="name === 'settings' && variant === 'outline'" cx="12" cy="12" r="3"/>
      <path *ngIf="name === 'settings' && variant === 'outline'"
            d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>

      <!-- Sun -->
      <circle *ngIf="name === 'sun'" cx="12" cy="12" r="5"/>
      <line *ngIf="name === 'sun'" x1="12" y1="1" x2="12" y2="3"/>
      <line *ngIf="name === 'sun'" x1="12" y1="21" x2="12" y2="23"/>
      <line *ngIf="name === 'sun'" x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line *ngIf="name === 'sun'" x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line *ngIf="name === 'sun'" x1="1" y1="12" x2="3" y2="12"/>
      <line *ngIf="name === 'sun'" x1="21" y1="12" x2="23" y2="12"/>
      <line *ngIf="name === 'sun'" x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line *ngIf="name === 'sun'" x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>

      <!-- Moon -->
      <path *ngIf="name === 'moon'"
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>

      <!-- Menu -->
      <line *ngIf="name === 'menu'" x1="4" y1="6" x2="20" y2="6"/>
      <line *ngIf="name === 'menu'" x1="4" y1="12" x2="20" y2="12"/>
      <line *ngIf="name === 'menu'" x1="4" y1="18" x2="20" y2="18"/>

      <!-- Close -->
      <path *ngIf="name === 'close'" d="M18 6 6 18M6 6l12 12"/>

      <!-- Check -->
      <polyline *ngIf="name === 'check'" points="9,11 12,14 22,4"/>
      <path *ngIf="name === 'check'" d="m21 2-9 9-4-4"/>

      <!-- Info -->
      <circle *ngIf="name === 'info'" cx="12" cy="12" r="10"/>
      <path *ngIf="name === 'info'" d="m12 16 0-4"/>
      <path *ngIf="name === 'info'" d="m12 8h.01"/>
    </svg>
  `,
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  @Input() name: IconName = 'home';
  @Input() size: IconSize = 'md';
  @Input() variant: 'solid' | 'outline' = 'solid';
  @Input() ariaHidden: boolean = true;
  @Input() ariaLabel?: string;

  get iconClasses(): string {
    const classes = ['icon'];

    classes.push(`icon-${this.size}`);
    classes.push(`icon-${this.variant}`);

    return classes.join(' ');
  }
}
