import {Component, OnInit, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AngularFirestore, } from '@angular/fire/firestore';
import { articleModel } from '../../../models/article.model';
import { AuthService } from '../../../services/auth.service';
import firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;
import {MatButton} from "@angular/material/button";
import {MESSAGES} from "../../../services/common.service";
import {UserModel} from "../../../models/user.model";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent implements OnInit {

  articleId;
  article: articleModel;
  userCredInfo : UserModel;
  comment: string;
  commentsArray: string[] = [];
  clapReceived = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fsStore: AngularFirestore,
    private authSrv: AuthService,
  ) {}

  ngOnInit(): void {
    this.authSrv.userCredInfo.subscribe((user) => {
      if (user) {
        this.userCredInfo = user
      }})

    this.activatedRoute.params.subscribe((data) => {
      this.articleId = data['id'];
    });

    this.fsStore
      .collection('all-articles')
      .doc(this.articleId)
      .valueChanges()
      .subscribe((article : articleModel) => {
        this.article = article;
        if(!!this.article?.comment?.length){
          this.commentsArray = []
          this.commentsArray = this.article.comment;
        }
        else {
          this.commentsArray = []
          this.commentsArray.push('No Comments For This Article So Far..')
        }
      });
  }

  makeComment() {

    this.commentsArray.push(`${this.userCredInfo.username} Says : '` + this.comment +` '`)
    this.fsStore
      .collection('all-articles')
      .doc(this.articleId)
      .update({
        comment: FieldValue.arrayUnion(
          `${this.userCredInfo.username} Says : '` + this.comment + ` '`
        ),
      });
    this.comment = ''
  }

  clap(button : MatButton) {

    button.color='primary'

    if(!this.clapReceived){
      this.clapReceived = true;
      this.fsStore
        .collection('all-articles')
        .doc(this.articleId)
        .update({ claps: FieldValue.increment(1) })


      //send notification to owner.
      let notificationToSet = MESSAGES.CLAP_NOTIFY + this.article.name

      this.fsStore.collection('users')
        .doc(this.article.ownerId)
        .update({
          notifications : FieldValue.arrayUnion(notificationToSet),
          setNotification: true,
        })

    }


  }

  checkIfWrittenByMe() {
    return this.article?.ownerId !== this.userCredInfo.userUID
  }
}
