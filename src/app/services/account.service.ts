import { Injectable, Inject } from '@angular/core';
import { TransferHttp } from '../modules/transfer-http/transfer-http';
import { LinkSettings } from '../library/linksetting/LinkSetting';
import { map } from 'rxjs/operators';


@Injectable()

export class AccountService {


    constructor(private transferHttp: TransferHttp) { }

    login(account: any) {
        const url = LinkSettings.GetResLinkSetting('Account', 'Login');
        return this.transferHttp.post(url, account)
            .pipe(map(res => res));
    }

    logout() {
        const url = LinkSettings.GetResLinkSetting('Account', 'Logout');
        return this.transferHttp.get(url)
            .pipe(map(res => res));
    }
    checklogin(pToken: string) {
        const url = LinkSettings.GetResLinkSetting('Account', 'CheckLogin');
        return this.transferHttp.post(url, JSON.stringify(pToken))
            .pipe(map(res => res));
    }

    getList() {
        const url = LinkSettings.GetResLinkSetting('Account', 'GetList');
        return this.transferHttp.get(url)
            .pipe(map(res => res));
    }
    insert(account: any) {
        const url = LinkSettings.GetResLinkSetting('Account', 'Insert');
        return this.transferHttp.post(url, JSON.stringify(account))
            .pipe(map(res => res));
    }
    update(account: any) {
        const url = LinkSettings.GetResLinkSetting('Account', 'Update');
        return this.transferHttp.put(url, JSON.stringify(account))
            .pipe(map(res => res));
    }
    delete(pKey: any) {
        const url = LinkSettings.GetResLinkSetting('Account', 'Delete', pKey);
        return this.transferHttp.delete(url)
            .pipe(map(res => res));
    }
    changePassword(oldPassword: string, newPassword: string) {
        const url = LinkSettings.GetResLinkSetting('Account', 'ChangePassword');
        // tslint:disable-next-line: object-literal-key-quotes
        return this.transferHttp.put(url, JSON.stringify({ 'oldPassword': oldPassword, 'newPassword': newPassword }))
            .pipe(map(res => res));
    }
}
