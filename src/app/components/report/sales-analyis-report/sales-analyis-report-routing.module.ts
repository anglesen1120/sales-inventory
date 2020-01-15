import { Routes, RouterModule } from '@angular/router';
import { SalesAnalyisReportComponent } from './sales-analyis-report.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '',
  component: SalesAnalyisReportComponent
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })

export class SalesAnalyisReportRoutingModule {
}