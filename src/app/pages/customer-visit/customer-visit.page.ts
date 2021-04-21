import { ApiService } from 'src/app/providers/api.service';
import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/providers/customers.service';
import { GeneralFunctionsService } from 'src/app/providers/general-functions.service';
import { LoadingController } from "@ionic/angular";
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { VisitInterface } from 'src/app/models/visitInterface';
import { constants } from 'src/environments/constants';
const { Toast } = Plugins;

@Component({
  selector: 'app-customer-visit',
  templateUrl: './customer-visit.page.html',
  styleUrls: ['./customer-visit.page.scss'],
})
export class CustomerVisitPage implements OnInit {
  private loading;
  /**
   * sirve para mostrar los datos correctos en la vista para empezar o finalizar una visita
   */
  public visiting = false;
  
  /**
   * interfas de visita
   */
  public visit: VisitInterface = new class implements VisitInterface {
      visitCoordinates: string;
      visitCustomerId: number;
      visitCustomerName: string;
      visitEndTime: string;
      visitHasSale: number;
      visitId: number;
      visitNoSaleReason: string;
      visitSellerId: number;
      visitSpendTime: any;
      visitStartTime: string;
      visitTotalSale: number;
  };
  constructor(
    private api: ApiService,
    private customers: CustomersService,
    private generalFunctions: GeneralFunctionsService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.customers.getCustomers().then(() => {
      if (localStorage.getItem(constants.CUSTOMER_VISIT)) {
        this.visiting = true;
        this.visit = JSON.parse(localStorage.getItem(constants.CUSTOMER_VISIT));
      }
    });
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Obteniendo su Posición. Por favor espere...'
    });
    await this.loading.present();
  }

  /**
   * inicializa los datos de una visita y los guarda en localStorage
   */
  startVisit() {
    this.presentLoading();
    this.generalFunctions.getLocation().then((message: any) => {
      const localization = {
        latitude: message.latitude,
        longitude: message.longitude
      };
      this.visiting = true;
      this.visit.visitSellerId = Number(localStorage.getItem(constants.USER_ID));
      this.visit.visitCustomerId = this.customers.customerIdSelected;
      this.visit.visitCustomerName = this.customers.getCustomerById(this.customers.customerIdSelected);
      this.visit.visitStartTime = this.generalFunctions.getCurrentDateTime(constants.DATE_FORMAT.DATABASE);
      this.visit.visitCoordinates = JSON.stringify(localization);
      this.visit.visitHasSale = 0;
      this.loading.dismiss();
      localStorage.setItem(constants.CUSTOMER_VISIT, JSON.stringify(this.visit));
    }, () => {
      this.loading.dismiss();
      this.toastError();
    });
  }

  /**
   * finaliza la venta y borra los datos guardados en localStorage
   */
  finishVisit() {
    this.visiting = false;
    this.visit.visitEndTime = this.generalFunctions.getCurrentDateTime(constants.DATE_FORMAT.DATABASE);
    this.visit.visitSpendTime = this.generalFunctions.
    calculateDifferenceBetweenTimes(this.visit.visitStartTime, this.visit.visitEndTime, constants.UNITIES.TIME.MILLISECONDS);

    if (this.visit.visitHasSale == 1) {
      this.visit.visitNoSaleReason = '';
    } else {
      this.visit.visitTotalSale = 0;
    }
    this.api.saveVisit(this.visit).subscribe(() => {
      localStorage.removeItem(constants.CUSTOMER_VISIT);
      // this.navCtrl.pop().then();
      this.router.navigate(['visit-list']);
    });
  }

  toastError() {
    const message ='No se logró obtener la posición!!';
    Toast.show({text: message, duration: 'long', position: 'center'});
  }

  /** parte de navegacion */
  goVisit() {
    this.router.navigate(['customer-visit']);
  }
  goOrders() {
    this.router.navigate(['customer-orders']);
  }

  goCatalog() {
    this.router.navigate(['home']);
  }

  goToLocalizate() {
    this.router.navigate(['customer-location']);
  }

}
