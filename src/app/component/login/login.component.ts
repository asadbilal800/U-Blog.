import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import firebase from 'firebase'
import {AngularFirestore} from "@angular/fire/firestore";
import {SignUpModel} from "../../models/sign-up.model";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  firebaseToken : Subscription;
  displayMessage;
  successMessage = 'User has been made successfully!'

  @ViewChild('form') myForm : NgForm;

  constructor(private firestoreAuth: AngularFireAuth,
              private authSrv : AuthService,
              private router : Router,
              private fireStore : AngularFirestore) {}

  ngOnInit(): void {
  }

   login() {
    //resetting error message so ngIf would run.
   // this.displayMessage=''

    let username= this.myForm.value.username;
    let password= this.myForm.value.password;

    this.firestoreAuth.signInWithEmailAndPassword(username, password).then( value => {
      this.firestoreAuth.user.subscribe(user => {
         this.authSrv.userUIDObsvr.next(user.uid);
         this.authSrv.getUserCredInfoFromDb();
      })
     this.firebaseToken=  this.firestoreAuth.idToken.subscribe((token)=> {
       this.authSrv.userToken.next(token);
       this.router.navigate(['/home'])
     })

    })
      .catch(
        err => {
          this.displayMessage= err.message;
        }
      );

  }

  ngOnDestroy() {
    if(this.firebaseToken) {
      this.firebaseToken.unsubscribe()
    }
  }

  async differentLogin(socialMedia) {

    let provider;
    if(socialMedia==='google') {
     provider = new firebase.auth.GoogleAuthProvider()
    }
    else {
      provider = new firebase.auth.TwitterAuthProvider()
    }
    const credentials = await this.firestoreAuth.signInWithPopup(provider);
    let signUpValues: SignUpModel = {username: credentials.user.displayName,email:credentials.user.email};

    this.fireStore.collection('users').doc(`${credentials.user.uid}`)
      .set(signUpValues)
      .then((value)=> {

      this.displayMessage = this.successMessage;
    })



  }
}
