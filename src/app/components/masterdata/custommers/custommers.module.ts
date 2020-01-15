import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustommersRoutingModule } from './custommers-routing.module';
import { CustommersComponent } from './custommers.component';

@NgModule({
  imports: [
    CommonModule,CustommersRoutingModule
  ],
  declarations: [CustommersComponent],
  
})
export class CustommersModule { }
