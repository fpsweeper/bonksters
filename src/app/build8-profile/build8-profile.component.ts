import { Component, OnInit, Inject, ViewEncapsulation  } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Connection, LAMPORTS_PER_SOL, SystemProgram, TransactionMessage, VersionedTransaction, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ActivatedRoute } from '@angular/router';
import { Metaplex } from '@metaplex-foundation/js';
import { resolve } from 'path';
import { AuthService } from '@auth0/auth0-angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ProjectModalComponent} from '../project-modal/project-modal.component'
import {DeleteModalComponent} from '../delete-modal/delete-modal.component'

declare global {
  interface Window {
      phantom:any;
      solflare:any;
      solana:any;
      SolflareApp:any
  }
}

const QUICKNODE_RPC = 'https://aged-purple-layer.solana-mainnet.discover.quiknode.pro/302af2b26a38d66b0645055d51fc02c9c7d906cc/';
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);

const DEV_RPC = 'https://api.devnet.solana.com '
const DEV_SOLANA_CONNECTION = new Connection(DEV_RPC);

declare var $: any;

@Component({
  
  selector: 'app-build8-profile',
  templateUrl: './build8-profile.component.html',
  styleUrls: ['./build8-profile.component.scss']
})

export class Build8ProfileComponent implements OnInit {

  collections = []

  loadingSubs = false
  dccode = ''
  CLIENT_ID = '1058690878555815966'
  CLIENT_SECRET = '1faTSdAK0knyjgzA5YhqrnPJBBwrXA-u'
  REDIRECT_URI = 'https://market8.club/market8profile'
  collsize = 20
  page = 1
  project = null

  profile = {
    dc: '',
    dcid: '',
    dcavatar: '',
    twitter: '',
    twimage: '',
    walladd: '',
    balance: '',
    startdate: '',
    enddate: '',
    status: 'No subscription found'
  }

