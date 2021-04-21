import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, NgxIonicImageViewerModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Geolocation],
  bootstrap: [AppComponent],
})
export class AppModule {}
