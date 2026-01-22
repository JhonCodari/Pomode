import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

export type FormFieldType = 'number' | 'text' | 'email' | 'password' | 'search';

@Component({
  selector: 'app-form-field',
  imports: [CommonModule, FormsModule, TranslateModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ],
  template: `
    <div class="form-group" [class.has-error]="hasError">
      <label
        [for]="fieldId"
        class="form-label"
        [class.required]="required"
      >
        <span *ngIf="emoji" aria-hidden="true" class="label-emoji">{{ emoji }}</span>
        {{ label | translate }}
      </label>

      <input
        [id]="fieldId"
        [type]="type"
        [value]="value"
        [min]="min"
        [max]="max"
        [step]="step"
        [placeholder]="placeholder | translate"
        [disabled]="disabled"
        [readonly]="readonly"
        [required]="required"
        class="form-input"
        [attr.aria-describedby]="hintId"
        [attr.aria-invalid]="hasError"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
      />

      <span
        *ngIf="hint"
        [id]="hintId"
        class="form-hint"
        [class.error-hint]="hasError"
      >
        {{ hint | translate }}
      </span>

      <div *ngIf="errorMessage" class="form-error" role="alert">
        {{ errorMessage | translate }}
      </div>
    </div>
  `,
  styleUrl: './form-field.component.scss'
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: FormFieldType = 'text';
  @Input() emoji?: string;
  @Input() hint?: string;
  @Input() placeholder?: string;
  @Input() min?: number;
  @Input() max?: number;
  @Input() step?: number;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() errorMessage?: string;
  @Input() fieldId?: string;

  @Output() inputChange = new EventEmitter<any>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  value: any = '';
  private onChange = (_: any) => {};
  private onTouched = () => {};

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  get hintId(): string {
    return `${this.fieldId || 'field'}-hint`;
  }

  constructor() {
    if (!this.fieldId) {
      this.fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = this.type === 'number' ? +target.value : target.value;

    this.value = value;
    this.onChange(value);
    this.inputChange.emit(value);
  }

  onBlur(): void {
    this.onTouched();
    this.blur.emit();
  }

  onFocus(): void {
    this.focus.emit();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
