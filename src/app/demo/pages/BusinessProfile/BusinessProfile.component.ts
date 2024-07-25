import { Component, ViewChild } from '@angular/core';
import { ProfileSettingService } from '../../../services/ProfileSettingService';
import { StateService } from '../../../services/StateService';
import { BusinessLabelService } from '../../../services/businessLabelService';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FileUploadService } from '../../../services/fileuploadservie';
import { HttpEventType } from '@angular/common/http';
import { AppSettings } from '../../../services/Constants';
import { ToastService } from '../../../services/ToastService';
import * as moment from "moment";
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { BusinessGroupService } from '../../../services/BusinessGroupService';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomLoggerService } from 'src/app/services/CustomLoggerService';

export interface PeriodicElement {
    BusinessGroupName: string;
    BusinessName: string;
    ShortName: string;
    Industry: string;
    City: string;
    PinCode: string;
}

@Component({
    selector: 'app-BusinessProfile',
    templateUrl: './BusinessProfile.component.html',
    styleUrls: ['./BusinessProfile.component.scss']
})
export class BusinessProfileComponent {
    businessGroupID: any;
    businessID: any;
    countryID: number = 2;
    app: any;
    x: any;
    labelsReq: any = false;
    businessNameTooltip: string = "You can contact Support to change your business name";
    shortNameTooltip: string = "We use your business short name when sending out mobile campaigns and some places on the website. You can contact Support to change your business short name";
    hoursTooltip: string = "One day per line.";
    industryTooltip: string = "Choosing an Industry helps us cater the Revords program better to your unique business. You can contact Support to change your Industry";
    businessLabelsTooltip: string = "Accurate and specific labels help customers find your business easier.";
    websiteTooltip: string = "The full URL! This includes the http:// or https:// at the beginning for the best SEO results.";
    facebookURLTooltip: string = "The full URL! This includes the http:// or https:// at the beginning for the best SEO results.";
    googleURLTooltip: string = "The full URL! This includes the http:// or https:// at the beginning for the best SEO results.";
    yelpURLTooltip: string = "The full URL! This includes the http:// or https:// at the beginning for the best SEO results.";
    states: any = [];
    businessLabels: any = [];
    dropdownSettingsSingleBusinessGroup: IDropdownSettings = {};
    ProfileFormGroup: FormGroup;
    selectedBusiness: { id: number, name: string }[] = [];
    filteredBusiness: any = [];
    file: File = null;
    file1: File = null;
    uploadProgress: any = undefined;
    uploadProgress1: any = undefined;
    uploadSub: Subscription;
    uploadSub1: Subscription;
    loadingLoading: boolean = false;
    isfileUploaded = false;
    isfileUploaded1 = false;
    submitted = false;
    isLoading = false;
    imagePath: any;
    logoPath: any;
    latitude: any;
    longitude: any;
    uniqueId: any;
    id: any;
    public dataSource = new MatTableDataSource<PeriodicElement>();
    labels: any;
    workingHoursID: any;
    iseditmode: any = false;
    workingHoursUniqueID: any;
    BusinessImageUrl1: any;
    BusinessImageUrl2: any;
    bussinessGroupData: any = [];
    selectedbusinessgroup: any = [];
    galleryFile1: File = null;
    galleryFile2: File = null;
    galleryFile3: File = null;
    galleryFile4: File = null;
    galleryuploadSub1: Subscription;
    galleryuploadSub2: Subscription;
    galleryuploadSub3: Subscription;
    galleryuploadSub4: Subscription;
    galleryuploadProgress1: any = undefined;
    GalleryImageUrl1: any;
    GalleryPath1: any;
    galleryuploadProgress2: any = undefined;
    GalleryImageUrl2: any;
    GalleryPath2: any;
    galleryuploadProgress3: any = undefined;
    GalleryImageUrl3: any;
    GalleryPath3: any;
    galleryuploadProgress4: any = undefined;
    GalleryImageUrl4: any;
    GalleryPath4: any;
    displayedColumns: string[] = ['BusinessGroupName', 'BusinessName', 'ShortName', 'Industry', 'City', 'PinCode', 'Action'];
    isAgeRestriction: Boolean = false;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginator') paginator: MatPaginator;

