import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '../card/card.component';

export interface StatItem {
  value: number | string;
  labelKey: string; // Mudança: usar chave de tradução em vez de string traduzida
}

@Component({
  selector: 'app-stats-sidebar',
  standalone: true,
  imports: [CommonModule, TranslateModule, CardComponent],
  templateUrl: './stats-sidebar.component.html',
  styleUrl: './stats-sidebar.component.scss'
})
export class StatsSidebarComponent {
  stats = input.required<StatItem[]>();
}
