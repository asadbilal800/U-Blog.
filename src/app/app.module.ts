import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import {RoutingModule} from "./routing-module";
import {RouterModule} from "@angular/router";
import { HeaderComponent } from './component/header/header.component';
import { SignupComponent } from './component/signup/signup.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
