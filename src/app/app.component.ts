import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SobrePage } from '../pages/sobre/sobre';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;
  sobrePage = SobrePage;

  @ViewChild('nav') nav: NavController;

  constructor(private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      splashScreen.show();

      setTimeout(() => {
        splashScreen.hide();
      }, 5000);
    });
  }

  sobrePageOpened() {
    if (this.nav.getActive() )
      return this.nav.getActive().name == 'SobrePage';
    else {
      return false;
    }
  }

  goToSobre(){
    this.nav.push(SobrePage);
  }
}

