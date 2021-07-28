import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import {AngularFirestore, DocumentSnapshot} from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import {UserModel} from "../../../models/user.model";
import firebase from "firebase/app";
import {MESSAGES} from "../../../services/common.service";
import {NgxSpinnerService} from "ngx-spinner";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent  {
  @ViewChild('form') myForm: NgForm;
  requiredMessage = MESSAGES.REQUIRED;
  emailFormat = MESSAGES.EMAIL_BAD_FORMAT


  constructor(
    private fsAuth: AngularFireAuth,
    private authSrv: AuthService,
    private router: Router,
    private fsStore: AngularFirestore,
    private snackBar: MatSnackBar,
    private spinner : NgxSpinnerService
  ) {}

  login() {
    let username = this.myForm.value.username;
    let password = this.myForm.value.password;

    this.fsAuth
      .signInWithEmailAndPassword(username, password)
      .then((value) => {
            this.authSrv.getUserDataFromFirebase(value.user.uid).then(
              () => {
                this.router.navigate(['./home/feed'])
              }
            )
      })
      .catch((err) => {
        this.snackBar.open(err.message, 'X', {
          duration: 8000,
          verticalPosition: 'top',
        });
      });
  }

  async differentLogin() {
    let provider = new firebase.auth.GoogleAuthProvider();
    const credentials = await this.fsAuth.signInWithPopup(provider);
    this.spinner.show('mainScreenSpinner')
    this.fsStore.collection('users').doc(`${credentials.user.uid}`)
      .get().subscribe( (result : DocumentSnapshot<UserModel>)=> {
        if(result) {
          console.log('User already in the db')
          this.authSrv.getUserDataFromFirebase(result.data().userUID).then(
            () => {
              this.spinner.hide('mainScreenSpinner')
              this.router.navigate(['./home/feed'])
            }
          )
        }
        else {
          console.log('user not in the db')
          let signUpValues: UserModel = {
            username: credentials.user.displayName,
            email: credentials.user.email,
            isNewUser: true,
          };

          this.fsStore
            .collection('users')
            .doc(`${credentials.user.uid}`)
            .set(signUpValues)
            .then((value) => {
              this.authSrv.getUserDataFromFirebase(result.data().userUID).then(
                () => {
                  this.spinner.hide('mainScreenSpinner')
                  this.router.navigate(['./home/feed'])
                }
              )
            });

        }
    })




  }
}
