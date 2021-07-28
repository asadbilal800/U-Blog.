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
import {AngularFireAuth} from "@angular/fire/auth";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  token;
  isAuth;
  constructor(private authSrv: AuthService ,private router :Router) {
    this.authSrv.userCredInfo.subscribe((user)=> {
      if(user) {
        this.isAuth = true
      }
      else {
        this.isAuth = false;
      }
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
