import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerLocationPageRoutingModule } from './customer-location-routing.module';

import { CustomerLocationPage } from './customer-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerLocationPageRoutingModule
  ],
  declarations: [CustomerLocationPage]
})
export class CustomerLocationPageModule {}
