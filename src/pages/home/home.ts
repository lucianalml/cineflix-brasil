import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetalhePage } from '../detalhe/detalhe';

// import { DetalhePage } from '../detalhe/detalhe'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  detalhePage = DetalhePage;

  constructor(public navCtrl: NavController) {

  }

  onGoToDetalhe(){
    this.navCtrl.push(DetalhePage);
  }

}
