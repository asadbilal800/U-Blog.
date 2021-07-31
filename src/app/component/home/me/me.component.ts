import {Component, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import {CommonService, MESSAGES} from "../../../services/common.service";
import {HomeComponent} from "../home.component";
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css'],
})
export class MeComponent implements OnInit {

  user: UserModel;
  bio;
  bioInput: boolean = true
  username;
  usernameInput: boolean = true;

  constructor(
    private authSrv: AuthService,
    private fsStorage: AngularFireStorage,
    private fsStore: AngularFirestore,
    private spinner: NgxSpinnerService,
    private commonSrv : CommonService,
    private fsAuth : AngularFireAuth,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.spinner.show('mainScreenSpinner');
    this.authSrv.userCredInfo.subscribe((user : UserModel) => {
      if(user){
        this.user = user;
        this.username = user.username
        this.bio = user.bio
      }
    });
    this.spinner.hide('mainScreenSpinner');
  }

  changePicture(event) {
    this.spinner.show('mainScreenSpinner');
    let file = event.target.files[0];
    this.fsStorage
      .ref(`display-pictures-users/${this.user.username}`)
      .put(file)
      .then((image) => {
        image.ref.getDownloadURL().then((url)=> {
          this.fsStore
            .collection('users')
            .doc(`${this.user.userUID}`)
            .update({ displayImage: url })
            .then(() => {
              this.spinner.hide('mainScreenSpinner');
              this.authSrv.getUserDataFromFirebase(this.user.userUID)
              this.commonSrv.handleDisplayMessage(MESSAGES.IMAGE_CHANGED)
            });
        })

      });
  }

  deleteAccountData() {
    let bool = confirm('Are you sure you want to delete user data!?')
    if(bool){
      this.spinner.show('mainScreenSpinner');
      this.fsStore.collection('users').doc(this.user.userUID)
        .update({
          username: '',
          displayImage :'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
          subscriptions : [],
          bookmarks : [],
          isNewUser : true,
          bio : '',
          notifications :[],
          newNotficationCount : 0

        }).then(()=> {
        this.spinner.hide('mainScreenSpinner');
        this.commonSrv.handleDisplayMessage(MESSAGES.ACCOUNT_DATA_DELETE)
        this.logOut()
      })
    }
  }

  logOut(){
    localStorage.clear()
    this.authSrv.userCredInfo.next(null)
    this.fsAuth.signOut().then(null);
    this.router.navigate(['/login'])
  }

  save(editable: string) {
    if(editable === 'username'){
      this.spinner.show('mainScreenSpinner');
      this.fsStore
        .collection('users')
        .doc(this.user.userUID)
        .update({
          username: this.username,
        })
        .then(() => {
          this.authSrv.getUserDataFromFirebase(this.user.userUID)
          this.spinner.hide('mainScreenSpinner');
          this.commonSrv.handleDisplayMessage(MESSAGES.SUCCESS_EDIT)
        });

    }
    else {
      this.spinner.show('mainScreenSpinner');
      this.fsStore
        .collection('users')
        .doc(this.user.userUID)
        .update({
          bio: this.bio,
        })
        .then(() => {
          this.authSrv.getUserDataFromFirebase(this.user.userUID)
          this.spinner.hide('mainScreenSpinner');
          this.commonSrv.handleDisplayMessage(MESSAGES.SUCCESS_EDIT)
        });
    }

  }



}
