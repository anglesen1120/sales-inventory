import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appFormatMoney]',
})
export class FormatMoneyDirective {

  // tslint:disable-next-line: no-inferrable-types
  DECIMAL_SEPARATOR: string = '.';
  // tslint:disable-next-line: no-inferrable-types
  THOUSANDS_SEPARATOR: string = ',';

  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }


  onInputChange(event, backspace) {
    if (event != null) {
      // tslint:disable-next-line: prefer-const
      let svalue = event.toString();

      // tslint:disable-next-line: one-variable-per-declaration
      let regex = new RegExp('[^' + this.DECIMAL_SEPARATOR + '\\d]', 'g'),
        number_string = svalue.replace(regex, ''),
        split = number_string.split(this.DECIMAL_SEPARATOR),
        rest = split[0].length % 3,
        result = split[0].substr(0, rest),
        thousands = split[0].substr(rest).match(/\d{3}/g);
      if (thousands) {
        const separator = rest ? this.THOUSANDS_SEPARATOR : '';
        result += separator + thousands.join(this.THOUSANDS_SEPARATOR);
        if (event < 0) {
          result = '-' + result;
        }
      }
      result = split[1] !== undefined ? result + this.DECIMAL_SEPARATOR + split[1] : result;

      this.ngControl.valueAccessor.writeValue(result);
    }
  }
}
