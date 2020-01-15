import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelPurcharsingOrderComponent } from './cancel-purcharsing-order.component';
import { CancelPurcharsingOrderRoutingModule } from "./cancel-purcharsing-order-routing.module";




@NgModule({
  imports: [
    CommonModule,CancelPurcharsingOrderRoutingModule
  ],
  declarations: [CancelPurcharsingOrderComponent],
  
})
export class CancelPurcharsingOrderModule { }
