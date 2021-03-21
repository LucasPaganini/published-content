import { Component, forwardRef, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { combineLatest } from 'rxjs';

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
  ],
})
export class DateInputComponent implements OnInit, ControlValueAccessor {
  public readonly dayControl = new FormControl();
  public readonly monthControl = new FormControl();
  public readonly yearControl = new FormControl();

  public ngOnInit(): void {
    combineLatest([
      this.dayControl.valueChanges,
      this.monthControl.valueChanges,
      this.yearControl.valueChanges,
    ]).subscribe(([day, month, year]) => {
      const date = new Date(year, month - 1, day);
      this._onChange(date);
      this._onTouched();
    });
  }

  public writeValue(value: Date): void {
    this.dayControl.setValue(value.getDate());
    this.monthControl.setValue(value.getMonth() + 1);
    this.yearControl.setValue(value.getFullYear());
  }

  private _onChange = (value: Date) => undefined;
  public registerOnChange(fn: (value: Date) => void): void {
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
}
