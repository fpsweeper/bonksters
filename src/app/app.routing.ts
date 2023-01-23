import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ShopComponent } from './shop/shop.component';
import { SoftwareComponent } from './software/software.component';
import { Build8ProfileComponent } from './build8-profile/build8-profile.component';

const routes: Routes =[
   // { path: 'market8profile',             component: Build8ProfileComponent },
   // { path: 'shop',             component: ShopComponent },
   // { path: 'hub',             component: SoftwareComponent },
    { path: 'home',             component: HomeComponent },
   // { path: 'user-profile',     component: ProfileComponent },
   // { path: 'register',           component: SignupComponent },
   // { path: 'landing',          component: LandingComponent },
   // { path: 'login',          component: LoginComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
