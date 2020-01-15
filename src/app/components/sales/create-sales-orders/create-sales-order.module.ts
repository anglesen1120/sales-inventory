import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateSalesOrdersRoutingModule } from './create-sales-order-routing';
import { CreateSalesOrdersComponent } from './create-sales-orders.component';




@NgModule({
  imports: [
    CommonModule,CreateSalesOrdersRoutingModule
  ],
  declarations: [CreateSalesOrdersComponent],
  
})
export class CreateSalesModule { }
