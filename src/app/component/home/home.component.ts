import {
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
import {UserModel} from "../../models/user.model";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sideNav: MatSidenav;
  @ViewChild(ModalDirective, { static: true }) modalDirective: ModalDirective;
  viewFeed = false;
  constructor(
    private router: Router,
    private commonSrv: CommonService,
    private fsAuth: AngularFireAuth,
    private authSrv: AuthService,
    private factResolve: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {

    this.authSrv.clearModalView.subscribe(() => {},error => {},
      () => {
        this.modalDirective.viewRef.clear();
        this.viewFeed = true;
      });

    this.commonSrv.sideNavTogglerEmitter.subscribe(() => {
      this.sideNav.toggle().then(() => null);
    });

    this.authSrv.userCredInfo
      .pipe(
        map((user : UserModel)=> {
          if(user?.isNewUser){
          return user.isNewUser
          }
          return null
        }))
      .subscribe((isNewUser) => {
      if(isNewUser){
        (isNewUser) ? this.createModal() : this.viewFeed = true
      }
    });
  }

  createModal() {
      let component = this.factResolve.resolveComponentFactory(
        DynamicModalComponent);
      this.modalDirective.viewRef.clear();
      this.modalDirective.viewRef.createComponent<DynamicModalComponent>(component);
  }

  signOut() {
    localStorage.clear()
    this.authSrv.userCredInfo.next(null)
    this.fsAuth.signOut().then(null);
    this.router.navigate(['/login'])
    console.log('signing out');
  }
}
