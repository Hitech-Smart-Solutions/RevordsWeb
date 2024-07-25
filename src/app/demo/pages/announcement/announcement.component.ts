import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HttpEventType } from '@angular/common/http';
import { FileUploadService } from '../../../services/fileuploadservie';
import { FormBuilder, Validators, AbstractControl, FormGroup, FormControl } from '@angular/forms';
import { AnnouncementService } from '../../../services/AnnouncementService';
import { ToastService } from '../../../services/ToastService';
import { AppSettings } from '../../../services/Constants';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MemberService } from 'src/app/services/MemberService';
import { PromotionService } from 'src/app/services/PromotionService';
import { BusinessGroupService } from 'src/app/services/BusinessGroupService';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { CustomLoggerService } from 'src/app/services/CustomLoggerService';

export class Tree {
  root: TreeNode;
}

export class TreeNode {
  label: string;
  value: string;
  countString: string;
  check?: boolean;
  children: TreeNode[];
}
@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent {
  @ViewChild('closebutton') closebutton: { nativeElement: { click: () => void; }; };
  @ViewChild('editor') editor: any;
  iseditmode = false;
  isLoading = false;
  submitted = false;
  annImage: any;
  dataSourceAnnouncement: any;
  newItemName: string = '';
  htmlContent = '';
  selectedBusinessName: string = '';
  sendToCustomers: string = '';
  membersData: any = [];
  summaryData = [];
  location: string = "";
  totalDelivered: number = 0;
  businessLocationIDs: string = "";
  seasons: any[] = [{ name: 'Send Immediately', value: 1 }, { name: 'Schedule it for later', value: 2 }];
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    showToolbar: false,
    // defaultFontName: 'Arial',
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
  loading: boolean = false; // Flag variable
  loadingLoading: boolean = false; // Flag variable
  file: File = null; // Variable to store file to Upload
  packageDetails: any = [];
  filtereddata: any = [];
  businessID: string;
  selectednodes: any[] = [];
  senditlater: any;
  displayData: any;
  pagesize: any = 5;
  uploadSub: Subscription;
  uploadProgress: any;
  isLoadingAnnData: boolean = false;
  isfileUploaded = false;
  fileName: any;
  filePath: any;
  url: string = "";
  notificationCount: number = 0;
  emailCount: number = 0;
  smsCount: number = 0;
  descriptionCharacterCount: number = 145;
  isAllChecked: Boolean = false;
  bussinessDataForRedemption: { id: any, businessName: string, checked: boolean, memberCount: number }[] = [];
  bussinessDataForStep3: { id: any, businessName: string, checked: boolean }[] = [];
  badgeDataForStep3: { id: number, badgeName: string, counts: number, checked: boolean }[] = [];
  tagDataForStep3: { id: number, tagName: string, counts: number, checked: boolean, isNegativeFlag: boolean }[] = [];
  isAllBadgeChecked: Boolean = false;
  isAllTagChecked: Boolean = false;
  dashBoardFormControl = new FormGroup({
    businessID: new FormControl(),
  })
  business: any;
  businessGroupID: any;
  urlSafe: SafeResourceUrl;
  subjectCharacterCount: number = 50;
  jobForm = this.fb.group({
    id: [''],
    subject: ['', Validators.required],
    description: ['', Validators.required],
    fileName: ['', Validators.required],
    fileContentType: [''],
    filePath: [''],
    ImageInput: ['', Validators.required],
    isSendImmediately: ['', Validators.required],
    isScheduledLater: [''],
    date: [''],
    time: [null],
    validDate: ['']
  });
  secondFormGroup = this.fb.group({
    membersOf: ['', Validators.required],
    sendToCustomers: ['', Validators.required]
  });
  dropdownSettings: IDropdownSettings = {};
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
  isLoadingSaveData = false;
  negativeFlagTooltip: any = '';
  /**
   * @param uploadService this is upload service for file upload
   * @param fb form builder
   * @param _announcementService annoucement service for get and post announcement
   * @param toastService toast service for toaster 
   * @param _defination defination service for getting tags and badges
   * @param dialog dialog box
   * @param sanitizer 
   */
  minDate = new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) < 10 ? ('0' + (new Date().getMonth() + 1)) :
    (new Date().getMonth() + 1)) + '-' + (new Date().getDate() < 10 ? ('0' + new Date().getDate()) : new Date().getDate());

  constructor(private uploadService: FileUploadService,
    private fb: FormBuilder, private _announcementService: AnnouncementService, private _businessGroupService: BusinessGroupService,
    public toastService: ToastService, private _promotionService: PromotionService,
    public dialog: MatDialog, public sanitizer: DomSanitizer, private _memberservice: MemberService
    , private _customLoggerService: CustomLoggerService) {
    this.business = JSON.parse(localStorage.getItem('Business'));
    this.packageDetails = JSON.parse(localStorage.getItem('PackageDetails'));
    this.businessGroupID = JSON.parse(localStorage.getItem('BusinessGroup'));

    this.business.forEach(element => {
      this.location += element.id + ',';
      this.businessLocationIDs += element.id + ',';
    });

    // if (this.business != '' && this.business != null && this.business != undefined) {
    //   if (this.business.length > 0) {
    //     this.setBusiness();
    //   }
    // }
    this.isfileUploaded = false;
    this.dropdownSettings = {
      idField: 'id',
      textField: 'businessName',
      itemsShowLimit: 1
    }
  }
  ontextchanged(length: number, control: string) {
    if (control == "subject") {
      let l = (this.jobForm.controls['subject'].value).length;
      this.subjectCharacterCount = length - l;
    }
  }
  onBusinessSelected(id: number) {
    if (this.bussinessDataForStep3.filter(x => x.id == id)[0].checked) {
      this.bussinessDataForStep3.filter(x => x.id == id)[0].checked = false;
    }
    else {
      this.bussinessDataForStep3.filter(x => x.id == id)[0].checked = true;
    }

    this.isAllChecked = (this.bussinessDataForStep3.filter(x => x.id != -1).length) ==
      (this.bussinessDataForStep3.filter(x => x.id != -1 && x.checked == true).length) ? true : false;

    this.onMembersOfSelected();
    this.BusinessNameForSummary();
  }
  public close() {
    this.closebutton.nativeElement.click();
  }
  ngOnInit() {
    this.GetAnnouncementsData();
    this.GetMembersData();
    this.GetBusinessGroupByID();
    this.dropdownSettings = {
      idField: 'id',
      textField: 'businessName',
      itemsShowLimit: 1
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
          this._customLoggerService.logError(AppSettings.LoggerAppName ,"Announcement > Method : GetBusinessGroupByID()" , error.message)
        }
      });
  }

  selectAllBusiness() {
    if (this.isAllChecked) {
      this.isAllChecked = false;
      this.bussinessDataForStep3.forEach(x => x.checked = false);

      this.badgeDataForStep3.forEach(ele => {
        ele.counts = this.membersData.filter(x =>
          (x.smsOptin == true || x.notificationOptin == true || x.emailOptin == true) &&
          x.status.toString().toLowerCase() == ele.badgeName.toLowerCase()).length;
      });

      this.tagDataForStep3.forEach(ele => {
        ele.counts = this.membersData.filter(x => x.tagname != null && x.tagname != '' && x.tagname != undefined &&
          (x.notificationOptin == true || x.emailOptin == true) &&
          x.tagname.toString().toLowerCase() == ele.tagName.toLowerCase()).length;
      });
    }
    else {
      this.isAllChecked = true;
      this.bussinessDataForStep3.forEach(x => x.checked = true);

      this.badgeDataForStep3.forEach(ele => {
        ele.counts = Number(ele.counts) + this.membersData.filter(x =>
          x.badgeName != null && x.badgeName != '' && x.badgeName != undefined &&
          (x.notificationOptin == true || x.emailOptin == true) &&
          x.status.toString().toLowerCase() == ele.badgeName.toLowerCase()).length;
      });

      this.tagDataForStep3.forEach(ele => {
        ele.counts = Number(ele.counts) + this.membersData.filter(x =>
          x.tagname != null && x.tagname != '' && x.tagname != undefined &&
          (x.notificationOptin == true || x.emailOptin == true) &&
          x.tagname.toString().toLowerCase() == ele.tagName.toLowerCase()).length;
      });
    }
    this.onMembersOfSelected();
    this.BusinessNameForSummary();
  }
  async BusinessNameForSummary() {
    this.selectedBusinessName = '';
    if (this.isAllChecked) {
      this.selectedBusinessName = 'All Locations';
    }
    else {
      this.bussinessDataForStep3.filter(x => x.id != -1).forEach(element => {
        if (element.checked) {
          this.selectedBusinessName += element.businessName + ', '
        }
      });
    }
    this.secondFormGroup.controls['membersOf'].setValue(this.selectedBusinessName);
  }
  ngAfterViewInit() {

  }
  /**
   * 
   * @param node this node is treenode which can be supply from change event of node 
   * @param value value is bool selected or not 
   */

  check(node: any, value: boolean) {
    node.check = value;
    node.children.forEach((x: any) => {
      this.check(x, value);
    });
  }
  /**
   * f function is used to get form controls in html page
   */
  get f(): { [key: string]: AbstractControl } {
    return this.jobForm.controls;
  }
  /**
   * for add new annocement and clear all fields
   */
  async AddNew() {
    this.iseditmode = true;
    this.submitted = false;
    this.subjectCharacterCount = 50;
    this.uploadProgress = null;
    this.ClearControlandView();
    await this.GetMembersData();
    // await this.setBusiness();
  }
  /**
   * for cancle annocement and clear all fields
   */
  Cancle() {
    this.iseditmode = false;
    this.submitted = false;
    this.subjectCharacterCount = 50;
    this.uploadProgress = null;
    this.ClearControlandView();
  }
  /**
   * onchange method is used for upload a document in the announcment.
   * @param event event is for getting file which is uploaded in the system.
   */
  onChange(event: { target: { files: File[]; }; }) {
    this.file = event.target.files[0];
    this.onUpload();
  }
  async GetMembersData() {
    this.isLoading = true;
    this.membersData = [];
    this.badgeDataForStep3 = [];
    this.tagDataForStep3 = [];
    this.totalDelivered = 0;
    this.notificationCount = 0;
    this.emailCount = 0;
    this.smsCount = 0;

    let date = this.jobForm.controls['date'].value;
    let time = this.jobForm.controls['time'].value;
    var sentDate = (date != "" && time != "") ?
      formatDate(new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate(), time, 0, 0), 'yyyy-MM-dd', 'en-US')
      : formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    let details = {
      "businessGroupId": this.businessGroupID.id,
      "businessLocationIDs": this.businessLocationIDs,
      "badgeIDs": '',
      "tagIDs": '',
      "sendDate": this.jobForm.controls['isSendImmediately'].value == 'true' ? formatDate(new Date(), 'yyyy-MM-dd', 'en-US') : sentDate
    }

    await this._memberservice.GetMembersDataForPromotion(details).then(async (data) => {
      let badgeData = data['table1'];
      let tagData = data['table2'];
      this.membersData = data['table3'];
      let summary = data['table4'];

      badgeData.forEach(element => {
        let x = { "id": element.id, "badgeName": element.name, "counts": element.count.toString(), "checked": false };
        this.badgeDataForStep3.push(x);
      });

      tagData.forEach(element => {
        let x = { "id": element.id, "tagName": element.name, "counts": element.count.toString(), "checked": false, "isNegativeFlag": element.isNegativeFlag };
        this.tagDataForStep3.push(x);
      });

      this.totalDelivered = summary[0].totalDelivered;
      this.notificationCount = summary[0].notificationCount
      this.emailCount = summary[0].emailCount;
      this.smsCount = summary[0].smsCount;

      await this.setBusiness();
      this.isLoading = false;
    }).catch((error) => {
      this.isLoading = false;
      console.log(error)
    });;
  }
  async onMembersOfSelected() {
    this.membersData = [];
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

    let date = this.jobForm.controls['date'].value;
    let time = this.jobForm.controls['time'].value;
    var sentDate = (date != "" && time != "") ?
      formatDate(new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate(), time, 0, 0), 'yyyy-MM-dd', 'en-US')
      : formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    let details = {
      "businessGroupId": this.businessGroupID.id,
      "businessLocationIDs": this.businessLocationIDs,
      "badgeIDs": badgeIDs,
      "tagIDs": tagIDs,
      "sendDate": this.jobForm.controls['isSendImmediately'].value == 'true' ? formatDate(new Date(), 'yyyy-MM-dd', 'en-US') : sentDate
    }

    this._memberservice.GetMembersDataForPromotion(details).then(async (data) => {
      let badgeData = data['table1'];
      let tagData = data['table2'];
      this.membersData = data['table3'];
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

      let business = JSON.parse(localStorage.getItem('Business'));
      this.bussinessDataForStep3 = [];
      business.forEach(element => {
        this.bussinessDataForRedemption.filter(x => x.id == element.id)[0].memberCount =
          this.membersData != null && this.membersData != undefined && this.membersData.length > 0 ?
            (this.membersData.filter(x => x.id == element.id).length > 0 ? this.membersData.filter(x => x.id == element.id)[0].count : 0) : 0
      });
      this.bussinessDataForStep3 = this.bussinessDataForRedemption;
    }).catch((error) => {
      console.log(error)
    });;
  }

  // onUpload of button Upload
  onUpload() {
    this.loadingLoading = true;

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
              this.annImage = AppSettings.Root_ENDPOINT + this.file.name;
              let array = event.partialText.split('|')[1].split('/');
              this.fileName = array[array.length - 1];
              this.jobForm.controls['fileName'].setValue(this.fileName);
              this.jobForm.controls['ImageInput'].setValue(this.fileName);
              this.filePath = AppSettings.Root_ENDPOINT + this.fileName;
            } else {
              this.loadingLoading = false;
              this.isfileUploaded = false;
            }
          }, error: error => {
            this._customLoggerService.logError(AppSettings.LoggerAppName ,"Announcement > Method : onUpload()" , error.message)
            console.log(error);
            alert(error.error);
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
    this.jobForm.controls['fileName'].setValue('');
    this.jobForm.controls['ImageInput'].setValue('');
    this.uploadProgress = "0%";
    this.reset();
  }
  reset() {
    this.file = null;
    this.fileName = null;
    this.filePath = null;
    this.uploadProgress = null;
    this.uploadSub = null;
    this.jobForm.controls['ImageInput'].setValue('');
  }

  Submit(): void {
    this.submitted = true;
    if (this.jobForm.invalid || this.secondFormGroup.invalid) {
      return;
    }
    let announcementDetails = this.GetAnnouncementDetails();
    if (announcementDetails.length <= 0) {
      alert("please select customers.");
      return;
    }
    this.isLoading = true;
    this.isLoadingSaveData = true;
    let date = this.jobForm.controls['date'] != null && this.jobForm.controls['date'] != undefined ? this.jobForm.controls['date'].value : "";
    let time = this.jobForm.controls['time'] != null && this.jobForm.controls['time'] != undefined ? this.jobForm.controls['time'].value : "";
    var deliveryDate = (date != "" && time != "") ?
      new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate(), time, 0, 0) : "";

    let badgeDetails = {
      "uniqueId": AppSettings.NewGUID(),
      "id": 0,
      "subject": this.jobForm.controls['subject'].value,
      "description": this.jobForm.controls['description'].value,
      "fileName": this.fileName != null && this.fileName != undefined ? this.fileName : "",
      "fileContentType": this.file != null && this.file != undefined ? this.file.type : "",
      "filePath": AppSettings.Root_ENDPOINT + this.fileName,
      "isSendImmediately": !this.senditlater,
      "isScheduledLater": this.senditlater,
      "createdDate": AppSettings.GetDate(),
      "isActive": AppSettings.Active,
      "createdBy": AppSettings.GetCreatedBy(),
      "deliveryDate": deliveryDate == "" ? AppSettings.GetDate() : deliveryDate,
      "lastModifiedBy": AppSettings.GetLastModifiedBy(),
      "lastModifiedDate": AppSettings.GetDate(),
      "businessGroupId": this.businessGroupID.id,
      "validDate": this.jobForm.controls['validDate'].value,
      "announcementDetails": announcementDetails,
      "locationwiseAnnoucementRedemption": this.GetRedemptionDetails(),
      "RedemptionAtID": -1
    }
    console.log(badgeDetails);
    this._announcementService.PostAnnouncements(badgeDetails)
      .subscribe({
        next: (data) => {
          this.ClearControlandView();
          this.isLoading = false;
          this.isLoadingSaveData = false;
          this.iseditmode = false;
        },
        error: error => {
          this._customLoggerService.logError(AppSettings.LoggerAppName ,"Announcement > Method : Submit()" , error.message)
          this.ClearControlandView();
          this.isLoading = false;
          this.isLoadingSaveData = false;
          this.iseditmode = false;
        }
      });
  }
  Preview(): void {
    let announcementDetails = this.GetAnnouncementDetails();
    let date = this.jobForm.controls['date'] != null && this.jobForm.controls['date'] != undefined ? this.jobForm.controls['date'].value : "";
    let time = this.jobForm.controls['time'] != null && this.jobForm.controls['time'] != undefined ? this.jobForm.controls['time'].value : "";
    var deliveryDate = (date != "" && time != "") ?
      new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate(), time, 0, 0) : "";
    this.url = "";
    this.urlSafe = "";
    let badgeDetails = {
      "uniqueId": AppSettings.NewGUID(),
      "id": 0,
      "subject": this.jobForm.controls['subject'].value,
      "description": this.jobForm.controls['description'].value,
      "fileName": this.file != undefined ? this.file.name : "",
      "fileContentType": this.file != undefined ? this.file.type : "",
      "filePath": "",
      "isSendImmediately": !this.senditlater,
      "isScheduledLater": this.senditlater,
      "createdDate": AppSettings.GetDate(),
      "isActive": AppSettings.Active,
      "createdBy": AppSettings.GetCreatedBy(),
      "deliveryDate": deliveryDate,
      "lastModifiedBy": AppSettings.GetLastModifiedBy(),
      "lastModifiedDate": AppSettings.GetDate(),
      "businessGroupId": this.businessGroupID.id,
      "announcementDetails": announcementDetails,
      "locationwiseAnnoucementRedemption": this.GetRedemptionDetails()
    }
    this._announcementService.PreviewAnnouncmentMail(badgeDetails)
      .subscribe({
        next: (data) => {
          this.url = AppSettings.Root_ENDPOINT + data.filepath;
          this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        },
        error: error => {
          this._customLoggerService.logError(AppSettings.LoggerAppName ,"Announcement > Method : Preview()" , error.message)
          console.log(error);
        }
      });
  }
  GetRedemptionDetails() {
    let details = [];
    this.bussinessDataForRedemption.forEach(element => {
      if (element.id != -1) {
        let tempDetails = {
          "uniqueID": AppSettings.NewGUID(),
          "id": 0,
          "annoucementID": 0,
          "businessLocationID": element.id,
          "isSent": this.bussinessDataForStep3.filter(x => x.id == element.id)[0].checked,
          "redeemableAt": -1,
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
  ClearControlandView() {
    this.jobForm = this.fb.group({
      id: [''],
      subject: ['', Validators.required],
      description: ['', Validators.required],
      fileName: ['', Validators.required],
      fileContentType: [''],
      filePath: [''],
      ImageInput: ['', Validators.required],
      isSendImmediately: ['', Validators.required],
      isScheduledLater: [''],
      date: [''],
      time: [''],
      validDate: ['']
    });
    this.secondFormGroup = this.fb.group({
      membersOf: ['', Validators.required],
      sendToCustomers: ['', Validators.required]
    });
    this.file = null;
    this.fileName = null;
    this.isfileUploaded = true;
    this.filePath = null;
    this.uploadProgress = null;
    this.submitted = false;
    this.badgeDataForStep3 = [];
    this.tagDataForStep3 = [];
    this.bussinessDataForStep3 = [];
    this.bussinessDataForRedemption = [];
    this.selectedBusinessName = '';
    this.sendToCustomers = '';
    this.summaryData = [];
    this.isAllChecked = false;
    this.isAllBadgeChecked = false;
    this.isAllTagChecked = false;
    this.GetAnnouncementsData();
    this.time.forEach(element => {
      element.disabled = false;
    });
    this.senditlater = undefined;
  }
  async ClearForEdit() {
    this.jobForm = this.fb.group({
      id: [''],
      subject: ['', Validators.required],
      description: ['', Validators.required],
      fileName: ['', Validators.required],
      fileContentType: [''],
      filePath: [''],
      ImageInput: ['', Validators.required],
      isSendImmediately: ['', Validators.required],
      isScheduledLater: [''],
      date: [''],
      time: [''],
      validDate: ['']
    });
    this.secondFormGroup = this.fb.group({
      membersOf: ['', Validators.required],
      sendToCustomers: ['', Validators.required]
    });
    this.file = null;
    this.fileName = "";
    this.filePath = "";
    this.isfileUploaded = true;
    this.uploadProgress = '0%';
    this.submitted = false;
    this.selectedBusinessName = '';
    this.sendToCustomers = '';
    this.badgeDataForStep3 = [];
    this.tagDataForStep3 = [];
    this.bussinessDataForStep3 = [];
    this.bussinessDataForRedemption = [];
    this.time.forEach(element => {
      element.disabled = false;
    });
    this.senditlater = undefined;
  }
  async showMore() {
    this.isLoadingAnnData = true;
    let newLength = this.displayData.length + parseInt(this.pagesize);
    await this.common();
    this.displayData = this.displayData.sort((a, b) => b.id - a.id).slice(0, newLength);
    this.isLoadingAnnData = false;
  }
  handleChange(evt: string) {
    this.senditlater = !evt;
    this.jobForm.controls['isSendImmediately'].setValue(evt);
  }
  GetAnnouncementsData() {
    this.isLoadingAnnData = true;
    this._announcementService.GetAnnouncementsByBusinessID(this.businessGroupID.id, this.location).pipe()
      .subscribe({
        next: (data) => {
          this.dataSourceAnnouncement = JSON.parse(JSON.stringify(data));
          this.displayData = this.dataSourceAnnouncement.sort((a, b) => b.id - a.id).slice(0, this.pagesize);
          this.isLoadingAnnData = false;
        },
        error: error => {
          this._customLoggerService.logError(AppSettings.LoggerAppName ,"Announcement > Method : GetAnnouncementsData()" , error.message)
          this.isLoadingAnnData = false;
        }
      });
  }
  GetAnnouncementDetails() {
    let details = [];
    for (let outer of this.badgeDataForStep3) {
      if (outer.checked) {
        let tempdefDetails = {
          "uniqueId": AppSettings.NewGUID(),
          "id": 0,
          "announcementId": 0,
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
          "uniqueId": AppSettings.NewGUID(),
          "id": 0,
          "announcementId": 0,
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

  async EditReplicate(id: any) {
    this.isLoadingAnnData = true;
    await this.ClearForEdit();
    await this.GetMembersData();
    this._announcementService.GetAnnouncementByID(id).pipe()
      .subscribe({
        next: async (data) => {
          this.jobForm = this.fb.group({
            id: [''],
            subject: [data.subject, Validators.required],
            description: [data.description, Validators.required],
            fileName: [data.fileName],
            fileContentType: [data.fileContentType],
            filePath: [AppSettings.Root_ENDPOINT + data.fileName],
            ImageInput: [data.fileName, Validators.required],
            isSendImmediately: ['', Validators.required],
            isScheduledLater: [''],
            date: [''],
            time: [''],
            validDate: ['']
          });
          this.subjectCharacterCount = 50 - this.jobForm.controls['subject'].value.length;

          data.locationwiseAnnoucementRedemption.filter(x => x.isSent == true).forEach(element => {
            this.bussinessDataForStep3.filter(d => d.id == element.businessLocationId)[0].checked = true;
          });
          this.isAllChecked = (this.bussinessDataForStep3.filter(x => x.id != -1).length) ==
            (this.bussinessDataForStep3.filter(x => x.id != -1 && x.checked == true).length) ? true : false;

          data.announcementDetails.filter(x => x.badgeId != 0).forEach(element => {
            this.badgeDataForStep3.filter(b => b.id == element.badgeId)[0].checked = true;
          });
          this.isAllBadgeChecked = this.badgeDataForStep3.filter(x => x.checked == false).length > 0 ? false : true;

          data.announcementDetails.filter(x => x.tagId != 0).forEach(element => {
            this.tagDataForStep3.filter(t => t.id == element.tagId)[0].checked = true;
          });
          this.isAllTagChecked = this.tagDataForStep3.filter(x => x.checked == false).length > 0 ? false : true;

          this.secondFormGroup = this.fb.group({
            membersOf: ['', Validators.required],
            sendToCustomers: ['', Validators.required]
          });

          await this.onMembersOfSelected();
          await this.BusinessNameForSummary();
          await this.BadgeTagForSummary();

          if (data.fileName != null && data.fileName != '') {
            this.fileName = data.fileName;
            this.isfileUploaded = false;
            this.uploadProgress = '100%';
            this.filePath = AppSettings.Root_ENDPOINT + data.fileName;
          }
          else {
            this.uploadProgress = null;
          }

          this.iseditmode = true;
          this.isLoadingAnnData = false;
        },
        error: error => {
          this._customLoggerService.logError(AppSettings.LoggerAppName ,"Announcement > Method : EditReplicate()" , error.message)
          this.isLoadingAnnData = false;
        }
      });
  }

  scheduleTimeChanged() {
    let val: any = this.jobForm.controls['time'].value;
    if (val != 0) {
      this.scheduleLaterTime = this.time.filter(x => x.value == val)[0].name;
    }
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

  async BadgeTagForSummary() {
    this.sendToCustomers = '';
    if (this.isAllBadgeChecked) {
      this.sendToCustomers = 'All Badges';
    }
    else {
      this.badgeDataForStep3.forEach(element => {
        if (element.checked) {
          this.sendToCustomers += (this.sendToCustomers == '' ? element.badgeName : (', ' + element.badgeName));
        }
      });
    }

    if (this.isAllTagChecked) {
      this.sendToCustomers += (this.sendToCustomers == '' ? 'All Tags' : ', All Tags');
    }
    else {
      this.tagDataForStep3.forEach(element => {
        if (element.checked) {
          this.sendToCustomers += (this.sendToCustomers == '' ? element.tagName : (', ' + element.tagName));
        }
      });
    }
    this.secondFormGroup.controls['sendToCustomers'].setValue(this.sendToCustomers);
  }

  async setBusiness() {
    let data = JSON.parse(localStorage.getItem('Business'));
    this.bussinessDataForStep3 = [];
    this.bussinessDataForRedemption = [];
    this.location = "";
    this.bussinessDataForRedemption.push({
      id: -1,
      businessName: "Any Location",
      checked: false,
      memberCount: 0
    });

    data.forEach(element => {
      this.location += element.id + ',';
      this.bussinessDataForRedemption.push({
        id: element.id,
        businessName: element.businessName,
        checked: false,
        memberCount: this.membersData != null && this.membersData != undefined && this.membersData.length > 0 ?
          (this.membersData.filter(x => x.id == element.id).length > 0 ? this.membersData.filter(x => x.id == element.id)[0].count : 0) : 0
      })
    });
    this.bussinessDataForStep3 = this.bussinessDataForRedemption;
  }

  //#region BusinessDropdown
  async onItemSelectAll(items) {
    this.dashBoardFormControl.controls['businessID'].setValue(items);
    this.location = "";
    items.forEach(element => {
      this.location += element.id + ',';
    });
    this.GetAnnouncementsData();
  }

  async onDeSelectAll(items) {
    this.dashBoardFormControl.controls['businessID'].setValue(items);
    this.location = "";
    items.forEach(element => {
      this.location += element.id + ',';
    });
    this.GetAnnouncementsData();
  }
  //#endregion

  async common() {
    let businesslocationID = this.dashBoardFormControl.controls['businessID'].value;
    this.location = "";
    if (businesslocationID.length > 0 && businesslocationID != null) {
      businesslocationID.forEach(element => {
        this.location += element.id + ',';
      });
    } else {
      this.business = JSON.parse(localStorage.getItem('Business'));
      this.business.forEach(element => {
        this.location += element.id + ',';
      });
    }

    this.GetAnnouncementsData();
  }

  onScheduleDateChanged() {
    let currentHour = new Date().getHours();
    let selectedDate = this.jobForm.controls['date'].value;

    this.jobForm.controls['time'].setValue('');

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
}
