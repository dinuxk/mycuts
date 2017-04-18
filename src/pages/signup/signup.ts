import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';



import { MainPage } from '../../pages/pages';

/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  segment: string;
  email: string;
  password: string;
  fName: string;
  lName: string;
  round: boolean;
  expand: boolean;
  showSpinner: boolean;
  spinnerColor: string;

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController) {

    this.segment = "signIn";
    this.showSpinner = false;
    this.spinnerColor = 'light';
  }


}
