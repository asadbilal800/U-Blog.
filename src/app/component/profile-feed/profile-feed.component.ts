import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {articleModel} from "../../models/article.model";
import {MatSidenav} from "@angular/material/sidenav";
import {AngularFireAuth} from "@angular/fire/auth";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireStorage} from "@angular/fire/storage";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "../../services/common.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-profile-feed',
  templateUrl: './profile-feed.component.html',
  styleUrls: ['./profile-feed.component.css']
})
export class ProfileFeedComponent implements OnInit {

  articleArray : articleModel[]=[];
  @ViewChild('imgArticle',{static: true}) img : ElementRef;
  @ViewChild('sidenav',{static:true}) sideNav : MatSidenav;
  articleArrayIds: string[]=[];
  noPosts: boolean = false;
  userCredInfo;

  constructor(private fsAuth : AngularFireAuth,
              private authSrv : AuthService,
              private router : Router,
              private fsStore : AngularFirestore,
              private afStorage : AngularFireStorage,
              private  spinner : NgxSpinnerService,
              private commonSrv: CommonService,
              private afAuth : AngularFireAuth,
  ) {

  }

  ngOnInit(): void {

     this.spinner.show('articleLoadingSpinner')
    this.commonSrv.sideNavTogglerEmitter.subscribe(()=> {
      this.sideNav.toggle();
    })

    this.authSrv.userCredInfo.pipe(take(1)).subscribe(data => {
      this.userCredInfo = data;
      //to avoid race condition..
    })
    this.getIdsOfArticle();


    setTimeout(()=> {
      this.loadArticle();
      this.spinner.hide('articleLoadingSpinner')
    },2000)




  }

  getIdsOfArticle(){
    this.fsStore.collection('all-articles').doc(`asad800`)
      .collection('articles')
      .snapshotChanges()
      .subscribe(
        data => {
          data.map(data=> {
            let id = data.payload.doc.id
            this.articleArrayIds.push(id)
          })
        }
      )
  }

  loadArticle() {

    let id =this.articleArrayIds.pop();
    if(id) {
      this.fsStore.collection('all-articles').doc(`asad800`)
        .collection('articles')
        .doc(id)
        .snapshotChanges()
        .pipe(take(1))
        .subscribe(data => {
          console.log(data)

          let singleArticle = data.payload.data() as articleModel
          singleArticle.id = data.payload.id;
          this.articleArray.push(singleArticle)
        })
    }

    else {
      this.noPosts = true;
    }

  }

  onScroll() {

    console.log('FIRED')
    if(this.noPosts){
      // do nothing..
    }
    else {
      this.spinner.show('articleLoadingSpinner')
      setTimeout(()=> {
        this.loadArticle();
        this.spinner.hide('articleLoadingSpinner')

      },1500);
    }

  }


  signOut() {
    this.afAuth.signOut().then(null)
    this.router.navigate(['/login'])
    console.log('signing out')
  }

}
