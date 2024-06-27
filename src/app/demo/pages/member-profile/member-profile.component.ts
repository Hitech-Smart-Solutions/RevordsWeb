import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MemberService } from '../../../services/MemberService';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../services/ToastService';
import { AppSettings } from '../../../services/Constants';
import { TagDefinationService } from '../../../services/TagDefinitionService';
import { CommonService } from '../../../services/CommonService';
import * as XLSX from 'xlsx';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { AdminComponent } from 'src/app/theme/layout/admin/admin.component';
import { UtcConverterService, UtcToLocalTimeFormat } from 'src/app/services/UtcConverterService';
import { catchError, map, startWith, switchMap, pipe, of as observableOf } from 'rxjs';
import { ActivityHistoryService } from 'src/app/services/ActivityHistoryService';
import { BusinessGroupService } from 'src/app/services/BusinessGroupService';

export interface PeriodicElement {
  name: string;
  phone: number;
  status: string;
  source: string;
  currentpoints: string;
  lifetimepoints: string;
  lastvisit: string;
  membersince: string;
  tagname: string;
  businessLocationId: string
}

export class ExportData {
  'Name': string;
  'Phone No': string;
  'Badge': string;
  'Source': string;
  'Current Points': string;
  'Lifetime Points': string;
  'Last Visit': string;
  'Customer Since': string;
  'Tag': string;
  'Email ID': string;
  'Birth Day': string;
  'Birth Month': string;
  'Highroller': string;
  'Freeplayer': string;
  'Lifettime Visits': string;
  'Time Spent': string;
  'Notes': string;
  'Business Location Name': string;
  'Sms Opt In': string;
  'Email Opt In': string;
  'Notification Opt In': string
}

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss']
})
export class MemberProfileComponent {
  button = 'Login';
  isLoading = false;
  formdataLoaded = false;
  businessID: string;
  Password: string;
  searchText: string = "";
  totalMembers: any = 0;
  tooltiptotalmembers: string;
  bronze: any = 0;
  tooltipbronzemembers: string;
  silver: any = 0;
  tooltipsilvermembers: string;
  gold: any = 0;
  tooltipgoldmembers: string;
  platinum: any = 0;
  tooltipplatinummembers: string;
  loading = false;
  totalData: any;
  memberName: any = "";
  tagname: any = "";
  badgename: any = "";
  displayedColumns: string[] = ['name', 'phone', 'status', 'source', 'currentpoints', 'lifetimepoints', 'lastvisit', 'membersince', 'istagged'];
  public dataSource = new MatTableDataSource<any>();
  public dataSourceForFilter = new MatTableDataSource<PeriodicElement>();
  public filtereddata: any = [];
  dataAll = [];
  currentpoints: any;
  membersince: any;
  lastvisit: any;
  lifetimepoints: any = 0;
  totalvisits: any = 0;
  pointstobeadded: any = 0;
  tagList: any = [{ name: 'Tags' }, { name: 'Best' },
  { name: 'Loyal' }, { name: 'New' }, { name: 'At Risk' }, { name: 'InActive' }, { name: 'New Customer' }
    , { name: '#HighRoller$' }];
  public pageSize: any = 50;
  totalPages: any = 0;
  selectedBadgeID = 0;
  public pageNumber = 1;
  disableMemberName = false;
  monthlist: any = [{ name: 'January', id: 1 }, { name: 'February', id: 2 }, { name: 'March', id: 3 }, { name: 'April', id: 4 },
  { name: 'May', id: 5 }, { name: 'June', id: 6 }, { name: 'July', id: 7 },
  { name: 'August', id: 8 }, { name: 'September', id: 9 }, { name: 'October', id: 10 },
  { name: 'November ', id: 11 }, { name: 'December ', id: 12 }];
  dayList: any = [{ name: '1', id: 1 }, { name: '2', id: 2 }, { name: '3', id: 3 }, { name: '4', id: 4 },
  { name: '5', id: 5 }, { name: '6', id: 6 }, { name: '7', id: 7 },
  { name: '8', id: 8 }, { name: '9', id: 9 }, { name: '10', id: 10 },
  { name: '11 ', id: 11 }, { name: '12 ', id: 12 }, { name: '13', id: 13 }, { name: '14', id: 14 }, { name: '15', id: 15 }
    , { name: '16', id: 16 }, { name: '17', id: 17 }, { name: '18', id: 18 }, { name: '19', id: 19 }, { name: '20', id: 20 }
    , { name: '21', id: 21 }, { name: '22', id: 22 }, { name: '23', id: 23 }, { name: '24', id: 24 }, { name: '25', id: 25 }
    , { name: '26', id: 26 }, { name: '27', id: 27 }, { name: '28', id: 28 }, { name: '29', id: 29 }, { name: '30', id: 30 },
  { name: '31', id: 31 }];
  jobForm: FormGroup = this.fb.group({
    id: [''],
    memberName: [''],
    phone: [''],
    email: [''],
    notes: [''],
    currentpoints: [0],
    dayID: [0],
    monthID: [0],
    pointstobeadded: [''],
    isHighroller: [false],
    isFreeplayer: [false],
    businessLocationID: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]]
  });
  pageEvent: PageEvent;
  bussinessData: any = [];
  disableBtnPrevious: boolean = true;
  disableBtnNext: boolean = true;
  MemeberProfileGroup: FormGroup;
  businessGroupID: any;
  fileName = 'ExcelSheet.xlsx';
  allSelected = false;
  submitted: boolean = false;
  isSubmitted: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsSingle: IDropdownSettings = {};
  dropdownSettingsSingleBusiness: IDropdownSettings = {};
  dropdownSettingsMonth: IDropdownSettings = {};
  dropdownSettingsDate: IDropdownSettings = {};
  selectedItems: any = [];
  memberData: any = null;
  smsOptin = false;
  emailOptin = false;
  notificationOptin = false;
  SelectedTagName: any = "";
  SelectedBUisnessName: any = "";
  SelectedSearchText: any = "";
  highroller: boolean = false;
  freePlayer: boolean = false;
  memberProfileID: any = 0;
  activityHistory: any = [];
  phoneNumber: any = '';
  positiveFlagName: any = '';
  negativeFlagName: any = '';

  constructor(private _memberservice: MemberService, private _businessGroupService: BusinessGroupService,
    public toastService: ToastService, private _activityHistoryService: ActivityHistoryService,
    private _liveAnnouncer: LiveAnnouncer, private fb: FormBuilder, private _tagservice: TagDefinationService,
    private _dateConverter: UtcConverterService,) {
    this.businessGroupID = JSON.parse(localStorage.getItem('BusinessGroup'));
    this.jobForm.setValue({
      id: 0,
      phone: "",
      memberName: "",
      email: "",
      notes: "",
      currentpoints: 0,
      dayID: 0,
      monthID: 0,
      pointstobeadded: '',
      isHighroller: false,
      isFreeplayer: false,
      businessLocationID: 0,
      phoneNumber: ['']
    });

    this.MemeberProfileGroup = fb.group({
      tags: [],
      business: [],
      search: [],
      phoneNumber: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]]
    });
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebutton1') closebutton1;

  handleHighRollerChange(event) {
    console.log(event)
    if (event.target.checked) {
      // If High Roller is checked, uncheck Free Player
      // this.freePlayer = false;
      this.jobForm.controls['isFreeplayer'].setValue(false);
    }
  }

  handleFreePlayerChange(event) {
    if (event.target.checked) {
      // If Free Player is checked, uncheck High Roller
      // this.highroller = false;
      this.jobForm.controls['isHighroller'].setValue(false);
    }
  }

  common(type: any) {
    let tagInput = this.MemeberProfileGroup.controls['tags'].value;
    let businessInput = this.MemeberProfileGroup.controls['business'].value;
    let searchInput = this.MemeberProfileGroup.controls['search'].value;
    this.SelectedTagName = tagInput;
    this.SelectedSearchText = searchInput;
    this.selectedBadgeID = type;
    this.pageNumber = 1;
    this.GetMembersData();
  }
  removeDuplicates(myArray, Prop) {
    return myArray.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[Prop]).indexOf(obj[Prop]) === pos;
    });
  }
  showNext() {
    this.totalPages = Math.ceil(parseInt(this.totalData) / parseInt(this.pageSize));
    this.pageNumber++;
    this.GetMembersData();
  }
  showPrevious() {
    this.totalPages = Math.ceil(parseInt(this.totalData) / parseInt(this.pageSize));
    this.pageNumber--;
    this.GetMembersData();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  clearControls() {
    this.isSubmitted = false;
    this.jobForm.setValue({
      id: 0,
      phone: "",
      memberName: "",
      email: "",
      notes: "",
      currentpoints: 0,
      dayID: 0,
      monthID: 0,
      pointstobeadded: '',
      isHighroller: false,
      isFreeplayer: false,
      businessLocationID: '',
      phoneNumber: ['']
    });
    this.jobForm.controls['memberName'].enable();
    this.jobForm.controls['monthID'].enable();
    this.jobForm.controls['dayID'].enable();
    this.jobForm.controls['email'].enable();
    this.jobForm.controls['businessLocationID'].enable();
    this.pointstobeadded = '';
    this.currentpoints = '';
    this.lifetimepoints = 0;
    this.lastvisit = '';
    this.memberName = '';
    this.memberData = null;
    this.smsOptin = false;
    this.emailOptin = false;
    this.notificationOptin = false;
    this.memberProfileID = 0;
    this.phoneNumber = '';
  }
  ngOnInit() {
    this.dropdownSettings = {
      idField: 'id',
      textField: 'businessName',
    };
    this.dropdownSettingsSingle = {
      idField: 'id',
      textField: 'name',
    }
    this.dropdownSettingsSingleBusiness = {
      idField: 'id',
      textField: 'businessName',
      singleSelection: true
    },
      this.dropdownSettingsMonth = {
        idField: 'id',
        textField: 'name',
        singleSelection: true
      },
      this.dropdownSettingsDate = {
        idField: 'id',
        textField: 'name',
        singleSelection: true
      }
    this.pageNumber = 1;
    this.GetMembersData();
    this.dataSource.sort = this.sort;
    this.GetTagData();
    this.GetBusinessGroupByID();
    this.bussinessData = JSON.parse(localStorage.getItem('Business'));
  }
  GetTagData() {
    this._tagservice.GetTagsByBusinessGroupID(this.businessGroupID.id).pipe()
      .subscribe({
        next: (data) => {
          this.tagList = data;
        },
        error: error => {
        }
      });
  }
  GetBusinessGroupByID() {
    this._businessGroupService.GetBusinessGroupByID(this.businessGroupID.id).pipe()
      .subscribe({
        next: (data) => {
          this.positiveFlagName = data.positiveFlagName;
          this.negativeFlagName = data.negativeFlagName;
        },
        error: error => {
        }
      });
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  NewMember() {
    this.clearControls();
  }
  onMobileChange() {
    let newVal = this.jobForm.controls['phoneNumber'].value.replace(/\D/g, '');
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 3) {
      newVal = newVal.replace(/^(\d{0,3})/, '($1)');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) ($2)');
    } else if (newVal.length <= 10) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) ($2)-$3');
    } else {
      newVal = newVal.substring(0, 10);
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) ($2)-$3');
    }
    this.jobForm.controls['phoneNumber'].setValue(newVal);
  }
  async SetData(data) {
    console.log('data', data)
    let month = data[0].birthMonth != null && data[0].birthMonth != '' ?
      this.monthlist.filter(x => x.name.substring(0, 3).toLowerCase() == data[0].birthMonth.toLowerCase()) : [];
    this.memberProfileID = data[0].id;
    await this.jobForm.setValue({
      id: data[0].id,
      phone: data[0].phone,
      memberName: data[0].name,
      email: data[0].emailId,
      notes: data[0].notes,
      currentpoints: data[0].currentpoints,
      dayID: (data[0].birthDay != null ?
        (data[0].birthDay < 10 ? parseInt(data[0].birthDay.substring(1, 2)) : parseInt(data[0].birthDay.substring(0, 2))) : ''),
      monthID: month.length > 0 ? month[0].id : 0,
      pointstobeadded: '',
      isHighroller: data[0].isHighroller.toString() == "true" && data[0].isHighroller != null ? true : false,
      isFreeplayer: data[0].isFreePlayer.toString() == "true" && data[0].isFreePlayer != null ? true : false,
      businessLocationID: data[0].businessLocationId != null && data[0].businessLocationId != '' ? parseInt(data[0].businessLocationId) : 0,
      phoneNumber: data[0].phone
    });
  }
  async EditProfile(id) {
    this.formdataLoaded = false;
    this.clearControls();
    this.disableMemberName = true;
    this.jobForm.controls['memberName'].disable();
    this.jobForm.controls['monthID'].disable();
    this.jobForm.controls['dayID'].disable();
    this.jobForm.controls['email'].disable();
    this.jobForm.controls['businessLocationID'].disable();

    await this._memberservice.GetMemberProfileByProfileID(id).pipe()
      .subscribe({
        next: async (data) => {
          await this.SetData(data);
          this.memberName = data[0].name;
          this.currentpoints = data[0].currentpoints;
          this.membersince = data[0].membersince;
          this.lastvisit = data[0].lastvisit;
          this.lifetimepoints = data[0].lifetimepoints;
          this.totalvisits = data[0].totalvisits;
          this.badgename = data[0].badgeName;
          this.tagname = data[0].tagname;
          this.pointstobeadded = 0;
          this.formdataLoaded = true;
          this.smsOptin = data[0].smsOptin != null ? data[0].smsOptin : false;
          this.emailOptin = data[0].emailOptin != null ? data[0].emailOptin : false;
          this.notificationOptin = data[0].notificationOptin != null ? data[0].notificationOptin : false;
        },
        error: error => {
          this.formdataLoaded = true;
        }
      });
  }
  subtractPoints() {
    this.pointstobeadded = this.pointstobeadded - 1;
    this.jobForm.patchValue({ pointstobeadded: this.pointstobeadded })
  }
  addPoints() {
    this.pointstobeadded = this.pointstobeadded + 1;
    this.jobForm.patchValue({ pointstobeadded: this.pointstobeadded })
  }
  Submit() {
    this.isSubmitted = true;
    if (this.jobForm.invalid) {
      return;
    }
    let id = this.jobForm.controls['id'].value != undefined && this.jobForm.controls['id'].value != '' ? this.jobForm.controls['id'].value : 0;
    let dayID = this.jobForm.controls['dayID'].value;
    let monthId = this.jobForm.controls['monthID'].value;
    let bday = null;
    bday = monthId != null && dayID != null && monthId.length > 0 && dayID.length > 0 ? (new Date().getFullYear() + "-" +
      (monthId[0].id < 10 ? ("0" + monthId[0].id) : monthId[0].id)
      + "-" + (dayID[0].id < 10 ? ("0" + dayID[0].id) : dayID[0].id)) : null;
    this.isLoading = true;
    if (id == 0) {
      let memberPostDetails = {
        "uniqueID": AppSettings.NewGUID(),
        "id": 0,
        "memberName": this.jobForm.controls['memberName'].value,
        "birthDate": dayID != 0 && monthId != 0 ? bday : null,
        "emailID": this.jobForm.controls['email'].value,
        "phoneNo": this.jobForm.controls['phoneNumber'].value,
        "isActive": AppSettings.Active,
        "createdBy": AppSettings.GetCreatedBy(),
        "createdDate": AppSettings.GetDate(),
        "lastModifiedBy": AppSettings.GetLastModifiedBy(),
        "lastModifiedDate": AppSettings.GetDate(),
        "BusinessLocationId": (this.jobForm.controls['businessLocationID'].value)[0].id,
        "memberProfile": [
          {
            "uniqueId": AppSettings.NewGUID(),
            "id": 0,
            "memberId": 0,
            "notes": this.jobForm.controls['notes'].value,
            "badgeId": AppSettings.Bronze,
            "tagId": 0,
            "businessGroupId": this.businessGroupID.id,
            "lastVisitDate": null,
            "lifeTimePoints": this.jobForm.controls['pointstobeadded'].value != "" ? this.jobForm.controls['pointstobeadded'].value : 0,
            "lifeTimeVisits": 0,
            "smsoptIn": false,
            "emailOptIn": this.jobForm.controls['email'].value != "" ? true : false,
            "notificationOptIn": false,
            "isHighroller": this.jobForm.controls['isHighroller'].value != null && this.jobForm.controls['isHighroller'].value != "" ? this.jobForm.controls['isHighroller'].value : false,
            "isFreeplayer": this.jobForm.controls['isFreeplayer'].value != null && this.jobForm.controls['isFreeplayer'].value != "" ? this.jobForm.controls['isFreeplayer'].value : false,
            "currentPoints": this.jobForm.controls['pointstobeadded'] != null && this.jobForm.controls['pointstobeadded'].value != "" && this.jobForm.controls['pointstobeadded'].value != null ? this.jobForm.controls['pointstobeadded'].value : 0,
            "sourceId": 1,// 1 for web - Dashboard source
            "stateId": AppSettings.Approved,
            "isActive": AppSettings.Active,
            "createdBy": AppSettings.GetCreatedBy(),
            "createdDate": AppSettings.GetDate(),
            "lastModifiedBy": AppSettings.GetLastModifiedBy(),
            "lastModifiedDate": AppSettings.GetDate(),
            "baseLocationID": (this.jobForm.controls['businessLocationID'].value)[0].id,
            "member": null
          }
        ]
      }
      console.log(memberPostDetails);
      this._memberservice.PostMemberProfileByPhone(memberPostDetails)
        .subscribe({
          next: (data) => {
            if (this.closebutton != null) {
              this.closebutton.nativeElement.click();
            }
            if (this.closebutton1 != null) {
              this.closebutton1.nativeElement.click();
            }
            this.isLoading = false;
            this.isSubmitted = false;
            this.clearControls();
            this.GetMembersData();
          },
          error: error => {
            this.isLoading = false;
          }
        });
    } else {
      let memberDetails = {
        "id": id,
        "notes": this.jobForm.controls['notes'].value,
        "lastModifiedBy": AppSettings.GetLastModifiedBy(),
        "lastModifiedDate": AppSettings.GetDate(),
        "points": this.jobForm.controls['pointstobeadded'] != null && this.jobForm.controls['pointstobeadded'].value != "" && this.jobForm.controls['pointstobeadded'].value != null ? this.jobForm.controls['pointstobeadded'].value : 0,
        "isHighroller": this.jobForm.controls['isHighroller'].value != null && this.jobForm.controls['isHighroller'].value != "" ? this.jobForm.controls['isHighroller'].value : false,
        "isFreeplayer": this.jobForm.controls['isFreeplayer'].value != null && this.jobForm.controls['isFreeplayer'].value != "" ? this.jobForm.controls['isFreeplayer'].value : false,
      }
      console.log(memberDetails)
      this._memberservice.PutMemberProfileInCustomerScreen(memberDetails.id, memberDetails)
        .subscribe({
          next: (data) => {
            this.closebutton.nativeElement.click();
            this.closebutton1.nativeElement.click();
            this.isLoading = false;
            this.clearControls();
            this.GetMembersData();
          },
          error: error => {
            console.log(error);
            this.isLoading = false;
          }
        });
    }
    this.isSubmitted = false;
  }
  GetMembersData() {
    this.button = 'Processing';
    this.isLoading = true;
    let tagInput = this.MemeberProfileGroup.controls['tags'].value;
    let businessInput = this.MemeberProfileGroup.controls['business'].value;
    let searchInput = this.MemeberProfileGroup.controls['search'].value;
    this.SelectedTagName = tagInput;
    this.SelectedSearchText = searchInput;
    let businessId = "";
    if (businessInput != null && businessInput != undefined && businessInput != '' && businessInput.length > 0) {
      for (let index = 0; index < businessInput.length; index++) {
        businessId += businessInput[index].id + ','
      }
    }
    let tagId = "";
    if (tagInput != null && tagInput != undefined && tagInput != '' && tagInput.length > 0) {
      for (let index = 0; index < tagInput.length; index++) {
        tagId += tagInput[index].id + ','
      }
    }

    let details = {
      "businessGroupId": this.businessGroupID.id,
      "BusinessLocationId": businessId,
      "FilterColumn": searchInput != null && searchInput != '' ? 't.name' : '',
      "FilterValue": searchInput != null && searchInput != '' ? searchInput : '',
      "PageIndex": (this.pageNumber - 1),
      "PageSize": this.pageSize,
      "SortColumn": 't."ID" desc',
      "BadgeId": this.selectedBadgeID,
      "TagId": tagId
    }

    this._memberservice.GetMemberProfileByBusinessGroupId(details).pipe()
      .subscribe({
        next: async (data) => {
          this.dataSource.data = data['table1'];
          this.totalData = parseInt(data['table2'][0].cnt);
          this.totalPages = Math.ceil(parseInt(this.totalData) / parseInt(this.pageSize));
          if (this.pageNumber < this.totalPages) {
            this.disableBtnNext = false;
          } else {
            this.disableBtnNext = true;
          }
          if ((this.pageNumber - 1) > 0) {
            this.disableBtnPrevious = false;
          } else {
            this.disableBtnPrevious = true;
          }

          this.dataSourceForFilter.data = this.dataSource.data;
          if (this.pageNumber == 1) {
            this.totalMembers = 0;
            this.bronze = 0;
            this.silver = 0;
            this.gold = 0;
            this.platinum = 0;

            this.filtereddata = data['table3'];
            if (businessInput == null || businessInput == undefined && businessInput == '' || businessInput.length == 0) {
              this.filtereddata.filter(x => x.businessLocationID == -1).forEach(element => {
                this.totalMembers += element.memberCount;
                if (element.badgeID == 1) {
                  this.bronze += element.memberCount;
                } else if (element.badgeID == 2) {
                  this.silver += element.memberCount;
                } else if (element.badgeID == 3) {
                  this.gold += element.memberCount;
                } else if (element.badgeID == 4) {
                  this.platinum += element.memberCount;
                }
              });
            }
            else {
              this.filtereddata.filter(x => x.businessLocationID != -1).forEach(element => {
                this.totalMembers += element.memberCount;
                if (element.badgeID == 1) {
                  this.bronze += element.memberCount;
                } else if (element.badgeID == 2) {
                  this.silver += element.memberCount;
                } else if (element.badgeID == 3) {
                  this.gold += element.memberCount;
                } else if (element.badgeID == 4) {
                  this.platinum += element.memberCount;
                }
              });
            }
          }
          this.tooltiptotalmembers = "Total Customers signed up including all active/inactive customers. press number for filter.";
          this.tooltipbronzemembers = "Customers who visited for the first time in the past 30 days.";
          this.tooltipsilvermembers = "Customers who visited in the past 30 days, excluding bronze and platinum.";
          this.tooltipgoldmembers = "Customers who visited in the past 20 days, excluding bronze and platinum.";
          this.tooltipplatinummembers = "Customers who have more than 50 lifetime points and have visited in the past 30 days.";
          this.isLoading = false;
        },
        error: error => {
          this.bronze = 0;
          this.gold = 0;
          this.silver = 0;
          this.platinum = 0;
          this.isLoading = false;
          console.log(error);
        }
      });
  }
  exportexcel(): void {
    this.button = 'Processing';
    this.isLoading = true;
    let tagInput = this.MemeberProfileGroup.controls['tags'].value;
    let businessInput1 = this.MemeberProfileGroup.controls['business'].value;
    let searchInput = this.MemeberProfileGroup.controls['search'].value;
    this.SelectedTagName = tagInput;
    this.SelectedSearchText = searchInput;
    let businessId = "";
    if (businessInput1 != null && businessInput1 != undefined && businessInput1 != '' && businessInput1.length) {
      for (let index = 0; index < businessInput1.length; index++) {
        businessId += businessInput1[index].id + ','
      }
    }
    let tagId = "";
    if (tagInput != null && tagInput != undefined && tagInput != '' && tagInput.length) {
      for (let index = 0; index < tagInput.length; index++) {
        tagId += tagInput[index].id + ','
      }
    }

    let details = {
      "businessGroupId": this.businessGroupID.id,
      "BusinessLocationId": businessId,
      "FilterColumn": searchInput != null && searchInput != '' ? 't.name' : '',
      "FilterValue": searchInput != null && searchInput != '' ? searchInput : '',
      "PageIndex": 0,
      "PageSize": 100000,
      "SortColumn": 't."ID" desc',
      "BadgeId": this.selectedBadgeID,
      "TagId": tagId
    }

    this._memberservice.GetMemberProfileByBusinessGroupId(details).pipe()
      .subscribe({
        next: (data1) => {
          console.log(data1)
          let excelData = data1['table1'];
          let data = new Array<ExportData>();

          excelData.forEach(x => {
            data.push({
              'Name': x['name'],
              'Phone No': this.formatPhoneNumber(x['phone']),
              'Badge': x['badgeName'],
              'Source': x['source'],
              'Current Points': x['currentpoints'],
              'Lifetime Points': x['lifetimepoints'],
              'Last Visit': this._dateConverter.convertUtcToLocalTime(x.lastvisit, UtcToLocalTimeFormat.SHORT),
              'Customer Since': this._dateConverter.convertUtcToLocalTime(x.membersince, UtcToLocalTimeFormat.SHORT_DATE),
              'Tag': x['tagname'],
              'Email ID': x['emailId'],
              'Birth Day': x['birthDay'],
              'Birth Month': x['birthMonth'],
              'Highroller': (x['isHighroller']).toString().toLowerCase() == 'true' ? 'Yes' : 'No',
              'Freeplayer': (x['isFreePlayer']).toString().toLowerCase() == 'true' ? 'Yes' : 'No',
              'Lifettime Visits': x['totalvisits'],
              'Time Spent': x['timeSpent'],
              'Notes': x['notes'],
              'Business Location Name': x['businessName'],
              'Sms Opt In': x['smsOptin'],
              'Email Opt In': x['emailOptin'],
              'Notification Opt In': x['notificationOptIn']
            })
          })

          var table: HTMLTableElement = <HTMLTableElement>document.getElementById("tabl");

          var row = table.insertRow(0);
          var cell = row.insertCell(0);
          cell.innerHTML = "Data Filtered By : ";

          var row1 = table.insertRow(1);
          var cell1 = row1.insertCell(0);
          var cell2 = row1.insertCell(1);

          this.SelectedTagName = "";
          if (tagInput != null && tagInput != undefined && tagInput != '' && tagInput.length) {
            for (let index = 0; index < tagInput.length; index++) {
              this.SelectedTagName += tagInput[index].name + ', '
            }
          }

          cell1.innerHTML = "Tag Name : ";
          cell2.innerHTML = this.SelectedTagName;

          var row2 = table.insertRow(2);
          var cell3 = row2.insertCell(0);
          var cell4 = row2.insertCell(1);
          cell3.innerHTML = "Search Text : ";
          cell4.innerHTML = this.SelectedSearchText;

          let businessInput = this.MemeberProfileGroup.controls['business'].value;
          this.SelectedBUisnessName = "";
          if (businessInput != null && businessInput != undefined && businessInput != '' && businessInput.length) {
            for (let index = 0; index < businessInput.length; index++) {
              this.SelectedBUisnessName += businessInput[index].businessName + ', '
            }
          }

          var row3 = table.insertRow(3);
          var cell5 = row3.insertCell(0);
          var cell6 = row3.insertCell(1);
          cell5.innerHTML = "Business Location : ";
          cell6.innerHTML = this.SelectedBUisnessName;

          var row4 = table.insertRow(4);
          var cell7 = row4.insertCell(0);
          var cell8 = row4.insertCell(1);
          cell7.innerHTML = "Downloaded on : ";
          cell8.innerHTML = new Date().toLocaleDateString("en-US") + " " + new Date().toLocaleTimeString("en-US");

          let worksheet_tmp1 = XLSX.utils.table_to_sheet(table);
          let worksheet_tmp2 = XLSX.utils.json_to_sheet(data);

          let a = XLSX.utils.sheet_to_json(worksheet_tmp1, { header: 1 })
          let b = XLSX.utils.sheet_to_json(worksheet_tmp2, { header: 1 })

          a = a.concat(b)
          let worksheet = XLSX.utils.json_to_sheet(a, { skipHeader: true })

          const new_workbook = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(new_workbook, worksheet, "worksheet")
          XLSX.writeFile(new_workbook, this.fileName);

          table.deleteRow(4);
          table.deleteRow(3);
          table.deleteRow(2);
          table.deleteRow(1);
          table.deleteRow(0);

          this.isLoading = false;
        },
        error: error => {
          console.log(error);
          this.isLoading = false;
        }
      });
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  OnPhoneNumberEntererd() {
    this.memberData = null;
    this.isSubmitted = false;
    let phoneNumber = this.jobForm.controls['phoneNumber'].value;
    if (phoneNumber != undefined && phoneNumber != null && phoneNumber != '' && phoneNumber.length == 10) {
      this._memberservice.GetMemberByPhoneNo(phoneNumber).pipe()
        .subscribe({
          next: (data) => {
            this.memberData = data;
          },
          error: error => {
            console.log(error);
          }
        });
    }
  }
  //#region BusinessDropdown
  async onItemSelectAll(items) {
    this.MemeberProfileGroup.controls['business'].setValue(items);
    this.common(0);
  }
  async onDeSelectAll(items) {
    this.MemeberProfileGroup.controls['business'].setValue(items);
    this.common(0);
  }
  //#endregion

  formatPhoneNumber(num) {
    var s2 = ("" + num).replace(/\D/g, '');
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
  }

  getActivityHistoryByMemberID() {
    this.activityHistory = [];
    this._activityHistoryService.GetActivityByMemberId(this.memberProfileID).pipe()
      .subscribe({
        next: async (data) => {
          this.activityHistory = data;
          this.phoneNumber = data[0].phone;
          console.log(this.activityHistory)
        },
        error: error => {
        }
      });
  }
}
