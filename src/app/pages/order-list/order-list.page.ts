import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerInterfase } from 'src/app/models/customer.interfase';
import { OrderListInterface } from 'src/app/models/orderListInterface';
import { ApiService } from 'src/app/providers/api.service';
import { GeneralFunctionsService } from 'src/app/providers/general-functions.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {

  public orderList: OrderListInterface[] = [
    {
      date: '2019-07-01',
      id: 5,
      amount: 250000
    },{
      date: '2019-07-01',
      id: 5,
      amount: 250000
    },{
      date: '2019-07-01',
      id: 5,
      amount: 250000
    },{
      date: '2019-07-01',
      id: 5,
      amount: 250000
    }
  ];

  public customer: CustomerInterfase = {
    label: 'Cliente',
    id: 0
  };
  
  constructor(
    private router: Router,  private api: ApiService, private activeRoute: ActivatedRoute, public generalFunctions: GeneralFunctionsService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((customer: CustomerInterfase) => {
      this.customer = customer;
      this.api.getCustomerOrders(this.customer.id).subscribe((responseOrders: OrderListInterface[]) =>{
        this.orderList = responseOrders;
      });
    });
  }

  showDetail(orderId) {
    // this.navCtrl.push(OrderDetailPage, {orderId}).then();
    this.router.navigate(['order-detail', {orderId}]);
  }

  /** parte de navegacion */
  goVisit() {
    // this.navCtrl.setRoot(VisitListPage).then();
    this.router.navigate(['visit-list']);
  }

  goOrders() {
    // this.navCtrl.setRoot(CustomerOrdersPage).then();
    this.router.navigate(['customer-orders']);
  }

  goCatalog() {
    // this.navCtrl.push(HomePage).then();
    this.router.navigate(['home']);
  }

  goToLocalizate() {
    // this.navCtrl.setRoot(CustomerLocationPage).then();
    this.router.navigate(['customer-location']);
  }

}
