import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionsComponent } from './promotions.component';
import { PromotionRoutingModule } from './promotion-routing.module';



@NgModule({
  imports: [
    CommonModule,PromotionRoutingModule
  ],
  declarations: [PromotionsComponent],
  
})
export class PromotionModule { }
