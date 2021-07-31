import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';
import { NgForm } from '@angular/forms';
import { articleModel } from '../../../models/article.model';
import { UserModel } from '../../../models/user.model';
import {map, take} from 'rxjs/operators';
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService, MESSAGES} from "../../../services/common.service";
import firebase from "firebase";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import {Action} from "@angular/fire/database";

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css'],
})
export class WriteComponent implements OnInit {
  user: UserModel;
  @ViewChild('form') forms: NgForm;
  topicList: string[] = [];
  image= null

  constructor(
    private fsStore: AngularFirestore,
    private fsAuth: AngularFireAuth,
    private fsStorage: AngularFireStorage,
    private authSrv: AuthService,
    private spinner : NgxSpinnerService,
    private commonSrv : CommonService
  ) {}

  ngOnInit(): void {
    this.fsStore
      .collection('topics')
      .valueChanges()
      .pipe(

        map((topics:Array<object>)=> {
          return topics
        })
      )
      .subscribe((topics) => {
        topics.map((topic) => {
          let topics = topic
          for (const topic in topics) {
            this.topicList.push(topics[topic]);
          }
        });
      });

    this.authSrv.userCredInfo.subscribe((user) => {
      if(user) {
        this.user = user;
      }
    });
  }

  write(form: NgForm) {
    if (!!this.image) {
      this.spinner.show('mainScreenSpinner')

      let article: articleModel = {
        owner: this.user.username,
        tag: form.value['dropdownTag'], //if you have number,use this syntax
        mintoRead: form.value['minToRead'],  //also this
        itSelf: form.value.itSelf,
        name: form.value.name,
        claps: 0,
        description: form.value.desc,
        ownerId: this.user.userUID,
        isNewArticle : true
      };



      this.fsStore
        .collection('all-articles')
        .doc()
        .set(article)
        .then((x) => {
          let articleID;


            this.fsStore
              .collection('all-articles', (ref) =>
                ref.where('isNewArticle', '==', true)
              )
              .get()
              .subscribe((article) => {
                articleID = article.docs[0].id
              })


          //now getting latest article and then storing image.
          this.fsStore
            .collection('all-articles')
            .get()
            .subscribe((data ) => {
              console.log(articleID)
              //storing article image.
              this.fsStorage
                .ref(
                  'article-images/' +
                  `${this.user.username}/${articleID}/image`
                )
                .put(this.image, {contentType: 'image/jpeg'})
                .then((img) => {
                  this.image = null;
                  img.ref.getDownloadURL().then(url => {
                    this.fsStore
                      .collection('all-articles')
                      .doc(articleID)
                      .update({imgURL: url, id: articleID, isNewArticle : false})
                      .then(() => {
                        this.commonSrv.handleDisplayMessage(MESSAGES.ARTICLE_POSTED)
                        this.spinner.hide('mainScreenSpinner')
                      })
                  })
                });
            })
        });
      this.forms.resetForm();

    } else {
      this.commonSrv.handleDisplayMessage(MESSAGES.SET_IMAGE)

    }
  }

  upload(event) {
    this.image = event.target.files[event.target.files.length -1];
    this.commonSrv.handleDisplayMessage(MESSAGES.IMAGE_UPLOAD)
  }
}
