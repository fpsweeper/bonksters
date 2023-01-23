import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})

export class SoftwareComponent implements OnInit {

  focus: any;
  focus1: any;
  softwares = [
    {
      projectname: 'GhostKidDao',
      background: '../../assets/img/ghostkid.png',
      description: 'We are coming from the shadows to create the largest DAO on Solana',
      link: 'https://www.ghostkid.io/',
      melink: 'https://magiceden.io/marketplace/ghost_kid_dao',
      twitter: 'https://twitter.com/GhostKidDAO',
      dc: 'https://discord.com/invite/bARRDJ99d9',
      profileimg: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/ghost_kid_dao_pfp_1662325189064.gif'
    },
    {
      projectname: 'GMers',
      background: 'https://www.gmers.io/images/About_Element_1.png',
      description: 'The GMers is a collection of 50,000 stick figures on Solana striving to be the world’s largest DAO',
      link: 'https://www.gmers.io/',
      melink: 'https://magiceden.io/marketplace/gmers',
      twitter: 'https://twitter.com/GMersNFT',
      dc: 'https://discord.com/invite/gsxE5p35js',
      profileimg: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/gmers_pfp_1662860639809.png'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
