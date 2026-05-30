import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IntentionService } from '../../services/intention.service';

@Component({
  selector: 'app-intention-log',
  imports: [TranslateModule],
  templateUrl: './intention-log.component.html',
  styleUrl: './intention-log.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntentionLogComponent {
  private intentionService = inject(IntentionService);

  private readonly COLLAPSED_COUNT = 3;

  readonly accomplished = this.intentionService.accomplished;
  readonly isExpanded = signal(false);

  readonly hasItems = computed(() => this.accomplished().length > 0);
  readonly hasMore = computed(() => this.accomplished().length > this.COLLAPSED_COUNT);
  readonly extraCount = computed(() => this.accomplished().length - this.COLLAPSED_COUNT);

  readonly visibleItems = computed(() => {
    const all = this.accomplished();
    return this.isExpanded() ? all : all.slice(-this.COLLAPSED_COUNT);
  });

  toggle(): void {
    this.isExpanded.update(v => !v);
  }
}
