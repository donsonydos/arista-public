import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitListPageRoutingModule } from './visit-list-routing.module';

import { VisitListPage } from './visit-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitListPageRoutingModule
  ],
  declarations: [VisitListPage]
})
export class VisitListPageModule {}