    constructor(private profileSettingService: ProfileSettingService, private stateService: StateService,
        private businessLabelService: BusinessLabelService, private uploadService: FileUploadService,
        public toastService: ToastService, private _businessGroupService: BusinessGroupService,
        private _customLoggerService: CustomLoggerService) {
        // this.businessGroupID = JSON.parse(localStorage.getItem('BusinessGroup'));
        this.ProfileFormGroup = new FormGroup({
            businessName: new FormControl('', Validators.required),
            shortName: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            city: new FormControl('', Validators.required),
            stateCodeId: new FormControl('', Validators.required),
            phoneNo: new FormControl('', Validators.required),
            pinCode: new FormControl('', Validators.required),
            industry: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            businessgroupID: new FormControl('', Validators.required),
            label: new FormControl(''),
            website: new FormControl(''),
            facebookUrl: new FormControl(''),
            twitterUrl: new FormControl(''),
            googleUrl: new FormControl(''),
            instagramUrl: new FormControl(''),
            yelpUrl: new FormControl(''),
            monFromTime: new FormControl(''),
            monToTime: new FormControl(''),
            tueFromTime: new FormControl(''),
            tueToTime: new FormControl(''),
            wedFromTime: new FormControl(''),
            wedToTime: new FormControl(''),
            thuFromTime: new FormControl(''),
            thuToTime: new FormControl(''),
            friFromTime: new FormControl(''),
            friToTime: new FormControl(''),
            satFromTime: new FormControl(''),
            satToTime: new FormControl(''),
            sunFromTime: new FormControl(''),
            sunToTime: new FormControl(''),
        })

        this.ProfileFormGroup.controls['businessName'].disable();
        this.ProfileFormGroup.controls['shortName'].disable();
        //this.ProfileFormGroup.controls['businessgroupID'].disable();
    }

