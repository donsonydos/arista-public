import { ApiService } from 'src/app/providers/api.service';
import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/providers/customers.service';
import { GeneralFunctionsService } from 'src/app/providers/general-functions.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core'
const { Toast } = Plugins;


@Component({
  selector: 'app-customer-location',
  templateUrl: './customer-location.page.html',
  styleUrls: ['./customer-location.page.scss'],
})
export class CustomerLocationPage implements OnInit {

  private loading;

  constructor(
    private api: ApiService,
    private customers: CustomersService,
    private generalFunctions: GeneralFunctionsService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.customers.getCustomers().then();
    this.generalFunctions.getLocation().then((message) => console.info('responde', message));
  }

  saveLocation() {
    this.presentLoading();
    this.generalFunctions.getLocation().then((message: any) => {
      const localization = {
        latitude: message.latitude,
        longitude: message.longitude
      };
      const dataLocalization = {
        customerId: this.customers.customerIdSelected,
        customerLocalization: localization
      };
      this.api.updateCustomerLocation(dataLocalization).subscribe(() => {
        this.loading.dismiss();
        this.toastSuccess();
      }, (error) => {
        this.loading.dismiss();
        this.toastError('error');
      });
    }, () => {
      this.loading.dismiss();
      this.toastError('reject');
    });
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Guardando ubicación. Por favor espere...'
    });
    await this.loading.present();
  }

  toastSuccess() {
    this.showToastMessage('Ubicación guardada Exitosamente!!');
  }

  toastError(type) {
    let msg = 'No se logró guardar la ubicación!!';
    if (type === 'reject') {
      msg = 'No se logró conectar al servidor!!';
    }
   this.showToastMessage(msg);
  }

  showToastMessage(message) {
    Toast.show({
      text: message,
      duration: 'long',
      position: 'center'
    });
  }

  /** parte de navegacion */
  goVisit() {
    // this.navCtrl.setRoot(VisitListPage).then();
    this.router.navigate(['customer-visit']);
  }
  goOrders() {
    // this.navCtrl.setRoot(CustomerOrdersPage).then();
    this.router.navigate(['customer-orders']);
  }

  goCatalog() {
    // this.navCtrl.push(HomePage);
    this.router.navigate(['home'])
  }

  goToLocalizate() {
    console.info('estoy aqui');
  }
}
