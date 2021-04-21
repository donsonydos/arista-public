import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailInterfase } from 'src/app/models/orderDetailInterfase';
import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {
  public detailOrder = {
    subtotal: 0,
    tax: 0,
    total: 0
  };

  public productsOrder: OrderDetailInterfase[] = [
    {
      // imagen principal del producto
      image: '',
      // nombre del producto o referencia
      prod_name: '',
      // descripción del producto
      prod_descriptions: '',
      // precio indivudual
      price: 0,
      // cantidad seleccionada
      quantity: 0
    }
  ];

  public currentTax = 0.19;
  constructor(
    public api: ApiService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe((data) => {
      console.log('este es el dato', data);
      this.api.getCustomerOrderDetail(data.orderId).subscribe((dataOrder: OrderDetailInterfase[]) => {
        this.productsOrder = dataOrder;
        this.calculateTotalOrder();
      });
    });
  }

  calculateTotalOrder() {
    this.detailOrder.subtotal = 0;
    this.productsOrder.forEach((product: any) => {
      this.detailOrder.subtotal += (product.price * product.quantity);
    });
    this.detailOrder.tax = this.detailOrder.subtotal * this.currentTax;
    this.detailOrder.total = this.detailOrder.subtotal + this.detailOrder.tax;
  }
}