    ngOnInit() {
        this.GetStatesByCountryID();
        this.GetBusinessLabelsByBusinessID();
        this.GetBusinessProfilesByGroupID();
        this.dropdownSettingsSingleBusinessGroup = {
            idField: 'id',
            textField: 'businessGroupName',
            singleSelection: true
        }
    }
    Cancle() {
        this.iseditmode = false;
        this.businessID = 0;
        this.file = null;
        this.file1 = null;
        this.uploadProgress = undefined;
        this.uploadProgress1 = undefined;
        this.BusinessImageUrl1 = '';
        this.BusinessImageUrl2 = '';
        this.galleryFile1 = null;
        this.galleryFile2 = null;
        this.galleryFile3 = null;
        this.galleryFile4 = null;
        this.galleryuploadProgress1 = undefined;
        this.galleryuploadProgress2 = undefined;
        this.galleryuploadProgress3 = undefined;
        this.galleryuploadProgress4 = undefined;
        this.GalleryImageUrl1 = '';
        this.GalleryImageUrl2 = '';
        this.GalleryImageUrl3 = '';
        this.GalleryImageUrl4 = '';
        this.ProfileFormGroup.controls['businessName'].enable();
        this.ProfileFormGroup.controls['shortName'].enable();
        this.id = 0;
        this.uniqueId = '';
        this.latitude = '';
        this.longitude = '';
        this.logoPath = '';
        this.imagePath = '';
        this.GalleryPath1 = '';
        this.GalleryPath2 = '';
        this.GalleryPath3 = '';
        this.GalleryPath4 = '';
        this.bussinessGroupData = [];
        this.selectedbusinessgroup = [];
        this.isAgeRestriction = false;
    }
    GetBusinessGroupData() {
        this.isLoading = true;
        this._businessGroupService.GetBusinessGroups().pipe()
            .subscribe({
                next: (data) => {
                    this.bussinessGroupData = data;
                },
                error: error => {
                    this._customLoggerService.logError(AppSettings.LoggerAppName, "Business Profile > Method : GetBusinessGroupData()", error.message);
                    console.log(error);
                }
            });
    }
    GetBusinessProfilesByGroupID() {
        this.profileSettingService.GetBusinessProfiles().pipe().subscribe((data) => {
            this.dataSource.data = data;
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        })
    }
    GetBusinessProfile(bID) {
        this.businessID = bID;

        this.profileSettingService.GetBusinessProfilesByID(bID).pipe().subscribe((data) => {
            this.isAgeRestriction = data.isAgeRestriction;
            this.ProfileFormGroup.controls['businessName'].setValue(data["legalName"]);
            this.ProfileFormGroup.controls['shortName'].setValue(data["businessName"]);
            this.ProfileFormGroup.controls['address'].setValue(data["adress"]);
            this.ProfileFormGroup.controls['city'].setValue(data["city"]);
            this.ProfileFormGroup.controls['stateCodeId'].setValue(data['stateCodeID']);
            this.ProfileFormGroup.controls['phoneNo'].setValue(data["phoneNo"]);
            this.ProfileFormGroup.controls['pinCode'].setValue(data["pinCode"]);
            this.ProfileFormGroup.controls['industry'].setValue(data["industry"]);
            this.ProfileFormGroup.controls['description'].setValue(data["descriptions"]);
            this.ProfileFormGroup.controls['website'].setValue(data["website"]);
            this.ProfileFormGroup.controls['facebookUrl'].setValue(data["facebookUrl"]);
            this.ProfileFormGroup.controls['twitterUrl'].setValue(data["twitterUrl"]);
            this.ProfileFormGroup.controls['googleUrl'].setValue(data["googleUrl"]);
            this.ProfileFormGroup.controls['instagramUrl'].setValue(data["instagramUrl"]);
            this.ProfileFormGroup.controls['yelpUrl'].setValue(data["yelpUrl"]);
            this.selectedbusinessgroup = [
                { id: data['businessGroupID'], businessGroupName: data['businessGroupName'] }
            ];
            this.ProfileFormGroup.controls['businessgroupID'].setValue(this.selectedbusinessgroup);
            if (data['imagePath'] != null && data['imagePath'] != "") {
                this.BusinessImageUrl2 = AppSettings.API_ENDPOINT + "/" + data['imagePath'].replace(" ", "%20");
                this.uploadProgress1 = "100%";
            }
            if (data['logoPath'] != null && data['logoPath'] != "") {
                this.BusinessImageUrl1 = AppSettings.API_ENDPOINT + "/" + data['logoPath'].replace(" ", "%20");
                this.uploadProgress = "100%";
            }
            if (data['galleryImagePath1'] != null && data['galleryImagePath1'] != "") {
                this.GalleryImageUrl1 = AppSettings.API_ENDPOINT + "/" + data['galleryImagePath1'].replace(" ", "%20");
                this.galleryuploadProgress1 = "100%";
            }
            if (data['galleryImagePath2'] != null && data['galleryImagePath2'] != "") {
                this.GalleryImageUrl2 = AppSettings.API_ENDPOINT + "/" + data['galleryImagePath2'].replace(" ", "%20");
                this.galleryuploadProgress2 = "100%";
            }
            if (data['galleryImagePath3'] != null && data['galleryImagePath3'] != "") {
                this.GalleryImageUrl3 = AppSettings.API_ENDPOINT + "/" + data['galleryImagePath3'].replace(" ", "%20");
                this.galleryuploadProgress3 = "100%";
            }
            if (data['galleryImagePath4'] != null && data['galleryImagePath4'] != "") {
                this.GalleryImageUrl4 = AppSettings.API_ENDPOINT + "/" + data['galleryImagePath4'].replace(" ", "%20");
                this.galleryuploadProgress4 = "100%";
            }
            this.logoPath = data['logoPath'];
            this.imagePath = data['imagePath'];
            this.GalleryPath1 = data['galleryImagePath1'];
            this.GalleryPath2 = data['galleryImagePath2'];
            this.GalleryPath3 = data['galleryImagePath3'];
            this.GalleryPath4 = data['galleryImagePath4'];
            this.latitude = data['latitude'];
            this.longitude = data['longitude'];
            this.uniqueId = data['uniqueId'];
            this.id = data['id'];
            this.labels = this.GetBusinessLabelsForEdit(data['businesswiseLabels']);
            this.BindBusinessWorkingDays(data['businesswiseWorkingDays']);
            this.selectedBusiness = [];
            this.labels.forEach(element => {
                this.selectedBusiness.push({
                    id: element.labelID,
                    name: this.businessLabels.filter(x => x.id == element.labelID)[0].name
                })
            });
        })
    }
    Edit(item) {
        this.GetBusinessGroupData();
        this.file = null;
        this.file1 = null;
        this.uploadProgress = undefined;
        this.uploadProgress1 = undefined;
        this.BusinessImageUrl1 = '';
        this.BusinessImageUrl2 = '';
        this.galleryFile1 = null;
        this.galleryFile2 = null;
        this.galleryFile3 = null;
        this.galleryFile4 = null;
        this.galleryuploadProgress1 = undefined;
        this.galleryuploadProgress2 = undefined;
        this.galleryuploadProgress3 = undefined;
        this.galleryuploadProgress4 = undefined;
        this.GalleryImageUrl1 = '';
        this.GalleryImageUrl2 = '';
        this.GalleryImageUrl3 = '';
        this.GalleryImageUrl4 = '';
        this.GetBusinessProfile(item.id);
        this.iseditmode = true;
        if (this.imagePath != '') {
            this.uploadProgress1 = "100%";
        }
        if (this.logoPath != '') {
            this.uploadProgress = "100%";
        }
        if (this.GalleryPath1 != '') {
            this.galleryuploadProgress1 = "100%";
        }
        if (this.GalleryPath2 != '') {
            this.galleryuploadProgress2 = "100%";
        }
        if (this.GalleryPath3 != '') {
            this.galleryuploadProgress3 = "100%";
        }
        if (this.GalleryPath4 != '') {
            this.galleryuploadProgress4 = "100%";
        }
    }
    AddNew() {
        this.Cancle();
        this.GetBusinessGroupData();
        this.iseditmode = true;
        this.submitted = false;
        this.ProfileFormGroup.reset();
    }
    GetBusinessLabelsForEdit(data: any) {
        let details = [];
        data.forEach((element: any) => {
            let tempdefDetails = {
                "uniqueID": element.uniqueId,
                "id": element.id,
                "businessID": element.businessId,
                "labelID": element.labelId,
                "isActive": element.isActive,
                "createdDate": element.createdDate,
                "createdBy": element.createdBy,
                "lastModifiedBy": element.lastModifiedBy,
                "lastModifiedDate": element.lastModifiedDate,
            }
            details.push(tempdefDetails);
        });
        return details;
    }

