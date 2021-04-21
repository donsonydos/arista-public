import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreViewPage } from './pre-view.page';

const routes: Routes = [
  {
    path: '',
    component: PreViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreViewPageRoutingModule {}
