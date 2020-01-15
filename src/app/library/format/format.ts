import * as moment from 'moment';

export class Format {

  public static setDecimalDate(date: any) {
    // tslint:disable-next-line: variable-name
    let _moment = moment(date);
    // tslint:disable-next-line: max-line-length
    return (_moment.year().toString() + (_moment.month() + 1 < 10 ? '0' + (_moment.month() + 1).toString() : (_moment.month() + 1).toString()) + (_moment.date() < 10 ? '0' + _moment.date().toString() : _moment.date().toString()) + '000000000');
  }

 

  public static setDecimalEndDate(date: any) {
    // tslint:disable-next-line: variable-name
    let _moment = moment(date);
    return (_moment.year().toString() + (_moment.month() + 1 < 10 ? '0' + (_moment.month() + 1).toString() : (_moment.month() + 1).toString()) + (_moment.date() < 10 ? '0' + _moment.date().toString() : _moment.date().toString()) + '235959999');
  }

  public static setDateToString(date: any) {
    let _moment = moment(date);
    return (_moment.year().toString() + '/' + (_moment.month() + 1 < 10 ? '0' + (_moment.month() + 1).toString() : (_moment.month() + 1).toString()) + '/' + (_moment.date() < 10 ? '0' + _moment.date().toString() : _moment.date().toString()));
  }

  public static formatDDMMYYY(date: any) {
    let _moment = moment(date);
    return ((_moment.date() < 10 ? '0' + _moment.date().toString() : _moment.date().toString()) + '/' + (_moment.month() + 1 < 10 ? '0' + (_moment.month() + 1).toString() : (_moment.month() + 1).toString()) + '/' + _moment.year().toString());
  }

  public static getDD(date: any) {
    let _moment = moment(date);
    return _moment.date() < 10 ? '0' + _moment.date().toString() : _moment.date().toString();
  }

  public static getMM(date: any) {
    let _moment = moment(date);
    return _moment.month() + 1 < 10 ? '0' + (_moment.month() + 1).toString() : (_moment.month() + 1).toString();
  }

  public static getYYYY(date: any) {
    let _moment = moment(date);
    return _moment.year().toString();
  }
  public static addDays(date: any, days: any) {
    return moment(date, 'DD-MM-YYYY').add(days, 'days').format('DD/MM/YYYY');
  }

  public static getFull(date: any) {
    return moment(date).format('YYYYMMDDHHmmssSSS');
  }

  public static getDatePrint(date: any) {
    return moment(date).format('DD/MM/YYYY HH:mm');
  }

  // tslint:disable-next-line: variable-name
  public static numberConvert(number: number) {
    var parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}
