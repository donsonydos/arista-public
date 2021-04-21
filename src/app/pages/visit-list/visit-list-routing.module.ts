import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitListPage } from './visit-list.page';

const routes: Routes = [
  {
    path: '',
    component: VisitListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitListPageRoutingModule {}
