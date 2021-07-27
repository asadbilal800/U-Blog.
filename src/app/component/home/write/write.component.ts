import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/auth.service';
import { NgForm } from '@angular/forms';
import { articleModel } from '../../../models/article.model';
import { UserModel } from '../../../models/user.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css'],
})
export class WriteComponent implements OnInit {
  userCredInfo: UserModel;
  @ViewChild('form') forms: NgForm;
  topicList: string[] = [];
  image;

  constructor(
    private afStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private afS: AngularFireStorage,
    private authSrv: AuthService
  ) {}

  ngOnInit(): void {
    this.afStore
      .collection('topics')
      .snapshotChanges()
      .pipe(take(1))
      .subscribe((data) => {
        data.map((topic) => {
          let topics: any = topic.payload.doc.data();
          for (const topic in topics) {
            this.topicList.push(topics[topic]);
          }
          console.log(this.topicList);
        });
      });

    this.authSrv.userCredInfo.subscribe((user) => {
      console.log('i ran');
      this.userCredInfo = user;
      console.log(this.userCredInfo);
    });
  }

  write(form: NgForm) {
    let article: articleModel = {
      owner: this.userCredInfo.username,
      tag: form.value['dropdownTag'], //also for this
      mintoRead: form.value['minToRead'], //if you have number,use this syntax
      itSelf: form.value.itSelf,
      name: form.value.name,
      claps: 7,
      imgURL: '',
      comment: [],
      id: '',
      description: form.value.desc,
    };

    //storing article
    this.afStore
      .collection('all-articles')
      .doc()
      .set(article)
      .then(() => {
        //now getting latest article and then storing image.

        this.afStore
          .collection('all-articles')
          .snapshotChanges()
          .pipe(take(1))
          .subscribe((data) => {
            let articleId = data.pop().payload.doc.id;
            console.log(articleId);

            //storing article Id into its field.

            //storing article image.
            let file = this.image;
            console.log('file to be uploaded : ' + file);
            console.log(this.image);
            this.afS
              .ref(
                'article-images/' +
                  `${this.userCredInfo.username}/${articleId}/image`
              )
              .put(this.image, { contentType: 'image/jpeg' })
              .then(() => {
                console.log('file uploaded.');
              })
              .then(() =>
                //getting download url from storage and storing in that article object.
                this.afS
                  .ref(
                    `article-images/${this.userCredInfo.username}/${articleId}/image`
                  )
                  .getDownloadURL()
                  .subscribe((url) => {
                    console.log('almost done');
                    console.log(url);
                    this.afStore
                      .collection('all-articles')
                      .doc(articleId)
                      .update({ imgURL: url, id: articleId })
                      .then(() => {
                        console.log('success');
                      });
                  })
              );
          });
      });
  }

  upload(event) {
    this.image = event.target.files[0];
  }
}
