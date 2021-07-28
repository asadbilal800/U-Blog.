import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
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

  constructor(
    private router: Router,
    private commonSrv: CommonService,
    private authSrv: AuthService,
  ) {}

  ngOnInit(): void {
    this.authSrv.userCredInfo.subscribe((data) => {
      if (data) {
        this.user = data;
        this.isAuth = true
      }
      else {
        this.isAuth = false;
        this.user = null;
      }

    });

  }

  toggleSideNav() {
    this.commonSrv.sideNavTogglerEmitter.next();
  }
}
