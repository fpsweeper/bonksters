import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.css']
})
export class ProjectModalComponent implements OnInit {

  closeResult = '';

  @Input() public project = {
    name: '',
    pathname: '',
    description: '',
    wallet: '',
    profilepiclink: '',
    profilecoverlink: '',
    twitterlink: '',
    discordlink: '',
    melink: '',
    fvcadd: '',
    colladd: ''
  }

  @Input() public toModify = false;

  pathExist = false
  notValidLink = false

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.project.wallet = sessionStorage.getItem('walletaddress')
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

  async focusOut(){
    if(this.project.pathname.length) {

      if(this.project.pathname.includes(' ') || this.project.pathname.includes('{') ||
      this.project.pathname.includes('}') || this.project.pathname.includes('|') ||
      this.project.pathname.includes('\\') || this.project.pathname.includes('^') ||
      this.project.pathname.includes('~') || this.project.pathname.includes('[') ||
      this.project.pathname.includes(']') || this.project.pathname.includes('`') ||
      this.project.pathname.includes('<') || this.project.pathname.includes('>') ||
      this.project.pathname.includes('/') || this.project.pathname.includes(','))
        this.notValidLink = true
      else
      {
        this.notValidLink = false

        const response = await fetch("https://market8.club:9090/getProject/" + this.project.pathname, {
        method: 'GET',
        headers: {'Content-Type':'application/json'}
        });

        if(response.ok){
          var res0 = await response.text();
          if(res0 != ''){
            this.pathExist = true
          }else{
            this.pathExist = false
          }
          
        }
      }
        
    }
  }

  async submitClicked(){
    if(!this.toModify){
      const response = await fetch("https://market8.club:9090/addProject", {
                method: 'POST',
                body: JSON.stringify(this.project),
                // mode: "no-cors",
                headers: {'Content-Type':'application/json'}
        });

      if(response.ok){
        this.showNotification('bottom', 'right', 'Your request is submitted!')
        this.activeModal.close('Submit');
      }
    }else{
      const response = await fetch("https://market8.club:9090/modifyProject", {
                method: 'POST',
                body: JSON.stringify(this.project),
                // mode: "no-cors",
                headers: {'Content-Type':'application/json'}
        });

      if(response.ok){
        this.showNotification('bottom', 'right', 'Your request is modified!')
        this.activeModal.close('Submit');
      }
    }
    
  }

}
