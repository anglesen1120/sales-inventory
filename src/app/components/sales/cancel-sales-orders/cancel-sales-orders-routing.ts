import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { CancelSalesOrdersComponent } from './cancel-sales-orders.component';

const routes: Routes = [{
  path: '',
  component: CancelSalesOrdersComponent
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })

export class CancelSalesOrdersRoutingModule {
}