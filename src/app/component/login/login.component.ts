import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  firebaseToken : Subscription;
  errorMessage;
  @ViewChild('form') myForm : NgForm;
  constructor(private firestoreAuth: AngularFireAuth,private authSrv : AuthService,private router : Router) {}

  ngOnInit(): void {
  }

  login() {
    //resetting error message so ngIf would run.
    this.errorMessage=''

    let username= this.myForm.value.username;
    let password= this.myForm.value.password;

    this.firestoreAuth.signInWithEmailAndPassword(username, password).then( value => {
     this.firebaseToken=  this.firestoreAuth.idToken.subscribe((token)=> {
       console.log('logging in')
       console.log(token)
       this.authSrv.userToken.next(token);
       this.router.navigate(['/home'])
     })

    })
      .catch(
        err => {
          this.errorMessage= err.message;
        }
      );


  }

  ngOnDestroy() {
    console.log('destroyed')
    if(this.firebaseToken) {
      this.firebaseToken.unsubscribe()
    }
  }

  differentLogin() {

  }
}
