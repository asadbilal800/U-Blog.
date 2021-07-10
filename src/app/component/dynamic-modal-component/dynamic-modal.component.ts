import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {AngularFirestore} from "@angular/fire/firestore";

@Component({
  selector: 'app-dynamic-modal-component',
  template: `
    <div fxLayout="column" fxLayoutAlign="center center" style="padding-top: 10%"  >
      <div class="modalView p-3"  >

        <h3 mat-dialog-title>Looks like you are a new User..</h3>
        <h5> Please Enter the following Details for your profile!</h5>
        <mat-form-field appearance="standard">
          <mat-label>Bio:</mat-label>
          <textarea [(ngModel)]="bio" matInput placeholder="Define Yourself.."
                    (input)="enableButtonFunction()"></textarea>
        </mat-form-field>

      </div>
      <button mat-raised-button color="primary" class="p-3 mt-3" [disabled]="enableButton" (click)="proceedToHome()">
        Proceed to Home!
      </button>

    </div>
  `,
  styleUrls : ['dynamicModal.css']
})
export class DynamicModalComponent implements OnInit {

  bio: string;

  constructor(private authSrv: AuthService,
              private afStore: AngularFirestore
  ) {
  }

  userId;
  enableButton: boolean = true;

  ngOnInit(): void {

    this.authSrv.userUIDObsvr.subscribe(uid => {
      this.userId = uid;
    })

  }

  enableButtonFunction() {
    this.enableButton = false
  }

  proceedToHome() {

    console.log(this.userId)

    this.afStore.collection('users').doc(this.userId).update({
      bio: this.bio, isNewUser : false
    }).then( ()=> {
      this.authSrv.clearModalView.next();
    }
  )
  }



}
