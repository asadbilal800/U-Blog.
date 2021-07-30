import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: UserModel = null;
  isAuth = false;
  isNewUser;

  constructor(
    private router: Router,
    private commonSrv: CommonService,
    private authSrv: AuthService,
  ) {}

  ngOnInit(): void {
    this.authSrv.userCredInfo.subscribe((data : UserModel) => {
      if (data ) {
        console.log('AHAHAHAHAHHAH')
        this.user = data;
        this.isAuth = true
        this.isNewUser = data.isNewUser
      }
      else {
        this.isAuth = false;
        this.user = null;
      }
    });

    this.commonSrv.clearModalView.subscribe(() => {},error => {},
      () => {
        this.isNewUser = false
      });

  }

  toggleSideNav() {
    this.commonSrv.sideNavTogglerEmitter.next();
  }
}
