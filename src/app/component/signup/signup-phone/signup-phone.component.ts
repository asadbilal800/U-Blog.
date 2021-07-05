import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WindowService} from "../../../services/window.service";
import firebase from "firebase";
import {AngularFirestore} from "@angular/fire/firestore";

@Component({
  selector: 'app-signup-phone',
  templateUrl: './signup-phone.component.html',
  styleUrls: ['./signup-phone.component.css']
})
export class SignupPhoneComponent implements OnInit {

  @ViewChild('phoneNumber') phone : ElementRef;
  localwinReference : any;
  recaptchaHide = true;

  displayMessage;
  successSmsMessage = 'A code has been sent to your Phone!'
  successMessage = 'User has been made successfully!'


  constructor(private winRefSrv : WindowService,private fireStore : AngularFirestore) {
    this.localwinReference = this.winRefSrv.windowRef

  }

  ngOnInit(): void {


    //recaptha implementation for phone number authentication.

    this.localwinReference.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'normal',
      'callback': (response) => {
        // when checking the box of captcha.
        this.sendSmsCode();
      },

    });
    //render captcha on main page.
    this.localwinReference.recaptchaVerifier.render();

  }


  sendSmsCode() {

    //displays the input and send code button.
    this.recaptchaHide = !this.recaptchaHide;

    let phone = this.phone.nativeElement.value;
    firebase.auth().signInWithPhoneNumber(phone, this.localwinReference.recaptchaVerifier)

      .then((confirmationResult) => {
        this.displayMessage = this.successSmsMessage
        this.localwinReference.confirmationResult = confirmationResult;

      }).catch((error) => {
      this.displayMessage = error.message;
    });
  }




  verify(code) {
    this.localwinReference.confirmationResult.confirm(code).then((result)=> {
      this.fireStore.collection('users').doc(`${result.user.uid}`).set(result.user)

        .then((value) => {
        this.displayMessage = this.successMessage;

      })})

      .catch(
      ((error) => {
        this.displayMessage = error.message;
      })
    )
  }



}
