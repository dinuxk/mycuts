import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {AngularFireModule} from 'angularfire2';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { MapPage } from '../pages/map/map';
import { LoginPage } from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
 const angConfig = {
    apiKey: "AIzaSyAfOs2AF6WpyxmaakMJDbtXKZYy80wfvL0",
    authDomain: "my-app-93a5a.firebaseapp.com",
    databaseURL: "https://my-app-93a5a.firebaseio.com",
    projectId: "my-app-93a5a",
    storageBucket: "my-app-93a5a.appspot.com",
    messagingSenderId: "287620851093"
  };

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    MapPage,
    LoginPage,
    SignupPage
  ],
  imports: [
    IonicModule.forRoot(MyApp,{
      mode: 'ios'
    }),
    AngularFireModule.initializeApp(angConfig)
  ],
  bootstrap: [IonicApp],
  
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    MapPage,
    LoginPage,
    SignupPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
