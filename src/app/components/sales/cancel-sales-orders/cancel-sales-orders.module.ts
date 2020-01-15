import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelSalesOrdersComponent } from './cancel-sales-orders.component';
import { CancelSalesOrdersRoutingModule } from './cancel-sales-orders-routing';



@NgModule({
  imports: [
    CommonModule,CancelSalesOrdersRoutingModule
  ],
  declarations: [CancelSalesOrdersComponent],
  
})
export class CancelSalesModule { }
