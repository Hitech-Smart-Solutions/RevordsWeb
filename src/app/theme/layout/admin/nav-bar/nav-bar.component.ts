// Angular import
import { Component, EventEmitter, Output, Inject, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { BerryConfig } from '../../../../app-config';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/CommonService';
import { AdminComponent } from '../admin.component';
import { SpinWheelService } from '../../../../services/SpinWheelConfigurationService';

export interface DialogData {
  animal: 'Fortune Plus Oswego LLC' | 'Fortune Plus LLC' | 'Fortune Plus South Elgin LLC';
}
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  // public props
  @Output() onNavCollapse = new EventEmitter();
  @Output() onNavCollapsedMob = new EventEmitter();
  navCollapsed;
  windowWidth: number;
  navCollapsedMob;
  bussinessName: any;
  bussinessData: any = [];
  businessID: string;
  // Constructor
  constructor(public dialog: DialogDataExampleDialog, private _commonService: CommonService,
    private appService: AdminComponent) {
    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1025 ? BerryConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
    let bussiness = JSON.parse(localStorage.getItem('selectedBusiness'));
    if (bussiness == null) {
      this.getBussiness();
    } else {
      let bussiness = JSON.parse(localStorage.getItem('selectedBusiness'));
      this.businessID = bussiness.id;
      this.bussinessName = bussiness.businessName;
    }
  }
  ngOnInit() {
    this.appService.refresh.subscribe(counter => {
      let bussiness = JSON.parse(localStorage.getItem('selectedBusiness'));
      this.businessID = bussiness.id;
      this.bussinessName = bussiness.businessName;
    });
  }
  getBussiness() {
    this._commonService.GetBussinessProfilesByGroupID(1)
      .subscribe({
        next: (data) => {
          this.bussinessData = data;
          localStorage.setItem('Business', JSON.stringify(this.bussinessData));
        },
        error: error => {

        }
      });
  }
  // public method
  navCollapse() {
    if (this.windowWidth >= 1025) {
      this.navCollapsed = !this.navCollapsed;
      this.onNavCollapse.emit();
    }
  }
  // openDialog() {
  // this.dialog.open('mymodal');
  // }
  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.onNavCollapsedMob.emit();
    }
  }
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})
export class DialogDataExampleDialog {
  // @Input() id?: string;
  //   isOpen = false;
  //   private element: any;
  //   title = 'appBootstrap';

  //   closeResult: string = '';
  // constructor(private modalService: NgbModal) {


  // }
  // open(content:any) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // } 
  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return  `with: ${reason}`;
  //   }
  // }
}
