import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from '../../../models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import {CommonService, MESSAGES} from '../../../services/common.service';
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
    private commonSrv : CommonService
  ) {}


  signup() {

    this.spinner.show('mainScreenSpinner')
    let email = this.myForm.value.email;
    let password = this.myForm.value.password;
    let username = this.myForm.value.username;

    //after singing/logging in,'data' gives 3 important things..uid,displayName and email.

    this.fsAuth
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        let signUpValues: UserModel = {
          username: username,
          email: email,
          password: password,
          isNewUser: true,
          userUID: data.user.uid,
          newNotficationCount : 0,
          notifications : [],
          bookmarks : [],
          displayImage: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
        };

          this.fsStore
            .collection('users')
            .doc(`${data.user.uid}`)
            .set(signUpValues)
            .then((value) => {
              this.spinner.hide('mainScreenSpinner')
              this.commonSrv.handleDisplayMessage(MESSAGES.SUCCESS_MESSAGE)
            });
      })
      .catch((error) => {
        this.spinner.hide('mainScreenSpinner')
        this.commonSrv.handleDisplayMessage(error.message)
      });

    this.myForm.resetForm();
    this.fsAuth.signOut().then(()=> {});
  }

}
