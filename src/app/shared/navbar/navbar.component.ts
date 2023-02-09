import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { Keypair, PublicKey } from '@solana/web3.js';
const { rpc } = require ('../../../config.json')
import { SolWalletsService, Wallet } from "angular-sol-wallets" ;
import {PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import {  SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import {ProtocolOptions, SocialProtocol, User} from '@spling/social-protocol'

declare global {
    interface Window {
        phantom:any;
        solflare:any;
        solana:any;
    }
}

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    provider
    _disconnected
    _accountChanged
    public isCollapsed = true;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];
    connected = false
    walletaddress = ''
    userFindLoading = false
    user = null

    profile = {
        name: 'fpsweeper',
        walletaddress: '',
        realwalladd: '',
        img: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
    }

    constructor(public location: Location, private router: Router, 
        private solWalletS : SolWalletsService) {
            solWalletS.setCluster("mainnet-beta");
            const wallets = [
                new PhantomWalletAdapter(),
                new SolflareWalletAdapter(),
              ]
          
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

    fromPhantomStringToWallet(seckey){
        const bs58 = require('bs58');
        const b = bs58.decode(seckey);
        const j = new Uint8Array(b.buffer, b.byteOffset, b.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        var from = Keypair.fromSeed(j.slice(0,32))
  
        return from
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


    async connect(){

        this.provider = this.getProvider(); // see "Detecting the Provider"

        try {
            
            const resp = await this.provider.connect();
            console.log(resp.publicKey.toString());
            
            this.profile.walletaddress = resp.publicKey.toString()
            this.profile.realwalladd = resp.publicKey.toString().substring(0, 7) + ' ... ' + 
                            resp.publicKey.toString().substring(resp.publicKey.toString().length - 3, resp.publicKey.toString().length )
            this.connected = true    

            // To Do -> Get all socials and wallets from database
            sessionStorage.setItem('walletaddress', this.profile.walletaddress)
        } catch (err) {

        }

    }

    async disconnect(){

        let provider: any
        provider = this.getProvider(); 
        await provider.disconnect();
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


    getProvider = () => {
        if ('phantom' in window || 'solana' in window) {
          var provider = window.phantom?.solana;
      
          if (provider?.isPhantom) {
            return provider;
          }

          else{
            provider = window.solana;
            if (provider?.isPhantom) {
                return provider;
            }
          }

        }else{
            if ('solflare' in window || 'solana' in window) {
                const provider = window.solflare;
                if (provider.isSolflare) {
                    return provider;
                }
            }
        }
      
        window.open('https://phantom.app/', '_blank');
    };

    async createUser(){
        const options = {
            rpcUrl: rpc,
            useIndexer: true
        } as ProtocolOptions
            const prov = this.getProvider()
            const resp = await prov.connect();
            console.log(prov, ' ;;;;;;;;;;;;;;;;;;;;;')
            const socialProtocol: SocialProtocol = await new SocialProtocol(prov, null, options).init() 
            //await socialProtocol.prepareWallet()

            let user: User | null = await socialProtocol.getUserByPublicKey(new PublicKey(resp.publicKey.toString())) 

            if(user == null){
                console.log('???????????????????????????????? !!!!!!!')
                const user2: User | null = await socialProtocol.createUser("FpSweeper", null, null) 
                console.log(user2, ' ************************')
            }else{
                console.log(user, ' YEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')
            }
            console.log('???????????????????????????????????????????')
            //console.log(user, ' ***************************************')
            
    }
}
