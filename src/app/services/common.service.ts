import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(private snackBar : MatSnackBar) {
  }
  sideNavTogglerEmitter = new Subject<void>();

  clearModalView = new Subject<void>();

  handleDisplayMessage(message : string){
    this.snackBar.open(message,'X',{
      verticalPosition: 'top',
      duration  :8000
    })
  }

  updateLocalStorage(item: any,name:string,flag: boolean){
    //meaning its an array.
    if(flag){
      let user = JSON.parse(localStorage.getItem('user'))
      if(user[name]?.find(items => items === item)) {
       // Founded in the array,deleting
        user[name].splice(user[name].indexOf(item),1)
        localStorage.setItem('user', JSON.stringify(user))
      }
    else {
       // 'Didnt find in the array,pushing
        if(user[name]){
          user[name].push(item)
          localStorage.setItem('user', JSON.stringify(user))
        }
        else {
         // 'array didnt exist,now pushing.
          user[name] = []
          user[name].push(item)
          localStorage.setItem('user', JSON.stringify(user))
        }

      }
    }

    //simple item,not an array.
    else {
      let user = JSON.parse(localStorage.getItem('user'))
      user[name] = item
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

}

export enum MESSAGES {
  SUCCESS_MESSAGE = 'User has been successfully made',
  REQUIRED = 'Please fill this correctly',
 SUCCESS_SMS_MESSAGE = 'A code has been sent to your Phone!',
  TICK_MESSAGE = 'Please tick the captcha Box!',
  EMAIL_BAD_FORMAT = 'Email format is not correct',
  IMAGE_CHANGED = 'Image changed successfully, Please Refresh to see changes!',
  ACCOUNT_DATA_DELETE = 'Account data has been deleted, PLease login again for Fresh Start.',
  SUCCESS_EDIT =  'Successfully Edited!',
  SUBSCRIBED = 'Followed!',
  UNSUBSCRIBED = 'UnFollowed!',
  FOLLOW = 'Follow!',
  FOLLOWING = 'Following!'

}
