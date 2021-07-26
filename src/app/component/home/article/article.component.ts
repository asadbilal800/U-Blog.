import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { articleModel } from '../../../models/article.model';
import { AuthService } from '../../../services/auth.service';
import firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent implements OnInit {
  articleId;
  disableClap = false;
  userCredInfo;
  article: articleModel;
  comment: string = '';
  commentsArray: string[] = [];
  constructor(
    private routerSS: ActivatedRoute,
    private afStore: AngularFirestore,
    private authSrv: AuthService
  ) {}

  ngOnInit(): void {
    this.authSrv.userCredInfo.subscribe((data) => [(this.userCredInfo = data)]);

    this.routerSS.params.subscribe((data) => {
      this.articleId = data['id'];
    });

    this.afStore
      .collection('all-articles')
      .doc(this.articleId)
      .snapshotChanges()
      .pipe(take(1))
      .subscribe((data) => {
        console.log(data.payload.data());

        this.article = data.payload.data() as articleModel;
        this.commentsArray = this.article.comment;
      });
  }

  makeComment() {
    console.log(this.comment);

    let localCommentArray = [];
    this.afStore
      .collection('all-articles')
      .doc(this.articleId)
      .valueChanges()
      .subscribe((data) => {
        // localCommentArray = data.comment as any;
      });
    localCommentArray.push(this.comment);
    console.log('array to be sent');
    console.log(localCommentArray);
    this.afStore
      .collection('all-articles')
      .doc(this.articleId)
      .update({
        comment: FieldValue.arrayUnion(
          `${this.userCredInfo.username} says : ` + this.comment
        ),
      });
  }

  // }
  clap() {
    this.afStore
      .collection('all-articles')
      .doc(this.articleId)
      .update({ claps: FieldValue.increment(1) });

    this.disableClap = true;
  }
}
