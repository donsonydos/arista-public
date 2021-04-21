import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerVisitPage } from './customer-visit.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerVisitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerVisitPageRoutingModule {}
