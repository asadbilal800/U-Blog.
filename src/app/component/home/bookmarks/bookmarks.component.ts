import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { articleModel } from '../../../models/article.model';
import {map, take} from 'rxjs/operators';
import firebase from "firebase";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css'],
})
export class BookmarksComponent implements OnInit {
  user: UserModel;
  bookmarkIdArray: string[] = [];
  articleArray: articleModel[] = [];
  booksmarksNotAvailable=false;

  constructor(
    private authSrv: AuthService,
    private fsStore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.authSrv.userCredInfo.subscribe((user) => {
      if(user) {
        this.user = user;
        if(!!this.user?.bookmarks?.length){
          this.bookmarkIdArray = this.user.bookmarks;
        }
        else {
          this.booksmarksNotAvailable = true
        }
      }
    });

    this.loadBookmark();
  }

  loadBookmark() {

    this.fsStore.collection('all-articles');
    this.bookmarkIdArray.map((id) => {
      this.fsStore
        .collection('all-articles')
        .doc(id)
        .get()
        .pipe(
          map((article : DocumentSnapshot<articleModel>) => {
            return article.data()
          })
        )
        .subscribe((article) => {
          this.articleArray.push(article);
        });
    });
  }
}
