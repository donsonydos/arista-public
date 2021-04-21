import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VisitInterface } from '../models/visitInterface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  imageDirectory = 'http://arista.kijhotechnologies.com/uploads/images/';
  thumbnailsDirectory = 'http://arista.kijhotechnologies.com/uploads/images/thumbnails/';

  apiUrl = 'http://aristaws.kijhotechnologies.com/';
  // apiUrl = 'http://192.168.0.114:83/';

  nameSelector = 'Todos';

  constructor(public http: HttpClient) {}

  getPriceRate(rateId: number) {
    return this.http.get(this.apiUrl + 'priceRate/' + rateId);
  }

  getPriceRateId(userId) {
    return this.http.get(this.apiUrl + 'priceRateId/' + userId);
  }

  getCategories(userId) {
    return this.http.get(this.apiUrl + 'categoryListApp/' + userId);
  }

  getSubCategories() {
    return this.http.get(this.apiUrl + 'subCategoryList');
  }

  getProducts(selector, id, start, statusProduct, priceRate) {
    const data = {
      selector,
      id,
      start,
      statusProduct,
      priceRate
    };
    return this.http.get(this.apiUrl + 'getProducts/' + JSON.stringify(data));
  }

  getImagesProduct(id) {
    return this.http.get(this.apiUrl + 'getImagesProduct/' + id);
  }

  getImages() {
    return this.http.get(this.apiUrl + 'images');
  }

  getLastRegistAction() {
    return this.http.get(this.apiUrl + 'regist_action_last_id');
  }

  getRegistAction(lastId) {
    return this.http.get(this.apiUrl + 'regist_action/' + lastId);
  }

  sendOrder(order) {
    const dataOrder = JSON.stringify(order);
    return this.http.post(this.apiUrl + 'order', {dataOrder});
  }

  updateCustomerLocation(localization) {
    const customerLocation = JSON.stringify(localization);
    return this.http.post(this.apiUrl + 'customer_location', {customerLocation});
  }

  loginUser(objectUserData) {
    const userData = JSON.stringify(objectUserData);
    return this.http.get(this.apiUrl + 'login_user/' + userData);
  }

  registerView() {
    const userId = localStorage.getItem('userId');
    return this.http.get(this.apiUrl + 'register_view_user/' + userId);
  }

  getCustomersSeller() {
    const userId = localStorage.getItem('userId');
    return this.http.get(this.apiUrl + 'get_customers_seller/' + userId);
  }
  saveVisit(visit: VisitInterface) {
    const dataVisit =  JSON.stringify(visit);
    return this.http.post(this.apiUrl + 'visit', {dataVisit})
  }

  getSellerVisit(date) {
    const userId = localStorage.getItem('userId');
    return this.http.get(this.apiUrl + 'get_seller_visit/' + userId + '/' + date);
  }

  getCustomerOrders(customerId) {
    return this.http.get(this.apiUrl + 'get_customer_orders/' + customerId);
  }

  getCustomerOrderDetail(orderId) {
    return this.http.get(this.apiUrl + 'get_customer_order_detail/' + orderId);
  }
}
