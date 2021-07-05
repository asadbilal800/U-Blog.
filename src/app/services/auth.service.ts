import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({providedIn:'root'})
export class AuthService {


  //weird race condition happened that is why i couldnt inject firebase obserable directly.
  userToken= new BehaviorSubject<string>(null);

}
