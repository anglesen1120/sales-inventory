import { NgModule } from '@angular/core';
import { NZ_ICONS } from 'ng-zorro-antd';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline
} from '@ant-design/icons-angular/icons';

const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline];

@NgModule({
  providers: [
    { provide: NZ_ICONS, useValue: icons }
  ],

  imports: [NzLayoutModule, NzMenuModule, NzProgressModule, NzDividerModule, NzIconModule,
    NzTableModule, NzDropDownModule, NzInputModule, NzButtonModule, NzModalModule, NzGridModule,
    NzSelectModule, NzFormModule, NzDatePickerModule],

  exports: [NzLayoutModule, NzMenuModule, NzProgressModule, NzDividerModule, NzIconModule,
    NzTableModule, NzDropDownModule, NzInputModule, NzButtonModule, NzModalModule, NzGridModule,
    NzSelectModule, NzFormModule, NzDatePickerModule]
})
export class AntProviderModule {
}