    BindBusinessWorkingDays(data: any) {
        this.ProfileFormGroup.controls['monFromTime'].setValue(data.length > 0 ? moment(data[0].monFromTime).format('HH:mm') : '00:00');
        this.ProfileFormGroup.controls['monToTime'].setValue(data.length > 0 ? moment(data[0].monToTime).format('HH:mm') : '00:00');
        this.ProfileFormGroup.controls['tueFromTime'].setValue(data.length > 0 ? moment(data[0].tueFromTime).format('HH:mm') : '00:00');
        this.ProfileFormGroup.controls['tueToTime'].setValue(data.length > 0 ? moment(data[0].tueToTime).format('HH:mm') : '00:00');
        this.ProfileFormGroup.controls['wedFromTime'].setValue(data.length > 0 ? moment(data[0].wedFromTime).format('HH:mm') : '00:00');
        this.ProfileFormGroup.controls['wedToTime'].setValue(data.length > 0 ? moment(data[0].wedToTime).format('HH:mm') : '00:00');
        this.ProfileFormGroup.controls['thuFromTime'].setValue(data.length > 0 ? moment(data[0].thuFromTime).format('HH:mm') : '00:00');
        this.ProfileFormGroup.controls['thuToTime'].setValue(data.length > 0 ? moment(data[0].thuToTime).format('HH:mm') : '00:00');
        this.ProfileFormGroup.controls['friFromTime'].setValue(data.length > 0 ? moment(data[0].friFromTime).format('HH:mm') : '00:00');
        this.ProfileFormGroup.controls['friToTime'].setValue(data.length > 0 ? moment(data[0].friToTime).format('HH:mm') : '00:00');
        this.ProfileFormGroup.controls['satFromTime'].setValue(data.length > 0 ? moment(data[0].satFromTime).format('HH:mm') : '00:00');
        this.ProfileFormGroup.controls['satToTime'].setValue(data.length > 0 ? moment(data[0].satToTime).format('HH:mm') : '00:00');
        this.ProfileFormGroup.controls['sunFromTime'].setValue(data.length > 0 ? moment(data[0].sunFromTime).format('HH:mm') : '00:00');
        this.ProfileFormGroup.controls['sunToTime'].setValue(data.length > 0 ? moment(data[0].sunToTime).format('HH:mm') : '00:00')
    }

    GetStatesByCountryID() {
        this.stateService.GetStatesByCountryID(this.countryID).pipe().subscribe((data) => {
            this.states = data;
        })
    }

    GetBusinessLabelsByBusinessID() {
        this.businessLabelService.GetBusinessLabelsByBusinessID().subscribe({
            next: (data) => {
                this.businessLabels = data;
                this.filteredBusiness = this.businessLabels;
            },
            error: error => {
                this._customLoggerService.logError(AppSettings.LoggerAppName, "Business Profile > Method : GetBusinessLabelsByBusinessID()", error.message);
            }
        })
    }

