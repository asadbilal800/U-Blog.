import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import {RoutingModule} from "./routing-module";
import { HeaderComponent } from './component/header/header.component';
import { SignupComponent } from './component/signup/signup.component';
import {FormsModule} from "@angular/forms";
import { HomeComponent } from './component/home/home.component';
import {AngularFireModule} from "@angular/fire";
import {firebaseConfig} from "../environments/environment";
import { AngularFirestoreModule} from "@angular/fire/firestore";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {AngularFireStorageModule} from "@angular/fire/storage";
import {AuthService} from "./services/auth.service";
import {AuthGuardServiceActivate} from "./services/auth-guard-activate.service";
import {WindowService} from "./services/window.service";
import { SignupPhoneComponent } from './component/signup/signup-phone/signup-phone.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    SignupComponent,
    HomeComponent,
    SignupPhoneComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
    ,
  ],
  providers: [AuthService,AuthGuardServiceActivate,WindowService],
  bootstrap: [AppComponent]
})
export class AppModule { }
