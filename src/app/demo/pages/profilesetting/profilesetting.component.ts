import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ProfileSettingService } from '../../../services/ProfileSettingService';
import { StateService } from '../../../services/StateService';
import { BusinessLabelService } from '../../../services/businessLabelService';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { AppSettings } from '../../../services/Constants';
import { ToastService } from '../../../services/ToastService';
import * as moment from "moment";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { GoogleMapsService } from '../../../services/google-maps.service'
import { PromotionService } from 'src/app/services/PromotionService';

@Component({
  selector: 'app-profilesetting',
  templateUrl: './profilesetting.component.html',
  styleUrls: ['./profilesetting.component.scss']
})
export class ProfilesettingComponent {
  businessGroupID: any;
  businessLocationID: number = 0;
  businessID: any;
  countryID: number = 2;
  industry: any = '';
  labelsReq: any = false;
  states: any = [];
  businessLabels: any = [];
  ProfileFormGroup: FormGroup;
  selectedBusiness: { id: number, name: string }[] = [];
  filteredBusiness: any = [];
  submitted = false;
  isLoading = false;
  latitude: any;
  longitude: any;
  uniqueId: any;
  dataSource: any;
  labels: any;
  iseditmode: any = false;
  isAgeRestriction: Boolean = false;
  isSponsored: Boolean = false;
  licenseNumber: any = '';
  timeZone: any = '';
  ChkMakeDefaultTime = false;
  dropdownSettingsSingleState: IDropdownSettings = {};
  statesData: any = [];
  customerID: any = '';
  workingHours = [{ id: 1, name: "12:00 AM" }, { id: 2, name: "12:30 AM" },
  { id: 3, name: "01:00 AM" }, { id: 4, name: "01:30 AM" }, { id: 5, name: "02:00 AM" },
  { id: 6, name: "02:30 AM" }, { id: 7, name: "03:00 AM" }, { id: 8, name: "03:30 AM" },
  { id: 9, name: "04:00 AM" }, { id: 10, name: "04:30 AM" }, { id: 11, name: "05:00 AM" },
  { id: 12, name: "05:30 AM" }, { id: 13, name: "06:00 AM" }, { id: 14, name: "06:30 AM" },
  { id: 15, name: "07:00 AM" }, { id: 16, name: "07:30 AM" }, { id: 17, name: "08:00 AM" },
  { id: 18, name: "08:30 AM" }, { id: 19, name: "09:00 AM" }, { id: 20, name: "09:30 AM" },
  { id: 21, name: "10:00 AM" }, { id: 22, name: "10:30 AM" }, { id: 23, name: "11:00 AM" },
  { id: 24, name: "11:30 AM" }, { id: 25, name: "12:00 PM" }, { id: 26, name: "12:30 PM" },
  { id: 27, name: "01:00 PM" }, { id: 28, name: "01:30 PM" }, { id: 29, name: "02:00 PM" },
  { id: 30, name: "02:30 PM" }, { id: 31, name: "03:00 PM" }, { id: 32, name: "03:30 PM" },
  { id: 33, name: "04:00 PM" }, { id: 34, name: "04:30 PM" }, { id: 35, name: "05:00 PM" },
  { id: 36, name: "05:30 PM" }, { id: 37, name: "06:00 PM" }, { id: 38, name: "06:30 PM" },
  { id: 39, name: "07:00 PM" }, { id: 40, name: "07:30 PM" }, { id: 41, name: "08:00 PM" },
  { id: 42, name: "08:30 PM" }, { id: 43, name: "09:00 PM" }, { id: 44, name: "09:30 PM" },
  { id: 45, name: "10:00 PM" }, { id: 46, name: "10:30 PM" }, { id: 47, name: "11:00 PM" },
  { id: 48, name: "11:30 PM" }];

  @ViewChild('search') searchElementRef: ElementRef;

  //#region Business Logo variables
  fileBusinessLogo: File;
  uploadProgressBusinessLogo: any;
  loadingBusinessLogo: boolean = false;
  uploadSubBusinessLogo: Subscription;
  isfileUploadedBusinessLogo = false;
  annImageBusinessLogo: any;
  fileNameBusinessLogo: any = null;
  filePathBusinessLogo: any = null;
  //#endregion

  //#region Business Display Image
  fileBusinessDisplayImage: File;
  uploadProgressBusinessDisplayImage: any;
  loadingBusinessDisplayImage: boolean = false;
  uploadSubBusinessDisplayImage: Subscription;
  isfileUploadedBusinessDisplayImage = false;
  annImageBusinessDisplayImage: any;
  fileNameBusinessDisplayImage: any = null;
  filePathBusinessDisplayImage: any = null;
  //#endregion

