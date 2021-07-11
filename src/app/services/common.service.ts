import {Injectable} from "@angular/core";
import {Subject} from "rxjs";


@Injectable({providedIn:"root"})

export class CommonService {

  sideNavTogglerEmitter = new Subject<void>();

}

export enum MESSAGES {
  SUCCESS_MESSAGE = 'User has been successfully made'
}
