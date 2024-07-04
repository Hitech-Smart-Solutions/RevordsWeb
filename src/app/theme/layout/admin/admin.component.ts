// Angular import
import { Component, NgZone, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

// Project import
import { BerryConfig } from '../../../app-config';
import { Observable, async } from 'rxjs';
import { CommonService } from '../../../services/CommonService';
import { SpinWheelService } from '../../../services/SpinWheelConfigurationService';
import { ProfileSettingService } from 'src/app/services/ProfileSettingService';
import { Router } from '@angular/router';
import { AppSettings } from './../../../services/Constants';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  refresh: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('closebutton') closebutton;
  // public props
  navCollapsed: boolean;
  navCollapsedMob: boolean;
  windowWidth: number;
  submenuCollapse: boolean;
  bussinessData: any = [];
  logoPath: any;
  selectedBusinessGroup: any = [];
  isSpinRequired: any;
  _defaultOpts: { indexID: number, arctext: string, colorCode: string, probability: number, IsPoints: boolean }[] = [];
  // Constructor
  constructor(private zone: NgZone, private location: Location, private locationStrategy: LocationStrategy,
    private _commonService: CommonService, private _spinwheel: SpinWheelService,
    private _profileService: ProfileSettingService, private _Route: Router) {
    this.isSpinRequired = JSON.parse(localStorage.getItem('IsSpinRequired'))
    this.getbusinessGroups();
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }

    if (current_url === this.location['_baseHref'] + '/layout/theme-compact' || current_url === this.location['_baseHref'] + '/layout/box')
      this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1025 ? BerryConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
  }
  ChangeClass(e) {
  }
  // Life cycle events
  ngOnInit() {
    this.getbusinessGroups();
  }
  async getbusinessGroups() {
    let userID = JSON.parse(localStorage.getItem('UserID'))
    await this._profileService.GetBusinessGroupesByUserID(userID)
      .subscribe({
        next: async (data) => {
          this.bussinessData = data;
          this.selectedBusinessGroup = JSON.parse(localStorage.getItem('BusinessGroup'));
          this.logoPath = "";
          this.logoPath = AppSettings.Root_ENDPOINT + this.selectedBusinessGroup.logoPath;
          //this.logoPath = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.selectedBusinessGroup.logoPath;
        },
        error: error => { }
      });
  }
  async getBussiness() {
    this._commonService.GetBussinessProfilesByGroupID(this.selectedBusinessGroup.id)
      .subscribe({
        next: async (data) => {
          localStorage.setItem('Business', JSON.stringify(data));
          localStorage.setItem('selectedBusiness', JSON.stringify(data[0]));
        },
        error: error => {
        }
      });
  }

  GetSpinWheeldefaultConfigByBusinessGroupID() {
    this._spinwheel.GetSpinWheeldefaultConfigByBusinessGroupID(this.selectedBusinessGroup.id).pipe()
      .subscribe({
        next: (data) => {
          data.forEach(element => {
            this._defaultOpts.push({
              indexID: element.indexID,
              arctext: element.arctext,
              colorCode: element.colorCode,
              probability: element.probability,
              IsPoints: element.isInteger
            });
          });
          localStorage.setItem("OPTS", JSON.stringify(this._defaultOpts));
        },
        error: error => {
          console.log(error);
        }
      });
  }

  async onBussinessSelected(b) {
    localStorage.setItem('BusinessGroup', JSON.stringify(b));
    this.selectedBusinessGroup = b;
    this.logoPath = "";
    this.logoPath = AppSettings.Root_ENDPOINT + this.selectedBusinessGroup.logoPath;
    await this.getBussiness();
    await this.GetSpinWheeldefaultConfigByBusinessGroupID();
    this._Route.navigate(['dashboard']);
    this.closebutton.nativeElement.click();
    this.refresh.emit();
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('selectedBusiness');
    localStorage.removeItem('Business');
    localStorage.removeItem('BusinessGroup');
    localStorage.removeItem('OPTS');
    localStorage.removeItem('UserData');
    this._Route.navigate(['login']);
    // this.currentUserSubject.next(null);
  }
  // public method
  navMobClick() {
    if (this.navCollapsedMob && (document.querySelector('app-navigation.coded-navbar') as HTMLDivElement).classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }
}
