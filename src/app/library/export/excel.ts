import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { String } from '../string/string';

type AOA = Array<Array<any>>;

function s2ab(s: string): ArrayBuffer {
  const buf: ArrayBuffer = new ArrayBuffer(s.length);
  const view: Uint8Array = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = 'xlsx';
const PDF_EXTENSION = 'pdf';


export class Export {
  wopts: XLSX.WritingOptions = { bookType: EXCEL_EXTENSION, type: 'binary' };

  public static exportExcelByElementId(elementId: string, excelFileName: string): void {
    var tbl = document.getElementById(elementId);
    const workbook: XLSX.WorkBook = XLSX.utils.table_to_book(tbl);
    const excelBuffer: any = XLSX.write(workbook, { bookType: EXCEL_EXTENSION, type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  public static exportExcelByArray(title1: any, title2: any, title3: any, title4: any, title5: any, jsonHeaderTitle: any, jsonDetail: any[]): void {
    let html = this.convertDataToHTML(title1, title2, title3, title4, title5, jsonHeaderTitle, jsonDetail);
    let tbl = document.createElement('table');
    tbl.innerHTML = html;
    const workbook: XLSX.WorkBook = XLSX.utils.table_to_book(tbl);
    const excelBuffer: any = XLSX.write(workbook, { bookType: EXCEL_EXTENSION, type: 'array' });
    this.saveAsExcelFile(excelBuffer, title1);
  }

  public static exportExcelByHTML(title: string,stringHTML: any): void {
    const workbook: XLSX.WorkBook = XLSX.utils.table_to_book(stringHTML);
    const excelBuffer: any = XLSX.write(workbook, { bookType: EXCEL_EXTENSION, type: 'array' });
    this.saveAsExcelFile(excelBuffer, title);
  }

  private static convertDataToHTML(pTitle1: any, pTitle2: any, pTitle3: any, pTitle4: any, pTitle5: any, pJSONHeaderTitle: any, pDataJSON: any[]): string {
    let printContents = "";
    let objTitle = JSON.parse(JSON.stringify(pJSONHeaderTitle || '{}'));
    let colspan = Object.keys(objTitle).length;

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

      let objData = JSON.parse(JSON.stringify(pDataJSON || '{}'));
      let i: number = 1;
      for (var d in objData) {
        printContents += "<tr><td>" + (i++) + "</td>";
        for (var t in objTitle) {
          let value = "";
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
  }


  private static wrapAndCenterCell(cell: XLSX.CellObject) {
    const wrapAndCenterCellStyle = { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } };
    this.setCellStyle(cell, wrapAndCenterCellStyle);
  }

  private static setCellStyle(cell: XLSX.CellObject, style: {}) {
    cell.s = style;
  }

  private static saveAsExcelFile(buffer: any, fileNameDefault: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileNameDefault + '_export_' + String.FormatDateTime(new Date()) + '.' + EXCEL_EXTENSION);
  }
}
