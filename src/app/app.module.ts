import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {AngularFireModule} from 'angularfire2';
import { MapPage } from '../pages/map/map';
//import { AddlocationPage } from '../pages/addlocation/addlocation';

import { AuthService } from '../providers/auth-service';
//  const angConfig = {
//     apiKey: "AIzaSyAfOs2AF6WpyxmaakMJDbtXKZYy80wfvL0",
//     authDomain: "my-app-93a5a.firebaseapp.com",
//     databaseURL: "https://my-app-93a5a.firebaseio.com",
//     projectId: "my-app-93a5a",
//     storageBucket: "my-app-93a5a.appspot.com",
//     messagingSenderId: "287620851093"
//   };
export const firebaseConfig = {
     apiKey: "AIzaSyA0E4FcsLDLxGwTd6ipxI6YNphUc7YMYbw",
    authDomain: "mycutsapp.firebaseapp.com",
    databaseURL: "https://mycutsapp.firebaseio.com",
    projectId: "mycutsapp",
    storageBucket: "mycutsapp.appspot.com",
    messagingSenderId: "847774870172"
};

@NgModule({
  declarations: [
    MyApp,
    MapPage  
  ],
  imports: [
    IonicModule.forRoot(MyApp,{
      mode: 'ios'
    }),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  
  entryComponents: [
    MyApp,
    MapPage 
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},AuthService]
})
export class AppModule {}
