import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerInterfase } from 'src/app/models/customer.interfase';
import { CustomersService } from 'src/app/providers/customers.service';
@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.page.html',
  styleUrls: ['./customer-orders.page.scss'],
})
export class CustomerOrdersPage implements OnInit {
  public customersList: Array<CustomerInterfase>;

  constructor(
    private customers: CustomersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.customers.getCustomers().then();
  }

  searchOrders() {
    for (const customer of this.customers.customerList) {
      if (customer.id === this.customers.customerIdSelected) {
        console.log('seleccionando el tales', customer);
        this.router.navigate(['order-list', customer])
        break;
      }
    }
  }

  /** parte de navegacion */
  goVisit() {
    // this.navCtrl.setRoot(VisitListPage).then();
    this.router.navigate(['visit-list'])
  }
  goOrders() {
    console.info('estoy aqui')
  }

  goCatalog() {
    // this.navCtrl.push(HomePage).then();
    this.router.navigate(['home'])
  }

  goToLocalizate() {
    // this.navCtrl.setRoot(CustomerLocationPage).then();
    this.router.navigate(['customer-location']);
  }

}
