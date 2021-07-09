import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({providedIn:'root'})
export class AuthService {


  constructor(private afStore : AngularFirestore) {
  }

  //weird race condition happened that is why i couldnt inject firebase observable directly.

  userToken= new BehaviorSubject<string>(null);
  userUIDObsvr = new BehaviorSubject<string>(null);
  userCredInfo = new BehaviorSubject<any>(null);

   getUserCredInfoFromDb(){

        let userUID =this.userUIDObsvr.value
        this.afStore.collection('users').doc(userUID).valueChanges().subscribe((userDetails)=> {
        this.userCredInfo.next(userDetails)
     })

  }


}

