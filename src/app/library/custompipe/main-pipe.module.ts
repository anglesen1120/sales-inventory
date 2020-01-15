import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateFormat, DateTimeFormat, NumberFormat, DecimalFormat } from './pipe';
import { NumberOnlyDirective } from './number.directive';

@NgModule({
  declarations: [
    DateFormat,
    DateTimeFormat,
    NumberFormat,
    DecimalFormat, NumberOnlyDirective
  ],
  imports: [CommonModule],
  exports: [
    DateFormat,
    DateTimeFormat,
    NumberFormat,
    DecimalFormat
  ]
})

export class MainPipe { }
