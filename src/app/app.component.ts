import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(
    private fsAuth: AngularFireAuth,
    private router: Router,
    private authSrv: AuthService,
  ) {}
  ngOnInit() {
      if (localStorage.getItem('user')) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.authSrv.userCredInfo.next(user);
      }
  }

}
