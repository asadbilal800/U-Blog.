import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {SignUpModel} from "../../models/sign-up.model";
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @ViewChild('form') myForm : NgForm;

  successMessage = 'User has been made successfully!'
  displayMessage;

  constructor(private fireStore : AngularFirestore
              ,private authF: AngularFireAuth
  ) { }


  ngOnInit(): void {

  }

  signup() {

    //resetting error message so ngIf would run.
    this.displayMessage=''

    let email= this.myForm.value.eph;
    let password= this.myForm.value.password;

    let signUpValues: SignUpModel =
      { username: this.myForm.value.username,
        email:this.myForm.value.eph,
        password:this.myForm.value.password,
        userUID : '',
        displayImage : '',
        subscriptions :[],
        bookmarks : [],
      };

       this.authF.createUserWithEmailAndPassword(email,password).then(data => {
         this.fireStore.collection('users').doc(`${data.user.uid}`)
           .set(signUpValues)
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
