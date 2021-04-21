import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Gesture, GestureController, IonSlides, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';
import { DesiredProductsService } from 'src/app/providers/desired-products.service';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';

@Component({
  selector: 'app-pre-view',
  templateUrl: './pre-view.page.html',
  styleUrls: ['./pre-view.page.scss'],
})
export class PreViewPage implements OnInit, AfterViewInit {
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild('imageSwipe') imageSwipe: ElementRef;
  
  start = 0;
  limit = 12;
  iLikeItem: any = false;
  currentProduct: any = {
    cat_id: 0,
    prod_id: 0,
    prod_name: '',
    prod_descriptions: '',
    image: ''
  };
  productsCategory: any = [];
  imagesProduct;
  slidePosition = 0;
  slideOptions: any;
  principalSlideOptions: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private zone: NgZone,
    private gestureCtrl: GestureController,
    private api: ApiService,
    public desiredProduct: DesiredProductsService,
    public modalController: ModalController
  ) { 
    this.slideOptions = {
      slidesPerView: 4,
      centeredSlides: true,
      zoom: false
    }
  }

  async openViewer(src) {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src: src
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });
 
    return await modal.present();
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: any) => {
      this.currentProduct = params;
    });
    this.productsCategory = [];
    this.checkLiked();
    this.getProductsCategory();
    this.getImagesProduct();
    setTimeout(() => {
      this.zone.run(() => {
        this.checkPositionSlide();
      })
    }, 500);
  }

  ngAfterViewInit() {
    const gesture: Gesture = this.gestureCtrl.create({
        el: this.imageSwipe.nativeElement,
        gestureName: 'swipe',
        onStart: ev => this.swipeEvent(ev),
      });
    gesture.enable(true);
  }

  swipeEvent(event) {
    let moveSlide = false;
    if (event.direction === 2) {
      if (this.slidePosition < this.productsCategory.length - 1) {
        this.slidePosition += 1;
        moveSlide = true;
      }
    }
    if (event.direction === 4 && this.slidePosition > 0) {
      this.slidePosition -= 1;
      moveSlide = true;
    }
    if (moveSlide) {
      this.changeProduct(this.productsCategory[this.slidePosition], false);
      this.slides.slideTo(this.slidePosition, 500);
    }
  }

  /**
   * obtiene todos los productos de la categoria a la que pertenece el producto seleccionado
   */
  getProductsCategory() {
    const priceRate = localStorage.getItem('price_rate');
    this.api.getProducts('category', this.currentProduct.cat_id, this.start, '', priceRate).subscribe((data: any) => {
      if (data.length > 0) {
        this.productsCategory = this.productsCategory.concat(data);
        this.start += this.limit;
        if (data.length == this.limit) {
          this.getProductsCategory();
        }
      }
    });
  }

  /**
   * obtiene todas las imagenes del prducto seleccionado (un producto puede tener muchas imagenes)
   */
  getImagesProduct() {
    this.api.getImagesProduct(this.currentProduct.prod_id).subscribe(data => {
      this.imagesProduct = data;
    });
  }

  /**
   * cambia el producto que se está mostrando por el que se cliquea
   * @param product
   */
  changeProduct(product, getPosition) {
    this.currentProduct = product;
    this.checkLiked();
    this.getImagesProduct();
    if (getPosition) {
      this.checkPositionSlide();
    }
  }

  /**
   * cambia la imagen del producto por otra otra seleccionada.
   * @param img
   */
  changeImage(img) {
    this.currentProduct.image = img;
  }

  /**
   * pone o quita productos en la lista de deseados
   */
  iLike() {
    this.desiredProduct.iLike(this.currentProduct).then(response => {
      this.iLikeItem = response;
    });
  }

  /**
   * al seleccionar un producto se verifica si este esta seleccionado como deseado.
   */
  checkLiked() {
    this.desiredProduct.checkProduct(this.currentProduct.prod_id).then(response => {
      this.iLikeItem = response;
    });
  }

  /**
   * hace scroll en el slide hasta la imagen seleccionada desde el home
   */
   checkPositionSlide() {
    for (let i in this.productsCategory) {
      if (Number(this.currentProduct.prod_id) === Number(this.productsCategory[i].prod_id)) {
        this.slidePosition = Number(i);
        this.slides.slideTo(this.slidePosition, 500);
        break;
      }
    }
  }

  /**
   * carga la imagen activa del slide en la vista previa de imagenes
   */
  async slideChanged() {
    this.slidePosition = await this.slides.getActiveIndex();
    if (this.productsCategory.hasOwnProperty(this.slidePosition)) {
      this.changeProduct(this.productsCategory[this.slidePosition], false);
    }
  }
}