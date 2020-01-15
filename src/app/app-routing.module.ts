import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/student' },

  { path: 'student', loadChildren: () => import('./components/student/student.module').then(m => m.StudentModule) },
  { path: 'custommers', loadChildren: () => import('./components/masterdata/custommers/custommers.module').then(m => m.CustommersModule) },
  { path: 'loyatites-custommers', loadChildren: () => import('./components/masterdata/loyatites-customers/loyatites-customers.module').then(m => m.LoyatitesCustomersModule) },
  { path: 'products', loadChildren: () => import('./components/masterdata/products/product.module').then(m => m.ProductsModule) },
  { path: 'promotions', loadChildren: () => import('./components/masterdata/promotions/promotion.module').then(m => m.PromotionModule) },
  { path: 'cancel-purcharsing', loadChildren: () => import('./components/purcharsing/cancel-purcharsing-order/cancel-purcharsing-order.module').then(m => m.CancelPurcharsingOrderModule) },
  { path: 'create-purcharsing', loadChildren: () => import('./components/purcharsing/create-purcharsing-order/create-purcharsing-order.module').then(m => m.CreatePurcharsingOrderModule) },
  { path: 'dashboard-report', loadChildren: () => import('./components/report/dashboard-report/dashboard-report.module').then(m => m.DashboardReportModule) },
  { path: 'sales-analyis-report', loadChildren: () => import('./components/report/sales-analyis-report/sales-analyis-report.module').then(m => m.SalesAnalyisReportModule) },
  { path: 'sales-report-date', loadChildren: () => import('./components/report/sales-report-date/sales-report-date.module').then(m => m.SalesReportDateModule) },
  { path: 'create-sales', loadChildren: () => import('./components/sales/create-sales-orders/create-sales-order.module').then(m => m.CreateSalesModule) },
  { path: 'cancel-sales', loadChildren: () => import('./components/sales/cancel-sales-orders/cancel-sales-orders.module').then(m => m.CancelSalesModule) },
  
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
