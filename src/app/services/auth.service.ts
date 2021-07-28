import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentSnapshot} from '@angular/fire/firestore';
import {map} from "rxjs/operators";
import {UserModel} from "../models/user.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private fsStore: AngularFirestore) {}

  userCredInfo = new BehaviorSubject<any>(null);

  getUserDataFromFirebase(userUID: string) {

    return new Promise<void>((resolve)=> {
    this.fsStore
    .collection('users')
    .doc(userUID).get()
    .pipe(
      map( (userDetails : DocumentSnapshot<UserModel>) => {
        let userDetail = userDetails.data()
        if(userDetail?.password){
          delete userDetail.password
        }
        return userDetail
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
