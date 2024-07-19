import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastService } from 'src/app/services/ToastService';
import { DefinationService } from 'src/app/services/DefinationService';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppSettings } from 'src/app/services/Constants';

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
  selector: 'app-definationsetting',
  templateUrl: './definationsetting.component.html',
  styleUrls: ['./definationsetting.component.scss']
})

export class DefinationsettingComponent {
  isLoading = false;
  isLoadingMember = false;
  buttonname = "Edit Definations";
  businessID: string;
  dataSource: any;
  dataSourceChild: any;
  public dataSourceMembers = new MatTableDataSource<PeriodicElement>();
  dataSourceForPagination: any;
  badgeData: any = [];
  iseditmode = false;
  submitted = false;
  criteriaList: any = [{ name: 'Visit Count', id: 1 }, { name: 'Amount Spent', id: 2 }, { name: 'Earned Points', id: 3 }, { name: 'Last Visit Date', id: 4 }, { name: 'Current Points', id: 5 }, { name: 'Average Time Spent(mins)', id: 6 }];
  conditionList: any = [{ name: 'Equals', id: 1 }, { name: 'Less Than', id: 2 }, { name: 'Greater Than', id: 3 }];
  displayedColumns: string[] = ['criteriaName', 'badgeValue', 'conditionName'];
  displayedColumnsMembers: string[] = ['name', 'phone', 'status', 'source', 'currentpoints', 'lifetimepoints', 'lastvisit', 'membersince', 'istagged'];
  pagesize: any = 50;
  pageNumber: any = 0;
  totalPages: any = 0;
  totalRecords = 100;
  isDataLoaded = false;
  rewardName: any;
  color: any;
  loadingApply = false;
  jobForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    rewardName: new FormControl(''),
    background: new FormControl(''),
    badgedefinations: new FormArray([])
  });
  skillsForms: any;
  businessGroupID: any;
  public toggle: boolean = false;
  selectedColor: any;
  BadgeId: any;
  memberCount: any;
  disableBtnPrevious: boolean = true;
  disableBtnNext: boolean = true;

  constructor(private _definationservice: DefinationService, public toastService: ToastService,
    private fb: FormBuilder) {
    this.businessGroupID = JSON.parse(localStorage.getItem('BusinessGroup'));
    this.jobForm.controls['rewardName'].disable();
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  get f(): { [key: string]: AbstractControl } {
    return this.jobForm.controls;
  }
  addDetailsFormGroup() {
    let action: any;
    const control = <FormArray>this.jobForm.controls['badgedefinations'];
    action = control.push(
      new FormGroup({
        id: new FormControl(0),
        badgeID: new FormControl(this.jobForm.controls['id'].value),
        criteriaID: new FormControl('', [Validators.required]),
        criteriaName: new FormControl(''),
        conditionID: new FormControl('', [Validators.required]),
        conditionName: new FormControl(''),
        type: new FormControl(''),
        badgeValue: new FormControl('', [Validators.required])
      }),
    );
  }
  DelDetailsFormGroup(id) {
    let action: any;
    let x: any = this.jobForm.get('badgedefinations');
    const control = <FormArray>this.jobForm.controls['badgedefinations'];
    const index = control.value.findIndex(image => image.id === id.value.id)
    if (index !== -1) control.removeAt(index);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSourceMembers.paginator = this.paginatorPageSize;
    }, 2000);
    this.isDataLoaded = true;
  }
  Submit() {
    this.isLoading = true;
    this.submitted = true;
    if (this.jobForm.invalid) {
      this.isLoading = false;
      return;
    }
    let badgeDetails = {
      "uniqueId": AppSettings.NewGUID(),
      "id": this.jobForm.controls['id'].value,
      "name": this.jobForm.controls['rewardName'].value,
      "color": this.jobForm.controls['background'].value,
      "stateId": AppSettings.Approved,
      "isActive": AppSettings.Active,
      "createdBy": AppSettings.GetCreatedBy(),
      "createdDate": AppSettings.GetDate(),
      "lastModifiedBy": AppSettings.GetCreatedBy(),
      "lastModifiedDate": AppSettings.GetDate(),
      "businessGroupId": this.businessGroupID.id,
      "badgeDefinations": this.GetBadgeDefinationDetails()
    }

    this._definationservice.PutBadgeDefinationByBadgeID(badgeDetails.id, badgeDetails)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.iseditmode = false;
          this.GetRewardsData(false);
          this.jobForm = this.fb.group({
            id: [''],
            rewardName: [''],
            background: [''],
            badgedefinations: new FormArray([]),
          });
          this.submitted = false;
          this.getExportProgress(data)
        },
        error: error => {
          this.isLoading = false;
          this.submitted = false;
        }
      });
    this.jobForm = this.fb.group({
      id: [''],
      rewardName: [''],
      background: [''],
      badgedefinations: new FormArray([]),
    });
  }
  getExportProgress(trxId) {
    this.loadingApply = true;
    this._definationservice.UpdateSingleBadgeByID(trxId).subscribe(
      _ => { },
      _ => { },
      () => {
        this.loadingApply = false;
        this.GetRewardsData(false);
      }
    );
  }
  GetBadgeDefinationDetails() {
    let y: any = this.jobForm.controls['badgedefinations'];
    let details = [];
    for (let detail of y.controls) {
      let tempdefDetails = {
        "uniqueId": AppSettings.NewGUID(),
        "id": detail.value.id,
        "badgeId": detail.value.badgeID,
        "criteriaId": detail.value.criteriaID,
        "stateId": AppSettings.Approved,
        "isActive": AppSettings.Active,
        "createdBy": AppSettings.GetCreatedBy(),
        "createdDate": AppSettings.GetDate(),
        "lastModifiedBy": AppSettings.GetCreatedBy(),
        "lastModifiedDate": AppSettings.GetDate(),
        "businessGroupId": this.businessGroupID.id,
        "badgeValue": detail.value.badgeValue,
        "conditionType": detail.value.conditionID
      }
      details.push(tempdefDetails);
    }
    return details;
  }
  async Edit(product) {
    this.BadgeId = product.badgeID;
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
      this.rewardName = product.badgeName;
      let a = product.color.split(',');
      let b = a[2].toString().split(' ');
      let c = b[1];
      this.selectedColor = c;
      this.jobForm.setValue({
        id: product.badgeID,
        rewardName: this.rewardName,
        background: "",
        badgedefinations: []
      });
      await this.getherData();
      // await this.GetMember();
      this.iseditmode = true;
    }
  }
  async getherData() {
    let action: any;
    const control = <FormArray>this.jobForm.controls['badgedefinations'];
    for (const element of this.dataSourceChild) {
      action = control.push(
        new FormGroup({
          id: new FormControl(element.id == undefined ? 0 : element.id),
          badgeID: new FormControl(element.badgeID == undefined ? 0 : element.badgeID),
          criteriaID: new FormControl(element.criteriaID == undefined ? 0 : element.criteriaID, [Validators.required]),
          criteriaName: new FormControl(element.criteriaName == undefined ? "" : element.criteriaName),
          conditionID: new FormControl(element.conditionID == undefined ? 0 : element.conditionID, [Validators.required]),
          conditionName: new FormControl(element.conditionName == undefined ? "" : element.conditionName),
          type: new FormControl(1),
          badgeValue: new FormControl(element.badgeValue == undefined ? 0 : element.badgeValue, [Validators.required])
        })
      );
    }
    await Promise.resolve(action).then(() => {
    });
  }

  async GetMember() {
    this.isLoadingMember = true;
    this._definationservice.GetMemberProfileByBadgeId(this.businessGroupID.id, this.BadgeId).pipe()
      .subscribe({
        next: (data) => {
          this.dataSourceForPagination = data;

          this.pageNumber = 0;
          this.totalPages = 0;
          if (this.dataSourceForPagination.length > 0) {
            this.pageNumber = this.pageNumber + 1;
            this.disableBtnNext = false;
          }

          if (this.dataSourceForPagination.length > 0 && this.dataSourceForPagination.length < this.pagesize) {
            this.totalPages = this.totalPages + 1;
          } else {
            this.totalPages = Math.ceil(parseInt(this.dataSourceForPagination.length) / parseInt(this.pagesize));
          }

          if (this.pageNumber == this.totalPages || this.totalPages == 0) {
            this.disableBtnNext = true;
          }
          this.dataSourceMembers.data = this.dataSourceForPagination.slice(0, this.pagesize);

          // this.dataSourceMembers.data = this.dataSourceMembers.data.filter((t) => t.status == "Bronze")
          // this.showSnackbarAction("Data Loaded...!", "1");
          this.isLoadingMember = false;
        },
        error: error => {
          // this.showSnackbarAction(error.statusText, "2");
          this.isLoadingMember = false;
        }
      });
  }

  ngOnInit() {
    let bussiness = JSON.parse(localStorage.getItem('selectedBusiness'));

    this.GetRewardsData(true);
  }
  Cancle() {
    this.iseditmode = false;
    this.submitted = false;
    this.jobForm = this.fb.group({
      id: [''],
      rewardName: [''],
      background: [''],
      badgedefinations: new FormArray([]),
    });
    this.disableBtnNext = true;
    this.disableBtnPrevious = true;
  }
  GetRewardsData(IsWithToast) {
    this._definationservice.GetBadgeDefinationsByBusinessGroupID(this.businessGroupID.id).pipe()
      .subscribe({
        next: (data) => {
          this.dataSource = data;
        },
        error: error => {
        }
      });
  }

  showNext() {
    this.isLoading = true;
    this.disableBtnPrevious = false;
    this.pageNumber = this.pageNumber + 1;

    if (this.pageNumber == this.totalPages || this.totalPages == 0) {
      this.disableBtnNext = true;
    }

    let newLength = parseInt(this.pageNumber) * parseInt(this.pagesize);
    let fromlength = (parseInt(this.pageNumber) - 1) * parseInt(this.pagesize);
    if (newLength > this.dataSourceForPagination.length) {
      newLength = this.dataSourceForPagination.length
    }
    this.dataSourceMembers.data = this.dataSourceForPagination.slice(fromlength, newLength);
    this.isLoading = false;
  }
  showPrevious() {
    this.isLoading = true;
    this.pageNumber = this.pageNumber - 1;
    this.disableBtnNext = false;
    if (this.pageNumber == 1 || this.pageNumber < 1) {
      this.disableBtnPrevious = true;
    }
    let newLength = (parseInt(this.pageNumber)) * parseInt(this.pagesize);
    let fromlength = (parseInt(this.pageNumber) - 1) * parseInt(this.pagesize);
    if (newLength > this.dataSourceForPagination.length) {
      newLength = this.dataSourceForPagination.length
    }
    this.dataSourceMembers.data = this.dataSourceForPagination.slice(fromlength, newLength);
    this.isLoading = false;
  }
}
