import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./component/login/login.component";
import {NgModule} from "@angular/core";
import {SignupComponent} from "./component/signup/signup.component";
import {HomeComponent} from "./component/home/home.component";
import {SignupPhoneComponent} from "./component/signup/signup-phone/signup-phone.component";
import {WriteComponent} from "./component/write/write.component";


const routes : Routes = [

  {path : '', redirectTo:'login',pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path : 'signup', component: SignupComponent},
  {path: 'signup/phone', component: SignupPhoneComponent},
  {path : 'home', component: HomeComponent,/* canActivate: [AuthGuardServiceActivate] */},
  {path: 'write', component: WriteComponent,/* canActivate: [AuthGuardServiceActivate] */},


]


@NgModule({
  imports:[
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]

})
export class RoutingModule {
}
