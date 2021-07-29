import {Component, OnInit} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;
import {UserModel} from "../../../models/user.model";
import {CommonService, MESSAGES} from "../../../services/common.service";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css'],
})
export class TopicsComponent implements OnInit {
  topicList;
  user : UserModel;
  color : string;
  constructor(
    private fsStore: AngularFirestore,
    private spinner: NgxSpinnerService,
    private authSrv: AuthService,
    private commonSrv: CommonService,
  ) {}
  ngOnInit(): void {
    this.authSrv.userCredInfo.subscribe((user) => {
      if(user) {
        this.user = user;
      }
    });

    this.spinner.show('mainScreenSpinner');
    this.fsStore
      .collection('topics')
      .doc<object>('SanBNEamwYEo8oZFqzJP')
      .valueChanges()
      .pipe(
        map((data) => {
          let arrayOfTopics = [];
          for (const item in data) {
            arrayOfTopics.push(data[item]);
          }
          return arrayOfTopics;
        })
      )
      .subscribe((topics) => {
        this.topicList = topics;
        this.spinner.hide('mainScreenSpinner');
      });
  }

  subscribeTopic(topic: string,button: MatButton) {
    let buttonInnerContent = button._getHostElement().innerText

    if(buttonInnerContent === MESSAGES.FOLLOW){
      button.color = "warn"
       button._getHostElement().innerText = MESSAGES.FOLLOWING

      this.fsStore
        .collection('users')
        .doc(`${this.user.userUID}`)
        .update({ subscriptions: FieldValue.arrayUnion(topic) })
        .then(() => {
          this.commonSrv.updateLocalStorage(topic,'subscriptions',true)
          this.commonSrv.handleDisplayMessage(MESSAGES.SUBSCRIBED)
        });
    }
    else {
      button.color = "primary"
      button._getHostElement().innerText = MESSAGES.FOLLOW

      this.fsStore
        .collection('users')
        .doc(`${this.user.userUID}`)
        .update({ subscriptions: FieldValue.arrayRemove(topic) })
        .then(() => {
          this.commonSrv.updateLocalStorage(topic,'subscriptions',true)
          this.commonSrv.handleDisplayMessage(MESSAGES.UNSUBSCRIBED)
        });
    }

  }
}
