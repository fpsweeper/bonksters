import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';
import { ShopComponent } from './shop/shop.component';
import { SoftwareComponent } from './software/software.component';
import { Build8ProfileComponent } from './build8-profile/build8-profile.component';
import { environment as env } from '../environments/environment';

import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { Navbar2Component } from './shared/navbar2/navbar2.component';


import { SolWalletsModule } from 'angular-sol-wallets';
import { ProjectModalComponent } from './project-modal/project-modal.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    ShopComponent,
    SoftwareComponent,
    Build8ProfileComponent,
    Navbar2Component,
    ProjectModalComponent,
    DeleteModalComponent
  ],
  imports: [
    SolWalletsModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HomeModule,
    AuthModule.forRoot({
      ...env.auth,
      httpInterceptor: {
        ...env.httpInterceptor,
      },
    })
  ],
  /*providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: Window,
      useValue: window,
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          json: () => import('highlight.js/lib/languages/json'),
        },
      },
    },
  ],*/
  bootstrap: [AppComponent]
})
export class AppModule { }
