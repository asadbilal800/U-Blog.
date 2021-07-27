import { Component, OnInit, } from '@angular/core';
import { WindowService } from '../../../../services/window.service';
import firebase from 'firebase/app'
import 'firebase/auth'
import { AngularFirestore } from '@angular/fire/firestore';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MESSAGES} from "../../../../services/common.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {SignUpModel} from "../../../../models/sign-up.model";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-signup-phone',
  templateUrl: './signup-phone.component.html',
  styleUrls: ['./signup-phone.component.css'],
})
export class SignupPhoneComponent implements OnInit {
  localwinReference: any;
  captchaVisible = false;
  captchaCheck: boolean = false;
  private phoneNumber;

  constructor(
    private winRefSrv: WindowService,
    private fireStore: AngularFirestore,
    private snackBar : MatSnackBar,
    private fsAuth : AngularFireAuth,
    private spinner : NgxSpinnerService
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
        let signUpUser: SignUpModel = {
          username: this.phoneNumber,
          isNewUser: true,
        };

        this.fireStore
          .collection('users')
          .doc(`${result.user.uid}`)
          .set(signUpUser)
          .then((value) => {
            this.spinner.hide('mainScreenSpinner')
            this.handleDisplayMessage(MESSAGES.SUCCESS_MESSAGE)
          });

      })
      .catch((error) => {
        this.handleDisplayMessage(error.message)
      });
    this.fsAuth.signOut().then(()=> null)

  }

  handleDisplayMessage(message : string){
    this.snackBar.open(message,'X',{
      verticalPosition: 'top',
      duration  :8000
    })
  }

}
