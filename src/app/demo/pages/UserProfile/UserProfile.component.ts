import { Component, ViewChild } from '@angular/core';
import { UserService } from '../../../services/UserService';
import { BusinessGroupService } from '../../../services/BusinessGroupService';
import { ProfileSettingService } from '../../../services/ProfileSettingService';
import { SourceService } from '../../../services/SourceService';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastService } from '../../../services/ToastService';
import { AppSettings } from '../../../services/Constants';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { CustomLoggerService } from 'src/app/services/CustomLoggerService';

export interface PeriodicElement {
    userId: string;
    userName: string;
    mobile: number;
    email: string;
    firstName: string;
    lastName: string;
    userTypeId: string;
}

@Component({
    selector: 'app-UserProfile',
    templateUrl: './UserProfile.component.html',
    styleUrls: ['./UserProfile.component.scss']
})

export class UserProfileComponent {
    isLoading = false;
    displayedColumns: string[] = ['userName', 'mobile', 'email', 'firstName', 'lastName', 'userTypeId', 'Action'];
    public dataSource = new MatTableDataSource<PeriodicElement>();
    public dataSourceForFilter = new MatTableDataSource<PeriodicElement>();
    public filtereddata: any = [];
    public pageSize = 50;
    public currentPage = 0;
    public totalSize = 0;
    pageEvent: PageEvent;
    bussinessData: any = [];
    bussinessGroupData: any = [];
    SourceData: any = [];
    submitted: boolean = false;
    isSubmitted: boolean = false;
    loading = false;
    iseditmode = false;
    senditlater: any;
    dropdownSettingsSingleBusiness: IDropdownSettings = {};
    dropdownSettingsSingleBusinessGroup: IDropdownSettings = {};
    dropdownSettingsSingleSource: IDropdownSettings = {};
    ProfileFormGroup: FormGroup;
    selectedbusinessgroup: any = [];
    selectedbusinesslocation: any = [];
    selectedSource: any = [];
    id: any = 0;
    existPassword: any = "";
    IsAdmin: any = 0;
    constructor(private _userservice: UserService, public toastService: ToastService,
        private _liveAnnouncer: LiveAnnouncer, private _businessGroupService: BusinessGroupService,
        private _profileSettingService: ProfileSettingService, private _sourceService: SourceService
        , private _customLoggerService: CustomLoggerService) {
        this.GetBusinessGroupData();
        this.ProfileFormGroup = new FormGroup({
            userId: new FormControl(''),
            userName: new FormControl('', Validators.required),
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
            mobile: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]),
            businessLocationID: new FormControl(''),
            businessgroupID: new FormControl('', Validators.required),
            SourceID: new FormControl(''),
            userTypeID: new FormControl('')
        })
    }
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('closebutton') closebutton;
    @ViewChild('closebutton1') closebutton1;

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit() {
        this.GetUsersData();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.GetBusinessGroupData();
        this.dropdownSettingsSingleBusiness = {
            idField: 'id',
            textField: 'businessName',
            singleSelection: true
        }
        this.dropdownSettingsSingleBusinessGroup = {
            idField: 'id',
            textField: 'businessGroupName',
            singleSelection: true
        }
        this.dropdownSettingsSingleSource = {
            idField: 'id',
            textField: 'sourceName',
            singleSelection: true
        }
    }
    numberOnly(event: any) {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            console.log('numberonly');
            return false;
        }
        else {
            console.log('Notnumberonly');
            console.log(charCode);
            this.formatPhoneNumber();
            return true;
        }
    }
    formatPhoneNumber() {
        let s = this.ProfileFormGroup.controls['mobile'].value;
        console.log('Mainnum');
        var s2 = ("" + s).replace(/\D/g, '');
        console.log(s2.length);
        let sf = (!s2) ? null : "(" + s2.slice(0, 3) + ") " + s2.slice(3, 6) + "-" + s2.slice(6);
        this.ProfileFormGroup.controls['mobile'].setValue(sf);
        console.log(this.ProfileFormGroup.controls['mobile'].errors);
    }
    GetBusinessGroupData() {
        this.isLoading = true;
        this._businessGroupService.GetBusinessGroups().pipe()
            .subscribe({
                next: (data) => {
                    console.log('this.bussinessGroupData');
                    this.bussinessGroupData = data;
                    console.log(this.bussinessGroupData);
                },
                error: error => {
                    this._customLoggerService.logError(AppSettings.LoggerAppName, "User Profile > Method : GetBusinessGroupData()", error.message);
                    console.log(error);
                }
            });
        console.log('finalBsinessData');
        console.log(this.bussinessGroupData);
    }

    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    GetUsersData() {
        this.isLoading = true;
        this._userservice.GetUsers().pipe()
            .subscribe({
                next: (data) => {
                    this.dataSource.data = data;
                    this.filtereddata = data;
                    this.dataSourceForFilter.data = this.dataSource.data;
                    this.loading = false;
                    this.isLoading = false;
                },
                error: error => {
                    this._customLoggerService.logError(AppSettings.LoggerAppName, "User Profile > Method : GetUsersData()", error.message);
                    console.log(error);
                    this.isLoading = false;
                }
            });
    }

    Cancle() {
        this.iseditmode = false;
        this.submitted = false;
        this.id = 0;
        this.existPassword = "";
        this.IsAdmin = 0;
        this.ProfileFormGroup.controls['userName'].disable();
        // this.bussinessData = [];
        this.bussinessGroupData = [];
        this.SourceData = [];
        this.selectedbusinessgroup = [];
        this.selectedbusinesslocation = [];
        this.selectedSource = [];
    }

    AddNew() {
        this.Cancle();
        this.iseditmode = true;
        this.submitted = false;
        this.ProfileFormGroup.reset();
        this.GetBusinessGroupData();
    }
    GetGroupDetails() {
        let details = [];
        (this.ProfileFormGroup.controls['businessgroupID'].value).forEach(element => {
            if (element.id != -1) {
                let tempDetails = {
                    "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "id": 0,
                    "userId": this.id,
                    "isActive": AppSettings.Active,
                    "createdBy": AppSettings.GetCreatedBy(),
                    "createdDate": AppSettings.GetDate(),
                    "lastModifiedBy": AppSettings.GetLastModifiedBy(),
                    "lastModifiedDate": AppSettings.GetDate(),
                    "businessLocationId": this.ProfileFormGroup.controls['businessLocationID'].value != null && (this.ProfileFormGroup.controls['businessLocationID'].value)[0] != null ? (this.ProfileFormGroup.controls['businessLocationID'].value)[0].id : null,
                    "sourceId": this.ProfileFormGroup.controls['SourceID'].value != null && (this.ProfileFormGroup.controls['SourceID'].value)[0] != null ? (this.ProfileFormGroup.controls['SourceID'].value)[0].id : null,
                    "user": null,
                    "businessGroupID": element.id,
                }
                details.push(tempDetails);
            }
        });
        return details;
    }
    Save() {
        this.iseditmode = true;
        this.submitted = true;
        if (this.ProfileFormGroup.invalid) {
            console.log('here')
            return;
        }
        this.isLoading = true;
        let Details = {
            "uniqueID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "userId": this.id,
            "userName": this.ProfileFormGroup.controls['userName'].value,
            "password": "2RAazGz7R4eBWOC5NaavQQ==",
            "firstName": this.ProfileFormGroup.controls['firstName'].value,
            "lastName": this.ProfileFormGroup.controls['lastName'].value,
            "isAdministrator": false,
            "mobile": this.ProfileFormGroup.controls['mobile'].value,
            "email": this.ProfileFormGroup.controls['email'].value,
            "isActive": AppSettings.Active,
            "createdBy": AppSettings.GetCreatedBy(),
            "createdDate": AppSettings.GetDate(),
            "lastModifiedBy": AppSettings.GetLastModifiedBy(),
            "lastModifiedDate": AppSettings.GetDate(),
            "userTypeId": this.senditlater,
            "userBusinessMapping": this.GetGroupDetails(),
        }
        console.log(Details);
        if (this.id == 0) {
            this._userservice.PostUsers(Details)
                .subscribe({
                    next: (data) => {
                        this.isLoading = false;
                        this.submitted = false;
                        this.iseditmode = false;
                        this.ProfileFormGroup.reset();
                        this.GetUsersData();
                    },
                    error: error => {
                        this._customLoggerService.logError(AppSettings.LoggerAppName, "User Profile > Method : Save()", error.message);
                        this.isLoading = false;
                        this.iseditmode = true;
                        this.submitted = false;
                    }
                });
        }
        else {
            this._userservice.PutUserProfile(this.id, Details)
                .subscribe({
                    next: (data) => {
                        this.isLoading = false;
                        this.submitted = false;
                        this.iseditmode = false;
                        this.ProfileFormGroup.reset();
                        this.GetUsersData();
                    },
                    error: error => {
                        this._customLoggerService.logError(AppSettings.LoggerAppName, "User Profile > Method : Save()", error.message);
                        this.isLoading = false;
                        this.iseditmode = true;
                        this.submitted = false;
                    }
                });
        }

    }

    handleChange(evt: string) {
        this.senditlater = evt;
        this.ProfileFormGroup.controls['userTypeID'].setValue(evt);
        this.dropdownSettingsSingleBusinessGroup = { singleSelection: evt == '1' ? false : true };
        this.selectedbusinessgroup = [];
        this.selectedbusinesslocation = [];
        this.selectedSource = [];
    }
    async ontextchanged(control) {
        let val = this.ProfileFormGroup.controls['email'].value;
        this.ProfileFormGroup.controls['userName'].setValue(val);
    }
    async Edit(id) {
        this.Cancle();
        this.iseditmode = true;
        this.ProfileFormGroup.controls['userName'].disable();
        this.id = id;
        await this._userservice.GetUsersByID(id).pipe()
            .subscribe({
                next: async (data) => {
                    await this.SetData(data);

                },
                error: error => {
                    this._customLoggerService.logError(AppSettings.LoggerAppName, "User Profile > Method : Edit()", error.message);
                    this.iseditmode = true;
                }
            });
    }

    async SetData(data) {
        this.existPassword = data[0].password;
        this.IsAdmin = data[0].isAdministrator;
        this.senditlater = data[0].userTypeId;
        this.GetBusinessGroupData();
        this.selectedbusinessgroup = [
            { id: data[0].business[0].businessGroupID, businessGroupName: data[0].business[0].businessGroupName }
        ];
        this.onChangeBusinessGroup();

        this.selectedbusinesslocation = [{
            id: data[0].business[0].businessLocationId, businessName: data[0].business[0].businessLocationName
        }];
        this.onChangeBusinessLocation();

        this.selectedSource = [{
            id: data[0].business[0].sourceId, sourceName: data[0].business[0].sourceName
        }];
        console.log('editusertype');

        this.dropdownSettingsSingleBusinessGroup = { singleSelection: this.senditlater == '1' ? false : true };
        console.log(this.senditlater);
        console.log(this.bussinessGroupData);
        console.log(this.selectedbusinessgroup);

        await this.ProfileFormGroup.setValue({
            userId: data[0].userId,
            userName: data[0].userName,
            firstName: data[0].firstName,
            lastName: data[0].lastName,
            email: data[0].email,
            mobile: data[0].mobile,
            businessgroupID: this.selectedbusinessgroup,
            businessLocationID: this.selectedbusinesslocation,
            userTypeID: data[0].userTypeId,
            SourceID: this.selectedSource
        });
        this.formatPhoneNumber();
    }

    onChangeBusinessGroup() {
        let GroupID = this.id != 0 ? this.selectedbusinessgroup[0].id : (this.ProfileFormGroup.controls['businessgroupID'].value)[0].id;
        this.bussinessData = [];
        this.SourceData = [];
        this._profileSettingService.GetBusinessProfilesByGroupID(GroupID).pipe()
            .subscribe({
                next: async (data) => {
                    this.bussinessData = data;

                },
                error: error => {
                    this._customLoggerService.logError(AppSettings.LoggerAppName, "User Profile > Method : onChangeBusinessGroup()", error.message);
                }
            });
    }

    onChangeBusinessLocation() {
        let LocationID = this.id != 0 ? this.selectedbusinesslocation[0].id : (this.ProfileFormGroup.controls['businessLocationID'].value)[0].id;
        this.SourceData = [];
        this._sourceService.GetSources().pipe()
            .subscribe({
                next: async (data) => {
                    this.SourceData = data.filter(item => (item.businessLocationID == LocationID));
                },
                error: error => {
                    this._customLoggerService.logError(AppSettings.LoggerAppName, "User Profile > Method : onChangeBusinessLocation()", error.message);
                }
            });
    }
}