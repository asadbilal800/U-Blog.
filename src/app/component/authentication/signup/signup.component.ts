import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SignUpModel } from '../../../models/sign-up.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MESSAGES} from '../../../services/common.service';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  @ViewChild('form') myForm: NgForm;
  requiredMessage = MESSAGES.REQUIRED
  emailFormat = MESSAGES.EMAIL_BAD_FORMAT


  constructor(
    private fsStore: AngularFirestore,
    private fsAuth: AngularFireAuth,
    private snackBar: MatSnackBar,
    private spinner : NgxSpinnerService,
  ) {}


  signup() {

    this.spinner.show('mainScreenSpinner')
    let email = this.myForm.value.email;
    let password = this.myForm.value.password;
    let username = this.myForm.value.username;

    let signUpValues: SignUpModel = {
      username: username,
      email: email,
      password: password,
      isNewUser: true,
    };

    //after singing/logging in,'data' gives 3 important things..uid,displayName and email.

    this.fsAuth
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {


          this.fsStore
            .collection('users')
            .doc(`${data.user.uid}`)
            .set(signUpValues)
            .then((value) => {
              this.spinner.hide('mainScreenSpinner')
              this.snackBar.open(MESSAGES.SUCCESS_MESSAGE, 'X', {
                duration: 8000,
                verticalPosition: 'top',
              });

            });


      })
      .catch((error) => {
        this.spinner.hide('mainScreenSpinner')
        this.snackBar.open(error.message, 'X', {
          duration: 8000,
          verticalPosition: 'top',
        });
      });

    this.myForm.resetForm();
    this.fsAuth.signOut().then(()=> {});
  }
}
