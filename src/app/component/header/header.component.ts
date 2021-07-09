import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {HomeComponent} from "../home/home.component";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild(HomeComponent) homeComponent;

  constructor(private afAuth : AngularFireAuth,
              private router : Router,
              private commonSrv : CommonService) {
  }

   ngOnInit(): void {

  }


  toggleSideNav() {
    this.commonSrv.sideNavTogglerEmitter.next();
  }
}
