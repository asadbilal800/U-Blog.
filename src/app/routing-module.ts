import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/authentication/login/login.component';
import { NgModule } from '@angular/core';
import { SignupComponent } from './component/authentication/signup/signup.component';
import { HomeComponent } from './component/home/home.component';
import { SignInPhoneComponent } from './component/authentication/login/signIn-phone/signIn-phone.component';
import { WriteComponent } from './component/home/write/write.component';
import { MeComponent } from './component/home/me/me.component';
import { TopicsComponent } from './component/home/topics/topics.component';
import { ProfileFeedComponent } from './component/home/profile-feed/profile-feed.component';
import { ArticleComponent } from './component/home/article/article.component';
import { BookmarksComponent } from './component/home/bookmarks/bookmarks.component';
import { AuthGuard } from './services/authGuard.service';

const routes: Routes = [

  { path: 'login', component: LoginComponent},
  { path: 'sign-in-phone', component: SignInPhoneComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    redirectTo: 'home/feed',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'write',
        component: WriteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'me',
        component: MeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'topics',
        component: TopicsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'feed',
        component: ProfileFeedComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'article/:id',
        component: ArticleComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'bookmarks',
        component: BookmarksComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
