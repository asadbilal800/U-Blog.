import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import {SignUpModel} from "../../../models/sign-up.model";

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
          localStorage.setItem('token', token);
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


    this.fireStore.collection('users').doc(`${credentials.user.uid}`)
      .get().subscribe( (result)=> {
        if(result.data()) {
          console.log('user already in the db')
          this.authSrv.userUIDObsvr.next(credentials.user.uid);
          this.authSrv.getUserCredInfoFromDb(credentials.user.uid);
          this.firebaseToken = this.firestoreAuth.idToken.subscribe((token) => {
            localStorage.setItem('token', token);
            this.authSrv.userToken.next(token);
            this.router.navigate(['/home/feed']);
          });
        }
        else {
          console.log('user not in the db')
          let signUpValues: SignUpModel = {
            username: credentials.user.displayName,
            email: credentials.user.email,
            userUID: '',
            displayImage: '',
            subscriptions: [],
            bookmarks: [],
            isNewUser: true,
            bio: '',
          };

          this.fireStore
            .collection('users')
            .doc(`${credentials.user.uid}`)
            .set(signUpValues)
            .then((value) => {});

        }
    })




  }
}
