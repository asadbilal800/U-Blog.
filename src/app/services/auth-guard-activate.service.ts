import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardServiceActivate implements CanActivate {
  isAuth = false;
  constructor(private authSrv: AuthService) {
    this.authSrv.userToken.subscribe((token) => {
      if (token) {
        this.isAuth = true;
      } else {
        this.isAuth = false;
      }
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.isAuth) {
      return true;
    } else {
      return false;
    }
  }
}
