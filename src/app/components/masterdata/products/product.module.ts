import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './product-routing.module';
import { ProductsComponent } from './products.component';
import { AntProviderModule } from 'src/app/ant-provider.module';


@NgModule({
  imports: [
    CommonModule,ProductsRoutingModule,AntProviderModule
  ],
  declarations: [ProductsComponent],
  
})
export class ProductsModule { }
