import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerVisitPageRoutingModule } from './customer-visit-routing.module';

import { CustomerVisitPage } from './customer-visit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerVisitPageRoutingModule
  ],
  declarations: [CustomerVisitPage]
})
export class CustomerVisitPageModule {}
