import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserModel} from "../../models/user.model";
import {map} from "rxjs/operators";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-dynamic-modal-component',
  template: `
    <div class="modal-dialog animate__animated animate__fadeInUp" style="height: 1vh;">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title"><b>Looks like you are a new user..</b></h3>
        </div>
        <div class="modal-body" fxLayout="column" >
          <h6>Enter the following Details for your profile!</h6>
          <mat-form-field fxFlex >
            <mat-label>Bio:</mat-label>
            <textarea
              [(ngModel)]="bio"
              matInput
              (input)="button.disabled=false"
            ></textarea>
          </mat-form-field>
        </div>
        <div class="modal-footer" >
          <button
            fxFlex
            mat-raised-button
            color="accent"
            disabled="true"
            #button
            (click)="proceedToHome()">
            Proceed to Home!
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DynamicModalComponent {

  constructor(
    private authSrv: AuthService,
    private afStore: AngularFirestore,
    private commonSrv: CommonService
  ) {}

  bio: string;

  proceedToHome() {

    this.authSrv.userCredInfo
      .pipe(
        map((user : UserModel)=> {
          if(!!user){
              return user.userUID}
          else {
            return null}

        }))
      .subscribe((uid) => {
        if(uid !== null) {
          this.afStore
            .collection('users')
            .doc(uid)
            .update({
              bio: this.bio,
              isNewUser: false,
            })
            .then(() => {
              this.commonSrv.clearModalView.complete();
            });
        }
      });



  }
}