    selectState(state: any) {
        let id = this.states.filter(x => x.name.toString().toLowerCase() == state.toString().toLowerCase())[0].id;
        this.ProfileFormGroup.controls['stateCodeId'].setValue(id)
    }

    businessLabelOnChange() {
        if (this.ProfileFormGroup.controls["label"].value.length >= 2) {
            this.filteredBusiness = this.filteredBusiness.filter(x => x.name.toLowerCase().includes(this.ProfileFormGroup.controls['label'].value.toLowerCase()));
        }
        else {
            this.filteredBusiness = this.businessLabels;
        }
    }

    selectBusiness(id: any) {
        if (this.selectedBusiness.filter(x => x.id == id).length == 0) {
            this.ProfileFormGroup.controls['label'].setValue('');
            this.selectedBusiness.push({
                id: id,
                name: this.businessLabels.filter(x => x.id == id)[0].name
            })
        }
    }

    removeBusiness(id: any) {
        this.selectedBusiness = this.selectedBusiness.filter(x => x.id != id);
    }

    onChange(event) {
        this.file = event.target.files[0];
    }

    onUpload() {
        this.loadingLoading = true;
        this.uploadProgress = "100";
        if (this.file) {
            this.loadingLoading = true;
            this.uploadSub = this.uploadService.uploadBusinessImage(this.file).subscribe((event: any) => {
                if (event.type == HttpEventType.UploadProgress) {
                    this.uploadProgress = Math.round(100 * (event.loaded / event.total)).toString() + "%";
                }
                if (event.partialText == "file uploaded") {
                    this.loadingLoading = false; // Flag variable
                    this.isfileUploaded = true;

                    const reader = new FileReader();
                    reader.onload = (e: any) => {
                        this.logoPath = this.file.name;
                        this.BusinessImageUrl1 = e.target.result;
                    };
                    reader.readAsDataURL(this.file);
                }
                else {
                    this.loadingLoading = false;
                    this.isfileUploaded = false;
                }
            });
        }
        this.loadingLoading = false;
    }
    cancelUpload() {
        if (this.uploadSub) {
            this.uploadSub.unsubscribe();
        }
        this.uploadProgress = "0%";
        this.reset();
    }

    reset() {
        this.file = null;
        this.uploadProgress = null;
        this.uploadSub = null;
        this.BusinessImageUrl1 = '';
        this.logoPath = null;
    }

    onChange1(event) {
        this.file1 = event.target.files[0];
    }

    onUpload1() {
        this.loadingLoading = true;
        this.uploadProgress1 = "100";

        if (this.file1) {
            this.loadingLoading = true;
            this.uploadSub1 = this.uploadService.uploadBusinessImage(this.file1).subscribe((event: any) => {
                if (event.type == HttpEventType.UploadProgress) {
                    this.uploadProgress1 = Math.round(100 * (event.loaded / event.total)).toString() + "%";
                }
                if (event.partialText == "file uploaded") {
                    this.loadingLoading = false; // Flag variable
                    this.isfileUploaded1 = true;
                    const reader = new FileReader();

                    reader.onload = (e: any) => {
                        this.imagePath = this.file1.name;
                        this.BusinessImageUrl2 = e.target.result;
                    };
                    reader.readAsDataURL(this.file1);
                } else {
                    this.loadingLoading = false;
                    this.isfileUploaded1 = false;
                    this.BusinessImageUrl2 = '';
                }
            });
        }
        this.loadingLoading = false;
    }
    cancelUpload1() {
        if (this.uploadSub1) {
            this.uploadSub1.unsubscribe();
        }
        this.uploadProgress1 = "0%";
        this.reset1();
    }

    reset1() {
        this.file1 = null;
        this.uploadProgress1 = null;
        this.uploadSub1 = null;
        this.BusinessImageUrl2 = '';
        this.imagePath = null;
    }

    GetBusinessLabels() {
        let details = [];
        this.selectedBusiness.forEach((element: any) => {
            let tempdefDetails = {
                "uniqueID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "id": 0,
                "labelID": element.id,
                "businessID": this.businessID,
                "isActive": true,
                "createdBy": AppSettings.GetCreatedBy(),
                "createdDate": AppSettings.GetDate(),
                "lastModifiedBy": AppSettings.GetCreatedBy(),
                "lastModifiedDate": AppSettings.GetDate()
            }
            details.push(tempdefDetails);
        });

        return details;
    }

