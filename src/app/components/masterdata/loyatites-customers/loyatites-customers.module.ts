import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyatitesCustomersComponent } from './loyatites-customers.component';
import { LoyatitesCustomersRoutingModule } from './loyatites-customers-routing.module';

@NgModule({
  imports: [
    CommonModule,LoyatitesCustomersRoutingModule
  ],
  declarations: [LoyatitesCustomersComponent],
  
})
export class LoyatitesCustomersModule { }
