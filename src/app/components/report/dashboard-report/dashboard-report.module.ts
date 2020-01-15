import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-report-routing.module';
import { DashboardReportComponent } from './dashboard-report.component';





@NgModule({
  imports: [
    CommonModule,DashboardRoutingModule
  ],
  declarations: [DashboardReportComponent],
  
})
export class DashboardReportModule { }
