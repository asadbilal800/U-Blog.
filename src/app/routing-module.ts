import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./component/login/login.component";
import {NgModule} from "@angular/core";
import {SignupComponent} from "./component/signup/signup.component";
import {HomeComponent} from "./component/home/home.component";
import {SignupPhoneComponent} from "./component/signup/signup-phone/signup-phone.component";
import {WriteComponent} from "./component/write/write.component";
import {MeComponent} from "./component/me/me.component";
import {TopicsComponent} from "./component/topics/topics.component";
import {ProfileFeedComponent} from "./component/profile-feed/profile-feed.component";
import {ArticleComponent} from "./component/article/article.component";
import {BookmarksComponent} from "./component/bookmarks/bookmarks.component";
import {AuthGuardServiceActivate} from "./services/auth-guard-activate.service";


const routes : Routes = [

  {path : '', redirectTo:'home/feed',pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path : 'signup', component: SignupComponent},
  {path: 'signup/phone', component: SignupPhoneComponent},
  {path : 'home', component: HomeComponent, canActivate: [AuthGuardServiceActivate] ,

    children :[
    {path: 'write', component: WriteComponent, canActivate: [AuthGuardServiceActivate] },
    { path : 'me', component: MeComponent},
    {path: 'topics', component: TopicsComponent},
    {path: 'feed', component: ProfileFeedComponent},
    {path: 'article/:id', component: ArticleComponent},
    {path: 'bookmarks', component: BookmarksComponent},




  ]
  },


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
