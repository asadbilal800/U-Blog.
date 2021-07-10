import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {HomeComponent} from "../home/home.component";
import {CommonService} from "../../services/common.service";
import {AuthService} from "../../services/auth.service";
import {SignUpModel} from "../../models/sign-up.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild(HomeComponent) homeComponent;
  user : SignUpModel = null;
  isAuth = false;

  constructor(private afAuth : AngularFireAuth,
              private router : Router,
              private commonSrv : CommonService,
              private authSrv : AuthService,
              private fsAuth : AngularFireAuth
              ) {
  }

   ngOnInit(): void {
    this.authSrv.userCredInfo.subscribe(data => {
      this.user = data;
    });

      this.fsAuth.idToken.subscribe( token => {
        if(token) {
          this.isAuth = true
        }
        else {
          this.isAuth = false;

        }

    })


  }


  toggleSideNav() {
    this.commonSrv?.sideNavTogglerEmitter.next();
  }
}
