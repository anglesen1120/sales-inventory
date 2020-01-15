import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesAnalyisReportRoutingModule } from './sales-analyis-report-routing.module';
import { SalesAnalyisReportComponent } from './sales-analyis-report.component';





@NgModule({
  imports: [
    CommonModule,SalesAnalyisReportRoutingModule
  ],
  declarations: [SalesAnalyisReportComponent],
  
})
export class SalesAnalyisReportModule { }
