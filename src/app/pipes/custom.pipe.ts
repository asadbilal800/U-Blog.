import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Pipe({
  name: 'noFeedPipe',
})
export class CustomPipe implements PipeTransform {
  constructor(private authSrv: AuthService) {}

  transform(value: string): string {
    if (this.authSrv.userCredInfo.value.subscriptions?.length) {
      return value;
    }
    return 'Looks like your feed is empty.. Browse Topics!';
  }
}
