import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      <div *ngIf="hasHeader" class="card-header">
        <ng-content select="[card-header]"></ng-content>
      </div>

      <div class="card-body">
        <ng-content></ng-content>
      </div>

      <div *ngIf="hasFooter" class="card-footer">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() elevated: boolean = false;
  @Input() hoverable: boolean = false;
  @Input() noPadding: boolean = false;
  @Input() hasHeader: boolean = false;
  @Input() hasFooter: boolean = false;

  get cardClasses(): string {
    const classes = ['card'];

    if (this.elevated) {
      classes.push('card-elevated');
    }

    if (this.hoverable) {
      classes.push('card-hoverable');
    }

    if (this.noPadding) {
      classes.push('card-no-padding');
    }

    return classes.join(' ');
  }
}
