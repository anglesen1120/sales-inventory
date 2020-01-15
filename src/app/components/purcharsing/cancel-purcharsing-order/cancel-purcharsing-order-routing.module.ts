import { Routes, RouterModule } from '@angular/router';
import { CancelPurcharsingOrderComponent } from './cancel-purcharsing-order.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '',
  component: CancelPurcharsingOrderComponent
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })

export class CancelPurcharsingOrderRoutingModule {
}