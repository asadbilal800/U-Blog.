import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {SignUpModel} from "../../models/sign-up.model";

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css']
})
export class MeComponent implements OnInit {

  currentUser : SignUpModel;
  constructor(private authSrv : AuthService

  )
  { }

  ngOnInit(): void {

    this.authSrv.userCredInfo.subscribe(data => {
      this.currentUser = data;
    })
  }

  changePicture(event) {
    let file = event.target.files[0];
    // call db here.!

  }
}
