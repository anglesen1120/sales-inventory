import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePurcharsingOrderRoutingModule } from './create-purcharsing-order-routing.module';
import { CreatePurcharsingOrderComponent } from './create-purcharsing-order.component';





@NgModule({
  imports: [
    CommonModule,CreatePurcharsingOrderRoutingModule
  ],
  declarations: [CreatePurcharsingOrderComponent],
  
})
export class CreatePurcharsingOrderModule { }