  //#region Business Image 1
  fileBusinessImage1: File;
  uploadProgressBusinessImage1: any;
  loadingBusinessImage1: boolean = false;
  uploadSubBusinessImage1: Subscription;
  isfileUploadedBusinessImage1 = false;
  annImageBusinessImage1: any;
  fileNameBusinessImage1: any = null;
  filePathBusinessImage1: any = null;
  //#endregion

  //#region Business Image 2
  fileBusinessImage2: File;
  uploadProgressBusinessImage2: any;
  loadingBusinessImage2: boolean = false;
  uploadSubBusinessImage2: Subscription;
  isfileUploadedBusinessImage2 = false;
  annImageBusinessImage2: any;
  fileNameBusinessImage2: any = null;
  filePathBusinessImage2: any = null;
  //#endregion

  //#region Business Image 3
  fileBusinessImage3: File;
  uploadProgressBusinessImage3: any;
  loadingBusinessImage3: boolean = false;
  uploadSubBusinessImage3: Subscription;
  isfileUploadedBusinessImage3 = false;
  annImageBusinessImage3: any;
  fileNameBusinessImage3: any = null;
  filePathBusinessImage3: any = null;
  //#endregion

  //#region Business Image 4
  fileBusinessImage4: File;
  uploadProgressBusinessImage4: any;
  loadingBusinessImage4: boolean = false;
  uploadSubBusinessImage4: Subscription;
  isfileUploadedBusinessImage4 = false;
  annImageBusinessImage4: any;
  fileNameBusinessImage4: any = null;
  filePathBusinessImage4: any = null;
  //#endregion

  constructor(private profileSettingService: ProfileSettingService, private stateService: StateService,
    private businessLabelService: BusinessLabelService, private uploadService: PromotionService,
    public toastService: ToastService, private googleMapsService: GoogleMapsService, private ngZone: NgZone) {
    this.businessGroupID = JSON.parse(localStorage.getItem('BusinessGroup'));
    this.ProfileFormGroup = new FormGroup({
      businessName: new FormControl('', Validators.required),
      shortName: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      stateCodeId: new FormControl('', Validators.required),
      phoneNo: new FormControl('', Validators.required),
      pinCode: new FormControl('', Validators.required),
      description: new FormControl(''),
      label: new FormControl(''),
      website: new FormControl(''),
      facebookUrl: new FormControl(''),
      twitterUrl: new FormControl(''),
      googleUrl: new FormControl(''),
      instagramUrl: new FormControl(''),
      yelpUrl: new FormControl(''),
      monFromTime: new FormControl([], [Validators.required, this.validatePattern]),
      monToTime: new FormControl([], [Validators.required, this.validatePattern]),
      tueFromTime: new FormControl([], [Validators.required, this.validatePattern]),
      tueToTime: new FormControl([], [Validators.required, this.validatePattern]),
      wedFromTime: new FormControl([], [Validators.required, this.validatePattern]),
      wedToTime: new FormControl([], [Validators.required, this.validatePattern]),
      thuFromTime: new FormControl([], [Validators.required, this.validatePattern]),
      thuToTime: new FormControl([], [Validators.required, this.validatePattern]),
      friFromTime: new FormControl([], [Validators.required, this.validatePattern]),
      friToTime: new FormControl([], [Validators.required, this.validatePattern]),
      satFromTime: new FormControl([], [Validators.required, this.validatePattern]),
      satToTime: new FormControl([], [Validators.required, this.validatePattern]),
      sunFromTime: new FormControl([], [Validators.required, this.validatePattern]),
      sunToTime: new FormControl([], [Validators.required, this.validatePattern]),
    })

    this.ProfileFormGroup.controls['businessName'].disable();
    this.ProfileFormGroup.controls['shortName'].disable();
  }

  ngOnInit() {
    this.GetStatesByCountryID();
    this.GetBusinessLabelsByBusinessID();
    this.GetBusinessProfilesByGroupID();
    this.getStates();
    this.dropdownSettingsSingleState = {
      idField: 'id',
      textField: 'name',
      singleSelection: true
    }
  }

