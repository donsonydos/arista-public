import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.page.html',
  styleUrls: ['./zoom.page.scss'],
})
export class ZoomPage implements OnInit {

  public imageSrc: string;
  constructor(private modalController: ModalController,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((data: any) => {
      this.imageSrc = data.src;
      this.openViewer(this.imageSrc);
    });
  }

  async openViewer(src: string) {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });
 
    return await modal.present();
  }

}
