import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'U-blog';

  constructor(private afAuth: AngularFireAuth, private router: Router) {}
  ngOnDestroy() {}

  logout() {
    this.afAuth.signOut().then(null);
    localStorage.clear();
    this.router.navigate(['/login']);
    console.log('signing out');
  }
}
