import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from "@angular/router";
import {AngularFirestore} from "@angular/fire/firestore";
import {take} from "rxjs/operators";
import {articleModel} from "../../models/article.model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {



  articleId;
  userCredInfo;
  article : articleModel;
  constructor(private routerSS : ActivatedRoute,
              private afStore : AngularFirestore,
              private authSrv : AuthService
              ) { }

  ngOnInit(): void {

    this.authSrv.userCredInfo.subscribe(data => [
      this.userCredInfo = data
    ]);

    this.routerSS.params.subscribe( data => {
      this.articleId = data['id']
    });

    this.afStore.collection('all-articles').doc(`${this.userCredInfo.username}`)
      .collection('articles')
      .doc(this.articleId)
      .snapshotChanges()
      .pipe(take(1))
      .subscribe(data => {
        console.log(data.payload.data())

         this.article = data.payload.data() as articleModel
      })
  }




}
