import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {MatSidenav} from "@angular/material/sidenav";
import {CommonService} from "../../services/common.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('sidenav',{static:true}) sideNav : MatSidenav;

  constructor(private router : Router,
              private commonSrv: CommonService,
              private afAuth : AngularFireAuth,
              ) {

  }

   ngOnInit(): void {

     this.commonSrv.sideNavTogglerEmitter.subscribe(()=> {
       this.sideNav.toggle();
     })


  }


  signOut() {
    this.afAuth.signOut().then(null)
    this.router.navigate(['/login'])
    console.log('signing out')
  }

}
