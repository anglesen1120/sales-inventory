import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { CreateSalesOrdersComponent } from './create-sales-orders.component';

const routes: Routes = [{
  path: '',
  component: CreateSalesOrdersComponent
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })

export class CreateSalesOrdersRoutingModule {
}