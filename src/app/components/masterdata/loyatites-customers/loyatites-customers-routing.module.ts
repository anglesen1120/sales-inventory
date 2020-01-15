import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { LoyatitesCustomersComponent } from './loyatites-customers.component';

const routes: Routes = [{
  path: '',
  component: LoyatitesCustomersComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class LoyatitesCustomersRoutingModule { }
