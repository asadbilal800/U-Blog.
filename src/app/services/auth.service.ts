import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentSnapshot} from '@angular/fire/firestore';
import {map} from "rxjs/operators";
import {UserModel} from "../models/user.model";
import firebase from "firebase";
import {Router} from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private fsStore: AngularFirestore,private router : Router) {}

  userCredInfo = new BehaviorSubject<any>(null);
  clearModalView = new Subject<void>();

  getUserDataFromFirebase(userUID: string) {

    return new Promise<void>((resolve)=> {
      console.log('promise running')
    this.fsStore
    .collection('users')
    .doc(userUID).get()
    .pipe(
      map( (userDetails : DocumentSnapshot<UserModel>) => {
        if(userDetails.data().password){
          delete userDetails.data().password
        }
        return userDetails.data()
      })
    )
    .subscribe((userDetails) => {
      console.log('setting item')
      localStorage.setItem('user', JSON.stringify(userDetails));
      this.userCredInfo.next(userDetails);
    });
    setTimeout(()=> {
      resolve()
    },1000)
})

  }
}
