import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardServiceActivate implements CanActivate {
  isAuth = false;
  token;
  constructor(private authSrv: AuthService, private router: Router) {
    this.authSrv.userToken.subscribe((token) => {
      if (token) {
        this.isAuth = true;
        this.token = token;
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

    if (localStorage.getItem('token')) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }
}
