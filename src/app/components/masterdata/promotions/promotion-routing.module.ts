import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PromotionsComponent } from './promotions.component';

const routes: Routes = [{
  path: '',
  component: PromotionsComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PromotionRoutingModule { }
