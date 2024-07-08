import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { AutopilotConfigService } from '../../../services/AutopilotConfigService';
import { ToastService } from '../../../services/ToastService';

export interface PeriodicElement {
  active: string;
  campaignType: string;
  purpose: string;
  reward: string;
  expiration: string;
  campaignTypeID: string;
  id: string;
}

@Component({
  selector: 'app-autopilotsetting',
  templateUrl: './autopilotsetting.component.html',
  styleUrls: ['./autopilotsetting.component.scss']
})
export class AutopilotsettingComponent {
  button = 'Login';
  isLoading = false;
  businessGroupID: any;
  loading = false;
  isDataLoaded = false;
  buttonname = "Edit Campaign";
  iseditmode = false;
  pendingcharacter = "0";
  displayedColumns: string[] = ['active', 'campaignType', 'purpose', 'reward', 'expiration'];
  pageSizes = [50];
  public dataSource = new MatTableDataSource<PeriodicElement>();
  public dataSourceForFilter = new MatTableDataSource<PeriodicElement>();
  dataAll = [];
  totalRecords = 100;
  autopilotFormGroup: FormGroup;
  autopilotData: any = [];
  checked: boolean = true;
  signUpRewardTooltip: string = "Customers receive the sign up reward instantly on the Customer Touchscreen when they sign up in store. No additional message is sent";
  lostTooltip: string = "Lost campaigns are only sent via email and mobile app";
  subjectCharacterCount: any =[];
  constructor(private _autopilotConfigService: AutopilotConfigService, private fb: FormBuilder,
    private _Route: Router, public toastService: ToastService, private _snackBar: MatSnackBar, private _liveAnnouncer: LiveAnnouncer) {
    this.autopilotFormGroup = this.fb.group({
      autopilotFormArray: new FormArray([
        new FormGroup({
          isActive: new FormControl('', [Validators.required]),
          campaignType: new FormControl('', [Validators.required]),
          purposeParameter: new FormControl('', [Validators.required]),
          reward: new FormControl('', [Validators.required]),
          expiration: new FormControl('', [Validators.required]),
          id: new FormControl('', [Validators.required])
        }),
      ]),
    });
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  @Output() changed = new EventEmitter<boolean>();

  ngOnInit() {
    this.businessGroupID = JSON.parse(localStorage.getItem('BusinessGroup'));
    this.GetMembersData();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.autopilotFormGroup.controls;
  }
  showSnackbarAction(message: string, action: string) {
    if (action == "1") {
      this.toastService.showSuccess(message);
    } else if (action == "2") {
      this.toastService.showDanger(message);
    }
  }
  async Edit() {
    if (this.iseditmode) {
      this.iseditmode = false;
      this.buttonname = "Edit Autopilot"

      let model = {
        "detail": this.getDetail()
      }

      this._autopilotConfigService.PutAutoPilotConfig(model).subscribe({
        next: (data) => {
          console.log('ddsf',data)
          this.isLoading = false;
          this.iseditmode = false;
          this.GetMembersData();
        },
        error: error => {
          console.log('ddsf',error)
          this.isLoading = false;
        }
      });
    }
    else {
      this.iseditmode = true;
      this.buttonname = "Save Changes"

      this.autopilotFormGroup = this.fb.group({
        autopilotFormArray: new FormArray([
        ]),
      });

      let action: any;
      const control = <FormArray>this.autopilotFormGroup.controls['autopilotFormArray'];
      let i=0;
      for (const element of this.autopilotData) {
        this.subjectCharacterCount[i] = element.reward.length;
        action = control.push(
          new FormGroup({
            isActive: new FormControl(element.active == undefined ? false : element.active),
            reward: new FormControl(element.reward == undefined ? "" : element.reward),
            expiration: new FormControl(element.expiration == undefined ? "" : element.expiration),
            purposeParameter: new FormControl(element.purposeParameter),
            id: new FormControl(element.id)
          })
        );
        i=i+1;
      }
      await Promise.resolve(action).then(() => {
      });
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  GetMembersData() {
    this.isLoading = true;
    this.button = 'Processing';
    this._autopilotConfigService.GetAutoPilotByBusinessGroupID(this.businessGroupID.id).pipe()
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSourceForFilter.data = data;
          this.autopilotData = data;
          this.loading = false;
          this.isLoading = false;
        },
        error: error => {
          console.log(error);
          this.isLoading = false;
        }
      });
  }

  getDetail() {
    let y: any = this.autopilotFormGroup.controls['autopilotFormArray'];
    let details = [];
    for (let detail of y.controls) {
      if (detail.dirty) {
        let tempdefDetails = {
          "id": detail.value.id != undefined ? detail.value.id : 0,
          "active": detail.value.isActive != undefined ? detail.value.isActive : false,
          "expiration": detail.value.expiration != undefined ? detail.value.expiration : 0,
          "purposeParameter": detail.value.purposeParameter != undefined ? detail.value.purposeParameter : 0,
          "reward": detail.value.reward != undefined ? detail.value.reward : ""
        }
        details.push(tempdefDetails);
      }
    }
    return details;
  }

  ontextchanged(length, i) {
    let l = (this.autopilotFormGroup.controls['autopilotFormArray'].value[i].reward).length;
    this.subjectCharacterCount[i] = length - l;

  }
}
