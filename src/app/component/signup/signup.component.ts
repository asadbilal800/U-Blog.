import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SignUpModel } from '../../models/sign-up.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MESSAGES } from '../../services/common.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  @ViewChild('form') myForm: NgForm;

  constructor(
    private fsStore: AngularFirestore,
    private authFs: AngularFireAuth,
    private snackBar: MatSnackBar
  ) {}

  signup() {
    let email = this.myForm.value.eph;
    let password = this.myForm.value.password;

    let signUpValues: SignUpModel = {
      username: this.myForm.value.username,
      email: this.myForm.value.eph,
      password: this.myForm.value.password,
      userUID: '',
      displayImage: '',
      subscriptions: [],
      bookmarks: [],
      isNewUser: true,
      bio: '',
    };

    this.authFs
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        this.fsStore
          .collection('users')
          .doc(`${data.user.uid}`)
          .set(signUpValues)
          .then((value) => {
            this.snackBar.open(MESSAGES.SUCCESS_MESSAGE, 'X', {
              duration: 8000,
              verticalPosition: 'top',
            });
          });
      })
      .catch((error) => {
        this.snackBar.open(error.message, 'X', {
          duration: 8000,
          verticalPosition: 'top',
        });
      });
  }
}
