import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import {SignupPage} from '../signup/signup';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import {MyApp} from '../../app/app.component';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

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
  constructor(public navCtrl: NavController,public anfire : AngularFire,public alertCtrl: AlertController) {

    this.segment = "signIn";
    this.showSpinner = false;
    this.spinnerColor = 'light';
    
  }
  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Login Error!',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

 SignUp(){
    this.navCtrl.push(SignupPage);
 }
     login(){
       if(this.email == undefined || this.email==''){
          this.showAlert("Email cannot be empty");
       }
       else if(this.password =='' || this.password == undefined){
          this.showAlert("Password cannot be empty");
       }
       else{
      this.anfire.auth.login({
        email: this.email,
        password: this.password 
      },
      {
        provider:AuthProviders.Password,
        method: AuthMethods.Password 
      }).then((response)=>{
        console.log('You are sucessfully logged in '+ JSON.stringify(response));
        let currentuser = {
          email: response.auth.email,
          picture: response.auth.photoURL
        };
        window.localStorage.setItem('uid',response.auth.uid);
        window.localStorage.setItem('name',response.auth.email);
        window.localStorage.setItem('photo',response.auth.photoURL);
        console.log('photo');
        window.localStorage.setItem('currentuser',JSON.stringify(currentuser));
        this.navCtrl.push(MyApp);
      }).catch((error) => { 
        this.showAlert(error.message);
      })
       }
    }
    FBLogin(){
      this.anfire.auth.login({
        provider: AuthProviders.Facebook,
        method:AuthMethods.Popup
      }).then((Response)=>{
        console.log("Facebook Login Success");
      let currentuser = {
          email: Response.auth.email,
          picture: Response.auth.photoURL
        };
        window.localStorage.setItem('uid',Response.auth.uid);
        window.localStorage.setItem('name',Response.auth.displayName);
        window.localStorage.setItem('photo',Response.auth.photoURL);
        
        window.localStorage.setItem('currentuser',JSON.stringify(currentuser));
        this.navCtrl.push(MyApp);
      }).catch((error) => { 
        console.log(error);
      })
    }
    googleLogin(){
      this.anfire.auth.login({
        provider: AuthProviders.Google,
        method:AuthMethods.Popup
      }).then((Response)=>{
        console.log("Facebook Login Success");
      let currentuser = {
          email: Response.auth.email,
          picture: Response.auth.photoURL
        };
        window.localStorage.setItem('uid',Response.auth.uid);
        window.localStorage.setItem('name',Response.auth.displayName);
        window.localStorage.setItem('photo',Response.auth.photoURL);
        
        window.localStorage.setItem('currentuser',JSON.stringify(currentuser));
        this.navCtrl.push(MyApp);
      }).catch((error) => { 
        console.log(error);
      })
    }
      setClass() {
    let classes = {
      round: this.round,
      expand: this.expand
    };
    return classes;
  }
}


