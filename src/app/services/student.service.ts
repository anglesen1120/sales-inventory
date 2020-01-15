import { Injectable, Inject } from '@angular/core';
import { TransferHttp } from '../modules/transfer-http/transfer-http';
import { LinkSettings } from '../library/linksetting/LinkSetting';
import { map } from 'rxjs/operators';



@Injectable()


export class StudentService {
    constructor(private transferHttp: TransferHttp) { }


    // Get all Student
    getFullImformationStudent() {
        const url = LinkSettings.GetResLinkSetting('Student', 'GetStudentFullImformation');
        return this.transferHttp.get(url).pipe(map(res => res));
    }



}