  constructor(@Inject(DOCUMENT) private doc: Document, private route: ActivatedRoute, public auth: AuthService, private modalService: NgbModal) { 

    const boo = new Promise(async (resolve, reject) => {
      const response = await fetch("https://market8.club:9090/checkUser/" + sessionStorage.getItem('walletaddress'), {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
      });

      if(response.ok){
        var res0 = await response.text();
        const res = JSON.parse(res0.valueOf())
        
        if(res.dcuser != null)
          this.profile.dc = res.dcuser
        if(res.dcimage != null)
          this.profile.dcavatar = res.dcimage
        if(res.twname != null)
          this.profile.twitter = res.twname
        if(res.twpic != null)
          this.profile.twimage = res.twpic
      }
      resolve(true)
    })
    
    boo.then(async res => {
      this.auth.user$.subscribe(async result=> {

          console.log(JSON.stringify({
            twitterid : result.sub.split('|')[1]
            ,name: result.name
            ,updatedat: result.updated_at
            ,twitterpic: result.picture
          }))

          if(this.profile.twitter === ''){

            this.linkTwObj({
              wallet: sessionStorage.getItem('walletaddress'),
              twid: result.sub.split('|')[1],
              twname: result.name,
              twpic: result.picture,
              twupdatedat: result.updated_at
            })

            this.profile.twitter = result.name

          }
          sessionStorage.setItem('twloading', 'false')
      });
    })

    const boo2 = new Promise(async (resolve, reject) => {
      const response = await fetch("https://market8.club:9090/checkSubscription/" + sessionStorage.getItem('walletaddress'), {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
      });

      if(response.ok){
        var res0 = await response.text();
        const res = JSON.parse(res0.valueOf())
        
        if(res != null){
          var sqlDate = new Date();
          var sqlDateNow = new Date();

          var YMDhms = res.enddate.split("-");
          sqlDate.setFullYear(parseInt(YMDhms[0]), parseInt(YMDhms[1])-1,
                                                 parseInt(YMDhms[2]));

          if(sqlDateNow <= sqlDate)
            {
              this.profile.status = 'Active'
              this.profile.startdate = res.startDate
              this.profile.enddate = res.enddate
            }
          else
            {
              this.profile.status = 'Expired'
              this.profile.startdate = res.startDate
              this.profile.enddate = res.enddate
            }
        }

      }
      resolve(true)
    })

    boo2.then(() => {

    })
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
          if(sessionStorage.getItem('twloading') != 'true'){
            if(params != null){
              console.log('params')
              if(params.code != null){
  
                console.log('params.code')
  
                this.dccode = params.code;
  
                if(this.dccode != null){
                  const data = {
                    'client_id': this.CLIENT_ID,
                    'client_secret': this.CLIENT_SECRET,
                    'grant_type': 'authorization_code',
                    'code': this.dccode,
                    'redirect_uri': this.REDIRECT_URI
                  }
      
                var formBody = [];
                for (var property in data) {
                  var encodedKey = encodeURIComponent(property);
                  var encodedValue = encodeURIComponent(data[property]);
                  formBody.push(encodedKey + "=" + encodedValue);
                }
                var formBody1 = formBody.join("&");
      
                fetch("https://discord.com/api/v10/oauth2/token", {
                      method: 'POST',
                      headers: {'Content-Type':'application/x-www-form-urlencoded'},
                      body: formBody1
                    }).then(async (response) => {
                      const res = JSON.parse((await response.text()).valueOf())
                      
                      fetch("https://discord.com/api/v10/oauth2/@me", {
                        method: 'GET',
                        headers: {'Authorization':'Bearer '+ res.access_token}
                      }).then(async (response) => {
      
                        var res = JSON.parse((await response.text()).valueOf())
                        this.profile.dc = res.user.username
                        this.profile.dcid = res.user.id
                        this.profile.dcavatar = 'https://cdn.discordapp.com/avatars/' + res.user.id+"/"+res.user.avatar
  
                        const obj = {
                          "wallet": sessionStorage.getItem('walletaddress'),
                          "dcid": res.user.id,
                          "dcimage": this.profile.dcavatar,
                          "dcuser": res.user.username
                        }

                        console.log('inserting DC ... ' +  JSON.stringify(obj))
                        this.linkDcObj(obj)
      
                      });
      
                    });
                }
              
              }
            }
          }  
    })

    if(sessionStorage.getItem('walletaddress') != null)
    {
      if(sessionStorage.getItem('walletaddress') != '')
      {
        this.profile.walladd = sessionStorage.getItem('walletaddress')

        const boo = new Promise(async (resolve, reject) => {
          let wallet = new PublicKey(this.profile.walladd);
          let balance = await SOLANA_CONNECTION.getBalance(wallet);
          let realBal = balance / LAMPORTS_PER_SOL
          resolve(realBal)
          
        })

        boo.then(res => {
          console.log(res + ` SOL`);
          this.profile.balance = res.toString()
        })

        this.getColl2(sessionStorage.getItem('walletaddress'), new Connection('https://cosmopolitan-intensive-sky.solana-mainnet.discover.quiknode.pro/f8bd3ba00f9fde3e18c3a91fc52e98196995bf31/'
        , 'confirmed'))

        this.getProject()
      }
    }
  }

  linkdc(){
    this.showNotification('bottom','right', 'Discord linked');
  }

  unlinkdc(){
    this.profile.dc = ''

    this.unLinkDcObj({
      "wallet": sessionStorage.getItem('walletaddress')
    })

    this.showNotification('bottom','right', 'Discord unlinked');
  }

  linktwitter(){
    this.profile.twitter = 'Twitter 1'
    this.showNotification('bottom','right', 'Twitter linked');
  }

  unlinktwitter(){
    this.profile.twitter = ''

    this.unLinkTwObj({
      "wallet": sessionStorage.getItem('walletaddress')
    })

    this.showNotification('bottom','right', 'Twitter unlinked');
  }

  showNotification(from, align, msg){
    const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
        icon: "notifications",
        message: msg
    },{
        type: type[color],
        timer: 4000,
        placement: {
            from: from,
            align: align
        },
        template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="fa fa-close"></i></button>' +
          '<i class="fa fa-bell" data-notify="icon"></i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
  }
  
  async getColl2(wallet, solanaConnection){

    const metaplex = new Metaplex(solanaConnection);

    const owner = new PublicKey(wallet);
    const allNFTs = await metaplex.nfts().findAllByOwner({owner});
    this.groupByColls.bind(this)
    this.groupByColls(allNFTs)
    /*this.groupByColls(allNFTs).then(res => {
      console.log(res + ' **********')
    })*/

    //console.log(allNFTs);
  }

  groupByColls(nfts){

      var i = 0;
      var colls = {}

      const result = nfts.reduce(function (r, a) {
          r[a.symbol] = r[a.symbol] || [];
          r[a.symbol].push(a);
          return r;
      }, Object.create(null))

      var res = []
        Object.keys(result).forEach((x, i, array) => {
            
            $.getJSON(result[x][0].uri, (data) => {

              if(data != null){
                var collName = ''
                if(data.collection != null)
                  collName = data.collection.name
                else
                {
                  if(data.name.includes('#'))
                    collName = data.name.split('#')[0]
                  else
                    collName = data.symbol
                }
                res.push({
                    "collection": collName,
                    "image": data.image,
                    "number_of_items": result[x].length
                  })

                  console.log('eeeeer')
                  this.collections.push({
                    "collection": collName,
                    "image": data.image,
                    "number_of_items": result[x].length
                  })
              }
              
            });

            //if(i == array.length -1) resolve(null)
        });
        //resolve(null)

      /*boo.then(x => {
        this.collections = res
        console.log(this.collections)
        resolve(res)
      })*/
      //console.log(result)
    
  }

  loginWithRedirect() {
    sessionStorage.setItem('twloading', 'true')
    this.auth.loginWithRedirect()
  }

  async linkDcObj(obj) {
      const response = await fetch("https://market8.club:9090/linkDc", {
              method: 'POST',
              body: JSON.stringify(obj),
              // mode: "no-cors",
              headers: {'Content-Type':'application/json'}
      });

      if(response.ok)
       this.showNotification('bottom','right', 'Discord linked');
  }

  async unLinkDcObj(obj) {
    const response = await fetch("https://market8.club:9090/unlinkDc", {
            method: 'POST',
            body: JSON.stringify(obj),
            // mode: "no-cors",
            headers: {'Content-Type':'application/json'}
    });
  }

  async linkTwObj(obj) {
    const response = await fetch("https://market8.club:9090/linkTw", {
            method: 'POST',
            body: JSON.stringify(obj),
            // mode: "no-cors",
            headers: {'Content-Type':'application/json'}
    });

    if(response.ok)
     this.showNotification('bottom','right', 'Twitter linked');
  }

  async unLinkTwObj(obj) {
    const response = await fetch("https://market8.club:9090/unlinkTw", {
            method: 'POST',
            body: JSON.stringify(obj),
            // mode: "no-cors",
            headers: {'Content-Type':'application/json'}
    });
  }

  addInColl(obj){
    this.collections.push(obj)
  }

  async renewSubs(months){
    this.loadingSubs = true
    await this.sendSol();
    const response = await fetch("https://market8.club:9090/subscribe/" + sessionStorage.getItem('walletaddress') + "/" + months, {
            method: 'POST',
            // mode: "no-cors",
            headers: {'Content-Type':'application/json'}
    });

    if(response.ok)
    {
      this.showNotification('bottom','right', 'Subscription renewed');
      var res0 = await response.text();
      const res = JSON.parse(res0.valueOf());
      this.profile.status = 'Active'
      this.profile.startdate = res.startDate
      this.profile.enddate = res.enddate
    } 

    this.loadingSubs = false
      
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
        if (window.solflare?.isSolflare || window.SolflareApp){
            if(window.solflare?.isSolflare){
                return window.solflare
            }
        }
    }
  
    window.open('https://phantom.app/', '_blank');
  };


  sendSol = async () => {
    // create array of instructions
    const instructions = [
        SystemProgram.transfer({
        fromPubkey: new PublicKey(sessionStorage.getItem('walletaddress')),
        toPubkey: new PublicKey('6WLx17ztTVnU7BFGc8wEvAuTYv2dNDgvBFFTfuA2fDQv'),
        lamports: LAMPORTS_PER_SOL * 0.05,
        }),
    ];
    const latestBlockHash = await DEV_SOLANA_CONNECTION.getLatestBlockhash('finalized');
    // create v0 compatible message
    const messageV0 = new TransactionMessage({
        payerKey: new PublicKey(sessionStorage.getItem('walletaddress')),
        recentBlockhash: latestBlockHash.blockhash,
        instructions,
    }).compileToV0Message();
    
    // make a versioned transaction
    const transactionV0 = new VersionedTransaction(messageV0);
    
    const provider = this.getProvider(); // see "Detecting the Provider"
    const signedTransaction = await provider.signTransaction(transactionV0, { maxRetries: 10 });
    const signature = await DEV_SOLANA_CONNECTION.sendRawTransaction(signedTransaction.serialize());

    const sss = await this.getConfirmation(DEV_SOLANA_CONNECTION, signature);
    console.log(sss + ' TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTt')
}

  getConfirmation = async (connection: Connection, tx: string) => {
    const result = await connection.getSignatureStatus(tx, {
      searchTransactionHistory: true,
    });
    return result.value?.confirmationStatus;
  };

  async getProject(){

    const response = await fetch("https://market8.club:9090/getProjectByWallet/" + sessionStorage.getItem('walletaddress'), {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
      });

      if(response.ok){
        var res0 = await response.text();
        
        this.project = JSON.parse(res0.valueOf())[0]
      }
  }

  async addProjectModal() {
    const modalRef = this.modalService.open(ProjectModalComponent);
    modalRef.componentInstance.toModify = false;

    modalRef.result.then(async (data) => {
      if(data === 'Submit')
        await this.getProject()
    },
    async (error) => {
      
    });

  }

  async modifyProjectModal() {
    const modalRef = this.modalService.open(ProjectModalComponent);
    modalRef.componentInstance.project = this.project;
    modalRef.componentInstance.toModify = true;

    modalRef.result.then(async (data) => {
      console.log('rrrrrr')
      if(data === 'Submit')
        await this.getProject()
    },
    async (error) => {
      await this.getProject()
    });
  }

  async deleteProjectModal(){

    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.pathName = this.project.pathname;

    modalRef.result.then(async (data) => {
      if(data === 'Submit')
        this.project = null
    },
    async (error) => {
      
    });

  }

}

