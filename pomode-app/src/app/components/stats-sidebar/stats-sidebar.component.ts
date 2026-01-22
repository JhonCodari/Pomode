import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';

export interface StatItem {
  value: number | string;
  label: string;
}

@Component({
  selector: 'app-stats-sidebar',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './stats-sidebar.component.html',
  styleUrl: './stats-sidebar.component.scss'
})
export class StatsSidebarComponent {
  stats = input.required<StatItem[]>();
}
