import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {map, take} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent implements OnInit {

  topicList;
  constructor(private fsStore: AngularFirestore,
              private spinner : NgxSpinnerService

  ) { }
  ngOnInit(): void {
    this.spinner.show()
    this.fsStore.collection('topics').doc<object>('SanBNEamwYEo8oZFqzJP').valueChanges()
      .pipe(
        take(1),
        map(
          data => {
            let arrayOfTopics=[];
            for(const item in data) {
               arrayOfTopics.push( data[item])
            }
            return arrayOfTopics
          }
        )
      )
      .subscribe(topics => {

     this.topicList = topics;
     this.spinner.hide()

    })
  }

}
