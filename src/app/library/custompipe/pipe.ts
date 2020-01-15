import { Pipe, PipeTransform } from '@angular/core';
import { ClientConfig } from '../clientconfig/clientconfig';
import { DatePipe, DecimalPipe } from '@angular/common';
import { String } from '../string/string';
import { isNumber } from 'util';


@Pipe({
    name: 'dateTimeFormat'
})
export class DateTimeFormat extends DatePipe implements PipeTransform {
    transform(value: any): any {
        return super.transform(value, ClientConfig.GetResClientConfig('DateTimeFormat'));
    }
}

@Pipe({
    name: 'dateFormat'
})
export class DateFormat extends DatePipe implements PipeTransform {
    transform(value: any): any {
        return super.transform(value, ClientConfig.GetResClientConfig('DateFormat'));
    }
}

@Pipe({
    name: 'numberFormat'
})
export class NumberFormat extends DecimalPipe implements PipeTransform {
  transform(value: any): any {
    if (value != null && value != undefined) {
      let svalue = value.toString();
      let regex = new RegExp('[^' + String.DECIMAL_SEPARATOR + '\\d]', 'g'),
        number_string = svalue.replace(regex, ''),
        split = number_string.split(String.DECIMAL_SEPARATOR),
        rest = split[0].length % 3,
        result = split[0].substr(0, rest),
        thousands = split[0].substr(rest).match(/\d{3}/g);
      if (thousands) {
        let separator = rest ? String.THOUSANDS_SEPARATOR : '';
        result += separator + thousands.join(String.THOUSANDS_SEPARATOR);
        if (value < 0)
          result = "-" + result;
      }
      result = split[1] != undefined ? result + String.DECIMAL_SEPARATOR + split[1] : result;
      return result;
    }
    }
    
}

@Pipe({
  name: 'decimalFormat'
})
export class DecimalFormat extends DecimalPipe implements PipeTransform {
  transform(value: any): any {
    let result = super.transform(value, ClientConfig.GetResClientConfig('DecimalFormat'));
    return result !== null ? result.replace(new RegExp('[' + String.THOUSANDS_SEPARATOR + ']', 'g'), '@').replace(new RegExp('[' + String.DECIMAL_SEPARATOR + ']', 'g'), String.THOUSANDS_SEPARATOR).replace(new RegExp('[' + '@' + ']', 'g'), String.DECIMAL_SEPARATOR) : null;
  }
}
