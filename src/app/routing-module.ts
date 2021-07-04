import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./component/login/login.component";
import {NgModule} from "@angular/core";
import {SignupComponent} from "./component/signup/signup.component";


const routes : Routes = [
  {path : '', redirectTo:'login',pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path : 'signup', component: SignupComponent}
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
