import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-container',
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './container.component.scss'
})
export class ContainerComponent {
  @Input() size: ContainerSize = 'lg';
  @Input() centered: boolean = true;
  @Input() noPadding: boolean = false;

  get containerClasses(): string {
    const classes = ['container'];

    classes.push(`container-${this.size}`);

    if (this.centered) {
      classes.push('container-centered');
    }

    if (this.noPadding) {
      classes.push('container-no-padding');
    }

    return classes.join(' ');
  }
}
