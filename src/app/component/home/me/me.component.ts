import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { SignUpModel } from '../../../models/sign-up.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css'],
})
export class MeComponent implements OnInit {
  currentUser: SignUpModel;
  constructor(
    private authSrv: AuthService,
    private fsStore: AngularFireStorage,
    private fireStore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.authSrv.userCredInfo.subscribe((data) => {
      this.currentUser = data;
    });
    this.currentUser.userUID = this.authSrv.userUIDObsvr.value;
  }

  changePicture(event) {
    console.log('method initiated.');
    let file = event.target.files[0];
    this.fsStore
      .ref(`display-pictures-users/${this.currentUser.username}`)
      .put(file)
      .then(() => {
        console.log('Display picture has been set in the storage');
        console.log('storing it in user table..');

        this.fsStore
          .ref(`display-pictures-users/${this.currentUser.username}`)
          .getDownloadURL()
          .subscribe((url) => {
            console.log(url);
            console.log(this.currentUser.userUID);
            this.fireStore
              .collection('users')
              .doc(`${this.currentUser.userUID}`)
              .update({ displayImage: url })
              .then(() => {
                console.log('successfully uploaded display picture');
              });
          });
      });
  }
}
