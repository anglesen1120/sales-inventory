import { Routes, RouterModule } from '@angular/router';
import { DashboardReportComponent } from './dashboard-report.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '',
  component: DashboardReportComponent
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })

export class DashboardRoutingModule {
}