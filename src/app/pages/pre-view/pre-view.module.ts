import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

import { PreViewPageRoutingModule } from './pre-view-routing.module';

import { PreViewPage } from './pre-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreViewPageRoutingModule,
    NgxIonicImageViewerModule
  ],
  declarations: [PreViewPage]
})
export class PreViewPageModule {}
