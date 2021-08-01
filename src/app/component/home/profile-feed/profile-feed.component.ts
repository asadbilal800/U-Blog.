import { Component, OnInit, ViewChild } from '@angular/core';
import { articleModel } from '../../../models/article.model';
import { MatSidenav } from '@angular/material/sidenav';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import {AngularFirestore, DocumentSnapshot} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import {CommonService, MESSAGES} from '../../../services/common.service';
import {map, take} from 'rxjs/operators';
import firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;
import { Observable } from 'rxjs';
import {UserModel} from "../../../models/user.model";

@Component({
  selector: 'app-profile-feed',
  templateUrl: './profile-feed.component.html',
  styleUrls: ['./profile-feed.component.css'],
})
export class ProfileFeedComponent implements OnInit {

  articleArray: articleModel[] = [];
  articleArrayIds: string[] = [];
  noPosts: boolean = false;
  user : UserModel;
  latestArticles : Array<articleModel>=[]
  latestArticleIndex: number = 0;
  observerableTopicList: Observable<any[string]>;
  myTopicList = []
  @ViewChild('sidenav', { static: false }) sideNav: MatSidenav;


  constructor(
    private fsAuth: AngularFireAuth,
    private authSrv: AuthService,
    private router: Router,
    private fsStore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private spinner: NgxSpinnerService,
    private commonSrv: CommonService
  ) {}

  ngOnInit(): void {

    this.spinner.show('mainScreenSpinner');
     this.authSrv.userCredInfo.subscribe((user) => {
      this.user = user;
      if(this.user?.subscriptions){
        this.myTopicList =  this.user.subscriptions
      }
    })

    this.getTopicList();

    this.commonSrv.sideNavTogglerEmitter.subscribe(() => {
      this.sideNav?.toggle();
    });

    this.realTimeDbChangesListener();


    this.getArticlesId().then(() => {
      this.loadArticle();
      this.spinner.hide('mainScreenSpinner');

    });
  }

  //this is a heavy firebase task,so it will take time fetching data.
  getArticlesId() {
    return new Promise<void>((resolve) => {
      this.user.subscriptions?.map((subscription) => {
        this.fsStore
          .collection('all-articles', (ref) =>
            ref.where('tag', '==', subscription as string)
          )
          .get()
          .pipe(
            map(data => {
              let arrayId = []
              data.docs.map(data => {
                arrayId.push(data.id)
              })
             return arrayId
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
      setTimeout(() => {
        resolve();
      }, 3000);
    });


  }

  loadArticle() {
    let id = this.articleArrayIds.pop();
    if (id) {
      this.fsStore
        .collection('all-articles')
        .doc(id)
        .get()
        .subscribe((data : DocumentSnapshot<articleModel>) => {
          let singleArticle = data.data() as articleModel;
          this.articleArray.push(singleArticle);
        });
    } else {
      this.noPosts = true;
    }
  }

  onScroll() {
    if (!this.noPosts) {
      this.spinner.show('articleLoadingSpinner');
      setTimeout(() => {
        this.loadArticle();
        this.spinner.hide('articleLoadingSpinner');
      }, 1000);
    } else {
      //do nothing.
    }
  }

  bookmarkArticle(id: string) {

    event.preventDefault();

    let user : UserModel = JSON.parse(localStorage.getItem('user'))
    if(user?.bookmarks?.find(ids => ids === id)){
      this.fsStore
        .collection('users')
        .doc(`${this.user.userUID}`)
        .update({ bookmarks: FieldValue.arrayRemove(id) })
        .then(() => {
          this.authSrv.getUserDataFromFirebase(this.user.userUID)
          this.commonSrv.handleDisplayMessage(MESSAGES.UNBOOKMARK)
        });
    }
    else {
      this.fsStore
        .collection('users')
        .doc(`${this.user.userUID}`)
        .update({bookmarks: FieldValue.arrayUnion(id)})
        .then(() => {
          this.authSrv.getUserDataFromFirebase(this.user.userUID)
          this.commonSrv.handleDisplayMessage(MESSAGES.BOOKMARK)
        });
    }
  }

  getTopicList() {

    this.observerableTopicList = this.fsStore
      .collection('topics')
      .doc('SanBNEamwYEo8oZFqzJP')
      .valueChanges()
      .pipe(
        map((data : Array<object>) => {
          let arrayOfTopics = [];
          for (const item in data) {
            arrayOfTopics.push(data[item]);
          }
          return arrayOfTopics;
        })
      );
  }

  realTimeDbChangesListener() {

    this.fsStore
      .collection('all-articles', (ref) =>
        ref.limitToLast(5).orderBy('timeCreated')
      )
      .valueChanges()
      .subscribe((data) => {

        this.latestArticles = data as articleModel[];
        this.latestArticles.reverse()

      })


    // this.fsStore
    //   .collection('all-articles')
    //   .stateChanges(['added'])
    //   .subscribe((data ) => {
    //
    //     //if length is greater than
    //     if(data.length === 1 ) {
    //       this.latestArticles.push(data[0].payload.doc.data() as articleModel)
    //     }


        // data.map((data) => {
        //
        //   if(!!data.payload.) {
        //     console.log('AHAHAHAHAHAH')
        //
        //     console.log(this.latestArticles.length)
        //     if(this.latestArticles.length > 5) {
        //       console.log('AHAHAHAHAHAH')
        //       this.latestArticles.splice(0,1)
        //       this.latestArticles.push(data.payload.doc.data() as articleModel)
        //
        //     }
        //   else {
        //       this.latestArticles.push(data.payload.doc.data() as articleModel)
        //     }
        //   }
        //
        // });
    //  });
  }
}
