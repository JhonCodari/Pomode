import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      (click)="handleClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() icon: boolean = false;

  get buttonClasses(): string {
    const classes = ['btn'];

    classes.push(`btn-${this.variant}`);
    classes.push(`btn-${this.size}`);

    if (this.fullWidth) {
      classes.push('btn-full-width');
    }

    if (this.icon) {
      classes.push('btn-icon');
    }

    return classes.join(' ');
  }

  handleClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
