import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PromotionService } from '../../../services/PromotionService';
import { ToastService } from '../../../services/ToastService';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Sort } from '@angular/material/sort';
import { AppSettings } from '../../../services/Constants';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SpinWheelService } from 'src/app/services/SpinWheelConfigurationService';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MemberService } from 'src/app/services/MemberService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { BusinessGroupService } from 'src/app/services/BusinessGroupService';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent {
  @ViewChild('wizard') public wizardRef: TemplateRef<any>;
  isLoading = false;
  isLoadingMembers = false;
  messageString = ("\n" + "Valid: " + "-" + "\n" + "Redeem at : " + "\n" + "Reply STOP to opt out" + "\n"
    + "Download Revords.com/app to save your reward");
  submitted = false;
  buttonname = "";
  businessGroupID: any;
  businessGroupName: any;
  businessID: string;
  loading = false;
  displayData: any = [];
  pagesize: any = 5;
  promotions: any = [];
  iseditmode = false;
  isLoadingAnnData = false;
  isValidPromoMSG1;
  isValidPromoMSG1MSG;
  isValidPromoMSG2;
  isValidPromoMSG2MSG;
  isValidOcassion;
  isValidOcassionMSG;
  errorMessageSpinWheel: any;
  icon: 'fa-edit';
  isLoadingSaveData = false;
  location: string = "";
  LatestSMSstatus = "";
  LatestSMSstatus2 = "";
  SMSStatus = "";
  businessLocationIDs: string = "";
  errorMessage: string = "";
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '8rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    showToolbar: false,
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  subjectCharacterCount1: number = 50;
  subjectCharacterCount2: number = 50;
  descriptionCharacterCount: number = 1200;
  showSendBtn: boolean = false;
  showPromo2: boolean = false;
  IsPriviewAvailable = true;
  minDate = new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) < 10 ? ('0' + (new Date().getMonth() + 1)) :
    (new Date().getMonth() + 1)) + '-' + (new Date().getDate() < 10 ? ('0' + new Date().getDate()) : new Date().getDate());
  maxDate = new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) < 10 ? ('0' + (new Date().getMonth() + 1)) :
    (new Date().getMonth() + 1)) + '-' + (new Date().getDate() < 10 ? ('0' + new Date().getDate()) : new Date().getDate());;
  bussinessDataForRedemption: { id: any, businessName: string, checked: boolean, memberCount: number }[] = [];
  bussinessDataForSentPromo: { id: any, businessName: string, checked: boolean }[] = [];
  bussinessDataForStep3: { id: any, businessName: string, checked: boolean, memberCount: number }[] = [];
  badgeDataForStep3: { id: any, badgeName: string, counts: string, checked: boolean }[] = [];
  tagDataForStep3: { id: any, tagName: string, counts: string, checked: boolean }[] = [];
  isAllChecked: Boolean = false;
  isAllBadgeChecked: Boolean = false;
  isAllTagChecked: Boolean = false;
  _defaultOpts: { indexID: number, arctext: string, colorCode: string, probability: number, IsPoints: boolean }[] = [];
  time: { name: string, value: number, disabled: boolean }[] = [
    { name: '9-10 AM', value: 9, disabled: false },
    { name: '10-11 AM', value: 10, disabled: false },
    { name: '11-12 PM', value: 11, disabled: false },
    { name: '12-1 PM', value: 12, disabled: false },
    { name: '1-2 PM', value: 13, disabled: false },
    { name: '2-3 PM', value: 14, disabled: false },
    { name: '3-4 PM', value: 15, disabled: false },
    { name: '4-5 PM', value: 16, disabled: false },
    { name: '5-6 PM', value: 17, disabled: false },
    { name: '6-7 PM', value: 18, disabled: false },
    { name: '7-8 PM', value: 19, disabled: false },
    { name: '8-9 PM', value: 20, disabled: false }
  ];
  scheduleLaterTime: string = '';
  selectedRedemtionOption: string = '';
  selectedBusinessName: string = '';
  sendToCustomers: string = '';
  enableSpinwheelStep: boolean = false;
  dashBoardFormControl = new FormGroup({
    businessID: new FormControl(),
  })
  indexwiseCharacters: { index: number, length: number }[] = [];
  membersData: any = [];
  businessWiseBadgeTagCount: any = [];
  firstFormGroup = this._formBuilder.group({
    id: [''],
    promotionalMessage1: ['', Validators.required],
    promotionalMessage2: [''],
    isWordOfMouth1: [false],
    isWordOfMouth2: [false],
    occasionHTML: [''],
    occasion: ['', Validators.compose([Validators.required, Validators.maxLength(1200)])],
    offerStartDate: ['', Validators.required],
    offerEndDate: ['', Validators.required],
    isSendSoon: ['', Validators.required],
    date: [''],
    time: [null],
    isSpinWheelAllowed1: [false],
    isSpinWheelAllowed2: [false],
    isRedeemable1: [true],
    isRedeemable2: [true],
    fileName: [''],
    fileContentType: [''],
    filePath: [''],
    isSpinMulti: [false],
    MuliplePromo: [false]
  });
  secondFormGroup = this._formBuilder.group({
    RedemptionAt: [null, Validators.required],
    membersOf: ['', Validators.required],
    sendToCustomers: ['', Validators.required]
  });
  spinFormGroup = this._formBuilder.group({
    0: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.compose([Validators.required])],
      IsInteger: [false],
      totalPoints: [0, Validators.compose([Validators.min(100), Validators.max(100)])]
    }),
    1: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.required],
      IsInteger: [false],
    }),
    2: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.required],
      IsInteger: [false],
    }),
    3: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.required],
      IsInteger: [false],
    }),
    4: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.required],
      IsInteger: [false],
    }),
    5: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.required],
      IsInteger: [false],
    }),
    6: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.required],
      IsInteger: [false],
    }),
    7: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.required],
      IsInteger: [false],
    })
  });
  business: any = [];
  packageDetails: any = [];
  file: File = null;
  uploadProgress: any;
  loadingLoading: boolean = false;
  uploadSub: Subscription;
  isfileUploaded = false;
  annImage: any;
  fileName: any;
  filePath: any;
  startDate: string;
  endDate: string;
  allSelected = false;
  spinWheelControls: any;
  totalPoints: number = 0;
  bussiness: any = [];
  totalDelivered: number = 0;
  notificationCount: number = 0;
  emailCount: number = 0;
  smsCount: number = 0;
  draftPromo: any = [];
  filtereddata: any = [];
  isSpinRequired: any;
  allowedWords = [{ text: 'friend', reward: 'bring a friend' }, { text: 'beer', reward: 'beverages' }, { text: 'wine', reward: 'beverages' },
  { text: 'drinks', reward: 'beverages' }, { text: 'off', reward: 'off' }, { text: '%', reward: 'discount' },
  { text: 'offer', reward: 'exciting offer' }, { text: 'gift card', reward: 'dollar' },
  { text: '$', reward: 'dollar' }, { text: 'buy one get', reward: 'BOGO' }, { text: 'bogo', reward: 'BOGO' },
  { text: 'free', reward: 'free item' }, { text: 'spin the wheel', reward: 'Spin wheel' }]
  negativeFlagTooltip: any = '';
  lastSmsSentDate: any = null;
  smsTillDate: any = null;
  @ViewChild('select') select: MatSelect;
  @ViewChild('editor') editor;
  // @ViewChild('exampleModal') modal: ElementRef;

  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsSingle: IDropdownSettings = {};
  constructor(private _liveAnnouncer: LiveAnnouncer, private _promotionService: PromotionService,
    public toastService: ToastService, private modalService: NgbModal, private _businessGroupService: BusinessGroupService,
    private _formBuilder: FormBuilder, private _memberservice: MemberService, public sanitizer: DomSanitizer,
    private _spinwheel: SpinWheelService, private datePipe: DatePipe) {
    this.isSpinRequired = JSON.parse(localStorage.getItem('IsSpinRequired'))
    this.business = JSON.parse(localStorage.getItem('Business'));
    this.businessGroupID = JSON.parse(localStorage.getItem('BusinessGroup'));
    this.packageDetails = JSON.parse(localStorage.getItem('PackageDetails'));
    this.businessGroupName = JSON.parse(localStorage.getItem('BusinessGroupName'));
    if (this.packageDetails.isMMS == true) {
      this.descriptionCharacterCount = 1200;
    }
    this.dropdownSettings = {
      idField: 'id',
      textField: 'businessName',
    }
    this.dropdownSettingsSingle = {
      idField: 'id',
      textField: 'businessName',
      singleSelection: true
    }
    this.bussiness = JSON.parse(localStorage.getItem('Business'));
    this.bussiness.forEach(element => {
      this.location += element.id + ',';
      this.businessLocationIDs += element.id + ',';
    });
  }

  onDateChange(): void {
    this.startDate = this.firstFormGroup.controls['offerStartDate'].value;
    this.endDate = this.firstFormGroup.controls['offerEndDate'].value;
    if (this.startDate > this.endDate) {
      this.firstFormGroup.controls['offerEndDate'].reset();
    }
    const dateFormat = 'yyyy-MM-dd';
    this.endDate = this.datePipe.transform(this.endDate, dateFormat);

    this.maxDate = null;
    this.firstFormGroup.controls['date'].setValue('');
    let val = this.firstFormGroup.controls["isSendSoon"].value;
    if (val == '2') {
      this.maxDate = this.firstFormGroup.controls["offerStartDate"].value;
    }
    this.getRewardstring();
  }
  async GetSpinWheeldefaultConfigByBusinessGroupID() {
    this._spinwheel.GetSpinWheeldefaultConfigByBusinessGroupID(this.businessGroupID.id).pipe()
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

        }
      });
  }
  async setBusiness() {
    let data = JSON.parse(localStorage.getItem('Business'));
    this.bussinessDataForStep3 = [];
    this.bussinessDataForRedemption = [];
    this.bussinessDataForRedemption.push({
      id: -1,
      businessName: "Any Location",
      checked: false,
      memberCount: 0
    })
    data.forEach(element => {
      this.bussinessDataForRedemption.push({
        id: element.id,
        businessName: element.businessName,
        checked: false,
        memberCount: this.membersData != null && this.membersData != undefined && this.membersData.length > 0 ? (this.membersData.filter(x => x.id == element.id).length > 0 ? this.membersData.filter(x => x.id == element.id)[0].count : 0) : 0
      });
    });
    this.bussinessDataForStep3 = this.bussinessDataForRedemption;
  }
  ngOnInit() {
    this.GetDraftPromotionByBusinessGroupID();
    this.GetPromotions();
    this.GetMembersData();
    this.setSpinWheelData();
    // this.GetLastSMSDetails();
    this.GetLastSMSSentDate();
    this.GetBusinessGroupByID();
    this.dropdownSettings = {
      idField: 'id',
      textField: 'businessName',
    }
    this.dropdownSettingsSingle = {
      idField: 'id',
      textField: 'businessName',
      singleSelection: true
    }
  }

  GetBusinessGroupByID() {
    this._businessGroupService.GetBusinessGroupByID(this.businessGroupID.id).pipe()
      .subscribe({
        next: (data) => {
          this.negativeFlagTooltip = "All " + data.negativeFlagName + "'s are excluded from badges. Select " + data.negativeFlagName
            + " to include.";
        },
        error: error => {
        }
      });
  }

  async GetMembersData() {
    this.membersData = [];
    this.badgeDataForStep3 = [];
    this.tagDataForStep3 = [];
    this.totalDelivered = 0;
    this.notificationCount = 0;
    this.emailCount = 0;
    this.smsCount = 0;

    let date = this.firstFormGroup.controls['date'].value;
    let time = this.firstFormGroup.controls['time'].value;
    var sentDate = (date != "" && time != "") ?
      formatDate(new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate(), time, 0, 0), 'yyyy-MM-dd', 'en-US')
      : formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    let details = {
      "businessGroupId": this.businessGroupID.id,
      "businessLocationIDs": this.businessLocationIDs,
      "badgeIDs": '',
      "tagIDs": '',
      "sendDate": this.firstFormGroup.controls['isSendSoon'].value == '1' ? formatDate(new Date(), 'yyyy-MM-dd', 'en-US') : sentDate
    }

    this._memberservice.GetMembersDataForPromotion(details).pipe()
      .subscribe({
        next: async (data) => {
          let badgeData = data['table1'];
          let tagData = data['table2'];
          this.membersData = data['table3'];
          let summary = data['table4'];
          badgeData.forEach(element => {
            let x = { "id": element.id, "badgeName": element.name, "counts": element.count.toString(), "checked": false };
            this.badgeDataForStep3.push(x);
          });

          tagData.forEach(element => {
            let x = { "id": element.id, "tagName": element.name, "counts": element.count.toString(), "checked": false };
            this.tagDataForStep3.push(x);
          });

          this.totalDelivered = summary[0].totalDelivered;
          this.notificationCount = summary[0].notificationCount
          this.emailCount = summary[0].emailCount;
          this.smsCount = summary[0].smsCount;

          await this.setBusiness();
        },
        error: error => {
          console.log(error);
        }
      });
  }

  async setSpinWheelData() {
    this.totalPoints = 0;
    let spinWheelData = JSON.parse(localStorage.getItem('OPTS'));
    if (spinWheelData != null) {
      this.spinWheelControls = Object.keys(this.spinFormGroup.controls);
      for (let index = 0; index < this.spinWheelControls.length; index++) {
        this.spinFormGroup.controls[index].controls['indexID'].setValue(spinWheelData[index].indexID);
        this.spinFormGroup.controls[index].controls['text'].setValue(spinWheelData[index].arctext);
        this.spinFormGroup.controls[index].controls['Probability'].setValue(spinWheelData[index].probability);
        this.spinFormGroup.controls[index].controls['IsInteger'].setValue(spinWheelData[index].IsPoints);
        this.totalPoints += parseInt(spinWheelData[index].probability);
      }
      this.spinFormGroup.controls[0].controls['totalPoints'].setValue(this.totalPoints);
      let length = spinWheelData.length;
      for (let i = 0; i < length; i++) {
        this.indexwiseCharacters.push({
          index: i,
          length: 15 - spinWheelData[i].arctext.length
        })
      }
    }
    else {
      await this.GetSpinWheeldefaultConfigByBusinessGroupID();
    }
  }

  resetSpinWheelData() {
    this.spinWheelControls = Object.keys(this.spinFormGroup.controls);
    this.indexwiseCharacters = [];
    for (let index = 0; index < this.spinWheelControls.length; index++) {
      this.spinFormGroup.controls[index].reset();
      this.indexwiseCharacters.push({
        index: index,
        length: 15
      })
    }
  }

  selectAllBusiness() {
    if (this.isAllChecked) {
      this.isAllChecked = false;
      this.bussinessDataForStep3.forEach(x => x.checked = false);
    }
    else {
      this.isAllChecked = true;
      this.bussinessDataForStep3.forEach(x => x.checked = true);
    }

    this.onMembersOfSelected();
    this.BusinessNameForSummary();
  }

  async onBusinessSelected(id: number) {
    if (this.bussinessDataForStep3.filter(x => x.id == id)[0].checked) {
      this.bussinessDataForStep3.filter(x => x.id == id)[0].checked = false;
    }
    else {
      this.bussinessDataForStep3.filter(x => x.id == id)[0].checked = true;
    }

    this.isAllChecked = (this.bussinessDataForStep3.filter(x => x.id != -1).length) ==
      (this.bussinessDataForStep3.filter(x => x.checked == true).length) ? true : false;

    this.onMembersOfSelected();
    this.BusinessNameForSummary();
  }

  onMembersOfSelected() {
    this.businessLocationIDs = '';
    let badgeIDs: string = '';
    let tagIDs: string = '';
    this.totalDelivered = 0;
    this.notificationCount = 0;
    this.emailCount = 0;
    this.smsCount = 0;

    this.bussinessDataForStep3.filter(x => x.id != -1).forEach(element => {
      if (element.checked)
        this.businessLocationIDs += element.id + ',';
    });

    this.badgeDataForStep3.forEach(element => {
      if (element.checked)
        badgeIDs += element.id + ',';
    });

    this.tagDataForStep3.forEach(element => {
      if (element.checked)
        tagIDs += element.id + ',';
    });

    let date = this.firstFormGroup.controls['date'].value;
    let time = this.firstFormGroup.controls['time'].value;
    var sentDate = (date != "" && time != "") ?
      formatDate(new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate(), time, 0, 0), 'yyyy-MM-dd', 'en-US')
      : formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    let details = {
      "businessGroupId": this.businessGroupID.id,
      "businessLocationIDs": this.businessLocationIDs,
      "badgeIDs": badgeIDs,
      "tagIDs": tagIDs,
      "sendDate": this.firstFormGroup.controls['isSendSoon'].value == '1' ? formatDate(new Date(), 'yyyy-MM-dd', 'en-US') : sentDate
    }

    console.log(details)

    this._memberservice.GetMembersDataForPromotion(details).pipe()
      .subscribe({
        next: async (data) => {
          let badgeData = data['table1'];
          let tagData = data['table2'];
          let summary = data['table4'];

          this.badgeDataForStep3.forEach(element => {
            element.counts = badgeData.filter(x => x.id == element.id)[0].count;
          });
          this.tagDataForStep3.forEach(element => {
            element.counts = tagData.filter(x => x.id == element.id)[0].count;
          });

          this.totalDelivered = summary[0].totalDelivered;
          this.notificationCount = summary[0].notificationCount;
          this.emailCount = summary[0].emailCount;
          this.smsCount = summary[0].smsCount;
        },
        error: error => {
          console.log(error);
        }
      });
  }
  selectAllBadges() {
    if (this.isAllBadgeChecked) {
      this.isAllBadgeChecked = false;
      this.badgeDataForStep3.forEach(x => x.checked = false);
    }
    else {
      this.isAllBadgeChecked = true;
      this.badgeDataForStep3.forEach(x => x.checked = true);
    }
    this.onMembersOfSelected();
    this.BadgeTagForSummary();
  }
  onBadgeSelected(id: number) {
    if (this.badgeDataForStep3.filter(x => x.id == id)[0].checked) {
      this.badgeDataForStep3.filter(x => x.id == id)[0].checked = false;
    }
    else {
      this.badgeDataForStep3.filter(x => x.id == id)[0].checked = true;
    }
    this.isAllBadgeChecked = this.badgeDataForStep3.filter(x => x.checked == false).length > 0 ? false : true;
    this.onMembersOfSelected();
    this.BadgeTagForSummary();
  }

  selectAllTags() {
    if (this.isAllTagChecked) {
      this.isAllTagChecked = false;
      this.tagDataForStep3.forEach(x => x.checked = false);
    }
    else {
      this.isAllTagChecked = true;
      this.tagDataForStep3.forEach(x => x.checked = true);
    }
    this.onMembersOfSelected();
    this.BadgeTagForSummary();
  }

  onTagSelected(id: number) {
    if (this.tagDataForStep3.filter(x => x.id == id)[0].checked) {
      this.tagDataForStep3.filter(x => x.id == id)[0].checked = false;
    }
    else {
      this.tagDataForStep3.filter(x => x.id == id)[0].checked = true;
    }
    this.isAllTagChecked = this.tagDataForStep3.filter(x => x.checked == false).length > 0 ? false : true;
    this.onMembersOfSelected();
    this.BadgeTagForSummary();
  }

  BadgeTagForSummary() {
    this.sendToCustomers = '';
    if (this.isAllBadgeChecked) {
      this.sendToCustomers = 'All Badges,';
    }
    else {
      this.badgeDataForStep3.forEach(element => {
        if (element.checked) {
          this.sendToCustomers += element.badgeName + ', '
        }
      });
    }

    if (this.isAllTagChecked) {
      this.sendToCustomers += 'All Tags';
    }
    else {
      this.tagDataForStep3.forEach(element => {
        if (element.checked) {
          this.sendToCustomers += element.tagName + ', '
        }
      });
    }
    this.secondFormGroup.controls['sendToCustomers'].setValue(this.sendToCustomers);
  }

  BusinessNameForSummary() {
    this.selectedBusinessName = '';
    if (this.isAllChecked) {
      this.selectedBusinessName = 'All';
    }
    else {
      this.bussinessDataForStep3.forEach(element => {
        if (element.checked) {
          this.selectedBusinessName += element.businessName + ', '
        }
      });
    }
    this.secondFormGroup.controls['membersOf'].setValue(this.selectedBusinessName);
  }

  async showMore() {
    this.isLoadingAnnData = true;
    let newLength = this.displayData.length + parseInt(this.pagesize);
    this.displayData = this.promotions.sort((a, b) => b.id - a.id).slice(0, newLength);
    this.isLoadingAnnData = false;
  }

  async EditReplicate(id) {
    this.isLoadingAnnData = true;

    await this.ClearForEdit();
    await this.GetMembersData();

    let length: any = 1200;
    this.firstFormGroup.controls['promotionalMessage1'].reset();
    this.firstFormGroup.controls['promotionalMessage1'].enable();
    this.firstFormGroup.controls['promotionalMessage1'].setValidators([Validators.required]);
    this.firstFormGroup.controls['promotionalMessage2'].reset();

    this._promotionService.GetPromotionByID(id).pipe()
      .subscribe({
        next: async (data) => {
          let year = new Date().getFullYear();
          let month = (new Date().getMonth() + 1);
          let date = new Date().getDate();
          this.startDate = year + "-" + (month < 10 ? ("0" + month) : month) + "-" + (date < 10 ? ("0" + date) : date);

          this.firstFormGroup = await this._formBuilder.group({
            id: [''],
            promotionalMessage1: [data.promotionalMessage, Validators.required],
            promotionalMessage2: [data.promotionalMessage2],
            isWordOfMouth1: [data.isWordOfMouth],
            isWordOfMouth2: [false],
            occasion: [data.occasion, Validators.compose([Validators.required, Validators.maxLength(length)])],
            occasionHTML: [data.occasionHtml],
            offerStartDate: [this.startDate, Validators.required],
            offerEndDate: ['', Validators.required],
            isSendSoon: ['', Validators.required],
            date: [''],
            time: [''],
            isSpinWheelAllowed1: [data.isSpinWheel],
            isSpinWheelAllowed2: [false],
            isRedeemable1: [data.isRedeemable],
            isRedeemable2: [false],
            fileName: [data.fileName],
            fileContentType: [data.fileContentType],
            filePath: [AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + data.fileName],
            isSpinMulti: [data.isSpinMulti],
            MuliplePromo: [data.promotionalMessage2 != '' && data.promotionalMessage2 != null ? true : false]
          });
          this.subjectCharacterCount1 = 50 - this.firstFormGroup.controls['promotionalMessage1'].value.length;
          this.subjectCharacterCount2 = 50 - this.firstFormGroup.controls['promotionalMessage2'].value.length;
          this.descriptionCharacterCount = length - this.firstFormGroup.controls['occasion'].value.length;

          this.secondFormGroup = await this._formBuilder.group({
            RedemptionAt: [data.redemptionOptionID, Validators.required],
            membersOf: ['', Validators.required],
            sendToCustomers: ['', Validators.required]
          });
          await this.BusinessNameForSummary();

          this.secondFormGroup.controls['sendToCustomers'].setValue(this.sendToCustomers);
          // await this.allowSpinwheel();
          if (data.promotionalMessage2 != '' && data.promotionalMessage2 != null) {
            this.btnAddPromo();
          }
          if (data.fileName != null && data.fileName != '') {
            this.isfileUploaded = false;
            this.fileName = data.fileName;
            this.filePath = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + data.fileName;
            this.uploadProgress = '100%';
          }
          else {
            this.uploadProgress = null;
          }
          this.iseditmode = true;
          this.buttonname = "Cancel";
          this.isLoadingAnnData = false;
        },
        error: error => {
          this.isLoadingAnnData = false;
        }
      });
  }

  async ClearForEdit() {
    this.firstFormGroup = this._formBuilder.group({
      id: [''],
      promotionalMessage1: ['', Validators.required],
      promotionalMessage2: [''],
      isWordOfMouth1: [false],
      isWordOfMouth2: [false],
      occasion: ['', Validators.compose([Validators.required, Validators.maxLength(length)])],
      occasionHTML: [''],
      offerStartDate: ['', Validators.required],
      offerEndDate: ['', Validators.required],
      isSendSoon: ['', Validators.required],
      date: [''],
      time: [''],
      isSpinWheelAllowed1: [false],
      isSpinWheelAllowed2: [false],
      isRedeemable1: [true],
      isRedeemable2: [true],
      fileName: [''],
      fileContentType: [''],
      filePath: [''],
      isSpinMulti: [false],
      MuliplePromo: [false]
    });
    this.secondFormGroup = this._formBuilder.group({
      RedemptionAt: [null, Validators.required],
      membersOf: ['', Validators.required],
      sendToCustomers: ['', Validators.required]
    });
    this.isfileUploaded = true;
    this.fileName = "";
    this.filePath = "";
    this.uploadProgress = null;
    this.buttonname = "Cancel";
    this.file = null;
    this.selectedBusinessName = '';
    this.sendToCustomers = '';
    this.badgeDataForStep3 = [];
    this.tagDataForStep3 = [];
    this.bussinessDataForStep3 = [];
    this.bussinessDataForRedemption = [];
    this.selectedRedemtionOption = '';
    this.totalDelivered = 0;
    this.notificationCount = 0;
    this.emailCount = 0;
    this.smsCount = 0;
    this.messageString = ("\n" + "Valid: " + "-" + "\n" + "Redeem at : " + "\n" + "Reply STOP to opt out" + "\n"
      + "Download Revords.com/app to save your reward");
  }

  showSnackbarAction(message: string, action: string) {
    if (action == "1") {
      this.toastService.showSuccess(message);
    } else if (action == "2") {
      this.toastService.showDanger(message);
    }
  }

  GetPromotions() {
    this.isLoadingAnnData = true;
    this._promotionService.GetPromotionsByBusinessGroupID(this.businessGroupID.id, this.location).pipe()
      .subscribe({
        next: async (data) => {
          this.promotions = JSON.parse(JSON.stringify(data));
          this.displayData = this.promotions.sort((a, b) => b.id - a.id).slice(0, this.pagesize);
          this.isLoadingAnnData = false;
        },
        error: error => {
          this.isLoadingAnnData = false;
        }
      });
  }

  async GetDraftPromotionByBusinessGroupID() {
    this._promotionService.GetDraftPromotionByBusinessGroupID(this.businessGroupID.id).pipe()
      .subscribe({
        next: async (data) => {
          this.draftPromo = data;
          if (this.draftPromo != '' && this.draftPromo != null && this.draftPromo != undefined && this.draftPromo.length > 0) {
            this.buttonname = "Resume Editing";
          }
          else {
            this.buttonname = "Create Promotion";
          }
        },
        error: error => {
        }
      });
  }
  // async GetLastSMSDetails() {
  //   this._memberservice.GetLastSMSDetails().pipe()
  //     .subscribe({
  //       next: async (data) => {
  //         this.LatestSMSstatus = "Last SMS Status : " + "Sent To : " + data.toNumber + " Sent on : " + data.created_at + " UTC";
  //         this.LatestSMSstatus2 = "delivery_status : " + data.delivery_status + " StatusCode : " + data.statusCode;
  //         this.SMSStatus = (data.delivery_status == "40002" || data.delivery_status == "40003") ? "delivery_Failed" : "delivered";
  //       },
  //       error: error => {
  //         this.LatestSMSstatus = "";
  //         this.LatestSMSstatus2 = "";
  //         this.SMSStatus = "";
  //       }
  //     });
  // }

  GetLastSMSSentDate() {
    this._promotionService.GetLastPromotionSentDateByBusinessGroupID(this.businessGroupID.id).pipe()
      .subscribe({
        next: async (data) => {
          this.lastSmsSentDate = data.item1;
          this.smsTillDate = data.item2;
        },
        error: error => {
          console.log(error);
        }
      });
  }

  async CreatePromotion() {
    if (this.iseditmode) {
      let promotion1Subject = this.firstFormGroup.controls['promotionalMessage1'].value;
      let occasion = this.firstFormGroup.controls['occasion'].value;
      if ((promotion1Subject != undefined && promotion1Subject != '' && promotion1Subject != null) ||
        (occasion != undefined && occasion != '' && occasion != null)) {
        this.modalService.open(this.wizardRef);
        return;
      }

      await this.GetDraftPromotionByBusinessGroupID();
      this.iseditmode = false;
      this.submitted = false;
      await this.ClearControlandView();
      await this.setSpinWheelData();
    }
    else {
      let year = new Date().getFullYear();
      let month = (new Date().getMonth() + 1);
      let date = new Date().getDate();
      this.startDate = year + "-" + (month < 10 ? ("0" + month) : month) + "-" + (date < 10 ? ("0" + date) : date);
      this.firstFormGroup.controls['offerStartDate'].setValue(this.startDate);
      await this.setSpinWheelData();
      await this.setBusiness();
      this.GetMembersData();
      this.iseditmode = true;
      this.submitted = false;
      this.buttonname = "Cancel";

      if (this.draftPromo != '' && this.draftPromo != null && this.draftPromo != undefined && this.draftPromo.length > 0) {
        this.EditReplicate(this.draftPromo[0].id);
      }
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  showOcassionInfo(promotion) {
    if (this.promotions.find(p => p.id == promotion.id).isVisible == false) {
      this.promotions.find(p => p.id == promotion.id).isVisible = true;
    }
    else if (this.promotions.find(p => p.id == promotion.id).isVisible == true) {
      this.promotions.find(p => p.id == promotion.id).isVisible = false;
    }
  }

  async ontextchanged(length, control) {
    if (control == "promotionalMessage1") {
      let l = (this.firstFormGroup.controls['promotionalMessage1'].value).length;
      this.subjectCharacterCount1 = length - l;
    }
    else if (control == "promotionalMessage2") {
      let f = (this.firstFormGroup.controls['promotionalMessage2'].value).length;
      this.subjectCharacterCount2 = length - f;
    }
    else if (control == "occasion") {
      let text: any = this.editor.textArea.nativeElement.innerText;
      this.descriptionCharacterCount = (this.packageDetails.isMMS == true ? 1200 : 1200) - (text == "\n" ? 0 : text.length);
      this.firstFormGroup.controls['occasion'].setValue(text == "\n" ? '' : text);
    }
    await this.getRewardstring();
  }
  async getRewardstring() {
    this.messageString = "";
    // this.messageString1 = ""; this.messageString2 = "";
    let checkwordspromotionalMessage1 = (this.firstFormGroup.controls['promotionalMessage1'].value);
    let valueCheckspromotionalMessage1 = checkwordspromotionalMessage1.replace(' ', '').toLowerCase();
    let checkwordspromotionalMessage2 = (this.firstFormGroup.controls['promotionalMessage2'].value);
    let valueCheckspromotionalMessage2 = checkwordspromotionalMessage2.replace(' ', '').toLowerCase();
    let checkwordsoccasion = (this.firstFormGroup.controls['occasion'] != null ? this.firstFormGroup.controls['occasion'].value : '');
    let valueChecksoccasion = checkwordsoccasion != null ? checkwordsoccasion.replace(' ', '').toLowerCase() : '';

    if (this.showPromo2) {
      this.messageString = this.businessGroupID.businessGroupName + " sent you a " + "double reward!";
      for (let index = 0; index < this.allowedWords.length; index++) {
        const element = this.allowedWords[index];
        if (valueCheckspromotionalMessage1.toLowerCase().includes(element.text.toLowerCase())) {
          this.isValidPromoMSG1 = true;
          this.isValidPromoMSG1MSG = "Hey!!! A " + element.reward + "" + " Reward has been detected. "
          if (element.reward == 'bring a friend') {
            let x = checkwordspromotionalMessage1;
            let setstring = this.extractIntegersFromString(x).toString();
            setstring = setstring == "" ? "" : "$" + setstring;
            this.messageString += ("\n" + "1: Bring a friend and get " + setstring + " reward!");
            break;
          }
          else if (element.reward == 'beverages') {
            let x = checkwordspromotionalMessage1;
            let setstring = this.extractIntegersFromString(x).toString();
            if (setstring == "") {
              setstring = "Offer on your favorite beverages!";
            }
            else {
              if (x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('$') && x.toLowerCase().includes('off')) {
                setstring = "$" + setstring + " off ALL Beer and Wine Reward!";
              } else if (x.toLowerCase().includes('beer') && !x.toLowerCase().includes('wine') && x.toLowerCase().includes('$') && x.toLowerCase().includes('off')) {
                setstring = "$" + setstring + " off ALL Beer Reward!";
              } else if (!x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('$') && x.toLowerCase().includes('off')) {
                setstring = "$" + setstring + " off ALL Wine for Reward!";
              } else if (x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('$')) {
                setstring = "ALL Beer and Wine for $" + setstring + " Reward!";
              } else if (x.toLowerCase().includes('beer') && !x.toLowerCase().includes('wine') && x.toLowerCase().includes('$')) {
                setstring = "ALL Beer for $" + setstring + " Reward!";
              } else if (!x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('$')) {
                setstring = "ALL Wine for $" + setstring + " Reward!";
              } else if (x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('%')) {
                setstring = setstring + "% off ALL Beer and Wine Reward!";
              } else if (x.toLowerCase().includes('beer') && !x.toLowerCase().includes('wine') && x.toLowerCase().includes('%')) {
                setstring = setstring + "% off ALL Beer Reward!";
              } else if (!x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('%')) {
                setstring = setstring + "% off ALL Wine Reward!";
              } else if (x.toLowerCase().includes('drinks') && x.toLowerCase().includes('$')) {
                setstring = "ALL Drinks for $" + setstring + " Reward!";
              } else if (x.toLowerCase().includes('drinks') && x.toLowerCase().includes('%')) {
                setstring = "ALL Drinks " + setstring + "% off Reward!";
              }
            }
            this.messageString += ("\n" + "1: " + setstring);
            break;
          }
          else if (element.reward == 'dollar') {
            let x = checkwordspromotionalMessage1;
            var indexstart = checkwordspromotionalMessage1.indexOf("$");
            let setstring = "";
            if (indexstart == -1) {
              setstring = "1: Special Reward!";
              this.messageString += ("\n" + setstring);
            }
            else {
              let checkamount = checkwordspromotionalMessage1.substring((indexstart + 1), (checkwordspromotionalMessage1.length - (indexstart + 1)));
              let indexendNumber = checkamount.indexOf(' ');
              let actualAmount = checkamount.substring(0, (indexendNumber >= 0 ? indexendNumber : checkamount.length));
              let successfullyParsed = parseInt(actualAmount);
              if (successfullyParsed) {
                let localstring = checkwordspromotionalMessage1.substring(indexstart, (checkwordspromotionalMessage1.length - indexstart));
                let indexend = localstring.indexOf(' ');
                setstring = localstring.substring(0, (indexend >= 0 ? indexend : localstring.length));
                this.messageString += ("\n" + "1: " + setstring + " Reward!");
              }
              else {
                setstring = "1: Special Reward!";
                this.messageString += ("\n" + setstring);
              }
            }
            break;
          }
          else if (element.reward == 'discount') {
            let x = checkwordspromotionalMessage1;
            var indexstart = checkwordspromotionalMessage1.indexOf("%");
            let setstring = "";
            if (indexstart == -1) {
              setstring = "1: " + "Special " + element.reward + " reward!";
              this.messageString += ("\n" + setstring);
            }
            else {
              let checkamount = checkwordspromotionalMessage1.substring(0, (indexstart + 1));
              let indexendNumber = checkamount.indexOf(' ');
              let actualAmount = checkamount.substring((indexendNumber >= 0 ? indexendNumber : 0), (checkamount.length));
              let successfullyParsed = parseInt(actualAmount);
              if (successfullyParsed) {
                let localstring = checkwordspromotionalMessage1.substring(0, (indexstart + 1));
                let indexend = localstring.indexOf(' ');
                setstring = localstring.substring((indexend >= 0 ? indexend : 0), localstring.length);
                this.messageString += ("\n" + "1: " + setstring + " " + element.reward + " reward!");
              }
              else {
                setstring = "1: " + "Special " + element.reward + " reward!";
                this.messageString += ("\n" + setstring);
              }
            }
            break;
          }
          else if (element.reward == 'free item') {
            this.messageString += ("\n" + "1: " + "Special " + element.reward + " reward!");
            break;
          }
          else if (element.reward == 'off') {
            let x = checkwordspromotionalMessage1;
            let setstring = this.extractIntegersFromString(x).toString();
            if (x.includes('$')) {
              this.messageString = this.businessGroupID.businessGroupName + " sent you a $" + setstring + ' ' + element.reward + " reward!";
            }
            else if (x.includes('%')) {
              this.messageString = this.businessGroupID.businessGroupName + " sent you a " + setstring + '% ' + element.reward + " reward!";
            }
            break;
          }
          else {
            this.messageString += ("\n" + "1: " + element.reward + " reward!");
            break;
          }
        } else if (checkwordspromotionalMessage1.toLowerCase().includes('spin the wheel')) {
          this.messageString += ("\n" + "1: Spin wheel reward!");
          break;
        } else {
          this.isValidPromoMSG1 = false;
          this.isValidPromoMSG1MSG = "No Reward detected";
        }
      }
      //for promo 2
      for (let index = 0; index < this.allowedWords.length; index++) {
        const element = this.allowedWords[index];

        if (valueCheckspromotionalMessage2.toLowerCase().includes(element.text.toLowerCase())) {
          this.isValidPromoMSG2 = true;
          this.isValidPromoMSG2MSG = "Hey!!! A " + element.reward + "" + " Reward has been detected. "
          if (element.reward == 'bring a friend') {
            let x = checkwordspromotionalMessage2;
            let setstring = this.extractIntegersFromString(x).toString();
            setstring = setstring == "" ? "" : "$" + setstring;
            this.messageString += ("\n" + "2: Bring a friend and get " + setstring + " reward!");
            break;
          }
          else if (element.reward == 'beverages') {
            let x = checkwordspromotionalMessage2;
            let setstring = this.extractIntegersFromString(x).toString();
            if (setstring == "") {
              setstring = "Offer on your favorite beverages!";
            }
            else {
              if (x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('$') && x.toLowerCase().includes('off')) {
                setstring = "$" + setstring + " off ALL Beer and Wine Reward!";
              } else if (x.toLowerCase().includes('beer') && !x.toLowerCase().includes('wine') && x.toLowerCase().includes('$') && x.toLowerCase().includes('off')) {
                setstring = "$" + setstring + " off ALL Beer Reward!";
              } else if (!x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('$') && x.toLowerCase().includes('off')) {
                setstring = "$" + setstring + " off ALL Wine for Reward!";
              } else if (x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('$')) {
                setstring = "ALL Beer and Wine for $" + setstring + " Reward!";
              } else if (x.toLowerCase().includes('beer') && !x.toLowerCase().includes('wine') && x.toLowerCase().includes('$')) {
                setstring = "ALL Beer for $" + setstring + " Reward!";
              } else if (!x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('$')) {
                setstring = "ALL Wine for $" + setstring + " Reward!";
              } else if (x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('%')) {
                setstring = setstring + "% off ALL Beer and Wine Reward!";
              } else if (x.toLowerCase().includes('beer') && !x.toLowerCase().includes('wine') && x.toLowerCase().includes('%')) {
                setstring = setstring + "% off ALL Beer Reward!";
              } else if (!x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('%')) {
                setstring = setstring + "% off ALL Wine Reward!";
              } else if (x.toLowerCase().includes('drinks') && x.toLowerCase().includes('$')) {
                setstring = "ALL Drinks for $" + setstring + " Reward!";
              } else if (x.toLowerCase().includes('drinks') && x.toLowerCase().includes('%')) {
                setstring = "ALL Drinks " + setstring + "% off Reward!";
              }
            }
            this.messageString += ("\n" + "2: " + setstring);
            break;
          }
          else if (element.reward == 'dollar') {
            let x = checkwordspromotionalMessage2;
            var indexstart = checkwordspromotionalMessage2.indexOf("$");
            let setstring = "";
            if (indexstart == -1) {
              setstring = "2: Special Reward!";
              this.messageString += ("\n" + setstring);
            }
            else {
              let checkamount = checkwordspromotionalMessage2.substring((indexstart + 1), (checkwordspromotionalMessage2.length - (indexstart + 1)));
              let indexendNumber = checkamount.indexOf(' ');
              let actualAmount = checkamount.substring(0, (indexendNumber >= 0 ? indexendNumber : checkamount.length));
              let successfullyParsed = parseInt(actualAmount);
              if (successfullyParsed) {
                let localstring = checkwordspromotionalMessage2.substring(indexstart, (checkwordspromotionalMessage2.length - indexstart));
                let indexend = localstring.indexOf(' ');
                setstring = localstring.substring(0, (indexend >= 0 ? indexend : localstring.length));
                this.messageString += ("\n" + "2: " + setstring + " Reward!");
              }
              else {
                setstring = "2: Special Reward!";
                this.messageString += ("\n" + setstring);
              }
            }
            break;
          }
          else if (element.reward == 'discount') {
            let x = checkwordspromotionalMessage2;
            var indexstart = checkwordspromotionalMessage2.indexOf("%");
            let setstring = "";
            if (indexstart == -1) {
              setstring = "2: " + "Special " + element.reward + " reward!";
              this.messageString += ("\n" + setstring);
            }
            else {
              let checkamount = checkwordspromotionalMessage2.substring((indexstart + 1), (checkwordspromotionalMessage2.length - (indexstart + 1)));
              let indexendNumber = checkamount.indexOf(' ');
              let actualAmount = checkamount.substring(0, (indexendNumber >= 0 ? indexendNumber : checkamount.length));
              let successfullyParsed = parseInt(actualAmount);
              if (successfullyParsed) {
                let localstring = checkwordspromotionalMessage2.substring(indexstart, (checkwordspromotionalMessage2.length - indexstart));
                let indexend = localstring.indexOf(' ');
                setstring = localstring.substring(0, (indexend >= 0 ? indexend : localstring.length));
                this.messageString += ("\n" + "2: " + setstring + " " + element.reward + " reward!");
              }
              else {
                setstring = "2: " + "Special " + element.reward + " reward!";
                this.messageString += ("\n" + setstring);
              }
            }
            break;
          }
          else if (element.reward == 'free item') {
            this.messageString += ("\n" + "2: " + "Special " + element.reward + " reward!");
            break;
          }
          else if (element.reward == 'off') {
            let x = checkwordspromotionalMessage1;
            let setstring = this.extractIntegersFromString(x).toString();
            if (x.includes('$')) {
              this.messageString = this.businessGroupID.businessGroupName + " sent you a $" + setstring + ' ' + element.reward + " reward!";
            }
            else if (x.includes('%')) {
              this.messageString = this.businessGroupID.businessGroupName + " sent you a " + setstring + '% ' + element.reward + " reward!";
            }
            break;
          }
          else {
            this.messageString += ("\n" + "2: " + element.reward + " reward!");
            break;
          }
        } else if (checkwordspromotionalMessage2.toLowerCase().includes('spin the wheel')) {
          this.messageString += ("\n" + "2: Spin wheel reward!");
          break;
        } else {
          this.isValidPromoMSG2 = false;
          this.isValidPromoMSG2MSG = "No Reward detected";
        }
      }
    }

    else {
      for (let index = 0; index < this.allowedWords.length; index++) {
        const element = this.allowedWords[index];
        if (valueCheckspromotionalMessage1.toLowerCase().includes(element.text.toLowerCase())) {
          this.isValidPromoMSG1 = true;
          this.isValidPromoMSG1MSG = "Hey!!! A " + element.reward + "" + " Reward has been detected. "
          if (element.reward == 'bring a friend') {
            let x = checkwordspromotionalMessage1;
            let setstring = this.extractIntegersFromString(x).toString();
            setstring = setstring == "" ? "" : "$" + setstring;
            this.messageString = this.businessGroupID.businessGroupName + " sent you Bring a friend and get " + setstring + " reward!";
            break;
          }
          else if (element.reward == 'beverages') {
            console.log('in')
            let x = checkwordspromotionalMessage1;
            let setstring = this.extractIntegersFromString(x).toString();
            console.log(setstring)
            if (setstring == "") {
              setstring = "Offer on your favorite beverages!";
            }
            else {
              if (x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('$') && x.toLowerCase().includes('off')) {
                setstring = "$" + setstring + " off ALL Beer and Wine Reward!";
              } else if (x.toLowerCase().includes('beer') && !x.toLowerCase().includes('wine') && x.toLowerCase().includes('$') && x.toLowerCase().includes('off')) {
                setstring = "$" + setstring + " off ALL Beer Reward!";
              } else if (!x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('$') && x.toLowerCase().includes('off')) {
                setstring = "$" + setstring + " off ALL Wine for Reward!";
              } else if (x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('$')) {
                setstring = "ALL Beer and Wine for $" + setstring + " Reward!";
              } else if (x.toLowerCase().includes('beer') && !x.toLowerCase().includes('wine') && x.toLowerCase().includes('$')) {
                setstring = "ALL Beer for $" + setstring + " Reward!";
              } else if (!x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('$')) {
                setstring = "ALL Wine for $" + setstring + " Reward!";
              } else if (x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('%')) {
                setstring = setstring + "% off ALL Beer and Wine Reward!";
              } else if (x.toLowerCase().includes('beer') && !x.toLowerCase().includes('wine') && x.toLowerCase().includes('%')) {
                setstring = setstring + "% off ALL Beer Reward!";
              } else if (!x.toLowerCase().includes('beer') && x.toLowerCase().includes('wine') && x.toLowerCase().includes('%')) {
                setstring = setstring + "% off ALL Wine Reward!";
              } else if (x.toLowerCase().includes('drinks') && x.toLowerCase().includes('$')) {
                setstring = "ALL Drinks for $" + setstring + " Reward!";
              } else if (x.toLowerCase().includes('drinks') && x.toLowerCase().includes('%')) {
                setstring = "ALL Drinks " + setstring + "% off Reward!";
              }
            }
            this.messageString = this.businessGroupID.businessGroupName + " sent you " + setstring;
            break;
          }
          else if (element.reward == 'dollar') {
            var indexstart = checkwordspromotionalMessage1.indexOf("$");
            let setstring = "";
            let checkamount = checkwordspromotionalMessage1.substring((indexstart + 1), (checkwordspromotionalMessage1.length - (indexstart + 1)));
            let indexendNumber = checkamount.indexOf(' ');
            let actualAmount = checkamount.substring(0, (indexendNumber >= 0 ? indexendNumber : checkamount.length));
            let successfullyParsed = parseInt(actualAmount);
            if (successfullyParsed) {
              let localstring = checkwordspromotionalMessage1.substring(indexstart, (checkwordspromotionalMessage1.length - indexstart));
              let indexend = localstring.indexOf(' ');
              setstring = localstring.substring(0, (indexend >= 0 ? indexend : localstring.length));
              this.messageString = this.businessGroupID.businessGroupName + " sent you a " + setstring + " reward!";
            }
            else {
              setstring = "dollar reward!";
              this.messageString = this.businessGroupID.businessGroupName + " sent you a " + setstring;
            }
            break;
          }
          else if (element.reward == 'discount') {
            let x = checkwordspromotionalMessage1;
            var indexstart = checkwordspromotionalMessage1.indexOf("%");
            let setstring = "";
            let checkamount = checkwordspromotionalMessage1.substring(0, (indexstart + 1));
            let indexendNumber = checkamount.indexOf(' ');
            let actualAmount = checkamount.substring((indexendNumber >= 0 ? indexendNumber : 0), (checkamount.length - 1));
            let successfullyParsed = parseInt(actualAmount);
            if (successfullyParsed) {
              let localstring = checkwordspromotionalMessage1.substring(0, (indexstart + 1));
              let indexend = localstring.indexOf(' ');
              setstring = localstring.substring((indexend >= 0 ? indexend : 0), localstring.length);
              this.messageString = this.businessGroupID.businessGroupName + " sent you a " + setstring + " " + element.reward + " reward!";
            }
            else {
              this.messageString = this.businessGroupID.businessGroupName + " sent you a " + element.reward + " reward!";
            }
            break;
          }
          else if (element.reward == 'free item') {
            this.messageString = this.businessGroupID.businessGroupName + " sent you a " + element.reward + " reward!";
            break;
          }
          else if (element.reward == 'off') {
            let x = checkwordspromotionalMessage1;
            let setstring = this.extractIntegersFromString(x).toString();
            if (x.includes('$')) {
              this.messageString = this.businessGroupID.businessGroupName + " sent you a $" + setstring + ' ' + element.reward + " reward!";
            }
            else if (x.includes('%')) {
              this.messageString = this.businessGroupID.businessGroupName + " sent you a " + setstring + '% ' + element.reward + " reward!";
            }
            break;
          }
          else {
            this.messageString = this.businessGroupID.businessGroupName + " sent you a " + element.reward + " reward!";
            break;
          }
        } else if (checkwordspromotionalMessage1.toLowerCase().includes('spin the wheel')) {
          this.messageString = this.businessGroupID.businessGroupName + " sent you a Spin wheel reward!";
          break;
        } else {
          this.isValidPromoMSG1 = false;
          this.isValidPromoMSG1MSG = "No Reward detected";
        }
        if (valueCheckspromotionalMessage2.includes(element.text.toLowerCase())) {
          this.isValidPromoMSG2 = true;
          this.isValidPromoMSG2MSG = "Hey!!! A " + element.reward + "" + " Reward has been detected. "
          break;
        } else {
          this.isValidPromoMSG2 = false;
          this.isValidPromoMSG2MSG = "No Reward detected";
        }
      }
    }

    const dateFormat = 'MM/dd';
    let startDate = this.datePipe.transform(this.firstFormGroup.controls['offerStartDate'].value, dateFormat);
    let endDate = this.datePipe.transform(this.firstFormGroup.controls['offerEndDate'].value, dateFormat);

    this.messageString += ("\n" + "Valid: " + (startDate == null ? "" : startDate) + "-" + (endDate == null ? "" : endDate)
      + "\n" + "Redeem at : " + this.selectedRedemtionOption + "\n" + "Reply STOP to opt out" + "\n"
      + "Download Revords.com/app to save your reward");
  }

  extractIntegersFromString(str: string): number[] {
    const matches = str.match(/\d+/g);
    if (matches) {
      return matches.map(match => parseInt(match, 10));
    } else {
      return [];
    }
  }

  Submit(): void {
    this.submitted = true;
    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid || this.spinFormGroup.invalid) {
      return;
    }
    this.isLoading = true;
    this.isLoadingSaveData = true;

    if (this.draftPromo != '' && this.draftPromo != null && this.draftPromo != undefined && this.draftPromo.length > 0) {
      this._promotionService.DeletePromotionByID(this.draftPromo[0].id)
        .subscribe({
          next: async (data) => {
            this.draftPromo = [];
          },
          error: error => {
            console.log(error);
          }
        });
    }

    let model = this.createModel();
    console.log(model)
    this._promotionService.MultiPromotions(model)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.isLoadingSaveData = false;
          this.iseditmode = false;
          this.submitted = false;
          this.ClearControlandView();
        },
        error: error => {
          this.isLoadingSaveData = false;
          this.isLoading = false;
          this.submitted = false;
        }
      });
  }

  createModel() {
    let details = [];
    let length = 0;
    if (this.showPromo2) {
      length = 2;
    }
    else {
      length = 1;
    }
    let promodetails: any = [];
    for (let index = 1; index <= length; index++) {
      let multiPromotion = this.GetPromotionModel(index)
      promodetails.push(multiPromotion);
    }
    return promodetails;
  }

  GetPromotionModel(index) {
    let date = this.firstFormGroup.controls['date'].value;
    let time = this.firstFormGroup.controls['time'].value;
    var sentDate = (date != "" && time != "") ?
      new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate(), time, 0, 0) : "";
    if (index == 1) {
      let isSpinWheel1: Boolean = this.firstFormGroup.controls['isSpinWheelAllowed1'].value;
      let val = this.secondFormGroup.controls['RedemptionAt'].value != null ? this.secondFormGroup.controls['RedemptionAt'].value : [];
      let badgeDetails = {
        "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "id": 0,
        "promotionalMessage": this.firstFormGroup.controls['promotionalMessage1'].value,
        "promotionalMessage2": this.firstFormGroup.controls['promotionalMessage2'].value,
        "isRedeemable": this.firstFormGroup.controls['isRedeemable1'].value,
        "isSpinWheel": isSpinWheel1,
        "isWordOfMouth": this.firstFormGroup.controls['isWordOfMouth1'].value,
        "occasion": this.firstFormGroup.controls['occasion'].value,
        "occasionHTML": this.firstFormGroup.controls['occasionHTML'].value,
        "isSendSoon": this.firstFormGroup.controls['isSendSoon'].value == '1' ? true : false,
        "isScheduledLater": this.firstFormGroup.controls['isSendSoon'].value == '2' ? true : false,
        "isSpinMulti": this.firstFormGroup.controls['isSpinMulti'].value,
        "sentDate": this.firstFormGroup.controls['isSendSoon'].value == '1' ? new Date() : sentDate,
        "offerStartDate": this.firstFormGroup.controls['offerStartDate'].value,
        "offerEndDate": this.firstFormGroup.controls['offerEndDate'].value,
        "createdDate": AppSettings.GetDate(),
        "isActive": AppSettings.Active,
        "createdBy": AppSettings.GetCreatedBy(),
        "lastModifiedBy": AppSettings.GetLastModifiedBy(),
        "lastModifiedDate": AppSettings.GetDate(),
        "businessGroupID": this.businessGroupID.id,
        "redemptionOptionID": val.length > 0 ? val[0].id : 0,
        "fileName": this.file != null && this.file != undefined ? this.file.name : "",
        "fileContentType": this.file != null && this.file != undefined ? this.file.type : "",
        "filePath": AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileName,
        "stateID": 3,
        "promotionReferenceID": 0,
        "messageBody": this.messageString,
        "promotionalDetails": this.GetPromotionDetails(),
        "spinWheelConfiguration": isSpinWheel1 == true ? this.GetSpinWheelDetails() : [],
        "locationwisePromotionRedemption": this.GetRedemptionDetails()
      }
      return badgeDetails;
    }
    else if (index == 2) {
      let isSpinWheel2: Boolean = this.firstFormGroup.controls['isSpinWheelAllowed2'].value;
      let val = this.secondFormGroup.controls['RedemptionAt'].value != null ? this.secondFormGroup.controls['RedemptionAt'].value : [];
      let badgeDetailsindex2 = {
        "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "id": 0,
        "promotionalMessage": this.firstFormGroup.controls['promotionalMessage2'].value,
        "promotionalMessage2": "",
        "isRedeemable": this.firstFormGroup.controls['isRedeemable2'].value,
        "isSpinWheel": isSpinWheel2,
        "isWordOfMouth": this.firstFormGroup.controls['isWordOfMouth2'].value,
        "occasion": this.firstFormGroup.controls['occasion'].value,
        "occasionHTML": this.firstFormGroup.controls['occasionHTML'].value,
        "isSendSoon": this.firstFormGroup.controls['isSendSoon'].value == '1' ? true : false,
        "isScheduledLater": this.firstFormGroup.controls['isSendSoon'].value == '2' ? true : false,
        "isSpinMulti": this.firstFormGroup.controls['isSpinMulti'].value,
        "sentDate": this.firstFormGroup.controls['isSendSoon'].value == '1' ? new Date() : sentDate,
        "offerStartDate": this.firstFormGroup.controls['offerStartDate'].value,
        "offerEndDate": this.firstFormGroup.controls['offerEndDate'].value,
        "createdDate": AppSettings.GetDate(),
        "isActive": AppSettings.Active,
        "createdBy": AppSettings.GetCreatedBy(),
        "lastModifiedBy": AppSettings.GetLastModifiedBy(),
        "lastModifiedDate": AppSettings.GetDate(),
        "businessGroupID": this.businessGroupID.id,
        "redemptionOptionID": val.length > 0 ? val[0].id : 0,
        "fileName": this.file != null && this.file != undefined ? this.file.name : "",
        "fileContentType": this.file != null && this.file != undefined ? this.file.type : "",
        "filePath": AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileName,
        "stateID": 3,
        "promotionReferenceID": 0,
        "messageBody": this.messageString,
        "promotionalDetails": this.GetPromotionDetails(),
        "spinWheelConfiguration": isSpinWheel2 == true ? this.GetSpinWheelDetails() : [],
        "locationwisePromotionRedemption": this.GetRedemptionDetails()
      }
      return badgeDetailsindex2;
    }
  }

  GetPromotionDetails() {
    let details = [];
    for (let outer of this.badgeDataForStep3) {
      if (outer.checked) {
        let tempdefDetails = {
          "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "id": 0,
          "promotionId": 0,
          "badgeId": outer.id,
          "tagId": 0,
          "createdDate": AppSettings.GetDate(),
          "isActive": AppSettings.Active,
          "createdBy": AppSettings.GetCreatedBy(),
          "lastModifiedBy": AppSettings.GetLastModifiedBy(),
          "lastModifiedDate": AppSettings.GetDate(),
        }
        details.push(tempdefDetails);
      }
    }
    for (let outer of this.tagDataForStep3) {
      if (outer.checked) {
        let tempdefDetails = {
          "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "id": 0,
          "promotionId": 0,
          "badgeId": 0,
          "tagId": outer.id,
          "createdDate": AppSettings.GetDate(),
          "isActive": AppSettings.Active,
          "createdBy": AppSettings.GetCreatedBy(),
          "lastModifiedBy": AppSettings.GetLastModifiedBy(),
          "lastModifiedDate": AppSettings.GetDate(),
        }
        details.push(tempdefDetails);
      }
    }
    return details;
  }

  GetSpinWheelDetails() {
    let details = [];
    this.spinWheelControls = Object.keys(this.spinFormGroup.controls);
    for (let index = 0; index < this.spinWheelControls.length; index++) {
      let tempdefDetails = {
        "uniqueId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "id": 0,
        "promotionId": 0,
        "indexId": this.spinFormGroup.controls[index].controls['indexID'].value,
        "bussinessGroupID": this.businessGroupID.id,
        "colorCode": '',
        "arctext": this.spinFormGroup.controls[index].controls['text'].value,
        "probability": this.spinFormGroup.controls[index].controls['Probability'].value,
        "isInteger": this.spinFormGroup.controls[index].controls['IsInteger'].value,
        "createdDate": AppSettings.GetDate(),
        "isActive": AppSettings.Active,
        "createdBy": AppSettings.GetCreatedBy(),
        "lastModifiedBy": AppSettings.GetLastModifiedBy(),
        "lastModifiedDate": AppSettings.GetDate(),
      }
      details.push(tempdefDetails);
    }
    return details;
  }

  GetRedemptionDetails() {
    let details = [];
    let redemptionAt = this.secondFormGroup.controls['RedemptionAt'].value != null ? this.secondFormGroup.controls['RedemptionAt'].value : [];
    this.bussinessDataForRedemption.forEach(element => {
      if (element.id != -1) {
        let tempDetails = {
          "uniqueID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "id": 0,
          "promotionID": 0,
          "businessLocationID": element.id,
          "locationName": this.selectedBusinessName,
          "isSent": this.bussinessDataForStep3.filter(x => x.id == element.id)[0].checked,
          "redeemableAt": redemptionAt.length > 0 ? redemptionAt[0].id : 0,
          "isActive": AppSettings.Active,
          "createdBy": AppSettings.GetCreatedBy(),
          "createdDate": AppSettings.GetDate(),
          "lastModifiedBy": AppSettings.GetLastModifiedBy(),
          "lastModifiedDate": AppSettings.GetDate(),
        }
        details.push(tempDetails);
      }
    });
    return details;
  }

  async ClearControlandView() {
    this.firstFormGroup = this._formBuilder.group({
      id: [''],
      promotionalMessage1: ['', Validators.required],
      promotionalMessage2: [''],
      isWordOfMouth1: [false],
      isWordOfMouth2: [false],
      occasion: ['', Validators.compose([Validators.required, Validators.maxLength(1200)])],
      occasionHTML: [''],
      offerStartDate: ['', Validators.required],
      offerEndDate: ['', Validators.required],
      isSendSoon: ['', Validators.required],
      date: [''],
      time: [''],
      isSpinWheelAllowed1: [false],
      isSpinWheelAllowed2: [false],
      isRedeemable1: [true],
      isRedeemable2: [true],
      fileName: [''],
      fileContentType: [''],
      filePath: [''],
      isSpinMulti: [false],
      MuliplePromo: [false]
    });
    this.secondFormGroup = this._formBuilder.group({
      RedemptionAt: [null, Validators.required],
      membersOf: ['', Validators.required],
      sendToCustomers: ['', Validators.required]
    });
    this.buttonname = "Create Promotion";
    this.file = null;
    this.isfileUploaded = true;
    this.isAllBadgeChecked = false;
    this.isAllTagChecked = false;
    this.isAllChecked = false;
    this.bussinessDataForStep3 = [];
    this.bussinessDataForRedemption = [];
    this.tagDataForStep3 = [];
    this.badgeDataForStep3 = [];
    this.fileName = null;
    this.filePath = null;
    this.uploadProgress = null;
    this.iseditmode = false;
    this.GetPromotions();
    this.showPromo2 = false;
    this.enableSpinwheelStep = false;
    this.selectedBusinessName = '';
    this.sendToCustomers = '';
    this.selectedRedemtionOption = '';
    this.messageString = ("\n" + "Valid: " + "-" + "\n" + "Redeem at : " + "\n" + "Reply STOP to opt out" + "\n"
      + "Download Revords.com/app to save your reward");
    this.isValidPromoMSG1 = null;
    this.isValidPromoMSG1MSG = "";
    this.subjectCharacterCount1 = 50;
    this.subjectCharacterCount2 = 50;
    this.time.forEach(element => {
      element.disabled = false;
    });
    this.totalDelivered = 0;
    this.notificationCount = 0;
    this.emailCount = 0;
    this.smsCount = 0;
  }
  async allowSpinwheel() {
    if (this.firstFormGroup.controls['isSpinWheelAllowed1'].value == true) {
      this.firstFormGroup.controls['isSpinWheelAllowed2'].disable();
      this.firstFormGroup.controls['promotionalMessage1'].setValue("Spin the wheel at kiosk and get exciting prizes");
      this.firstFormGroup.controls['promotionalMessage1'].disable();
      this.getRewardstring();
    }
    else if (this.firstFormGroup.controls['isSpinWheelAllowed1'].value == false) {
      this.firstFormGroup.controls['isSpinWheelAllowed2'].enable();
      if (this.firstFormGroup.controls['promotionalMessage1'].value == "Spin the wheel at kiosk and get exciting prizes") {
        this.firstFormGroup.controls['promotionalMessage1'].setValue('')
      }
      this.firstFormGroup.controls['promotionalMessage1'].enable();
      this.getRewardstring();
    }

    if (this.firstFormGroup.controls['isSpinWheelAllowed2'].value == true) {
      this.firstFormGroup.controls['isSpinWheelAllowed1'].disable();
      this.firstFormGroup.controls['promotionalMessage2'].setValue("Spin the wheel at kiosk and get exciting prizes");
      this.firstFormGroup.controls['promotionalMessage2'].disable();
      this.getRewardstring();
    }
    else if (this.firstFormGroup.controls['isSpinWheelAllowed2'].value == false) {
      this.firstFormGroup.controls['isSpinWheelAllowed1'].enable();
      if (this.firstFormGroup.controls['promotionalMessage2'].value == "Spin the wheel at kiosk and get exciting prizes") {
        this.firstFormGroup.controls['promotionalMessage2'].setValue('')
      }
      this.firstFormGroup.controls['promotionalMessage2'].enable();
      this.getRewardstring();
    }

    this.enableSpinwheelStep = (this.firstFormGroup.controls['isSpinWheelAllowed1'].value == true ||
      this.firstFormGroup.controls['isSpinWheelAllowed2'].value == true) ? true : false;
  }
  async btnAddPromo() {
    if (this.showPromo2) {
      this.showPromo2 = false;
      this.enableSpinwheelStep = this.firstFormGroup.controls['isSpinWheelAllowed2'].value == true ? false : this.enableSpinwheelStep;
      this.firstFormGroup.controls['isSpinWheelAllowed2'].setValue(false);
      this.firstFormGroup.controls['isSpinWheelAllowed1'].enable();
      this.firstFormGroup.controls['promotionalMessage2'].setValue('');
    }
    else {
      this.showPromo2 = true;
      this.firstFormGroup.controls['promotionalMessage2'].enable();
    }
    await this.getRewardstring();
  }
  scheduleTimeChanged() {
    let val: number = this.firstFormGroup.controls['time'].value;
    if (val != 0) {
      this.scheduleLaterTime = this.time.filter(x => x.value == val)[0].name;
    }
    this.onMembersOfSelected();
  }
  onRedemptionOptionChanged() {
    let val = this.secondFormGroup.controls['RedemptionAt'].value != null ? this.secondFormGroup.controls['RedemptionAt'].value : [];
    if (val.length > 0) {
      if (val[0].id == -1) {
        this.selectedRedemtionOption = "Any Location"
      }
      else {
        this.selectedRedemtionOption = this.bussinessDataForRedemption.filter(x => x.id == val[0].id)[0].businessName;
      }
    }
    else if (val.length == 0) {
      this.selectedRedemtionOption = '';
    }
    this.getRewardstring();
  }
  onChange(event) {
    this.file = event.target.files[0];
    this.onUpload();
  }
  onUpload() {
    if (this.file) {
      this.loadingLoading = true;
      this.uploadSub = this._promotionService.uploadPromotionalfile(this.file).pipe()
        .subscribe({
          next: (event: any) => {
            if (event.type == HttpEventType.UploadProgress) {
              this.uploadProgress = Math.round(100 * (event.loaded / event.total)).toString() + "%";
            }
            if (event.partialText != undefined && event.partialText.split('|')[0] == "file uploaded") {
              this.loadingLoading = false; // Flag variable
              this.isfileUploaded = true;
              this.annImage = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.file.name;
              let array = event.partialText.split('|')[1].split('\\');
              this.fileName = array[array.length - 1];
              this.filePath = AppSettings.API_ENDPOINT + AppSettings.Root_ENDPOINT + "/" + this.fileName;
            } else {
              this.loadingLoading = false;
              this.isfileUploaded = false;
            }
          },
          error: error => {
            console.log("This is on upload error", error);
            this.errorMessage = error.error;
            this.modalService.open(this.errorMessage, {
              animation: true,
              size: 'lg',
              centered: true,
            });
            this.cancelUpload();
          }
        });
    }
    this.loadingLoading = false;
  }
  cancelUpload() {
    if (this.uploadSub != null) {
      this.uploadSub.unsubscribe();
    }
    this.isfileUploaded = false;
    this.fileName = "";
    this.reset();
  }
  reset() {
    this.file = null;
    this.filePath = null;
    this.uploadProgress = null;
    this.uploadSub = null;
  }
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  onEventLog(controlName: any, data: any, index: any): void {
    if (controlName == "arcText") {
      this.indexwiseCharacters[index].length = 15 - data.srcElement.value.length;
    }
    if (controlName == "IsPoints") {
      let text: any = this.spinFormGroup.controls[index].controls['text'].value;
      let IsPoints: any = this.spinFormGroup.controls[index].controls['IsInteger'].value;

      if (isNaN(Number(text))) {
        this.spinFormGroup.controls[index].controls['text'].setValue('');
        this.indexwiseCharacters[index].length = 15;
      }
    }
    if (controlName == "probability") {
      this.totalPoints = 0;
      this.spinWheelControls = Object.keys(this.spinFormGroup.controls);
      for (let index = 0; index < this.spinWheelControls.length; index++) {
        this.totalPoints += parseInt(this.spinFormGroup.controls[index].controls['Probability'].value);
      }
      this.spinFormGroup.controls['0'].controls['totalPoints'].setValue(this.totalPoints);
    }
  }
  numberOnly(controlName: any, event: any, index: any): boolean {
    if (controlName == "arcText") {
      let IsPoints: any = this.spinFormGroup.controls[index].controls['IsInteger'].value;
      if (IsPoints) {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
      }
    }
    if (controlName == "probability") {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
  }
  onScheduleDateChanged() {
    let currentHour = new Date().getHours();
    let selectedDate = this.firstFormGroup.controls['date'].value;

    this.firstFormGroup.controls['time'].setValue('');

    if ((moment().local().date() == moment(selectedDate).local().date()) && ((moment().local().month() + 1) == (moment(selectedDate).local().month() + 1))
      && (moment().local().year() == moment(selectedDate).local().year())) {
      this.time.forEach(element => {
        if (element.value < currentHour) {
          element.disabled = true;
        }
      });
    }
    else {
      this.time.forEach(element => {
        element.disabled = false;
      });
    }
    this.onMembersOfSelected();
  }
  common() {
    let businesslocationID = this.dashBoardFormControl.controls['businessID'].value;
    this.location = "";
    if (businesslocationID.length > 0 && businesslocationID != null) {
      businesslocationID.forEach(element => {
        this.location += element.id + ',';
      });
    } else {
      this.bussiness = JSON.parse(localStorage.getItem('Business'));
      this.bussiness.forEach(element => {
        this.location += element.id + ',';
      });
    }

    this.GetPromotions();
    this.displayData = this.promotions.sort((a, b) => b.id - a.id).slice(0, this.pagesize);
  }
  DraftSave() {
    if (this.draftPromo != '' && this.draftPromo != null && this.draftPromo != undefined && this.draftPromo.length > 0) {
      return;
    }

    this.submitted = true;
    this.isLoading = true;
    this.isLoadingSaveData = true;
    let model = this.createModel();
    model[0].stateID = 2;
    if (model.length > 1) {
      model[1].stateID = 2;
    }
    // 
    this.modalService.dismissAll();
    this._promotionService.MultiPromotions(model)
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.isLoadingSaveData = false;
          this.iseditmode = false;
          this.submitted = false;
          this.ClearControlandView();
          this.buttonname = "Resume Editing";
        },
        error: error => {
          this.isLoadingSaveData = false;
          this.isLoading = false;
          this.submitted = false;
        }
      });
  }
  async closePopup() {
    this.modalService.dismissAll();
    if (this.draftPromo != '' && this.draftPromo != null && this.draftPromo != undefined && this.draftPromo.length > 0) {
      this._promotionService.DeletePromotionByID(this.draftPromo[0].id)
        .subscribe({
          next: async (data) => {
            this.draftPromo = [];
          },
          error: error => {

          }
        });
    }
    this.buttonname = "Create Promotion";
    this.iseditmode = false;
    this.submitted = false;
    await this.ClearControlandView();
    await this.setSpinWheelData();
  }
  //#region BusinessDropdown
  async onItemSelectAll(items) {
    this.dashBoardFormControl.controls['businessID'].setValue(items);
    this.location = "";
    items.forEach(element => {
      this.location += element.id + ',';
    });
    this.GetPromotions();
    this.displayData = this.promotions.sort((a, b) => b.id - a.id).slice(0, this.pagesize);
  }

  async onDeSelectAll(items) {
    this.dashBoardFormControl.controls['businessID'].setValue(items);
    this.location = "";
    items.forEach(element => {
      this.location += element.id + ',';
    });
    this.GetPromotions();
    this.displayData = this.promotions.sort((a, b) => b.id - a.id).slice(0, this.pagesize);
  }
  //#endregion

  onScheduleLaterSelected() {
    let val = this.firstFormGroup.controls["isSendSoon"].value;
    if (val == '2') {
      this.maxDate = this.firstFormGroup.controls["offerStartDate"].value;
      let year = new Date().getFullYear();
      let month = (new Date().getMonth() + 1);
      let date = new Date().getDate();
      this.firstFormGroup.controls['date'].setValue(year + "-" + (month < 10 ? ("0" + month) : month) + "-" + (date < 10 ? ("0" + date) : date));
      this.onScheduleDateChanged();
    }
    this.onMembersOfSelected();
  }
}
