import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {AngularFireStorage} from "@angular/fire/storage";
import {AngularFireAuth} from "@angular/fire/auth";
import {AuthService} from "../../services/auth.service";
import {NgForm} from "@angular/forms";
import {articleModel} from "../../models/article.model";
import {SignUpModel} from "../../models/sign-up.model";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit {

  userCredInfo: SignUpModel;
  @ViewChild('form') form : NgForm;

  constructor(private afStore: AngularFirestore,
              private afAuth: AngularFireAuth,
              private afS: AngularFireStorage,
              private authSrv: AuthService)
  {
  }

  ngOnInit(): void {

    this.authSrv.userCredInfo.subscribe(user => {
      this.userCredInfo = user;
    })
  }



  write(form: NgForm) {

    let article: articleModel = {
      owner: this.userCredInfo.username,
      tag: form.value.tag,
      mintoRead: form.value['minToRead'], //if you have number,use this syntax
      itSelf: form.value.itSelf,
      claps: 7
    }

    //storing article
    this.afStore.collection('all-articles').doc(`${this.userCredInfo.username}`)
      .collection('articles').doc().set(article).then(
      ()=> {
        //now getting latest article and then storing image.

        this.afStore.collection('all-articles').doc(`${this.userCredInfo.username}`)
          .collection('articles').snapshotChanges().pipe(take(1)).subscribe(data => {
          let articleId =data.pop().payload.doc.id

          //storing article image.
          let file = form.value.file
          this.afS.ref('article-images/' + `${this.userCredInfo.username}/${articleId}`)
            .put(file,{contentType: 'image/jpeg'}).then(()=> {
            console.log('file uploaded.')
          }).then( ()=>

            //getting download url from storage and storing in that article object.
            this.afS.ref(`article-images/${this.userCredInfo.username}/${articleId}`)
              .getDownloadURL().subscribe(url => {

              this.afStore.collection('all-articles').doc(`${this.userCredInfo.username}`)
                .collection('articles').doc(articleId).update({imgURL: url })
            })

          )

        })
      }

    );
  }

  upload(event) {
    this.form.value.file  =event.target.files[0];
  }
}
