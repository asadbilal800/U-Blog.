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
import {map, take} from "rxjs/operators";
import firebase from "firebase";
import FieldValue = firebase.firestore.FieldValue;

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

  constructor(private fsAuth : AngularFireAuth, private authSrv : AuthService, private router : Router, private fsStore : AngularFirestore, private afStorage : AngularFireStorage, private  spinner : NgxSpinnerService, private commonSrv: CommonService, private afAuth : AngularFireAuth,
  ) {
  }

  ngOnInit(): void {

   // this.spinner.show('mainScreenSpinner')


    this.commonSrv.sideNavTogglerEmitter.subscribe(()=> {
      this.sideNav?.toggle();
    });


    this.authSrv.userCredInfo
      .subscribe(data => {
      console.log('DATA:')
      console.log(data)
      this.userCredInfo = data;
      //to avoid race condition..
    })

    setTimeout(()=> {
      this.getIdsOfArticle();
      this.spinner.hide('mainScreenSpinner')
    },2000)


    setTimeout(()=> {
      this.loadArticle();
      this.spinner.hide('mainScreenSpinner')
    },4000)




  }

  getIdsOfArticle(){

    let arrayOfId = []
    this.userCredInfo.subscriptions.map(
      subscription => {
        console.log('current subscription')
        console.log(subscription)

        this.fsStore.collection('all-articles', ref =>
          ref.where("tag", "==", subscription as string)
        ).snapshotChanges()
          .pipe(
            take(1),
            map(data=> {
                let arrayOfId = []
                data.map(val => {
                  let id = val.payload.doc.id
                  arrayOfId.push(id)
                })
                return arrayOfId
              }
            )
          ).subscribe( data => {
            this.articleArrayIds  = arrayOfId.concat(data)
          }
        )

      }
    )
  }

  loadArticle() {


    let id =this.articleArrayIds.pop();
    if(id) {
      console.log('pop id->'+ id)
      console.log(this.articleArrayIds.length)
      this.fsStore.collection('all-articles')
        .doc(id)
        .snapshotChanges()
        .pipe(take(1))
        .subscribe(data => {

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
    this.articleArray = null;
  }


  test(){
    console.log('test function started ->')

    let arrayOfId = []



  }


  bookmarkArticle(id: string) {

    event.preventDefault()
    console.log(id)

    this.fsStore.collection('users').doc(`${this.authSrv.userUIDObsvr.value}`).update(
      {bookmarks : FieldValue.arrayUnion(id)}
    ).then(()=> {
      console.log('bookmark-ed!!')
    })

  }
}
