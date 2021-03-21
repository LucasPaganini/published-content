import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DateInputComponent } from './date-input.component';

@NgModule({
  declarations: [DateInputComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [DateInputComponent],
})
export class DateInputModule {}
