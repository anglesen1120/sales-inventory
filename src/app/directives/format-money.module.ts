import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormatMoneyDirective } from './format-money.directive';

@NgModule({
  declarations: [
    FormatMoneyDirective
  ],
  imports: [CommonModule],
  exports: [
    FormatMoneyDirective
  ]
})

export class FormatMoneyDirectiveModule { }