  //#region BusinessLogo
  onChangeBusinessLogo(event: any) {
    this.fileBusinessLogo = event.target.files[0];

    if (this.fileBusinessLogo) {
      this.loadingBusinessLogo = true;
      this.uploadSubBusinessLogo = this.uploadService.uploadFile(this.fileBusinessLogo).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgressBusinessLogo = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingBusinessLogo = false; // Flag variable
          this.isfileUploadedBusinessLogo = true;
          this.annImageBusinessLogo = AppSettings.Root_ENDPOINT + this.fileBusinessLogo.name;
          let array = event.partialText.split('|')[1].split('/');
          this.fileNameBusinessLogo = array[array.length - 1];
          this.filePathBusinessLogo = AppSettings.Root_ENDPOINT + this.fileNameBusinessLogo;
        } else {
          this.loadingBusinessLogo = false;
          this.isfileUploadedBusinessLogo = false;
        }
      });
    }
    this.loadingBusinessLogo = false;
  }

  cancelUploadBusinessLogo() {
    if (this.uploadSubBusinessLogo != null) {
      this.uploadSubBusinessLogo.unsubscribe();
    }
    this.uploadProgressBusinessLogo = "0%";
    this.isfileUploadedBusinessLogo = false;
    this.fileNameBusinessLogo = null;
    this.resetBusinessLogoDetails();
  }
  resetBusinessLogoDetails() {
    this.fileBusinessLogo = null;
    this.filePathBusinessLogo = null;
    this.uploadProgressBusinessLogo = null;
    this.uploadSubBusinessLogo = null;
  }
  //#endregion


  //#region BusinessDisplayImage
  onChangeBusinessDisplayImage(event: any) {
    this.fileBusinessDisplayImage = event.target.files[0];

    if (this.fileBusinessDisplayImage) {
      this.loadingBusinessDisplayImage = true;
      this.uploadSubBusinessDisplayImage = this.uploadService.uploadFile(this.fileBusinessDisplayImage).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgressBusinessDisplayImage = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingBusinessDisplayImage = false; // Flag variable
          this.isfileUploadedBusinessDisplayImage = true;
          this.annImageBusinessDisplayImage = AppSettings.Root_ENDPOINT + this.fileBusinessDisplayImage.name;
          let array = event.partialText.split('|')[1].split('/');
          this.fileNameBusinessDisplayImage = array[array.length - 1];
          this.filePathBusinessDisplayImage = AppSettings.Root_ENDPOINT + this.fileNameBusinessDisplayImage;
        } else {
          this.loadingBusinessDisplayImage = false;
          this.isfileUploadedBusinessDisplayImage = false;
        }
      });
    }
    this.loadingBusinessDisplayImage = false;
  }

  cancelUploadBusinessDisplayImage() {
    if (this.uploadSubBusinessDisplayImage != null) {
      this.uploadSubBusinessDisplayImage.unsubscribe();
    }
    this.uploadProgressBusinessDisplayImage = "0%";
    this.isfileUploadedBusinessDisplayImage = false;
    this.fileNameBusinessDisplayImage = null;
    this.resetBusinessDisplayImageDetails();
  }

  resetBusinessDisplayImageDetails() {
    this.fileBusinessDisplayImage = null;
    this.filePathBusinessDisplayImage = null;
    this.uploadProgressBusinessDisplayImage = null;
    this.uploadSubBusinessDisplayImage = null;
  }
  //#endregion


  //#region BusinessImage1
  onChangeBusinessImage1(event: any) {
    this.fileBusinessImage1 = event.target.files[0];

    if (this.fileBusinessImage1) {
      this.loadingBusinessImage1 = true;
      this.uploadSubBusinessImage1 = this.uploadService.uploadFile(this.fileBusinessImage1).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgressBusinessImage1 = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingBusinessImage1 = false; // Flag variable
          this.isfileUploadedBusinessImage1 = true;
          this.annImageBusinessImage1 = AppSettings.Root_ENDPOINT  + this.fileBusinessImage1.name;
          let array = event.partialText.split('|')[1].split('/');
          this.fileNameBusinessImage1 = array[array.length - 1];
          this.filePathBusinessImage1 = AppSettings.Root_ENDPOINT + this.fileNameBusinessImage1;
        } else {
          this.loadingBusinessImage1 = false;
          this.isfileUploadedBusinessImage1 = false;
        }
      });
    }
    this.loadingBusinessImage1 = false;
  }

  cancelUploadBusinessImage1() {
    if (this.uploadSubBusinessImage1 != null) {
      this.uploadSubBusinessImage1.unsubscribe();
    }
    this.uploadProgressBusinessImage1 = "0%";
    this.isfileUploadedBusinessImage1 = false;
    this.fileNameBusinessImage1 = null;
    this.resetBusinessImage1Details();
  }

  resetBusinessImage1Details() {
    this.fileBusinessImage1 = null;
    this.filePathBusinessImage1 = null;
    this.uploadProgressBusinessImage1 = null;
    this.uploadSubBusinessImage1 = null;
  }
  //#endregion

  //#region BusinessImage2
  onChangeBusinessImage2(event: any) {
    this.fileBusinessImage2 = event.target.files[0];

    if (this.fileBusinessImage2) {
      this.loadingBusinessImage2 = true;
      this.uploadSubBusinessImage2 = this.uploadService.uploadFile(this.fileBusinessImage2).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgressBusinessImage2 = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingBusinessImage2 = false; // Flag variable
          this.isfileUploadedBusinessImage2 = true;
          this.annImageBusinessImage2 = AppSettings.Root_ENDPOINT + this.fileBusinessImage2.name;
          let array = event.partialText.split('|')[1].split('/');
          this.fileNameBusinessImage2 = array[array.length - 1];
          this.filePathBusinessImage2 = AppSettings.Root_ENDPOINT + this.fileNameBusinessImage2;
        } else {
          this.loadingBusinessImage2 = false;
          this.isfileUploadedBusinessImage2 = false;
        }
      });
    }
    this.loadingBusinessImage2 = false;
  }

  cancelUploadBusinessImage2() {
    if (this.uploadSubBusinessImage2 != null) {
      this.uploadSubBusinessImage2.unsubscribe();
    }
    this.uploadProgressBusinessImage2 = "0%";
    this.isfileUploadedBusinessImage2 = false;
    this.fileNameBusinessImage2 = null;
    this.resetBusinessImage2Details();
  }

  resetBusinessImage2Details() {
    this.fileBusinessImage2 = null;
    this.filePathBusinessImage2 = null;
    this.uploadProgressBusinessImage2 = null;
    this.uploadSubBusinessImage2 = null;
  }
  //#endregion

  //#region BusinessImage3
  onChangeBusinessImage3(event: any) {
    this.fileBusinessImage3 = event.target.files[0];

    if (this.fileBusinessImage3) {
      this.loadingBusinessImage3 = true;
      this.uploadSubBusinessImage3 = this.uploadService.uploadFile(this.fileBusinessImage3).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgressBusinessImage3 = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingBusinessImage3 = false; // Flag variable
          this.isfileUploadedBusinessImage3 = true;
          this.annImageBusinessImage3 = AppSettings.Root_ENDPOINT + this.fileBusinessImage3.name;
          let array = event.partialText.split('|')[1].split('/');
          this.fileNameBusinessImage3 = array[array.length - 1];
          this.filePathBusinessImage3 = AppSettings.Root_ENDPOINT + this.fileNameBusinessImage3;
        } else {
          this.loadingBusinessImage3 = false;
          this.isfileUploadedBusinessImage3 = false;
        }
      });
    }
    this.loadingBusinessImage3 = false;
  }

  cancelUploadBusinessImage3() {
    if (this.uploadSubBusinessImage3 != null) {
      this.uploadSubBusinessImage3.unsubscribe();
    }
    this.uploadProgressBusinessImage3 = "0%";
    this.isfileUploadedBusinessImage3 = false;
    this.fileNameBusinessImage3 = null;
    this.resetBusinessImage3Details();
  }

  resetBusinessImage3Details() {
    this.fileBusinessImage3 = null;
    this.filePathBusinessImage3 = null;
    this.uploadProgressBusinessImage3 = null;
    this.uploadSubBusinessImage3 = null;
  }
  //#endregion

  //#region BusinessImage4
  onChangeBusinessImage4(event: any) {
    this.fileBusinessImage4 = event.target.files[0];

    if (this.fileBusinessImage4) {
      this.loadingBusinessImage4 = true;
      this.uploadSubBusinessImage4 = this.uploadService.uploadFile(this.fileBusinessImage4).subscribe((event: any) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgressBusinessImage4 = Math.round(100 * (event.loaded / event.total)).toString() + "%";
        }
        if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
          this.loadingBusinessImage4 = false; // Flag variable
          this.isfileUploadedBusinessImage4 = true;
          this.annImageBusinessImage4 = AppSettings.Root_ENDPOINT + this.fileBusinessImage4.name;
          let array = event.partialText.split('|')[1].split('/');
          this.fileNameBusinessImage4 = array[array.length - 1];
          this.filePathBusinessImage4 = AppSettings.Root_ENDPOINT + this.fileNameBusinessImage4;
        } else {
          this.loadingBusinessImage4 = false;
          this.isfileUploadedBusinessImage4 = false;
        }
      });
    }
    this.loadingBusinessImage4 = false;
  }

  cancelUploadBusinessImage4() {
    if (this.uploadSubBusinessImage4 != null) {
      this.uploadSubBusinessImage4.unsubscribe();
    }
    this.uploadProgressBusinessImage4 = "0%";
    this.isfileUploadedBusinessImage4 = false;
    this.fileNameBusinessImage4 = null;
    this.resetBusinessImage4Details();
  }

  resetBusinessImage4Details() {
    this.fileBusinessImage4 = null;
    this.filePathBusinessImage4 = null;
    this.uploadProgressBusinessImage4 = null;
    this.uploadSubBusinessImage4 = null;
  }
  //#endregion

  getStates() {
    this.stateService.GetStates().subscribe({
      next: (data: any) => {
        this.statesData = data;
      },
      error: (error: any) => {
        console.log("This is error message", error)
      }
    })
  }

  Cancle() {
    this.iseditmode = false;
    this.businessID = 0;
    this.isAgeRestriction = false;
    this.isSponsored = false;
    this.customerID = '';
    this.licenseNumber = '';
    this.timeZone = '';
  }

  GetBusinessProfilesByGroupID() {
    this.profileSettingService.GetBusinessProfilesByGroupID(this.businessGroupID.id).pipe().subscribe((data) => {
      this.dataSource = data;
    })
  }

  Edit(e) {
    this.profileSettingService.GetBusinessProfilesByID(e.id).subscribe({
      next: (data: any) => {
        this.businessLocationID = e.id;
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        this.industry = data.industry;
        this.isAgeRestriction = data.isAgeRestriction;
        this.isSponsored = data.isSponsored;
        this.customerID = data.customerID;
        this.licenseNumber = data.licenseNumber;
        this.timeZone = data.timeZone;

        this.ProfileFormGroup.controls['businessName'].setValue(data.legalName);
        this.ProfileFormGroup.controls['shortName'].setValue(data.businessName);

        let phone: any = '';
        const value = data.phoneNo.replace(/[^0-9]/g, '');
        let format = '(***) ***-****';

        for (let i = 0; i < value.length; i++) {
          format = format.replace('*', value.charAt(i));
        }

        if (format.indexOf('*') >= 0) {
          format = format.substring(0, format.indexOf('*'));
        }
        phone = format.trim();

        this.ProfileFormGroup.controls['phoneNo'].setValue(phone);
        this.ProfileFormGroup.controls['address'].setValue(data.adress);
        this.ProfileFormGroup.controls['city'].setValue(data.city);
        this.ProfileFormGroup.controls['stateCodeId'].setValue(data.stateCodeID);

        this.ProfileFormGroup.controls['pinCode'].setValue(data.pinCode);
        this.ProfileFormGroup.controls['description'].setValue(data.descriptions);
        this.ProfileFormGroup.controls['website'].setValue(data.website);
        this.ProfileFormGroup.controls['facebookUrl'].setValue(data.facebookUrl);
        this.ProfileFormGroup.controls['twitterUrl'].setValue(data.twitterUrl);
        this.ProfileFormGroup.controls['googleUrl'].setValue(data.googleUrl);
        this.ProfileFormGroup.controls['instagramUrl'].setValue(data.instagramUrl);
        this.ProfileFormGroup.controls['yelpUrl'].setValue(data.yelpUrl);

        let monFrom = new Date(data.businesswiseWorkingDays[0].monFromTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['monFromTime'].setValue(monFrom);

        let monTo = new Date(data.businesswiseWorkingDays[0].monToTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['monToTime'].setValue(monTo);

        let tueFrom = new Date(data.businesswiseWorkingDays[0].tueFromTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['tueFromTime'].setValue(tueFrom);

        let tueTo = new Date(data.businesswiseWorkingDays[0].tueToTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['tueToTime'].setValue(tueTo);

        let wedFrom = new Date(data.businesswiseWorkingDays[0].wedFromTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['wedFromTime'].setValue(wedFrom);

        let wedTo = new Date(data.businesswiseWorkingDays[0].wedToTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['wedToTime'].setValue(wedTo);

        let thuFrom = new Date(data.businesswiseWorkingDays[0].thuFromTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['thuFromTime'].setValue(thuFrom);

        let thuTo = new Date(data.businesswiseWorkingDays[0].thuToTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['thuToTime'].setValue(thuTo);

        let friFrom = new Date(data.businesswiseWorkingDays[0].friFromTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['friFromTime'].setValue(friFrom);

        let friTo = new Date(data.businesswiseWorkingDays[0].friToTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['friToTime'].setValue(friTo);

        let satFrom = new Date(data.businesswiseWorkingDays[0].satFromTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['satFromTime'].setValue(satFrom);

        let satTo = new Date(data.businesswiseWorkingDays[0].satToTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['satToTime'].setValue(satTo);

        let sunFrom = new Date(data.businesswiseWorkingDays[0].sunFromTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['sunFromTime'].setValue(sunFrom);

        let sunTo = new Date(data.businesswiseWorkingDays[0].sunToTime).toLocaleString('en-US',
          { hour: '2-digit', minute: '2-digit', hour12: true });
        this.ProfileFormGroup.controls['sunToTime'].setValue(sunTo);

        this.iseditmode = true;
        this.ChkMakeDefaultTime = false;

        let labels = this.GetBusinessLabelsForEdit(data['businesswiseLabels']);
        this.selectedBusiness = [];
        labels.forEach(element => {
          this.selectedBusiness.push({
            id: element.labelID,
            name: this.businessLabels.filter(x => x.id == element.labelID)[0].name
          })
        });

        if (data.logoPath != '' && data.logoPath != null && data.logoPath != undefined) {
          this.filePathBusinessLogo = AppSettings.Root_ENDPOINT + data.logoPath;
          this.uploadProgressBusinessLogo = (100).toString() + "%";
          this.fileNameBusinessLogo = data.logoPath;
        }
        else {
          this.cancelUploadBusinessLogo();
        }

        if (data.imagePath != '' && data.imagePath != null && data.imagePath != undefined) {
          this.filePathBusinessDisplayImage = AppSettings.Root_ENDPOINT + data.imagePath;
          this.uploadProgressBusinessDisplayImage = (100).toString() + "%";
          this.fileNameBusinessDisplayImage = data.imagePath;
        }
        else {
          this.cancelUploadBusinessDisplayImage();
        }

        if (data.galleryImagePath1 != '' && data.galleryImagePath1 != null && data.galleryImagePath1 != undefined) {
          this.filePathBusinessImage1 = AppSettings.Root_ENDPOINT + data.galleryImagePath1;
          this.uploadProgressBusinessImage1 = (100).toString() + "%";
          this.fileNameBusinessImage1 = data.galleryImagePath1;
        }
        else {
          this.cancelUploadBusinessImage1();
        }

        if (data.galleryImagePath2 != '' && data.galleryImagePath2 != null && data.galleryImagePath2 != undefined) {
          this.filePathBusinessImage2 = AppSettings.Root_ENDPOINT + data.galleryImagePath2;
          this.uploadProgressBusinessImage2 = (100).toString() + "%";
          this.fileNameBusinessImage2 = data.galleryImagePath2;
        }
        else {
          this.cancelUploadBusinessImage2();
        }

        if (data.galleryImagePath3 != '' && data.galleryImagePath3 != null && data.galleryImagePath3 != undefined) {
          this.filePathBusinessImage3 = AppSettings.Root_ENDPOINT + data.galleryImagePath3;
          this.uploadProgressBusinessImage3 = (100).toString() + "%";
          this.fileNameBusinessImage3 = data.galleryImagePath3;
        }
        else {
          this.cancelUploadBusinessImage3();
        }

        if (data.galleryImagePath4 != '' && data.galleryImagePath4 != null && data.galleryImagePath4 != undefined) {
          this.filePathBusinessImage4 = AppSettings.Root_ENDPOINT + data.galleryImagePath4;
          this.uploadProgressBusinessImage4 = (100).toString() + "%";
          this.fileNameBusinessImage4 = data.galleryImagePath4;
        }
        else {
          this.cancelUploadBusinessImage4();
        }
      },
      error: (error: any) => {

      }
    })
  }

  selectBusiness(id: any) {
    if (this.selectedBusiness.length == 5) {
      this.toastService.show("You can select upto 5 Business labels only !")
      return;
    }

    if (this.selectedBusiness.filter(x => x.id == id).length == 0) {
      this.ProfileFormGroup.controls['label'].setValue('');
      this.selectedBusiness.push({
        id: id,
        name: this.businessLabels.filter(x => x.id == id)[0].name
      })
    }
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

      }
    })
  }

  businessLabelOnChange() {
    if (this.ProfileFormGroup.controls["label"].value.length >= 2) {
      this.filteredBusiness = this.filteredBusiness.filter(x => x.name.toLowerCase().includes(this.ProfileFormGroup.controls['label'].value.toLowerCase()));
    }
    else {
      this.filteredBusiness = this.businessLabels;
    }
  }

  GetBusinessLabels() {
    let details = [];
    this.selectedBusiness.forEach((element: any) => {
      let tempdefDetails = {
        "uniqueID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "id": 0,
        "labelID": element.id,
        "businessID": this.businessLocationID,
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
      "businessId": this.businessLocationID,
      "monFromTime": this.ProfileFormGroup.controls['monFromTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['monFromTime'].value.label : this.ProfileFormGroup.controls['monFromTime'].value,
      "monToTime": this.ProfileFormGroup.controls['monToTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['monToTime'].value.label : this.ProfileFormGroup.controls['monToTime'].value,
      "tueFromTime": this.ProfileFormGroup.controls['tueFromTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['tueFromTime'].value.label : this.ProfileFormGroup.controls['tueFromTime'].value,
      "tueToTime": this.ProfileFormGroup.controls['tueToTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['tueToTime'].value.label : this.ProfileFormGroup.controls['tueToTime'].value,
      "wedFromTime": this.ProfileFormGroup.controls['wedFromTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['wedFromTime'].value.label : this.ProfileFormGroup.controls['wedFromTime'].value,
      "wedToTime": this.ProfileFormGroup.controls['wedToTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['wedToTime'].value.label : this.ProfileFormGroup.controls['wedToTime'].value,
      "thuFromTime": this.ProfileFormGroup.controls['thuFromTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['thuFromTime'].value.label : this.ProfileFormGroup.controls['thuFromTime'].value,
      "thuToTime": this.ProfileFormGroup.controls['thuToTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['thuToTime'].value.label : this.ProfileFormGroup.controls['thuToTime'].value,
      "friFromTime": this.ProfileFormGroup.controls['friFromTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['friFromTime'].value.label : this.ProfileFormGroup.controls['friFromTime'].value,
      "friToTime": this.ProfileFormGroup.controls['friToTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['friToTime'].value.label : this.ProfileFormGroup.controls['friToTime'].value,
      "satFromTime": this.ProfileFormGroup.controls['satFromTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['satFromTime'].value.label : this.ProfileFormGroup.controls['satFromTime'].value,
      "satToTime": this.ProfileFormGroup.controls['satToTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['satToTime'].value.label : this.ProfileFormGroup.controls['satToTime'].value,
      "sunFromTime": this.ProfileFormGroup.controls['sunFromTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['sunFromTime'].value.label : this.ProfileFormGroup.controls['sunFromTime'].value,
      "sunToTime": this.ProfileFormGroup.controls['sunToTime'].value.label != undefined ?
        this.ProfileFormGroup.controls['sunToTime'].value.label : this.ProfileFormGroup.controls['sunToTime'].value,
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
      console.log('in')
      return;
    }

    this.isLoading = true;

    let details = {
      "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "id": this.businessLocationID,
      "legalName": this.ProfileFormGroup.controls['businessName'].value,
      "businessName": this.ProfileFormGroup.controls['shortName'].value,
      "adress": this.ProfileFormGroup.controls['address'].value,
      "phoneNo": this.ProfileFormGroup.controls['phoneNo'].value.replaceAll(/[^a-zA-Z0-9]/g, ''),
      "pinCode": this.ProfileFormGroup.controls['pinCode'].value,
      "industry": this.industry,
      "descriptions": this.ProfileFormGroup.controls['description'].value,
      "logoPath": this.fileNameBusinessLogo,
      "imagePath": this.fileNameBusinessDisplayImage,
      "website": this.ProfileFormGroup.controls['website'].value,
      "facebookUrl": this.ProfileFormGroup.controls['facebookUrl'].value,
      "twitterUrl": this.ProfileFormGroup.controls['twitterUrl'].value,
      "googleUrl": this.ProfileFormGroup.controls['googleUrl'].value,
      "instagramUrl": this.ProfileFormGroup.controls['instagramUrl'].value,
      "latitude": this.latitude,
      "longitude": this.longitude,
      "yelpUrl": this.ProfileFormGroup.controls['yelpUrl'].value,
      "stateId": 3,
      "isActive": true,
      "businessGroupId": this.businessGroupID.id,
      "createdBy": AppSettings.GetCreatedBy(),
      "createdDate": AppSettings.GetDate(),
      "lastModifiedBy": AppSettings.GetCreatedBy(),
      "lastModifiedDate": AppSettings.GetDate(),
      "stateCodeID": this.ProfileFormGroup.controls['stateCodeId'].value,
      "city": this.ProfileFormGroup.controls['city'].value,
      "businesswiseLabels": this.GetBusinessLabels(),
      "businesswiseWorkingDays": this.GetBusinessWorkingHours(),
      "galleryImagePath1": this.fileNameBusinessImage1,
      "galleryImagePath2": this.fileNameBusinessImage2,
      "galleryImagePath3": this.fileNameBusinessImage3,
      "galleryImagePath4": this.fileNameBusinessImage4,
      "isAgeRestriction": this.isAgeRestriction,
      "isSponsored": this.isSponsored,
      "customerID": this.customerID,
      "licenseNumber": this.licenseNumber,
      "timeZone": this.timeZone,
    }

    this.profileSettingService.PutBusinessProfile(details.id, details)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.submitted = false;
          this.iseditmode = false;
          this.isAgeRestriction = false;
          this.isSponsored = false;
          this.customerID = '';
          this.licenseNumber = '';
          this.timeZone = '';
          this.ProfileFormGroup.reset();
          this.GetBusinessProfilesByGroupID();
        },
        error: error => {
          this.isLoading = false;
          this.iseditmode = true;
          this.submitted = false;
        }
      });
  }

  onChangeDefaultTime() {
    let getValueFrom = this.ProfileFormGroup.controls['monFromTime'].value;
    let getValueTo = this.ProfileFormGroup.controls['monToTime'].value;

    this.ChkMakeDefaultTime = !this.ChkMakeDefaultTime;
    this.ProfileFormGroup.controls['tueFromTime'].setValue(getValueFrom);
    this.ProfileFormGroup.controls['tueToTime'].setValue(getValueTo);
    this.ProfileFormGroup.controls['wedFromTime'].setValue(getValueFrom);
    this.ProfileFormGroup.controls['wedToTime'].setValue(getValueTo);
    this.ProfileFormGroup.controls['thuFromTime'].setValue(getValueFrom);
    this.ProfileFormGroup.controls['thuToTime'].setValue(getValueTo);
    this.ProfileFormGroup.controls['friFromTime'].setValue(getValueFrom);
    this.ProfileFormGroup.controls['friToTime'].setValue(getValueTo);
    this.ProfileFormGroup.controls['satFromTime'].setValue(getValueFrom);
    this.ProfileFormGroup.controls['satToTime'].setValue(getValueTo);
    this.ProfileFormGroup.controls['sunFromTime'].setValue(getValueFrom);
    this.ProfileFormGroup.controls['sunToTime'].setValue(getValueTo);
  }

  initAutocomplete() {
    this.googleMapsService.api.then((maps) => {
      let autocomplete = new maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          this.latitude = autocomplete.getPlace().geometry.location.lat();
          this.longitude = autocomplete.getPlace().geometry.location.lng();
          this.ProfileFormGroup.controls['address'].setValue(this.searchElementRef.nativeElement.value);

          let city = '';
          let postal_code = '';
          let state: any = [];
          let country = '';
          autocomplete.getPlace().address_components?.forEach((element: any) => {

            const types = element.types;
            if (types.includes('locality')) {
              city = element.long_name;
            }

            if (types.includes('postal_code')) {
              postal_code = element.long_name;
            }

            if (types.includes('administrative_area_level_1')) {
              state = element.short_name;
            }

            if (types.includes('country')) {
              country = element.short_name === 'US' ? 'USA' : element.long_name;
            }
          });
          let formattedAddress = autocomplete.getPlace().formatted_address || '';
          const removeComponent = (address: string, component: string) => {
            if (component) {
              const index = address.indexOf(component);
              if (index !== -1) {
                address = address.substring(0, (index)) + address.substring(index + component.length);
              }
            }

            return address;
          }

          formattedAddress = removeComponent(formattedAddress, city);
          formattedAddress = removeComponent(formattedAddress, postal_code);
          formattedAddress = removeComponent(formattedAddress, state);
          formattedAddress = removeComponent(formattedAddress, country);
          formattedAddress = formattedAddress
            .replaceAll(',', '').trim();

          autocomplete.getPlace().address_components?.forEach((element: any) => {
            const types = element.types;
            if (types.includes('locality')) {
              city = element.long_name;
            }

          });

          this.ProfileFormGroup.controls['city'].setValue(city);
          this.ProfileFormGroup.controls['pinCode'].setValue(postal_code);
          this.ProfileFormGroup.controls['address'].setValue(formattedAddress);

          let selectedState = this.statesData.filter(x => x.name == state)[0].id;
          this.ProfileFormGroup.controls['stateCodeId'].setValue(selectedState);
        });
      });

      this.searchElementRef.nativeElement.addEventListener('keydown', (event: any) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      });
    });
  }

  removeBusiness(id: any) {
    this.selectedBusiness.splice((this.selectedBusiness.indexOf(this.selectedBusiness.filter(x => x.id == id)[0])), 1);
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  formatNum(event: any) {
    if (event.inputType != 'deleteContentBackward') {
      const inputElement = event.target as HTMLInputElement;
      let inputValue = inputElement.value;
      const value = inputValue.replace(/[^0-9]/g, '');
      let format = '(***) ***-****';

      for (let i = 0; i < value.length; i++) {
        format = format.replace('*', value.charAt(i));
      }

      if (format.indexOf('*') >= 0) {
        format = format.substring(0, format.indexOf('*'));
      }

      inputElement.value = format.trim();
    }
  }

  validatePattern(control: FormControl) {
    const items = control.value;
    const pattern = /^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AP][M])$/;

    if (items && items.label != undefined) {
      const invalidItems = !pattern.test(items.label);
      return invalidItems == true ? { invalidPattern: true } : null;
    }
    else if (items && items.label == undefined) {
      const invalidItems = !pattern.test(items);
      return invalidItems == true ? { invalidPattern: true } : null;
    }

    return null;
  }
}