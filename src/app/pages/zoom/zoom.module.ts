import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { ZoomPage } from './zoom.page';
import { ZoomPageRoutingModule } from './zoom-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZoomPageRoutingModule,
    NgxIonicImageViewerModule
  ],
  declarations: [ZoomPage]
})
export class ZoomPageModule {}
