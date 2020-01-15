import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import Swal from 'sweetalert2';
import { String } from '../string/string';
import { ClientConfig } from '../clientconfig/clientconfig';

@Injectable()

export class AlertService {

  headerConfirm = 'Xác nhận';
  headerInfo = 'Thông báo';
  textAddSuccess = 'Đã thêm thành công.';
  textEditSuccess = 'Đã sửa thành công.';
  textDeleteSuccess = 'Đã xóa thành công.';
  textSaveSuccess = 'Đã lưu thành công.';
  textImportSuccess = 'Đã nhập dữ liệu thành công.';
  textExportSuccess = 'Đã xuất dữ liệu thành công.';
  textChangStatusSuccess = 'Đã đổi mật khẩu thành công.';


  btnOkText = 'OK';
  btnCancelText = 'Cancel';
  btnOkColor = '#3085d6';
  btnCancelColor = '#d33';

  timerNumber = 1000;
  showPrice = false;
  isGroupService = false;
  constructor() { }

  deleteDetailConfirm(pItemName: string): Promise<any> {
    return Swal.fire({
      title: this.headerConfirm,
      html: String.Format('', this.getParamFormat([pItemName])),
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: this.btnCancelColor,
      cancelButtonText: this.btnCancelText,
      confirmButtonColor: this.btnOkColor,
      confirmButtonText: this.btnOkText
    }).then(result => result);
  }

  infomation(pText: string, ...args: string[]) {
    Swal.fire({
      title: this.headerInfo,
      html: String.Format(pText, this.getParamFormat(args)),
      icon: 'info'
    });
  }

  warning(pText: string, ...args: string[]) {
    Swal.fire({
      title: this.headerInfo,
      html: String.Format(pText, this.getParamFormat(args)),
      icon: 'warning'
    });
  }

  error(pText: string, ...args: string[]) {
    Swal.fire({
      title: this.headerInfo,
      html: String.Format(pText, this.getParamFormat(args)),
      icon: 'error'
    });
  }

  private getParamFormat(args: string[]): string[] {
    const color = ClientConfig.GetResClientConfig('ColorParamAlert');
    return args.map((res: any) => {
      return '<span style="font-weight:bold;color:' + color + '">' + res + '</span>';
    });
  }

  question(pStringFormat: string, ...args: string[]): Promise<any> {
    return Swal.fire({
      title: this.headerConfirm,
      html: String.Format(pStringFormat, this.getParamFormat(args)),
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: this.btnCancelText,
      confirmButtonColor: this.btnOkColor,
      cancelButtonColor: this.btnCancelColor,
      confirmButtonText: this.btnOkText
    }).then(result => result);
  }


  addSuccess() {
    this.actionSuccess(this.textAddSuccess);
  }

  editSuccess() {
    this.actionSuccess(this.textEditSuccess);
  }

  deleteSuccess(): Promise<any> {
    return this.actionSuccess(this.textDeleteSuccess).then(result => result);
  }

  saveSuccess() {
    this.actionSuccess(this.textSaveSuccess);
  }

  changStatusSuccess() {
    this.actionSuccess(this.textChangStatusSuccess);
  }

  importSuccess() {
    this.actionSuccess(this.textImportSuccess);
  }

  exportSuccess() {
    this.actionSuccess(this.textExportSuccess);
  }

  actionSuccess(pStringFormat: string, ...args: string[]): Promise<any> {
    return Swal.fire({
      position: 'center',
      title: this.headerInfo,
      html: String.Format(pStringFormat, this.getParamFormat(args)),
      icon: 'success',
      showConfirmButton: false,
      timer: this.timerNumber
    }).then(result => result);
  }

  async updateStatus(status: any) {
    const statusList = ClientConfig.GetResClientConfig('StatusList');
    const { value: chosen } = await Swal.fire({
      title: 'Chọn trạng thái cập nhật',
      input: 'select',
      inputOptions: statusList,
      inputValue: status,
      showCancelButton: true,
      inputValidator: (value) => {
        return !value && 'Bạn cần chọn một thứ gì đó!';
      }
    });

    if (chosen) {
      return chosen;
    }

  }

  async questionPrint() {
    const { value: formValues } = await Swal.fire({
      title: 'CHỌN HÌNH THỨC IN',
      html:
        `<h5>Loại dịch vụ</h5>
        <div class="first">
          <label><input type="radio" id="typeService1" name="typeService" (click)="!isGroupService" checked>Dịch vụ thường</label><br>
          <label><input type="radio" id="typeService2" name="typeService" (click)="isGroupService">Dịch vụ gói</label><br>
        </div>
        <h5>Hiển thị giá của dịch vụ</h5>
        <div class="second">
           <label><input type="radio" id="price1" name="price" (click)="showPrice" checked>Có</label><br>
           <label><input type="radio" id="price2" name="price" (click)="!showPrice">Không</label><br>
        </div>`,
      focusConfirm: false,
      preConfirm: () => {
        if ((document.getElementById('typeService1') as HTMLInputElement).checked) {
          this.isGroupService = false;
        } else if ((document.getElementById('typeService2') as HTMLInputElement).checked) {
          this.isGroupService = true;
        }

        if ((document.getElementById('price1') as HTMLInputElement).checked) {
          this.showPrice = true;
        } else if ((document.getElementById('price2') as HTMLInputElement).checked) {
          this.showPrice = false;
        }
        return {
          isGroupService: this.isGroupService,
          showPrice: this.showPrice
        };
      }
    });

    if (formValues) {
      return formValues;
    }
  }

  async registration() {
    const { value: formValues } = await Swal.fire({
      title: 'THANH TOÁN',
      html:
        `<div class="first">
          <label><input type="checkbox" id="typeService1" name="typeService1">Dịch vụ thường</label><br>
          <label><input type="checkbox" id="typeService2" name="typeService2">Dịch vụ gói</label><br>
        </div>`,
      focusConfirm: false,
      preConfirm: () => {
        // tslint:disable-next-line: max-line-length
        if (!(document.getElementById('typeService1') as HTMLInputElement).checked && !(document.getElementById('typeService2') as HTMLInputElement).checked) {
          return Swal.showValidationMessage('Bạn chưa chọn dịch vụ tiếp nhận');
        }

        // tslint:disable-next-line: one-variable-per-declaration
        let groupService = false,
          service = false;
        if ((document.getElementById('typeService1') as HTMLInputElement).checked) {
          service = true;
        }
        if ((document.getElementById('typeService2') as HTMLInputElement).checked) {
          groupService = true;
        }
        return {
          groupService,
          service
        };
      },
    });

    if (formValues) {
      return formValues;
    }
  }

  async saveResult(inputValue: any) {
    const { value: text } = await Swal.fire({
      title: 'Lưu kết quả dịch vụ',
      input: 'textarea',
      inputPlaceholder: 'Kết quả dịch vụ',
      showCancelButton: true,
      inputValue,
      confirmButtonText: 'Lưu',
      cancelButtonText: 'Đóng'
    });

    if (text) {
      return text;
    }
  }

}
