import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RewardService } from 'src/app/services/RewardService';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from 'src/app/services/ToastService';
import { DefinationService } from 'src/app/services/DefinationService';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MemberService } from 'src/app/services/MemberService';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Action } from 'rxjs/internal/scheduler/Action';
import { TagDefinationService } from 'src/app/services/TagDefinitionService';
import { AppSettings } from 'src/app/services/Constants';
import { Observable, filter, interval, switchMap, take, takeWhile, timeout, timer } from 'rxjs';

export interface PeriodicElement {
  name: string;
  phone: number;
  status: string;
  source: string;
  currentpoints: string;
  lifetimepoints: string;
  lastvisit: string;
  membersince: string;
  istagged: string;
}

@Component({
  selector: 'app-tag-definition',
  templateUrl: './tagdefinition.component.html',
  styleUrls: ['./tagdefinition.component.scss']
})
export class TagDefinitionComponent {
  isLoading = false;
  isLoadingMember = false;
  buttonname = "Edit Definations";
  businessGroupID: any;
  dataSource: any;
  dataSourceChild: any;
  public dataSourceMembers = new MatTableDataSource<PeriodicElement>();
  dataSourceForPagination: any;
  badgeData: any = [];
  iseditmode = false;
  criteriaList: any = [{ name: 'Visit Count', id: 1 }, { name: 'Amount Spent', id: 2 }, { name: 'Earned Points', id: 3 }, { name: 'Last Visit Date', id: 4 }, { name: 'Current Points', id: 5 }, { name: 'Average Time Spent(mins)', id: 6 }];
  conditionList: any = [{ name: 'Equals', id: 1 }, { name: 'Less Than', id: 2 }, { name: 'Greater Than', id: 3 }];
  displayedColumns: string[] = ['criteriaName', 'tagValue', 'conditionName'];
  displayedColumnsMembers: string[] = ['name', 'phone', 'status', 'source', 'currentpoints', 'lifetimepoints', 'lastvisit', 'membersince', 'istagged'];
  pagesize: any = 5;
  pageNumber: any = 0;
  totalPages: any = 0;
  totalRecords = 100;
  isDataLoaded = false;
  rewardName: any;
  color: any;
  submitted = false;
  jobForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    rewardName: new FormControl(''),
    tagdefinations: new FormArray([])
  });
  pageEvent: PageEvent;
  skillsForms: any;
  public toggle: boolean = false;
  disableBtnPrevious: boolean = true;
  disableBtnNext: boolean = true;
  TagId: any;
  memberCount: any;
  loadingApply = false;
  timesCalledFakeCheck = 0;
  constructor(private _definationservice: DefinationService, public toastService: ToastService,
    private _Route: Router, private toaster: ToastrService,
    private _liveAnnouncer: LiveAnnouncer, private _memberservice: MemberService,
    private fb: FormBuilder, private _tagDefinationService: TagDefinationService) {


  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  AddNew() {
    this.iseditmode = true;
    this.submitted = false;
    this.jobForm.reset();
    this.jobForm = this.fb.group({
      id: [''],
      rewardName: ['', Validators.required],
      tagdefinations: new FormArray([
        new FormGroup({
          id: new FormControl(0),
          tagID: new FormControl(0),
          criteriaID: new FormControl('', [Validators.required]),
          criteriaName: new FormControl(''),
          conditionID: new FormControl('', [Validators.required]),
          conditionName: new FormControl(''),
          type: new FormControl(''),
          tagValue: new FormControl('', [Validators.required])
        }),
      ]),
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.jobForm.controls;
  }

  Cancle() {
    this.iseditmode = false;
    this.submitted = false;
    this.jobForm.reset();
    this.jobForm = this.fb.group({
      id: [''],
      rewardName: ['', Validators.required],
      tagdefinations: new FormArray([])
    });
    this.TagId=0;
    this.disableBtnNext = true;
    this.disableBtnPrevious = true;
  }

  addDetailsFormGroup() {
    let action: any;
    const control = <FormArray>this.jobForm.controls['tagdefinations'];
    action = control.push(
      new FormGroup({
        id: new FormControl(0),
        tagID: new FormControl(this.jobForm.controls['id'].value),
        criteriaID: new FormControl('', [Validators.required]),
        criteriaName: new FormControl(''),
        conditionID: new FormControl('', [Validators.required]),
        conditionName: new FormControl(''),
        type: new FormControl(''),
        tagValue: new FormControl('', [Validators.required])
      }),
    );
  }

  DelDetailsFormGroup(id) {
    let action: any;
    let x: any = this.jobForm.get('tagdefinations');
    const control = <FormArray>this.jobForm.controls['tagdefinations'];
    const index = control.value.findIndex(image => image.id === id.value.id)
    if (index !== -1) control.removeAt(index);
  }

  ngAfterViewInit() {
    this.isDataLoaded = true;
    this.dataSourceMembers.paginator = this.paginator;
  }
  Refresh() {
    this.GetRewardsData();
  }
  Submit() {
    this.submitted = true;
    if (this.jobForm.invalid) {
      return;
    }
    let id = this.jobForm.controls['id'].value != undefined && this.jobForm.controls['id'].value != '' ? this.jobForm.controls['id'].value : 0;
    this.isLoading = true;
    let badgeDetails = {
      "uniqueId": AppSettings.NewGUID(),
      "id": id,
      "name": this.jobForm.controls['rewardName'].value,
      "stateId": AppSettings.Approved,
      "isActive": AppSettings.Active,
      "createdBy": AppSettings.GetCreatedBy(),
      "createdDate": AppSettings.GetDate(),
      "lastModifiedBy": AppSettings.GetCreatedBy(),
      "lastModifiedDate": AppSettings.GetDate(),
      "businessGroupId": this.businessGroupID.id,
      "tagDefinations": this.GetBadgeDefinationDetails()
    }
    if (id == 0) {
      this._tagDefinationService.PostTagDefinationByTagID(badgeDetails)
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.iseditmode = false;
            this.submitted = false;
            this.GetRewardsData();
            this.getExportProgress(data)
            // this.jobForm.reset();
            this.loadingApply = true;
          },
          error: error => {
            this.isLoading = false;
            this.submitted = false;
          }
        });
    } else {
      this._tagDefinationService.PutTagDefinationByTagID(badgeDetails.id, badgeDetails)
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.iseditmode = false;
            this.submitted = false;
            this.GetRewardsData();
            this.getExportProgress(data)
            // this.jobForm.reset();
          },
          error: error => {
            this.isLoading = false;
            this.submitted = false;
          }
        });
    }

    this.jobForm = this.fb.group({
      id: [''],
      rewardName: ['', Validators.required],
      tagdefinations: new FormArray([])
    });
  }
  getExportProgress(trxId) {
    this.loadingApply = true;
     this._tagDefinationService.UpdateSingleTagByID(trxId).subscribe(
        _ => { },
        _ => { },
        () => {
          this.loadingApply = false;
          this.GetRewardsData();
        }
      );
  }
  isStatusCompleted(status){

    return status;
  }
  GetBadgeDefinationDetails() {
    let y: any = this.jobForm.controls['tagdefinations'];
    let details = [];

    for (let detail of y.controls) {
      let tempdefDetails = {
        "uniqueId": AppSettings.NewGUID(),
        "id": detail.value.id != undefined ? detail.value.id : 0,
        "tagID": detail.value.tagID != undefined ? detail.value.tagID : 0,
        "criteriaId": detail.value.criteriaID,
        "stateId": AppSettings.Approved,
        "isActive": AppSettings.Active,
        "createdBy": AppSettings.GetCreatedBy(),
        "createdDate": AppSettings.GetDate(),
        "lastModifiedBy": AppSettings.GetCreatedBy(),
        "lastModifiedDate": AppSettings.GetDate(),
        "businessGroupId": this.businessGroupID.id,
        "tagValue": detail.value.tagValue,
        "conditionType": detail.value.conditionID
      }
      details.push(tempdefDetails);
    }
    return details;
  }

  async Edit(product) {
    this.TagId = product.tagID;
    this.memberCount = product.count;
    this.dataSourceMembers.data = [];
    this.dataSourceForPagination = [];
    this.pageNumber = 0;
    this.totalPages = 0;

    if (this.iseditmode) {
      this.iseditmode = false;
    }
    else {
      this.skillsForms = [];
      this.jobForm.controls['rewardName'].disable();
      this.dataSourceChild = (product.child);
      this.rewardName = product.tagName;
      this.jobForm.patchValue({
        id: product.tagID != undefined && product.tagID != null ? product.tagID : 0,
        rewardName: this.rewardName,
        tagdefinations: []
      });
      await this.getherData();
      this.iseditmode = true;
    }
  }

  clickMethod(badgeDetails) {
    if (confirm("Are you sure to delete " + badgeDetails.tagName + ". If you delete this tag then this tag will removed from the customers.")) {
      this._tagDefinationService.PutTagByTagID(badgeDetails.tagID)
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.iseditmode = false;
            this.submitted = false;
            this.jobForm.reset();
            this.GetRewardsData();
          },
          error: error => {
            this.isLoading = false;
            this.submitted = false;
          }
        });
    }
  }

  async getherData() {
    let action: any;
    const control = <FormArray>this.jobForm.controls['tagdefinations'];
    for (const element of this.dataSourceChild) {
      action = control.push(
        new FormGroup({
          id: new FormControl(element.id == undefined ? 0 : element.id),
          tagID: new FormControl(element.tagID == undefined ? 0 : element.tagID),
          criteriaID: new FormControl(element.criteriaID == undefined ? 0 : element.criteriaID, [Validators.required]),
          criteriaName: new FormControl(element.criteriaName == undefined ? "" : element.criteriaName),
          conditionID: new FormControl(element.conditionID == undefined ? 0 : element.conditionID, [Validators.required]),
          conditionName: new FormControl(element.conditionName == undefined ? "" : element.conditionName),
          type: new FormControl(1),
          tagValue: new FormControl(element.tagValue == undefined ? 0 : element.tagValue, [Validators.required])
        })
      );
    }
    await Promise.resolve(action).then(() => {
    });
  }

  async GetMember() {
    this.isLoadingMember = true;
    this._tagDefinationService.GetMemberProfileByTagId(this.businessGroupID.id, this.TagId).pipe()
      .subscribe({
        next: (data) => {
          this.dataSourceMembers.data = data;
          this.isLoadingMember = false;
        },
        error: error => {
          this.isLoadingMember = false;
        }
      });
  }

  ngOnInit() {
    this.businessGroupID = JSON.parse(localStorage.getItem('BusinessGroup'));
    this.dataSourceMembers.paginator = this.paginator;
    this.submitted = false;
    this.GetRewardsData();
  }
  GetRewardsData() {
    this._tagDefinationService.GetTagDefinationsByBusinessGroupID(this.businessGroupID.id).pipe()
      .subscribe({
        next: (data) => {
          this.dataSource = data;
        },
        error: error => {
          
        }
      });
  }
}
