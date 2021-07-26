import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'U-blog';

  constructor(
    private fsAuth: AngularFireAuth,
    private router: Router,
    private authSrv: AuthService,
  ) {}
  ngOnInit() {
    if (!!this.authSrv.userCredInfo) {
      if (localStorage.getItem('user')) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.authSrv.userCredInfo.next(user);
      }
    }
  }

  logout(){
    this.fsAuth.signOut().then(null);
    localStorage.clear()
    this.router.navigate(['/login'])
    console.log('signing out');

  }
}
