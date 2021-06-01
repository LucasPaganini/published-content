import { Component, forwardRef, OnInit } from '@angular/core';
import {
  AsyncValidator,
  ControlValueAccessor,
  FormControl,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { combineLatest } from 'rxjs';
import { dateExists, isHoliday, isWeekend } from './validators';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
  ],
})
export class DateInputComponent
  implements OnInit, ControlValueAccessor, AsyncValidator {
  public readonly dayControl = new FormControl(new Date().getDate(), [
    Validators.required,
    Validators.min(1),
    Validators.max(31),
  ]);

  public readonly monthControl = new FormControl(new Date().getMonth() + 1, [
    Validators.required,
    Validators.min(1),
    Validators.max(12),
  ]);

  public readonly yearControl = new FormControl(new Date().getFullYear(), [
    Validators.required,
    Validators.min(0),
  ]);

  public ngOnInit(): void {
    combineLatest([
      this.dayControl.valueChanges,
      this.monthControl.valueChanges,
      this.yearControl.valueChanges,
    ]).subscribe(() => {
      const value = this.getValue();
      this._onChange(value);
      this._onTouched();
    });
  }

  public getValue(): Date | null {
    if (
      this.dayControl.invalid ||
      this.monthControl.invalid ||
      this.yearControl.invalid
    )
      return null;

    const day = this.dayControl.value;
    const month = this.monthControl.value;
    const year = this.yearControl.value;
    if (dateExists(year, month, day) === false) return null;

    return new Date(year, month - 1, day);
  }

  public writeValue(value: Date | null): void {
    value = value ?? new Date();

    const day = value.getDate();
    const month = value.getMonth() + 1;
    const year = value.getFullYear();

    this.dayControl.setValue(day);
    this.monthControl.setValue(month);
    this.yearControl.setValue(year);
  }

  private _onChange = (value: Date | null) => undefined;
  public registerOnChange(fn: (value: Date | null) => void): void {
    this._onChange = fn;
  }

  private _onTouched = () => undefined;
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.dayControl.disable();
      this.monthControl.disable();
      this.yearControl.disable();
    } else {
      this.dayControl.enable();
      this.monthControl.enable();
      this.yearControl.enable();
    }
  }

  public async validate(): Promise<{
    invalid?: true;
    holiday?: true;
    weekend?: true;
  } | null> {
    if (
      this.dayControl.invalid ||
      this.monthControl.invalid ||
      this.yearControl.invalid
    )
      return { invalid: true };

    const day = this.dayControl.value;
    const month = this.monthControl.value;
    const year = this.yearControl.value;
    if (dateExists(year, month, day)) return { invalid: true };

    const date = new Date(year, month - 1, day);
    if (isWeekend(date)) return { weekend: true };
    if (await isHoliday(date)) return { holiday: true };

    return null;
  }
}
