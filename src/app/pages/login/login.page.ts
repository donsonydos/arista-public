import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/providers/api.service';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  registerCredentials = {
    user:'',
    password:''
  };
  loading;
  constructor(private api: ApiService, private router: Router, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  /**
   * se conecta con la api para verificar el logueo de un usario bien sea tipo vendedor o cliente
   */
   loginUser() {
    this.presentLoading();
    this.api.loginUser(this.registerCredentials).subscribe((responseLogin: any) => {

      // cierra el loading de logueo
      this.loading.dismiss();

      // si hay usuario se procesa la informacion
      if (responseLogin.length > 0) {

        // asigna el usuario a variable para usarse en condicionales que definen el comportamiento de la app
        const userType = responseLogin[0].userType;
        localStorage.setItem('userId', responseLogin[0].id);
        localStorage.setItem('userType', userType);
        localStorage.setItem('priceRateId', responseLogin[0].priceRateId);

        if (Number(userType) === 1) {
          // usuarios tipo cliente
          this.router.navigate(['home']);
        } else if (Number(userType) === 2) {
          // usuarios tipo vendedor
          this.router.navigate(['visit-list']);
        }
      } else {
        // si no hay usuario se muestra un mensaje informativo
        this.showAlert('Atención', 'Parece que el usuario no está registrado');
      }
    }, (error: any) => {
      console.error('error en conexion', error);
      this.loading.dismiss();
      this.showAlert('Atención', 'No se pudo establecer conexión con el servidor');
    });
  }

  /**
   * muestra un alerta con el mensaje personalizado
   * @param title
   * @param msg
   */
  async showAlert (title, msg) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: msg,
      buttons: [ {
        text: 'Ok',
      }]
    });
    await alert.present();
  }

  /**
   * muestra un loading al iniciar logueo
   */
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Logueando. Por favor espere...'
    });
    await this.loading.present();
  }

}
