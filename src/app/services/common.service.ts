import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {
  sideNavTogglerEmitter = new Subject<void>();
}

export enum MESSAGES {
  SUCCESS_MESSAGE = 'User has been successfully made',
  REQUIRED = 'Please fill this correctly',
 SUCCESS_SMS_MESSAGE = 'A code has been sent to your Phone!',
  TICK_MESSAGE = 'Please tick the captcha Box!',
  EMAIL_BAD_FORMAT = 'Email format is not correct'
}
