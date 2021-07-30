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

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css'],
})
export class WriteComponent implements OnInit {
  user: UserModel;
  @ViewChild('form') forms: NgForm;
  topicList: string[] = [];
  image;

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
        ownerId: this.user.userUID
      };

      this.fsStore
        .collection('all-articles')
        .doc()
        .set(article)
        .then((x) => {
          //now getting latest article and then storing image.
          this.fsStore
            .collection('all-articles')
            .snapshotChanges().pipe(
            take(1)
          )
            .subscribe((data) => {
              let articleId = data[0].payload.doc.id
              //storing article image.
              this.fsStorage
                .ref(
                  'article-images/' +
                  `${this.user.username}/${articleId}/image`
                )
                .put(this.image, {contentType: 'image/jpeg'})
                .then((img) => {
                  img.ref.getDownloadURL().then(url => {
                    this.fsStore
                      .collection('all-articles')
                      .doc(articleId)
                      .update({imgURL: url, id: articleId})
                      .then(() => {
                        this.commonSrv.handleDisplayMessage(MESSAGES.ARTICLE_POSTED)
                        this.spinner.hide('mainScreenSpinner')
                      })
                  })
                });
            })
        });
    } else {
      this.commonSrv.handleDisplayMessage(MESSAGES.SET_IMAGE)

    }
  }

  upload(event) {
    this.image = event.target.files[0];
  }
}
