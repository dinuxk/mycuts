import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { MapPage } from '../pages/map/map';
import { LoginPage } from '../pages/login/login';

@Component({
  selector : 'myappPage',
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  Name: any;
  photourl:any;
  rootPage: any = MapPage;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,public menu: MenuController) {
    this.initializeApp();
    this.loginSessions();
    this.pages = [
      { title: 'Login SignUp', component: LoginPage },
      { title: 'Home', component: HelloIonicPage },
      { title: 'Discovery', component: ListPage },
      { title: 'MapPage', component: MapPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
    
  }
  loginSessions(){
  this.Name = localStorage.getItem('name');
  this.photourl = localStorage.getItem('photo');
  }
}