    GetBusinessWorkingHours() {
        let details = [];
        let tempdefDetails = {
            "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "id": 0,
            "businessId": this.businessID,
            "monFromTime": this.ProfileFormGroup.controls['monFromTime'].value,
            "monToTime": this.ProfileFormGroup.controls['monToTime'].value,
            "tueFromTime": this.ProfileFormGroup.controls['tueFromTime'].value,
            "tueToTime": this.ProfileFormGroup.controls['tueToTime'].value,
            "wedFromTime": this.ProfileFormGroup.controls['wedFromTime'].value,
            "wedToTime": this.ProfileFormGroup.controls['wedToTime'].value,
            "thuFromTime": this.ProfileFormGroup.controls['thuFromTime'].value,
            "thuToTime": this.ProfileFormGroup.controls['thuToTime'].value,
            "friFromTime": this.ProfileFormGroup.controls['friFromTime'].value,
            "friToTime": this.ProfileFormGroup.controls['friToTime'].value,
            "satFromTime": this.ProfileFormGroup.controls['satFromTime'].value,
            "satToTime": this.ProfileFormGroup.controls['satToTime'].value,
            "sunFromTime": this.ProfileFormGroup.controls['sunFromTime'].value,
            "sunToTime": this.ProfileFormGroup.controls['sunToTime'].value,
            "isActive": true,
            "createdBy": AppSettings.GetCreatedBy(),
            "createdDate": AppSettings.GetDate(),
            "lastModifiedBy": AppSettings.GetCreatedBy(),
            "lastModifiedDate": AppSettings.GetDate(),
        }
        details.push(tempdefDetails);

        return details;
    }

