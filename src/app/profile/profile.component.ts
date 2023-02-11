import { Component, OnInit, Inject, ViewEncapsulation  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ProjectModalComponent} from '../project-modal/project-modal.component'
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomSnackComponent} from '../custom-snack/custom-snack.component'
const { rpc } = require ('../../config.json')
import { FormBuilder, FormControl } from '@angular/forms';
import { concatMap, first, map } from 'rxjs/operators';
import { WalletAdapterNetwork, WalletReadyState, WalletName  } from '@solana/wallet-adapter-base';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';

declare global {
  interface Window {
      phantom:any,
      solflare:any,
      solana:any,
      SolflareApp:any
  }
}

declare var $: any;

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  
  readonly connection$ = this._connectionStore.connection$;
  readonly wallets$ = this._walletStore.wallets$;
  readonly wallet$ = this._walletStore.wallet$;

  wallet = this.wallet$.pipe(
    map((wallet) => wallet?.adapter['_wallet'] || null)
  );

  readonly walletName$ = this.wallet$.pipe(
    map((wallet) => wallet?.adapter.name || null)
  );
  readonly ready$ = this.wallet$.pipe(
    map(
      (wallet) =>
        wallet &&
        (wallet.adapter.readyState === WalletReadyState.Installed ||
          wallet.adapter.readyState === WalletReadyState.Loadable)
    )
  );
  readonly connected$ = this._walletStore.connected$;
  readonly publicKey$ = this._walletStore.publicKey$;
  lamports = 0;
  recipient = '';
  readonly form = this._formBuilder.group<{
    recipient: FormControl<string | null>;
    lamports: FormControl<number | null>;
  }>({
    recipient: this._formBuilder.control(null),
    lamports: this._formBuilder.control(null),
  });


  userFindLoading = false
  user = null
  fileToUpload: File | null = null;
  chargingFileText = 'Upload Profile Picture'
  createLoading = false

  username = ''
  description = ''
  userProfile = {
    profileImg : null
  }

  constructor(private route: ActivatedRoute, private modalService: NgbModal, private _snackBar: MatSnackBar,
            private _connectionStore: ConnectionStore,
            private _walletStore: WalletStore, private readonly _formBuilder: FormBuilder) { 

              
    }

  ngOnInit(): void {

    this._connectionStore.setEndpoint('http://api.mainnet.solana.com');
    this._walletStore.setAdapters([
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
    ]);
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

  getProvider = () => {
    if ('phantom' in window || 'solana' in window) {
      var provider = window.phantom?.solana;
  
      if (provider?.isPhantom) {
        console.log('aaaaaaaaaaaaaa ', provider)
        return provider;
      }

      else{
        provider = window.solana;
        if (provider?.isPhantom) {
          console.log('bbbbbbbbbbbbbbbbbbbbb')
            return provider;
        }
      }

    }else{
        /*if (window.solflare?.isSolflare || window.SolflareApp){
            if(window.solflare?.isSolflare){
                return window.solflare
            }
        }*/
    }
  
    window.open('https://phantom.app/', '_blank');
  };

  async addProjectModal() {
    const modalRef = this.modalService.open(ProjectModalComponent);
    modalRef.componentInstance.toModify = false;

    modalRef.result.then(async (data) => {
      /*if(data === 'Submit')
        await this.getProject()*/
    },
    async (error) => {
      
    });

  }

  async handleFileInput(files: FileList) {
   
    
    //this._walletStore.connect().subscribe()

    //this._hdWalletStore.connect()

    /*const msg = new TextEncoder().encode(`Shadow Drive Signed Message:\nStorage Account: \nUpload files with hash: `);

    const prov = this.getProvider()
    const resp = await prov.connect();

    let msgSig = await prov.signMessage(msg);

    console.log(msgSig , ' -----------------------------')

    const bytes_1 = require("@project-serum/anchor/dist/cjs/utils/bytes");

    const encodedMsg = bytes_1.bs58.encode(msgSig.signature);
    //const encodedMsg = bytes_1.bs58.encode(msgSig.signature);*/
  
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload)
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.fileToUpload);
    fileReader.onload = () => {
      this.userProfile.profileImg = fileReader.result
    }
    this.chargingFileText= 'Charged'

  }

  clearProfilePic(){
    this.fileToUpload = null
    this.userProfile.profileImg = null
    this.chargingFileText= 'Upload Profile Picture'
  }

  async createUserClicked(){
    if(this.username === '' || this.description === '' || this.userProfile.profileImg == null)
      this.openSnackBar2()
    else{
      this.createLoading = true
      console.log('Creating user ...')
      this.createLoading = false
    }
  }

  onDisconnect() {
    this._walletStore.disconnect().subscribe();
  }

  onSelectWallet(walletName: WalletName) {
    this._walletStore.selectWallet(walletName);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['custom-snackbar'],
      verticalPosition: 'top'
    });
  }

  openSnackBar2() {
    this._snackBar.openFromComponent(CustomSnackComponent, {
      duration: 3000,
      panelClass: ['custom-snackbar'],
      verticalPosition: 'top', 
      data: 'Some fields still empty'
    });
  }

  /*async createUser2(){
    await this.solWalletS.connect().then( async wallet => {
      console.log("Wallet connected successfully with this address:", wallet.publicKey);

      let imgFile = {
        base64: this.userProfile.profileImg,
        size: this.fileToUpload.size,
        type: this.fileToUpload.type,
      };
  
      const options = {
          rpcUrl: rpc,
          useIndexer: true
      } as ProtocolOptions
          const prov = this.getProvider()
          const resp = await prov.connect();
          const socialProtocol: SocialProtocol = await new SocialProtocol(wallet, null, options).init() 
          //await socialProtocol.prepareWallet()
  
          let user: User | null = await socialProtocol.getUserByPublicKey(new PublicKey(resp.publicKey.toString())) 
  
          if(user == null){
              const user2: User | null = await socialProtocol.createUser(this.username, null, this.description) 
              console.log(user2, ' ************************')
          }else{
              console.log(user, ' YEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')
          }

    }).catch(err => {
      console.log("Error connecting wallet", err );
    })

    
  }*/

  getWalletFromObservable() {
    return new Promise(resolve=>{

      this.wallet$.pipe(first()).subscribe((res:any) => {
        resolve(res.adapter['_wallet']);
      });
    })
  }

}


