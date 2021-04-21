import { AlertController, IonInfiniteScroll, LoadingController, MenuController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DesiredProductsService } from 'src/app/providers/desired-products.service';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { VisitInterface } from 'src/app/models/visitInterface';
import { constants } from 'src/environments/constants';
const { Toast } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  infiniteEvent;
  loading;
  start = 0;
  limit = 12;
  finish = false;
  id: any;
  selector = 'all';
  productList = [];
  categoryList: any = [];
  subCategoryList;
  search = '';
  statusProduct = '';
  currentTax = 0.19;
  detailOrder = {
    subtotal: 0,
    tax: 0,
    total: 0
  };

  timeStoped = 0;
  intervalTimeStoped: any = null;
  price: string;
  quantity: string;

  userId;
  userType;
  priceRateId: number = 1;

  visit: VisitInterface;

  constructor(
    public api: ApiService,
    private router: Router,
    public desiredProduct: DesiredProductsService,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { 
    this.userId = localStorage.getItem('userId');
    this.userType = localStorage.getItem('userType');
  }

  showDetail(product) {
    this.router.navigate(['pre-view', product]);
  }

  ngOnInit() {
    this.api.nameSelector = 'Todos';
    // si no existe precio de moneda se debe buscar
    if (!localStorage.getItem('price_rate')) {
      // si no existe un id del precio de la moneda se debe buscar
      if (!localStorage.getItem('priceRateId')) {
        // si el usuario es customer se busca el currency que le corresponda
        if (Number(this.userType) === constants.USER_TYPE.CUSTOMER) {
          this.getPriceRateId();
        } else {
          // si el usuario es vendedor se asigna pesos por defecto
          localStorage.setItem('priceRateId', '1');
          this.priceRateId = 1;
          this.loadPriceRate();
        }
      } else {
        this.priceRateId = Number(localStorage.getItem('priceRateId'));
        this.loadPriceRate();
      }
    } else {
      // si existe precio de moneda se cargan los elementos de categorias y productos
      this.loadElements();
    }

    this.calculateTotalOrder();
  }

  getPriceRateId() {
    this.api.getPriceRateId(this.userId).subscribe((data: any) => {
      localStorage.setItem('priceRateId', data.currencyId);
      this.priceRateId = data.currencyId;
      this.loadPriceRate();
    });
  }

  loadElements() {  
    this.loadCategories();
    this.loadSubCategories();
    this.loadProducts('all', null);
    if (localStorage.getItem('desiredProducts')) {
      this.desiredProduct.desiredProducts = JSON.parse(localStorage.getItem('desiredProducts'));
      this.desiredProduct.desiredProductsIds = JSON.parse(localStorage.getItem('desiredProductsIds'));
    }
  }

  loadPriceRate() {
    console.log('precio con ', this.priceRateId);
    this.api.getPriceRate(this.priceRateId).subscribe((data: any) => {
      localStorage.setItem('price_rate', data.value);
      this.loadElements();
    });
  }


  /**
   * inicia timer para busqueda evitando exeso de consultas a bd
   */
  startTimer() {
    if (this.intervalTimeStoped !== null) {
      clearInterval(this.intervalTimeStoped);
    }
    let THIS = this;
    this.intervalTimeStoped = setInterval(function () {
      THIS.timeStoped++;
      //pregunta si lleva un segundo sin teclear nada antes de empezar a buscar
      if (THIS.timeStoped >= 1) {
        clearInterval(THIS.intervalTimeStoped);
        THIS.start = 0;
        THIS.productList = [];
        THIS.finish = false;
        if (THIS.search === '') {
          THIS.loadProducts('all', null);
        } else {
          THIS.loadProducts("search", THIS.search);
        }
      }
    }, 1000);
  }

  /**
   * carga la lista de categorías
   */
  loadCategories() {
    let userId = this.userId;
    if (Number(this.userType) === constants.USER_TYPE.SELLER) {
      // id 0 significa que es un seller
      userId = 0;
    }
    this.api.getCategories(userId).subscribe((data: any) => {
      if (data.error) {
        this.alertUserBlocked();
      } else {
        this.categoryList = data;
      }
    });
  }

  /**
   * carga la lista de sub categorías
   */
  loadSubCategories() {
    this.api.getSubCategories().subscribe(data => {
      this.subCategoryList = data;
      this.orderingCategories();
    });
  }

  /**
   * ordena las sub categroías dentro de las categorías correspondientes
   */
  orderingCategories() {
    for (let categoryId in this.categoryList) {
      if (this.categoryList.hasOwnProperty(categoryId)) {
        this.categoryList[categoryId].subs = [];
        for (let subCategoryId in this.subCategoryList) {
          if (this.subCategoryList.hasOwnProperty(subCategoryId) &&
            this.categoryList[categoryId].cat_id === this.subCategoryList[subCategoryId].cat_id) {
            this.categoryList[categoryId].subs.push(this.subCategoryList[subCategoryId]);
          }
        }
      }
    }
  }

  /**
   * carga productos según la categoría o sub categoría seleccionada
   * desde la vista lateral de categorías y sub categorías
   * @param selector: all, category, subCategory
   * @param id: id de sub categoría o sub categoría
   * @param filterName: nombre para mostrar en la cabecera de la app
   */
  loadProductsFromFilter(selector, id, filterName) {
    this.api.nameSelector = filterName;
    this.start = 0;
    this.productList = [];
    this.loadCategories();
    this.loadSubCategories();
    this.finish = false;
    this.loadProducts(selector, id);
  }

  /**
   * carga los productos segun parametros enviados
   * @param selector: all, category, subCategory
   * @param id: id de sub categoría o sub categoría
   */
  loadProducts(selector, id) {
    this.selector = selector;
    this.id = id;
    const priceRate = localStorage.getItem('price_rate');
    this.api.getProducts(selector, id, this.start, this.statusProduct, priceRate).subscribe((data: any) => {
      this.productList = this.productList.concat(data);
      if (data.length === this.limit) {
        this.start += this.limit; 
        if (this.infiniteEvent) {
          this.infiniteEvent.target.complete();
        }
      } else {
        this.finish = true;
        if (this.infiniteEvent) {
          this.infiniteEvent.disabled = true;
        }
      }
    });
    if (selector !== 'search') {
      this.menuCtrl.close().then();
    }
  }

  /**
   * compara el tiempo que lleva el input de busqueda sin ser modificado para hacer peticion a base de datos
   */
  getItems() {
    this.timeStoped = 0;
    this.startTimer();
  }

  /**
   * re inicia la busqueda de productos al dar click en cancelar busqueda
   */
  onCancel() {
    this.start = 0;
    this.finish = false;
    this.productList = [];
    this.loadProducts('all', null);
  }

  /**
   * muestra los menu laterales según el que se cliquee,
   * @param toggleName
   */
  toggleSideMenu(toggleName) {
    this.menuCtrl.enable(true, toggleName);
    this.menuCtrl.open(toggleName);
  }

  doInfinite(infiniteScroll) {
    this.infiniteEvent = infiniteScroll;
    if (!this.finish) {
      this.loadProducts(this.selector, this.id);
    } else {
      infiniteScroll.target.disabled = true;
    }
  }

  /**
   * borra productos de la lista de deseados desde la lista lateral.
   * @param product
   * @param all
   */
  async deleteDesired(product, all) {
    let msg = '¿Realmente desea borrar el producto?';
    if (all) {
      msg = '¿Realmente desea borrar todos los productos?';
    }
    let alert = await this.alertCtrl.create({
      header: 'Atención',
      message: msg,
      buttons: [{
        text: 'Cancelar'
      }, {
        text: 'Aceptar',
        handler: () => {
          if (!all) {
            this.desiredProduct.iLike(product).then(() => {
              this.calculateTotalOrder();
            });
          } else {
            this.clearCar();
          }
        }
      }]
    });
    await alert.present();
  }

  async alertUserBlocked() {
    let alert = await this.alertCtrl.create({
      header: 'Atención',
      message: 'Usuario temporalmente inhabilidato',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
            this.clearCar();
            this.logoutUser();
        }
      }]
    });
    await alert.present();
  }

  async alertCustomerRequired() {
    let alert = await this.alertCtrl.create({
      header: 'Atención',
      message: 'Debe Estar realizando una visita para enviar el pedido',
      buttons: [{
        text: 'Cancelar'
      }, {
        text: 'Aceptar',
        handler: () => {
          this.router.navigate(['customer-visit']);
        }
      }]
    });
    await alert.present();
  }

  logoutUser() {
    // limpia las variables del local storage
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('desiredProducts');
    localStorage.removeItem('desiredProductsIds');
    localStorage.removeItem('priceRateId');
    localStorage.removeItem('price_rate');
    this.router.navigate(['login']);
  }

  clearCar() {
    this.desiredProduct.desiredProducts = [];
    this.desiredProduct.desiredProductsIds = [];
    this.calculateTotalOrder();
  }

  /**
   * pone o quita productos en la lista de deseados
   */
  iLike(product) {
    this.desiredProduct.iLike(product).then(() => {
      this.calculateTotalOrder();
    });
  }

  filterStatus() {
    this.loadProductsFromFilter(this.selector, this.id, this.api.nameSelector);
  }

  calculateTotalOrder() {
    this.detailOrder.subtotal = 0;
    this.desiredProduct.desiredProducts.forEach((product: any) => {
      this.detailOrder.subtotal += (product.price * product.quantity);
    });
    this.detailOrder.tax = this.detailOrder.subtotal * this.currentTax;
    this.detailOrder.total = this.detailOrder.subtotal + this.detailOrder.tax;
    localStorage.setItem('desiredProducts', JSON.stringify(this.desiredProduct.desiredProducts));
    localStorage.setItem('desiredProductsIds', JSON.stringify(this.desiredProduct.desiredProductsIds));
  }

  sendOrder() {
    this.visit = JSON.parse(localStorage.getItem(constants.CUSTOMER_VISIT));
    let userId = this.userId;
    if (Number(this.userType) === constants.USER_TYPE.SELLER) {
      if (this.visit) {
        userId = this.visit.visitCustomerId;
        this.finishSendOrder(userId);
      } else {
        // muestra mensaje de que es necesario estar en una visita
        this.alertCustomerRequired();
      }
    } else {
      this.finishSendOrder(userId);
    }
  }

  finishSendOrder(userId) {
    this.presentLoading();
    if (this.desiredProduct.desiredProducts.length > 0) {
      let productOrder = [];
      this.desiredProduct.desiredProducts.forEach(product => {
        productOrder.push({
          quantity: product.quantity,
          reference: product.prod_name,
          description: product.prod_descriptions,
          unitValue: product.price,
          customerId: userId,
          prodId: product.prod_id
        });
      });
      this.api.sendOrder(productOrder).subscribe(() => {
        // si existe una visita a cliente se le asigna el valor de la venta.
        if (this.visit) {
          this.visit.visitTotalSale = this.detailOrder.total;
          this.visit.visitHasSale = constants.VISIT_HAS_SALE.TRUE;
          localStorage.setItem(constants.CUSTOMER_VISIT, JSON.stringify(this.visit));
        }
        this.loading.dismiss();
        this.toastSuccess();
        this.clearCar();
        this.menuCtrl.close().then();      
      }, () => {
        this.loading.dismiss();
        this.alertNoConnection();
      });
    } else {
      this.showAlertNoProducts();
    }
  }

  async showAlertNoProducts() {
    let alert = await this.alertCtrl.create({
      header: 'Atención',
      message: 'No se puede enviar un pedido sin productos',
      buttons: [{
        text: 'Aceptar',
      }]
    });
    await alert.present();
  }

  less(product) {
    if (product.quantity > 1) {
      product.quantity = product.quantity - 1;
      this.calculateTotalOrder();
    }
  }

  plus(product) {
    product.quantity = Number(product.quantity) + 1;
    this.calculateTotalOrder();
  }

  toastSuccess() {
    Toast.show({
      text: 'Pedido enviado Exitosamente!!',
      duration: 'long',
      position: 'center'
    });
  }

  async alertNoConnection() {
    let alert = await this.alertCtrl.create({
      header: 'Atención',
      message: 'No se pudo enviar su pedido. Por favor intente de nuevo.',
      buttons: [{
        text: 'Aceptar',
      }]
    });
    await alert.present().then();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Enviando. Por favor espere...'
    });
    await this.loading.present();
  }

  async selectCurrency() {
    let alert = await this.alertCtrl.create({
      header: 'Moneda',
      message: 'Por favor seleccione su moneda',
      buttons: [{
        text: 'COP',
        handler: () => {
          this.priceRateId = 1;
          this.changeCurrency();
        }
      }, {
        text: 'USD',
        handler: () => {
          this.priceRateId = 2;
          this.changeCurrency();
        }
      }, {
        text: 'Cancelar'
      }]
    });
    await alert.present();
  }

  changeCurrency() {
    this.start = 0;
    this.productList = [];
    this.finish = false;
    this.loadPriceRate();
  }
}
