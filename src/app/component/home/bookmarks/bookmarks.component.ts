import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { articleModel } from '../../../models/article.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css'],
})
export class BookmarksComponent implements OnInit {
  user: UserModel;
  bookmarkIdArray: string[] = [];
  articleArray: articleModel[] = [];
  constructor(
    private authSrv: AuthService,
    private afStore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.authSrv.userCredInfo.subscribe((user) => {
      this.user = user;
    });

    this.getBookMmarksOfUser();
    this.loadBookmark();
  }

  getBookMmarksOfUser() {
    this.bookmarkIdArray = this.user.bookmarks;
  }

  loadBookmark() {
    this.afStore.collection('all-articles');

    this.bookmarkIdArray.map((id) => {
      this.afStore
        .collection('all-articles')
        .doc(id)
        .valueChanges()
        .pipe(take(1))
        .subscribe((article) => {
          this.articleArray.push(article as articleModel);
        });
    });
  }
}
