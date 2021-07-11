import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { loginModel } from '../../models/login.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  firebaseToken: Subscription;
  @ViewChild('form') myForm: NgForm;

  constructor(
    private firestoreAuth: AngularFireAuth,
    private authSrv: AuthService,
    private router: Router,
    private fireStore: AngularFirestore,
    private snackBar: MatSnackBar
  ) {}

  login() {
    let username = this.myForm.value.username;
    let password = this.myForm.value.password;

    this.firestoreAuth
      .signInWithEmailAndPassword(username, password)
      .then((value) => {
        this.firestoreAuth.user.subscribe((user) => {
          this.authSrv.userUIDObsvr.next(user.uid);
          this.authSrv.getUserCredInfoFromDb(user.uid);
        });
        this.firebaseToken = this.firestoreAuth.idToken.subscribe((token) => {
          this.authSrv.userToken.next(token);
          this.router.navigate(['/home/feed']);
        });
      })
      .catch((err) => {
        this.snackBar.open(err.message, 'X', {
          duration: 8000,
          verticalPosition: 'top',
        });
      });
  }

  ngOnDestroy() {
    if (this.firebaseToken) {
      this.firebaseToken.unsubscribe();
    }
  }

  async differentLogin(socialMedia) {
    let provider;
    if (socialMedia === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
    } else {
      provider = new firebase.auth.TwitterAuthProvider();
    }
    const credentials = await this.firestoreAuth.signInWithPopup(provider);
    let signUpValues: loginModel = {
      username: credentials.user.displayName,
      email: credentials.user.email,
    };

    this.fireStore
      .collection('users')
      .doc(`${credentials.user.uid}`)
      .set(signUpValues)
      .then((value) => {});
  }
}
