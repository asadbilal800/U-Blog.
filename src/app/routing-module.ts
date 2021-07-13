import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/authentication/login/login.component';
import { NgModule } from '@angular/core';
import { SignupComponent } from './component/authentication/signup/signup.component';
import { HomeComponent } from './component/home/home.component';
import { SignupPhoneComponent } from './component/authentication/signup/signup-phone/signup-phone.component';
import { WriteComponent } from './component/home/write/write.component';
import { MeComponent } from './component/home/me/me.component';
import { TopicsComponent } from './component/home/topics/topics.component';
import { ProfileFeedComponent } from './component/home/profile-feed/profile-feed.component';
import { ArticleComponent } from './component/home/article/article.component';
import { BookmarksComponent } from './component/home/bookmarks/bookmarks.component';
import { AuthGuardServiceActivate } from './services/auth-guard-activate.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/feed',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/phone', component: SignupPhoneComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardServiceActivate],

    children: [
      {
        path: 'write',
        component: WriteComponent,
        canActivate: [AuthGuardServiceActivate],
      },
      {
        path: 'me',
        component: MeComponent,
        canActivate: [AuthGuardServiceActivate],
      },
      {
        path: 'topics',
        component: TopicsComponent,
        canActivate: [AuthGuardServiceActivate],
      },
      {
        path: 'feed',
        component: ProfileFeedComponent,
        canActivate: [AuthGuardServiceActivate],
      },
      {
        path: 'article/:id',
        component: ArticleComponent,
        canActivate: [AuthGuardServiceActivate],
      },
      {
        path: 'bookmarks',
        component: BookmarksComponent,
        canActivate: [AuthGuardServiceActivate],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
