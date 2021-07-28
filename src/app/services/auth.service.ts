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
    this.fsStore
    .collection('users')
    .doc(userUID).valueChanges()
    .pipe(
      map( (userDetails : UserModel) => {
        if(userDetails.password){
          delete userDetails.password
        }
        return userDetails
      })
    )
    .subscribe((userDetails) => {
      localStorage.setItem('user', JSON.stringify(userDetails));
      this.userCredInfo.next(userDetails);
    });
    setTimeout(()=> {
      resolve()
    },1000)
})

  }
}
