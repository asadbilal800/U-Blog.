import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {CommonService, MESSAGES} from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';
import {AngularFirestore} from "@angular/fire/firestore";
import firebase from "firebase/app";
import FieldValue = firebase.firestore.FieldValue;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: UserModel;
  isAuth = false;
  isNewUser;
  notifications : string[];
  newNotficationCount= 0
  @ViewChild('SecondSidenav') secondSideNav;

  constructor(
    private router: Router,
    private commonSrv: CommonService,
    private authSrv: AuthService,
    private fsStore : AngularFirestore
  ) {}

  ngOnInit(): void {


    this.commonSrv.secondSideNavTogglerEmitter.subscribe(() => {
      this.secondSideNav.close().then(() => null);
    })


    this.authSrv.userCredInfo.subscribe((data : UserModel) => {
      if (data) {
        this.user = data;
        this.isAuth = true
        this.isNewUser = data.isNewUser
        this.newNotficationCount = this.user.newNotficationCount
        if( this.user.notifications.length){
          this.notifications = this.user.notifications
          this.notifications.reverse()
        }
      }
      else {
        this.isAuth = false;
        this.user = null;
      }
    });


    //listen for new notification
    this.fsStore.collection('users')
      .doc(this.user?.userUID)
      .valueChanges()
      .subscribe((user: UserModel)  => {

        //first check notification are alive or not..means logged in.
        if(this.user) {

          if(user.setNotification){
            this.notifications = user.notifications
            this.fsStore.collection('users').doc(this.user.userUID)
              .update({
                setNotification : false,
                newNotficationCount : FieldValue.increment(1)
              })
            this.commonSrv.handleDisplayMessage(MESSAGES.NEW_NOTIFICATION, true)
            this.authSrv.getUserDataFromFirebase(this.user.userUID)
          }
          else {
            }
          }
      })

    this.commonSrv.clearModalView.subscribe(() => {},error => {},
      () => {
        this.isNewUser = false
      });

  }

  toggleSideNav() {
    this.commonSrv.sideNavTogglerEmitter.next();
  }

  clearNotificationCount(SecondSideNav) {

    SecondSideNav.toggle();

    if(this.newNotficationCount !== 0) {
      this.fsStore.collection('users').doc(this?.user?.userUID)
        .update({
          newNotficationCount : 0,
          notifications : []
        })

      this.authSrv.getUserDataFromFirebase(this.user.userUID)
    }
    else {
    }


  }
}
