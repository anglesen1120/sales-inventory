"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var Format = /** @class */ (function () {
    function Format() {
    }
    Format.setDecimalDate = function (date) {
        var _moment = moment(date);
        return (_moment.year().toString() + (_moment.month() + 1 < 10 ? '0' + (_moment.month() + 1).toString() : (_moment.month() + 1).toString()) + (_moment.date() < 10 ? '0' + _moment.date().toString() : _moment.date().toString()) + '000000000');
    };
    Format.setDecimalEndDate = function (date) {
        var _moment = moment(date);
        return (_moment.year().toString() + (_moment.month() + 1 < 10 ? '0' + (_moment.month() + 1).toString() : (_moment.month() + 1).toString()) + (_moment.date() < 10 ? '0' + _moment.date().toString() : _moment.date().toString()) + '235959999');
    };
    Format.setDateToString = function (date) {
        var _moment = moment(date);
        return (_moment.year().toString() + "/" + (_moment.month() + 1 < 10 ? '0' + (_moment.month() + 1).toString() : (_moment.month() + 1).toString()) + "/" + (_moment.date() < 10 ? '0' + _moment.date().toString() : _moment.date().toString()));
    };
    Format.formatDDMMYYY = function (date) {
        var _moment = moment(date);
        return ((_moment.date() < 10 ? '0' + _moment.date().toString() : _moment.date().toString()) + "/" + (_moment.month() + 1 < 10 ? '0' + (_moment.month() + 1).toString() : (_moment.month() + 1).toString()) + "/" + _moment.year().toString());
    };
    Format.getDD = function (date) {
        var _moment = moment(date);
        return _moment.date() < 10 ? '0' + _moment.date().toString() : _moment.date().toString();
    };
    Format.getMM = function (date) {
        var _moment = moment(date);
        return _moment.month() + 1 < 10 ? '0' + (_moment.month() + 1).toString() : (_moment.month() + 1).toString();
    };
    Format.getYYYY = function (date) {
        var _moment = moment(date);
        return _moment.year().toString();
    };
    Format.addDays = function (date, days) {
        return moment(date, "DD-MM-YYYY").add(days, 'days').format('DD/MM/YYYY');
    };
    Format.getFull = function (date) {
        return moment(date).format('YYYYMMDDHHmmssSSS');
    };
    Format.getDatePrint = function (date) {
        return moment(date).format('DD/MM/YYYY HH:mm');
    };



    return Format;
}());
exports.Format = Format;
//# sourceMappingURL=format.js.map