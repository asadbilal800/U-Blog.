import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/authentication/login/login.component';
import { RoutingModule } from './routing-module';
import { HeaderComponent } from './component/header/header.component';
import { SignupComponent } from './component/authentication/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './component/home/home.component';
import { AngularFireModule } from '@angular/fire';
import { firebaseConfig } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AuthService } from './services/auth.service';
import { AuthGuardServiceActivate } from './services/auth-guard-activate.service';
import { SignInPhoneComponent } from './component/authentication/login/signIn-phone/signIn-phone.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { WriteComponent } from './component/home/write/write.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatCardModule } from '@angular/material/card';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonService } from './services/common.service';
import { MatListModule } from '@angular/material/list';
import { MeComponent } from './component/home/me/me.component';
import { TopicsComponent } from './component/home/topics/topics.component';
import { ProfileFeedComponent } from './component/home/profile-feed/profile-feed.component';
import { ArticleComponent } from './component/home/article/article.component';
import { BookmarksComponent } from './component/home/bookmarks/bookmarks.component';
import { DynamicModalComponent } from './component/dynamic-modal-component/dynamic-modal.component';
import { ModalDirective } from './directives/modal.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomPipe } from './pipes/custom.pipe';
import {MatBadgeModule} from "@angular/material/badge";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    SignupComponent,
    HomeComponent,
    SignInPhoneComponent,
    WriteComponent,
    MeComponent,
    TopicsComponent,
    ProfileFeedComponent,
    ArticleComponent,
    BookmarksComponent,
    DynamicModalComponent,
    ModalDirective,
    CustomPipe,
  ],
    imports: [
        BrowserModule,
        RoutingModule,
        FormsModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatOptionModule,
        MatToolbarModule,
        FlexModule,
        MatDividerModule,
        InfiniteScrollModule,
        MatCardModule,
        NgxSpinnerModule,
        MatSidenavModule,
        MatListModule,
        MatDialogModule,
        MatChipsModule,
        MatSnackBarModule,
        NgxMatFileInputModule,
        MatTooltipModule,
        MatBadgeModule,
    ],
  providers: [
    AuthService,
    AuthGuardServiceActivate,
    CommonService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
