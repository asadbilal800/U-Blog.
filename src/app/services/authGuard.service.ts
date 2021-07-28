import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  token;
  isAuth;
  constructor(private authSrv: AuthService ,private router :Router) {
    this.authSrv.userCredInfo.subscribe((user)=> {
      (user) ? this.isAuth = true : this.isAuth = false
    })
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

     if(this.isAuth) {
       return true
     }
     else {
       return this.router.createUrlTree(['./login'])
     }

  }
}
