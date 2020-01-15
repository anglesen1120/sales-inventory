import { String } from '../string/string';

export class LinkSettings {
    public static GetResLinkSetting(pGroup: string, pFunction: string, ...pParams: any[]) {
        // tslint:disable-next-line: prefer-const
        let resLinkSetting: any = require('../../../assets/document/reslink-api.json');
        // tslint:disable-next-line: prefer-const
        let link = resLinkSetting[pGroup][pFunction];
        return String.Format(link, pParams);
    }
}
