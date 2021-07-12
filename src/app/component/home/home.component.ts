import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { DynamicModalComponent } from '../dynamic-modal-component/dynamic-modal.component';
import { ModalDirective } from '../../directives/modal.directive';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) sideNav: MatSidenav;
  user;
  viewFeed = false;
  @ViewChild(ModalDirective, { static: false }) modalDirective: ModalDirective;
  constructor(
    private router: Router,
    private commonSrv: CommonService,
    private afAuth: AngularFireAuth,
    private authSrv: AuthService,
    private factResolve: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.authSrv.clearModalView.subscribe(() => {
      this.modalDirective.viewRef.clear();
      this.viewFeed = true;
    });

    this.commonSrv.sideNavTogglerEmitter.subscribe(() => {
      this.sideNav?.toggle();
    });

    this.authSrv.userCredInfo.subscribe((user) => {
      this.user = user;
      setTimeout(() => {
        let newUser = this.user?.isNewUser;
        if (newUser) {
          this.createModal();
        } else {
          this.viewFeed = true;
        }
      }, 1000);
    });
  }

  createModal() {
    setTimeout(() => {
      let component = this.factResolve.resolveComponentFactory(
        DynamicModalComponent
      );
      this.modalDirective.viewRef.clear();
      this.modalDirective.viewRef.createComponent<DynamicModalComponent>(
        component
      );
    }, 1000);
  }

  signOut() {
    this.afAuth.signOut().then(null);
    localStorage.clear();
    this.router.navigate(['/login']);
    console.log('signing out');
  }
}
