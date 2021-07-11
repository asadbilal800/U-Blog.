import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css'],
})
export class TopicsComponent implements OnInit {
  topicList;
  currentUser;
  constructor(
    private fsStore: AngularFirestore,
    private spinner: NgxSpinnerService,
    private authSrv: AuthService
  ) {}
  ngOnInit(): void {
    this.spinner.show();
    this.fsStore
      .collection('topics')
      .doc<object>('SanBNEamwYEo8oZFqzJP')
      .valueChanges()
      .pipe(
        take(1),
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
        this.spinner.hide();
      });

    this.authSrv.userCredInfo.subscribe((user) => {
      this.currentUser = user;
    });
  }

  subscribeTopic(topic: string) {
    console.log('subscribing to topic... ' + topic);
    console.log(this.authSrv.userUIDObsvr.value);

    this.fsStore
      .collection('users')
      .doc(`${this.authSrv.userUIDObsvr.value}`)
      .update({ subscriptions: FieldValue.arrayUnion(topic) })
      .then(() => {
        console.log('subscribed!');
      });
  }
}
