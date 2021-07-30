import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import {AngularFirestore, DocumentSnapshot} from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import {UserModel} from "../../../models/user.model";
import firebase from "firebase/app";
import {CommonService, MESSAGES} from "../../../services/common.service";
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
    private commonSrv : CommonService,
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
        this.commonSrv.handleDisplayMessage(err.message)
      });
  }

  async googleLogin() {
    let provider = new firebase.auth.GoogleAuthProvider();
    const credentials = await this.fsAuth.signInWithPopup(provider);
    this.fsStore.collection('users').doc(`${credentials.user.uid}`)
      .get().subscribe( (result : DocumentSnapshot<UserModel>)=> {

        if(result.data()) {
          console.log('User already in the db')
          this.getUserDataFromFirebase(credentials.user.uid)
        }

        else {
          console.log('user not in the db')
          let signUpValues: UserModel = {
            username: credentials.user.displayName,
            email: credentials.user.email,
            isNewUser: true,
            userUID: credentials.user.uid
          };
          this.fsStore
            .collection('users')
            .doc(`${credentials.user.uid}`)
            .set(signUpValues)
            .then((value) => {
              this.getUserDataFromFirebase(credentials.user.uid)
            });

        }
    })
  }

  getUserDataFromFirebase(uid){
    this.authSrv.getUserDataFromFirebase(uid).then(
      () => {
        this.router.navigate(['./home/feed'])
      }
    )
  }
}
