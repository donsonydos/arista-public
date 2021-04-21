import { Injectable } from '@angular/core';
import { CustomerInterfase } from '../models/customer.interfase';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  public customerIdSelected: number = 0;
  public searchText = '';
  private copySearchText = '';
  private changeSearchText = false;
  public filteredCustomer: any[] = [];
  public customerList: Array<CustomerInterfase>;
  public customerSelected: CustomerInterfase;

  constructor(
    private api: ApiService
  ) { }

  getCustomers() {
    return new Promise((resolve) => {
      if (typeof this.customerList === 'undefined' || this.customerList.length === 0) {
        this.api.getCustomersSeller().subscribe((responseCustomers: Array<CustomerInterfase>) => {
          this.customerList =  responseCustomers;
          if (responseCustomers.length > 0 && this.customerIdSelected === 0) {
            this.customerIdSelected = responseCustomers[0].id;
            this.searchText = responseCustomers[0].label;
          }
          resolve(this.customerList);
        });
      } else {
        resolve(this.customerList);
      }
    });
  }

  /**
   * asigna valor al customerSelected
   */
  setCustomerSelected() {
    if (this.customerList.length > 0) {
      for (const customer of this.customerList) {
        if (customer.id === this.customerIdSelected) {
          this.customerSelected = customer;
          break;
        }
      }
    }
  }

  /**
   * obtiene el valor del customer seleccionado
   */
  getCustomerSelected() {
    return this.customerSelected;
  }

  getCustomerById(customerId) {
      if (this.customerList.length > 0) {
          for (const customer of this.customerList) {
              if (customer.id === customerId) {
                  return customer.label;
              }
          }
      }
  }
  search() {
    this.filteredCustomer = [];
    for (const customer of this.customerList) {
      if (customer.label.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0 && this.searchText.length > 0) {
        this.filteredCustomer.push(customer);
      }
    }
  }

  changeCustomer(customer) {
    this.changeSearchText = true;
    this.customerIdSelected = customer.id;
    this.searchText = customer.label;
    this.filteredCustomer = [];
  }

  addFocus() {
    this.copySearchText = this.searchText;
    this.changeSearchText = false;
    this.searchText = '';
  }

  removeFocus() {
    if (!this.changeSearchText) {
      this.searchText = this.copySearchText;
    }

  }
}