    Submit() {
        this.submitted = true;
        if (this.ProfileFormGroup.invalid) {
            return;
        }

        if (this.selectedBusiness.length == 0) {
            this.labelsReq = true;
            return;
        }
        this.isLoading = true;
        let details = {
            "uniqueId": this.uniqueId,
            "id": this.id,
            "legalName": this.ProfileFormGroup.controls['businessName'].value,
            "businessName": this.ProfileFormGroup.controls['shortName'].value,
            "adress": this.ProfileFormGroup.controls['address'].value,
            "phoneNo": this.ProfileFormGroup.controls['phoneNo'].value,
            "pinCode": this.ProfileFormGroup.controls['pinCode'].value,
            "industry": this.ProfileFormGroup.controls['industry'].value,
            "descriptions": this.ProfileFormGroup.controls['description'].value,
            "logoPath": this.logoPath,
            "imagePath": this.imagePath,
            "website": this.ProfileFormGroup.controls['website'].value,
            "facebookUrl": this.ProfileFormGroup.controls['facebookUrl'].value,
            "twitterUrl": this.ProfileFormGroup.controls['twitterUrl'].value,
            "googleUrl": this.ProfileFormGroup.controls['googleUrl'].value,
            "instagramUrl": this.ProfileFormGroup.controls['instagramUrl'].value,
            "latitude": this.latitude,
            "longitude": this.longitude,
            "yelpUrl": this.ProfileFormGroup.controls['yelpUrl'].value,
            "stateId": 0,
            "isActive": true,
            "businessGroupId": (this.ProfileFormGroup.controls['businessgroupID'].value)[0].id,
            "createdBy": AppSettings.GetCreatedBy(),
            "createdDate": AppSettings.GetDate(),
            "lastModifiedBy": AppSettings.GetCreatedBy(),
            "lastModifiedDate": AppSettings.GetDate(),
            "stateCodeID": this.ProfileFormGroup.controls['stateCodeId'].value,
            "city": this.ProfileFormGroup.controls['city'].value,
            "businesswiseLabels": this.GetBusinessLabels(),
            "businesswiseWorkingDays": this.GetBusinessWorkingHours(),
            "galleryImagePath1": this.GalleryPath1,
            "galleryImagePath2": this.GalleryPath2,
            "galleryImagePath3": this.GalleryPath3,
            "galleryImagePath4": this.GalleryPath4,
            "isAgeRestriction": this.isAgeRestriction
        }
        console.log(details);
        if (this.id > 0) {
            this.profileSettingService.PutBusinessProfile(details.id, details)
                .subscribe({
                    next: (data) => {
                        this.isLoading = false;
                        this.submitted = false;
                        this.iseditmode = false;
                        this.isAgeRestriction = false;
                        this.ProfileFormGroup.reset();
                        this.GetBusinessProfilesByGroupID();
                    },
                    error: error => {
                        this._customLoggerService.logError(AppSettings.LoggerAppName, "Business Profile > Method : Submit()", error.message);
                        this.isLoading = false;
                        this.iseditmode = false;
                        this.isAgeRestriction = false;
                        this.ProfileFormGroup.reset();
                        this.GetBusinessProfilesByGroupID();
                        this.submitted = false;
                    }
                });
        }
        else {
            this.profileSettingService.PostBusinessProfile(details)
                .subscribe({
                    next: (data) => {
                        this.isLoading = false;
                        this.submitted = false;
                        this.iseditmode = false;
                        this.isAgeRestriction = false;
                        this.ProfileFormGroup.reset();
                        this.GetBusinessProfilesByGroupID();
                    },
                    error: error => {
                        this._customLoggerService.logError(AppSettings.LoggerAppName, "Business Profile > Method : Submit()", error.message);
                        this.isLoading = false;
                        this.iseditmode = false;
                        this.isAgeRestriction = false;
                        this.ProfileFormGroup.reset();
                        this.GetBusinessProfilesByGroupID();
                        this.submitted = false;
                    }
                });
        }
    }
    onChangegallery1(event) {
        this.galleryFile1 = event.target.files[0];
    }
    onUploadgallery1() {
        this.loadingLoading = true;
        // this.galleryuploadProgress1 = "100";
        if (this.galleryFile1) {
            this.loadingLoading = true;
            this.galleryuploadSub1 = this.uploadService.uploadBusinessImage(this.galleryFile1)
                .subscribe((event: any) => {
                    if (event.type == HttpEventType.UploadProgress) {
                        let ProgressValue = Math.round(100 * (event.loaded / event.total)).toString() + "%";
                        if (this.galleryuploadProgress1 == null || this.galleryuploadProgress1 == "" || this.galleryuploadProgress1 == 'undefined') {
                            this.galleryuploadProgress1 = ProgressValue;
                        }
                    }
                    if (event.partialText == "file uploaded") {
                        this.loadingLoading = false; // Flag variable
                        this.isfileUploaded = true;

                        // Add code for preview uploaded image by shahi
                        const reader = new FileReader();
                        reader.onload = (e: any) => {
                            if (this.GalleryPath1 == null || this.GalleryPath1 == "" || this.GalleryPath1 == 'undefined') {
                                this.GalleryPath1 = this.galleryFile1.name;
                                this.GalleryImageUrl1 = e.target.result;
                            }
                        };
                        reader.readAsDataURL(this.galleryFile1);

                    }
                    else {
                        this.loadingLoading = false;
                        this.isfileUploaded = false;
                    }
                },
                    ((error: any) => {
                        this._customLoggerService.logError(AppSettings.LoggerAppName, "Business Profile > Method : onUploadgallery1()", error.message)
                    }));
        }
        this.loadingLoading = false;
    }
    cancelgallery1() {
        if (this.galleryuploadSub1) {
            this.galleryuploadSub1.unsubscribe();
        }
        this.galleryFile1 = null;
        this.galleryuploadProgress1 = null;
        this.galleryuploadSub1 = null;
        this.GalleryImageUrl1 = '';
        this.GalleryPath1 = null;
    }
    onChangegallery2(event) {
        this.galleryFile2 = event.target.files[0];
        console.log('changegallery2');
        console.log(this.galleryFile2);
        console.log(this.galleryuploadProgress2);
    }
    cancelgallery2() {
        if (this.galleryuploadSub2) {
            this.galleryuploadSub2.unsubscribe();
        }
        this.galleryFile2 = null;
        this.galleryuploadProgress2 = null;
        this.galleryuploadSub2 = null;
        this.GalleryImageUrl2 = '';
        this.GalleryPath2 = null;
    }
    onUploadgallery2() {
        this.loadingLoading = true;
        // this.galleryuploadProgress1 = "100";
        if (this.galleryFile2) {
            this.loadingLoading = true;
            this.galleryuploadSub2 = this.uploadService.uploadBusinessImage(this.galleryFile2).subscribe((event: any) => {
                if (event.type == HttpEventType.UploadProgress) {
                    this.galleryuploadProgress2 = Math.round(100 * (event.loaded / event.total)).toString() + "%";
                }
                if (event.partialText == "file uploaded") {
                    this.loadingLoading = false; // Flag variable
                    this.isfileUploaded = true;

                    // Add code for preview uploaded image by shahi
                    const reader = new FileReader();
                    reader.onload = (e: any) => {
                        if (this.GalleryPath2 == null || this.GalleryPath2 == "" || this.GalleryPath2 == 'undefined') {
                            this.GalleryPath2 = this.galleryFile2.name;
                            this.GalleryImageUrl2 = e.target.result;
                        }
                    };
                    reader.readAsDataURL(this.galleryFile2);

                }
                else {
                    this.loadingLoading = false;
                    this.isfileUploaded = false;
                }
            }, ((error: any) => {
                this._customLoggerService.logError(AppSettings.LoggerAppName, "Business Profile > Method : onUploadgallery2()", error.message)
            }));
        }
        this.loadingLoading = false;
    }
    onChangegallery3(event) {
        this.galleryFile3 = event.target.files[0];
    }
    cancelgallery3() {
        if (this.galleryuploadSub3) {
            this.galleryuploadSub3.unsubscribe();
        }
        this.galleryFile3 = null;
        this.galleryuploadProgress3 = null;
        this.galleryuploadSub3 = null;
        this.GalleryImageUrl3 = '';
        this.GalleryPath3 = null;
    }
    onUploadgallery3() {
        this.loadingLoading = true;
        // this.galleryuploadProgress1 = "100";
        if (this.galleryFile3) {
            this.loadingLoading = true;
            this.galleryuploadSub3 = this.uploadService.uploadBusinessImage(this.galleryFile3).subscribe((event: any) => {
                if (event.type == HttpEventType.UploadProgress) {
                    this.galleryuploadProgress3 = Math.round(100 * (event.loaded / event.total)).toString() + "%";
                }
                if (event.partialText == "file uploaded") {
                    this.loadingLoading = false; // Flag variable
                    this.isfileUploaded = true;

                    // Add code for preview uploaded image by shahi
                    const reader = new FileReader();
                    reader.onload = (e: any) => {
                        if (this.GalleryPath3 == null || this.GalleryPath3 == "" || this.GalleryPath3 == 'undefined') {
                            this.GalleryPath3 = this.galleryFile3.name;
                            this.GalleryImageUrl3 = e.target.result;
                        }
                    };
                    reader.readAsDataURL(this.galleryFile3);

                }
                else {
                    this.loadingLoading = false;
                    this.isfileUploaded = false;
                }
            }, ((error: any) => {
                this._customLoggerService.logError(AppSettings.LoggerAppName, "Business Profile > Method : onUploadgallery3()", error.message)
            }));
        }
        this.loadingLoading = false;
    }
    onChangegallery4(event) {
        this.galleryFile4 = event.target.files[0];
    }
    cancelgallery4() {
        if (this.galleryuploadSub4) {
            this.galleryuploadSub4.unsubscribe();
        }
        this.galleryFile4 = null;
        this.galleryuploadProgress4 = null;
        this.galleryuploadSub4 = null;
        this.GalleryImageUrl4 = '';
        this.GalleryPath4 = null;
    }
    onUploadgallery4() {
        this.loadingLoading = true;
        // this.galleryuploadProgress1 = "100";
        if (this.galleryFile4) {
            this.loadingLoading = true;
            this.galleryuploadSub4 = this.uploadService.uploadBusinessImage(this.galleryFile4).subscribe((event: any) => {
                if (event.type == HttpEventType.UploadProgress) {
                    let ProgressValue = Math.round(100 * (event.loaded / event.total)).toString() + "%";
                    if (this.galleryuploadProgress4 == null || this.galleryuploadProgress4 == "" || this.galleryuploadProgress4 == 'undefined') {
                        this.galleryuploadProgress4 = ProgressValue;
                    }
                }
                if (event.partialText == "file uploaded") {
                    this.loadingLoading = false; // Flag variable
                    this.isfileUploaded = true;

                    // Add code for preview uploaded image by shahi
                    const reader = new FileReader();
                    reader.onload = (e: any) => {
                        if (this.GalleryPath4 == null || this.GalleryPath4 == "" || this.GalleryPath4 == 'undefined') {
                            this.GalleryPath4 = this.galleryFile4.name;
                            this.GalleryImageUrl4 = e.target.result;
                        }
                    };
                    reader.readAsDataURL(this.galleryFile4);

                }
                else {
                    this.loadingLoading = false;
                    this.isfileUploaded = false;
                }
            }, ((error: any) => {
                this._customLoggerService.logError(AppSettings.LoggerAppName, "Business Profile > Method : onUploadgallery4()", error.message)
            }));
        }
        this.loadingLoading = false;
    }
}