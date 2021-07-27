import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserModel } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private fsStore: AngularFirestore) {}

  //weird race condition happened that is why i couldnt inject firebase observable directly.

  userToken = new BehaviorSubject<string>(null);
  userCredInfo = new BehaviorSubject<any>(null);
  clearModalView = new Subject<void>();

  getUserDataFromFirebase(userUID: string) {

    this.fsStore
      .collection('users')
      .doc(userUID).get()
      .subscribe((userDetails) => {
        localStorage.setItem('user', JSON.stringify(userDetails));
        this.userCredInfo.next(userDetails);
      });
  }
}
