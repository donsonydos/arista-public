import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { constants } from 'src/environments/constants';
import {ApiService} from "src/app/providers/api.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(platform: Platform, public router: Router,  private api: ApiService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();

      if (localStorage.hasOwnProperty('userId')) {
        const userType = localStorage.getItem('userType');
          if (!userType || Number(userType) === constants.USER_TYPE.CUSTOMER) {
              this.router.navigate(['home']);
              this.api.registerView().subscribe(response => console.info(response));
            } else if (Number(userType) === constants.USER_TYPE.SELLER) {
              this.router.navigate(['visit-list']);
            }
          } else {
        this.router.navigate(['login']);
      }
      // this.rootPage = VisitListPage;
      // splashScreen.hide();
    });
  }
}
