import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesReportDateRoutingModule } from './sales-report-date-routing.module';
import { SalesReportDateComponent } from './sales-report-date.component';





@NgModule({
  imports: [
    CommonModule,SalesReportDateRoutingModule
  ],
  declarations: [SalesReportDateComponent],
  
})
export class SalesReportDateModule { }
