import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {articleModel} from "../../models/article.model";
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireStorage} from "@angular/fire/storage";
import { NgxSpinnerService} from "ngx-spinner";
import {take} from "rxjs/operators";
import {MatSidenav} from "@angular/material/sidenav";
import {CommonService} from "../../services/common.service";



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  articleArray : articleModel[]=[];
  articleImgUrl;
  @ViewChild('imgArticle',{static: true}) img : ElementRef;
  articleArrayIds: string[]=[];
  noPosts: boolean = false;
  @ViewChild('sidenav',{static:true}) sideNav : MatSidenav;
  userCredInfo;

  constructor(private fsAuth : AngularFireAuth,
              private authSrv : AuthService,
              private router : Router,
              private fsStore : AngularFirestore,
              private afStorage : AngularFireStorage,
              private  spinner : NgxSpinnerService,
              private commonSrv: CommonService
              ) {

  }

   ngOnInit(): void {

    this.authSrv.userCredInfo.subscribe(data => {
      this.userCredInfo = data;
    })

    this.commonSrv.sideNavTogglerEmitter.subscribe(()=> {
      this.sideNav.toggle();
    })

    this.spinner.show('mainScreenSpinner')
     this.getIdsOfArticle();
     //to avoid race condition..
     setTimeout(()=> {
       this.loadArticle();

       this.spinner.hide('mainScreenSpinner')
     },2000)


  }

   getIdsOfArticle(){

    this.fsStore.collection('all-articles').doc(`${this.userCredInfo.username}`)
      .collection('articles')
      .snapshotChanges()
      .subscribe(
      data => {
       data.map(data=> {
         let id = data.payload.doc.id;
         this.articleArrayIds.push(id)
        })
      }
    )
  }

  loadArticle() {

    let id =this.articleArrayIds.pop();
    if(id) {
      this.fsStore.collection('all-articles').doc(`${this.userCredInfo.username}`)
        .collection('articles')
        .doc(id)
        .snapshotChanges()
        .pipe(take(1))
        .subscribe(data => {

        let singleArticle = data.payload.data() as articleModel
        this.articleArray.push(singleArticle)
      })
    }

    else {
      this.noPosts = true;
    }

  }

  onScroll() {

    if(this.noPosts){
      // do nothing..
    }
    else {
      this.spinner.show('articleLoadingSpinner')
      setTimeout(()=> {
        this.loadArticle();
        this.spinner.hide('articleLoadingSpinner')

      },2000);
    }

  }

}
