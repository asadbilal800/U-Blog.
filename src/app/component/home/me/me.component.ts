import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { SignUpModel } from '../../../models/sign-up.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css'],
})
export class MeComponent implements OnInit {
  currentUser: SignUpModel;
  value: string = 'Change Display Picture';
  constructor(
    private authSrv: AuthService,
    private fsStore: AngularFireStorage,
    private fireStore: AngularFirestore,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.spinner.show('mainScreenSpinner');
    this.authSrv.userCredInfo.subscribe((data) => {
      this.currentUser = data;
    });
    this.currentUser.userUID = this.authSrv.userUIDObsvr.value;
    this.spinner.hide('mainScreenSpinner');
  }

  changePicture(event) {
    this.spinner.show('mainScreenSpinner');
    console.log('method initiated.');
    let file = event.target.files[0];
    this.fsStore
      .ref(`display-pictures-users/${this.currentUser.username}`)
      .put(file)
      .then(() => {
        console.log('Display picture has been set in the storage');
        console.log('storing it in user table..');
        this.spinner.hide('mainScreenSpinner');
        this.snackBar.open('Image changed successfully', 'X', {
          duration: 8000,
          verticalPosition: 'top',
        });

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
