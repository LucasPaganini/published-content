import { Component, forwardRef, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { isDate } from 'lodash-es';
import { combineLatest } from 'rxjs';
import { UniqueService } from '../unique';

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

  public readonly dayInputID = this._unique.id('day-input-');
  public readonly monthInputID = this._unique.id('month-input-');
  public readonly yearInputID = this._unique.id('year-input-');

  constructor(private readonly _unique: UniqueService) {}

  public ngOnInit(): void {
    combineLatest([
      this.dayControl.valueChanges,
      this.monthControl.valueChanges,
      this.yearControl.valueChanges,
    ]).subscribe(([day, month, year]) => {
      const date = new Date(year, month - 1, day);
      this._onChange(date);
    });
  }

  public writeValue(value: Date | null): void {
    if (isDate(value)) {
      const day = value.getDate();
      const month = value.getMonth() + 1;
      const year = value.getFullYear();

      this.dayControl.setValue(day);
      this.monthControl.setValue(month);
      this.yearControl.setValue(year);
    } else {
      this.dayControl.setValue(null);
      this.monthControl.setValue(null);
      this.yearControl.setValue(null);
    }
  }

  private _onChange = (_value: Date | null): void => undefined;
  public registerOnChange(fn: (value: Date | null) => void): void {
    this._onChange = fn;
  }

  /** It's also called in the component template when we have a "blur" or "input" event */
  public onTouched = (): void => undefined;
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
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
