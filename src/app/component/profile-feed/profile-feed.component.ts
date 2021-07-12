import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { articleModel } from '../../models/article.model';
import { MatSidenav } from '@angular/material/sidenav';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../services/common.service';
import { map, take } from 'rxjs/operators';
import firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-feed',
  templateUrl: './profile-feed.component.html',
  styleUrls: ['./profile-feed.component.css'],
})
export class ProfileFeedComponent implements OnInit {
  articleArray: articleModel[] = [];
  @ViewChild('imgArticle', { static: true }) img: ElementRef;
  @ViewChild('sidenav', { static: true }) sideNav: MatSidenav;
  articleArrayIds: string[] = [];
  noPosts: boolean = false;
  userCredInfo;
  latestArticles = [];
  latestArticleIndex: number = 0;
  observerableTopicList: Observable<any[]>;

  constructor(
    private fsAuth: AngularFireAuth,
    private authSrv: AuthService,
    private router: Router,
    private fsStore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private spinner: NgxSpinnerService,
    private commonSrv: CommonService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.observerableTopicList = this.fsStore
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
      );

    this.fsStore
      .collection('all-articles')
      .stateChanges(['added'])

      .subscribe((action) => {
        action.map((a) => {
          if (this.latestArticleIndex == 5) {
            this.latestArticleIndex = 0;
          }
          let article = a.payload.doc.data() as any;
          this.latestArticles[this.latestArticleIndex] = article.name;
          this.latestArticleIndex = this.latestArticleIndex + 1;
        });
      });

    this.spinner.show('mainScreenSpinner');

    this.commonSrv.sideNavTogglerEmitter.subscribe(() => {
      this.sideNav?.toggle();
    });

    this.authSrv.userCredInfo.pipe(take(1)).subscribe((data) => {
      this.userCredInfo = data;
      //to avoid race condition..
    });

    setTimeout(() => {
      console.log('fetching id of user article.');
      this.getIdsOfArticle();
    }, 3000);

    setTimeout(() => {
      this.loadArticle();
      this.spinner.hide('mainScreenSpinner');
    }, 7000);
  }

  getIdsOfArticle() {
    let arrayOfId = [];
    this.userCredInfo.subscriptions.map((subscription) => {
      console.log('current subscription');
      console.log(subscription);

      this.fsStore
        .collection('all-articles', (ref) =>
          ref.where('tag', '==', subscription as string)
        )
        .snapshotChanges()
        .pipe(
          take(1),
          map((data) => {
            let arrayOfId = [];
            data.map((val) => {
              let id = val.payload.doc.id;
              arrayOfId.push(id);
            });
            return arrayOfId;
          })
        )
        .subscribe((idsArray) => {
          if (idsArray) {
            idsArray.map((id) => {
              this.articleArrayIds.push(id);
            });
          }
        });
    });
    console.log('successfully fetched all id into array');
    console.log(this.articleArrayIds);
  }

  loadArticle() {
    let id = this.articleArrayIds.pop();
    if (id) {
      console.log('pop id->' + id);
      console.log(this.articleArrayIds.length);
      this.fsStore
        .collection('all-articles')
        .doc(id)
        .snapshotChanges()
        .pipe(take(1))
        .subscribe((data) => {
          let singleArticle = data.payload.data() as articleModel;
          singleArticle.id = data.payload.id;
          this.articleArray.push(singleArticle);
        });
    } else {
      this.noPosts = true;
    }
  }

  onScroll() {
    if (this.noPosts) {
      // do nothing..
    } else {
      this.spinner.show('articleLoadingSpinner');
      setTimeout(() => {
        this.loadArticle();
        this.spinner.hide('articleLoadingSpinner');
      }, 1500);
    }
  }

  bookmarkArticle(id: string) {
    event.preventDefault();
    console.log(id);

    this.fsStore
      .collection('users')
      .doc(`${this.authSrv.userUIDObsvr.value}`)
      .update({ bookmarks: FieldValue.arrayUnion(id) })
      .then(() => {
        console.log('bookmark-ed!!');
      });
  }
}
