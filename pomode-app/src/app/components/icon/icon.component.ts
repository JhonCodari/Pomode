import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export type IconName =
  | 'home' | 'settings' | 'sun' | 'moon' | 'menu' | 'close' | 'check' | 'info'
  | 'play' | 'pause' | 'skip-forward' | 'rotate-ccw'
  | 'volume-x' | 'volume-1' | 'volume-2'
  | 'chevron-up' | 'chevron-down'
  | 'coffee' | 'palmtree' | 'music' | 'piano'
  | 'minimize' | 'repeat' | 'help-circle' | 'bell' | 'sliders'
  | 'eye';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [class]="iconClasses"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.aria-hidden]="ariaHidden"
      [attr.aria-label]="ariaLabel"
      role="img"
    >
      @switch (name) {
        @case ('home') {
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        }
        @case ('settings') {
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        }
        @case ('sun') {
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
          <path d="m4.93 4.93 1.41 1.41"/>
          <path d="m17.66 17.66 1.41 1.41"/>
          <path d="M2 12h2"/>
          <path d="M20 12h2"/>
          <path d="m6.34 17.66-1.41 1.41"/>
          <path d="m19.07 4.93-1.41 1.41"/>
        }
        @case ('moon') {
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        }
        @case ('menu') {
          <line x1="4" x2="20" y1="12" y2="12"/>
          <line x1="4" x2="20" y1="6" y2="6"/>
          <line x1="4" x2="20" y1="18" y2="18"/>
        }
        @case ('close') {
          <path d="M18 6 6 18"/>
          <path d="m6 6 12 12"/>
        }
        @case ('check') {
          <path d="M20 6 9 17l-5-5"/>
        }
        @case ('info') {
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        }
        @case ('play') {
          <polygon points="6 3 20 12 6 21 6 3"/>
        }
        @case ('pause') {
          <rect x="14" y="4" width="4" height="16" rx="1"/>
          <rect x="6" y="4" width="4" height="16" rx="1"/>
        }
        @case ('skip-forward') {
          <polygon points="5 4 15 12 5 20 5 4"/>
          <line x1="19" x2="19" y1="5" y2="19"/>
        }
        @case ('rotate-ccw') {
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        }
        @case ('volume-x') {
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" x2="17" y1="9" y2="15"/>
          <line x1="17" x2="23" y1="9" y2="15"/>
        }
        @case ('volume-1') {
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        }
        @case ('volume-2') {
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        }
        @case ('chevron-up') {
          <path d="m18 15-6-6-6 6"/>
        }
        @case ('chevron-down') {
          <path d="m6 9 6 6 6-6"/>
        }
        @case ('coffee') {
          <path d="M10 2v2"/>
          <path d="M14 2v2"/>
          <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>
          <path d="M6 2v2"/>
        }
        @case ('palmtree') {
          <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"/>
          <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3"/>
          <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35"/>
          <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14"/>
        }
        @case ('music') {
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
        }
        @case ('piano') {
          <path d="M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8"/>
          <path d="M2 14h20"/>
          <path d="M6 14v4"/>
          <path d="M10 14v4"/>
          <path d="M14 14v4"/>
          <path d="M18 14v4"/>
        }
        @case ('minimize') {
          <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
          <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
          <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
          <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
        }
        @case ('repeat') {
          <path d="m17 2 4 4-4 4"/>
          <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
          <path d="m7 22-4-4 4-4"/>
          <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
        }
        @case ('help-circle') {
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <path d="M12 17h.01"/>
        }
        @case ('bell') {
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        }
        @case ('sliders') {
          <line x1="4" x2="4" y1="21" y2="14"/>
          <line x1="4" x2="4" y1="10" y2="3"/>
          <line x1="12" x2="12" y1="21" y2="12"/>
          <line x1="12" x2="12" y1="8" y2="3"/>
          <line x1="20" x2="20" y1="21" y2="16"/>
          <line x1="20" x2="20" y1="12" y2="3"/>
          <line x1="2" x2="6" y1="14" y2="14"/>
          <line x1="10" x2="14" y1="8" y2="8"/>
          <line x1="18" x2="22" y1="16" y2="16"/>
        }
        @case ('eye') {
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
          <circle cx="12" cy="12" r="3"/>
        }
      }
    </svg>
  `,
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  @Input() name: IconName = 'home';
  @Input() size: IconSize = 'md';
  @Input() variant: 'solid' | 'outline' = 'outline';
  @Input() ariaHidden: boolean = true;
  @Input() ariaLabel?: string;

  get iconClasses(): string {
    return `icon icon-${this.size}`;
  }
}
