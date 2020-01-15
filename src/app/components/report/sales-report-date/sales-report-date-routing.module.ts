import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { SalesReportDateComponent } from './sales-report-date.component';

const routes: Routes = [{
  path: '',
  component: SalesReportDateComponent
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })

export class SalesReportDateRoutingModule {
}