import {Pipe, PipeTransform, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MESSAGES} from "../services/common.service";

@Pipe({
  name: 'unfollow'
})
export class UnfollowPipe implements PipeTransform {
  subscriptions : Array<string> = JSON.parse(localStorage.getItem('user')).subscriptions

  transform(value: string, args: string, button: MatButton): unknown {
    if(this.subscriptions?.find((item)=> item === args)){
      button.color = 'warn'
      return MESSAGES.FOLLOWING
    }
    else {
      return value
    }
  }

}
