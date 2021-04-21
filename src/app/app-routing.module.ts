import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'customer-location',
    loadChildren: () => import('./pages/customer-location/customer-location.module').then( m => m.CustomerLocationPageModule)
  },
  {
    path: 'customer-orders',
    loadChildren: () => import('./pages/customer-orders/customer-orders.module').then( m => m.CustomerOrdersPageModule)
  },
  {
    path: 'customer-visit',
    loadChildren: () => import('./pages/customer-visit/customer-visit.module').then( m => m.CustomerVisitPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'order-detail',
    loadChildren: () => import('./pages/order-detail/order-detail.module').then( m => m.OrderDetailPageModule)
  },
  {
    path: 'order-list',
    loadChildren: () => import('./pages/order-list/order-list.module').then( m => m.OrderListPageModule)
  },
  {
    path: 'pre-view',
    loadChildren: () => import('./pages/pre-view/pre-view.module').then( m => m.PreViewPageModule)
  },
  {
    path: 'visit-list',
    loadChildren: () => import('./pages/visit-list/visit-list.module').then( m => m.VisitListPageModule)
  },
  {
    path: 'zoom',
    loadChildren: () => import('./pages/zoom/zoom.module').then( m => m.ZoomPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
