"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileSaver = require("file-saver");
var XLSX = require("xlsx");
var string_1 = require("../string/string");
function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i !== s.length; ++i)
        view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}
var EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
var EXCEL_EXTENSION = 'xlsx';
var PDF_EXTENSION = 'pdf';
var Export = /** @class */ (function () {
    function Export() {
        this.wopts = { bookType: EXCEL_EXTENSION, type: 'binary' };
    }
    Export.exportExcelByElementId = function (elementId, excelFileName) {
        var tbl = document.getElementById(elementId);
        var workbook = XLSX.utils.table_to_book(tbl);
        var excelBuffer = XLSX.write(workbook, { bookType: EXCEL_EXTENSION, type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    };
    Export.exportExcelByArray = function (title1, title2, title3, title4, title5, jsonHeaderTitle, jsonDetail) {
        var html = this.convertDataToHTML(title1, title2, title3, title4, title5, jsonHeaderTitle, jsonDetail);
        var tbl = document.createElement('table');
        tbl.innerHTML = html;
        var workbook = XLSX.utils.table_to_book(tbl);
        var excelBuffer = XLSX.write(workbook, { bookType: EXCEL_EXTENSION, type: 'array' });
        this.saveAsExcelFile(excelBuffer, title1);
    };
    Export.exportExcelByHTML = function (title, stringHTML) {
        var workbook = XLSX.utils.table_to_book(stringHTML);
        var excelBuffer = XLSX.write(workbook, { bookType: EXCEL_EXTENSION, type: 'array' });
        this.saveAsExcelFile(excelBuffer, title);
    };
    Export.convertDataToHTML = function (pTitle1, pTitle2, pTitle3, pTitle4, pTitle5, pJSONHeaderTitle, pDataJSON) {
        var printContents = "";
        var objTitle = JSON.parse(JSON.stringify(pJSONHeaderTitle || '{}'));
        var colspan = Object.keys(objTitle).length;
        if (colspan > 0) {
            colspan += 1;
            printContents += "<table class='table' width='100%'>";
            printContents += "<thead>";
            printContents += "<tr style='text-align:center'><th colspan='" + colspan + "'><b>" + pTitle1 + "</b></th></tr>";
            printContents += "<tr style='text-align:center'><th colspan='" + colspan + "'>" + pTitle2 + "</th></tr>";
            printContents += "<tr style='text-align:center'><th colspan='" + colspan + "'>" + pTitle3 + "</th></tr>";
            printContents += "<tr style='text-align:center'><th colspan='" + colspan + "'>" + pTitle4 + "</th></tr>";
            printContents += "<tr style='text-align:center'><th colspan='" + colspan + "'>" + pTitle5 + "</th></tr>";
            printContents += "<tr style='text-align:center'><th colspan='" + colspan + "'></th></tr>";
            printContents += "<tr>";
            printContents += "<th width='10%'>STT</th>";
            for (var t in objTitle) {
                printContents += "<th>" + objTitle[t] + "</th>";
            }
            printContents += "</tr>";
            printContents += "</thead>";
            printContents += "<tbody>";
            var objData = JSON.parse(JSON.stringify(pDataJSON || '{}'));
            var i = 1;
            for (var d in objData) {
                printContents += "<tr><td>" + (i++) + "</td>";
                for (var t in objTitle) {
                    var value = "";
                    if (objData[d][t] != null)
                        value = objData[d][t];
                    printContents += "<td>" + value + "</td>";
                }
                printContents += "</tr>";
            }
            printContents += "</tbody>";
            printContents += "</table>";
        }
        return printContents;
    };
    Export.wrapAndCenterCell = function (cell) {
        var wrapAndCenterCellStyle = { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } };
        this.setCellStyle(cell, wrapAndCenterCellStyle);
    };
    Export.setCellStyle = function (cell, style) {
        cell.s = style;
    };
    Export.saveAsExcelFile = function (buffer, fileNameDefault) {
        var data = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileNameDefault + '_export_' + string_1.String.FormatDateTime(new Date()) + '.' + EXCEL_EXTENSION);
    };
    return Export;
}());
exports.Export = Export;
//# sourceMappingURL=excel.js.map