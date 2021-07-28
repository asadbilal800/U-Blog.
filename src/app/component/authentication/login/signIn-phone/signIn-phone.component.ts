import { Component, OnInit, } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
import { AngularFirestore } from '@angular/fire/firestore';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MESSAGES} from "../../../../services/common.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {UserModel} from "../../../../models/user.model";
import {NgxSpinnerService} from "ngx-spinner";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup-phone',
  templateUrl: './signIn-phone.component.html',
  styleUrls: ['./signIn-phone.component.css'],
})
export class SignInPhoneComponent implements OnInit {
  localwinReference: any;
  captchaVisible = false;
  captchaCheck: boolean = false;
  private phoneNumber;

  constructor(
    private fsStore: AngularFirestore,
    private snackBar : MatSnackBar,
    private fsAuth : AngularFireAuth,
    private spinner : NgxSpinnerService,
    private authSrv : AuthService,
    private router : Router
  ) {
    this.localwinReference = window;
  }

  ngOnInit(): void {
    //recaptcha implementation for phone number authentication.

    this.localwinReference.recaptchaVerifier =
      new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'normal',
        callback: (response) => {
          this.captchaCheck = true
        },
      });
    this.localwinReference.recaptchaVerifier.render();
  }

  sendSmsCode(number) {
    if(this.captchaCheck) {
      this.phoneNumber = '+92'
      this.phoneNumber = this.phoneNumber.concat(number)

      firebase.auth()
      .signInWithPhoneNumber(this.phoneNumber, this.localwinReference.recaptchaVerifier)
      .then((confirmationResult) => {
        this.captchaVisible = true
        this.handleDisplayMessage(MESSAGES.SUCCESS_SMS_MESSAGE)
        this.localwinReference.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        this.handleDisplayMessage(error.message)
      });
    }
    else {
      this.handleDisplayMessage(MESSAGES.TICK_MESSAGE)
    }

  }

  verify(code) {
    this.spinner.show('mainScreenSpinner')
    this.localwinReference.confirmationResult
      .confirm(String(code))
      .then((result) => {
        this.fsStore.collection('users').doc(`${result.user.uid}`)
          .get().subscribe( (userData)=> {
          if(userData.data()) {
            console.log('User already in the db')
            this.authSrv.getUserDataFromFirebase(result.user.uid);
              this.spinner.hide('mainScreenSpinner')
              this.router.navigate(['/home/feed']);
          }
          else {
            console.log('user not in the db')
            let signUpValues: UserModel = {
              username: result.user.displayName,
              isNewUser: true,
            };

            this.fsStore
              .collection('users')
              .doc(`${result.user.uid}`)
              .set(signUpValues)
              .then((value) => {
                this.authSrv.getUserDataFromFirebase(result.user.uid);
                  this.spinner.hide('mainScreenSpinner')
                  this.router.navigate(['/home/feed']);
              });

          }
        })
      })
      .catch((error) => {
        this.spinner.hide('mainScreenSpinner')
        this.handleDisplayMessage(error.message)
      });
    this.captchaCheck = false
    this.fsAuth.signOut().then(()=> null)

  }

  handleDisplayMessage(message : string){
    this.snackBar.open(message,'X',{
      verticalPosition: 'top',
      duration  :8000
    })
  }

}
