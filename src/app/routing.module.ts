import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./component/login/login.component";
import {NgModule} from "@angular/core";


const routes : Routes = [
  {path : '', redirectTo:'login',pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
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
