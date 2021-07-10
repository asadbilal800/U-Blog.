import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/firestore";
import {SignUpModel} from "../models/sign-up.model";

@Injectable({providedIn:'root'})
export class AuthService {


  constructor(private afStore : AngularFirestore) {
  }

  //weird race condition happened that is why i couldnt inject firebase observable directly.

  userToken= new BehaviorSubject<string>(null);
  userUIDObsvr = new BehaviorSubject<string>(null);
  userCredInfo = new BehaviorSubject<any>(null);

   getUserCredInfoFromDb(userUID: string){

        let uid = userUID
        this.afStore.collection('users').doc(uid).valueChanges().subscribe((userDetails)=> {
          console.log(userDetails)
        this.userCredInfo.next(userDetails)
     })

  }


}

