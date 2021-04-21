import { ApiService } from 'src/app/providers/api.service';
import { Component, OnInit } from '@angular/core';
import { GeneralFunctionsService } from 'src/app/providers/general-functions.service';
import { VisitInterface } from 'src/app/models/visitInterface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.page.html',
  styleUrls: ['./visit-list.page.scss'],
})
export class VisitListPage {
  public dateList = {
    filterDate: this.generalFunctions.getCurrentDate()
  };
  
  public totalTime = '';

  public monthShortNames = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  constructor(
    private api: ApiService,
    private generalFunctions: GeneralFunctionsService,
    private router: Router
  ) { }

  public visitList: VisitInterface[] = [];

  ionViewDidEnter() {
    this.api.getSellerVisit(this.dateList.filterDate).subscribe((responseVisitSeller: VisitInterface[]) => {
      this.visitList = responseVisitSeller;
      this.getTotalTime();
    });
  }

  newVisit() {
    this.router.navigate(['customer-visit']);
  }

  getTotalTime() {
    let total = 0;
    for (const visit of this.visitList) {
      total += Number(visit.visitSpendTime);
    }
    this.totalTime = this.generalFunctions.msToTime(total);
  }

  /** parte de navegacion */
  goVisit() {
    console.info('estoy aqui');
  }
  goOrders() {
    this.router.navigate(['customer-orders']);
  }

  goCatalog() {
    this.router.navigate(['home']);
  }

  goToLocalizate() {
    this.router.navigate(['customer-location']);
  }

}
