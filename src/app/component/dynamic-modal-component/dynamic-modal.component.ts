import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserModel} from "../../models/user.model";
import {map} from "rxjs/operators";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-dynamic-modal-component',
  template: `
    <div class="modal-dialog animate__animated animate__fadeInUp">
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
              (input)="checkInput()"
            ></textarea>
          </mat-form-field>
        </div>
        <div class="modal-footer" >
          <button
            fxFlex
            mat-raised-button
            color="accent"
            [disabled]="inputEmpty"
            #buttonSubmit
            (click)="proceedToHome()">
            Proceed to Home!
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DynamicModalComponent {
  bio: string;
  inputEmpty: boolean = true
  constructor(
    private authSrv: AuthService,
    private afStore: AngularFirestore,
    private commonSrv: CommonService
  ) {}


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
              this.authSrv.getUserDataFromFirebase(uid)
              this.commonSrv.clearModalView.complete();
            });
        }
      });


  }

  checkInput() {
    (this.bio) ? this.inputEmpty = false : this.inputEmpty =true
  }
}
