import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreatePurcharsingOrderComponent } from './create-purcharsing-order.component';

const routes: Routes = [{
  path: '',
  component: CreatePurcharsingOrderComponent
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })

export class CreatePurcharsingOrderRoutingModule {
}