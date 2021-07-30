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
  notifications : string[] =[]
  newNotficationCount= null
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
        if(this.user?.newNotficationCount){
          this.newNotficationCount =this.user.newNotficationCount
        }
        if( this.user?.notifications){
          console.log('founddddddd OLD notification')
          this.notifications = this.user.notifications
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
        console.log('CHANGESSSS')

        if(user?.notifications){
          console.log(user.notifications)
          console.log(this.user.notifications)
          if(user?.notifications?.length === this.user?.notifications?.length){
            console.log('NOTHING NEW.')
          }
          else {
            console.log('notified')
            this.commonSrv.handleDisplayMessage(MESSAGES.NEW_NOTIFICATION,true)
            this.fsStore.collection('users').doc(this?.user?.userUID)
              .update({
                newNotficationCount : FieldValue.increment(1)})
              this.authSrv.getUserDataFromFirebase(this?.user?.userUID)

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

    SecondSideNav.toggle()
    if(this.newNotficationCount !== 0 && this.newNotficationCount !== null) {
      this.fsStore.collection('users').doc(this?.user?.userUID)
        .update({
          newNotficationCount : 0})
      this.newNotficationCount = 0;
      this.authSrv.getUserDataFromFirebase(this.user.userUID)
    }
    else {
      console.log('no need for db')
    }


  }
}
