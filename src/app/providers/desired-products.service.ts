import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DesiredProductsService {

  constructor() { }

  desiredProductsIds: any = [];
  desiredProducts: any = [];

  checkProduct(prod_id) {
    return new Promise(resolve => {
      if (this.desiredProductsIds.indexOf(prod_id) >= 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  iLike(product) {
    return new Promise(resolve => {
      if (this.desiredProductsIds.indexOf(product.prod_id) >= 0) {
        let idSplice = this.desiredProductsIds.indexOf(product.prod_id);
        this.desiredProductsIds.splice(idSplice, 1);
        this.desiredProducts.splice(idSplice,1);
        resolve(false);
      } else {
        product.quantity = 1;
        this.desiredProductsIds.push(product.prod_id);
        this.desiredProducts.push(product);
        resolve(true);
      }
    });
  }
}
