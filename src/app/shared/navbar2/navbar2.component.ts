import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';

import { SolWalletsService, Wallet } from "angular-sol-wallets" ;
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar2',
  templateUrl: './navbar2.component.html',
  styleUrls: ['./navbar2.component.css']
})
export class Navbar2Component implements OnInit {

  navbarOpen = false;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  public isCollapsed = true;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  connected = false
  walletaddress = ''

  profile = {
      name: 'fpsweeper',
      walletaddress: '',
      realwalladd: '',
      img: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
  }

  constructor(public location: Location, private router: Router, 
      private solWalletS : SolWalletsService) {
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
      if (event instanceof NavigationStart) {
         if (event.url != this.lastPoppedUrl)
             this.yScrollStack.push(window.scrollY);
     } else if (event instanceof NavigationEnd) {
         if (event.url == this.lastPoppedUrl) {
             this.lastPoppedUrl = undefined;
             window.scrollTo(0, this.yScrollStack.pop());
         } else
             window.scrollTo(0, 0);
     }
   });
   this.location.subscribe((ev:PopStateEvent) => {
       this.lastPoppedUrl = ev.url;
   });

  if(sessionStorage.getItem('walletaddress') != null)
  {
          if(sessionStorage.getItem('walletaddress') != '')
          {
              this.profile.walletaddress = sessionStorage.getItem('walletaddress')
              this.profile.realwalladd = this.profile.walletaddress.substring(0, 7) + ' ... ' + 
                                      this.profile.walletaddress.substring(this.profile.walletaddress.length - 3, this.profile.walletaddress.length )
              this.connected = true

              const boo = new Promise(async (resolve, reject) => {
                  const response = await fetch("https://market8.club:9090/checkUser/" + sessionStorage.getItem('walletaddress'), {
                  method: 'GET',
                  headers: {'Content-Type':'application/json'}
                  });

                  if(response.ok){
                      var res0 = await response.text();
                      const res = JSON.parse(res0.valueOf())
                      
                      if(res.dcuser != null)
                        this.profile.img = res.dcimage
                      else
                        if(res.twpic != null)
                          this.profile.img = res.twpic
                  }
                  resolve(true)
              })
              
              boo.then(() => {})
          }
  }

  }

  isHome() {
      var titlee = this.location.prepareExternalUrl(this.location.path());

      if( titlee === '#/home' ) {
          return true;
      }
      else {
          return false;
      }
  }

  isDocumentation() {
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if( titlee === '#/documentation' ) {
          return true;
      }
      else {
          return false;
      }
  }

  /*connect(){
      this.connected = true
  }*/

  connect(){
          this.solWalletS.connect().then(async wallet => {
          console.log("Wallet connected successfully with this address 1:", wallet.publicKey.toJSON());
          this.walletaddress = wallet.publicKey.toJSON()
          this.profile.walletaddress = wallet.publicKey.toJSON()
          this.profile.realwalladd = wallet.publicKey.toJSON().substring(0, 7) + ' ... ' + 
                                     wallet.publicKey.toJSON().substring(wallet.publicKey.toJSON().length - 3, wallet.publicKey.toJSON().length )
          this.connected = true    
          
          // To Do -> Get all socials and wallets from database
          sessionStorage.setItem('walletaddress', this.profile.walletaddress)

          const response = await fetch("https://market8.club:9090/checkUser/" + this.profile.walletaddress, {
              method: 'GET',
              headers: {'Content-Type':'application/json'}
          });

          if (!response.ok)
          {
              console.error("Error");
          }
          else{
              var res0 = await response.text();
              if(res0 === '')
              {
                  console.log('Saving user !!')
                  this.addUser({
                      "wallet": this.profile.walletaddress
                  })
              }
              else{
                  const res = JSON.parse(res0.valueOf())
                  if(res.dcuser != null)
                      this.profile.img = res.dcimage
                  else
                      if(res.twpic != null)
                          this.profile.img = res.twpic
              }
          }
      }).catch(err => {
          console.log("Error connecting wallet", err );
      })
  }

  disconnect(){
      this.connected = false
      this.walletaddress = ''
      sessionStorage.setItem('walletaddress', '')
  }

  async addUser(obj) {
      const response = await fetch("https://market8.club:9090/addUser", {
              method: 'POST',
              body: JSON.stringify(obj),
              // mode: "no-cors",
              headers: {'Content-Type':'application/json'}
      });
  }

  setClass(){
      if(this.isCollapsed)
          return ''
      else
          return 'collapsedmenu'
  }
}
