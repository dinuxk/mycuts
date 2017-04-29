import { Injectable } from '@angular/core';
import firebase from 'firebase';
/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {

public fireAuth: any;
public userData: any;

  constructor() {
      this.fireAuth = firebase.auth();
      this.userData = firebase.database().ref('/userData');
  }
  resetPassword(email: string): any {
  return this.fireAuth.sendPasswordResetEmail(email);
}
doLogout(): any {
  return this.fireAuth.signOut();
}
}
