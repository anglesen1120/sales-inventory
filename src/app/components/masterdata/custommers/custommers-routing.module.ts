import { Routes, RouterModule } from '@angular/router';
import { CustommersComponent } from './custommers.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: '',
  component: CustommersComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class CustommersRoutingModule { }
