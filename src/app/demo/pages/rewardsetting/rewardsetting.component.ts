import { Component, ViewChild } from '@angular/core';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { RewardService } from 'src/app/services/RewardService';
import { ToastService } from 'src/app/services/ToastService';
import { AppSettings } from 'src/app/services/Constants';
import { CustomLoggerService } from 'src/app/services/CustomLoggerService';

export interface PeriodicElement {
  rewardname: string;
  points: number;
  hours: string;
}
const COLUMNS_SCHEMA = [
  {
    key: "rewardName",
    type: "text",
    label: "Reward"
  },
  {
    key: "points",
    type: "text",
    label: "Pt Cost"
  }
]
const USER_DATA = [
  { "rewardName": "$5 Free Play - Redeem 10 points", "points": "10" },
  { "rewardName": "$10 Free Play - Redeem 18 points", "points": "18" },
  { "rewardName": "$15 Free Play - Redeem 25 points", "points": "28" },
];
@Component({
  selector: 'app-rewardsetting',
  templateUrl: './rewardsetting.component.html',
  styleUrls: ['./rewardsetting.component.scss']
})
export class RewardsettingComponent {
  fieldArray: Array<any> = [];
  newAttribute: any = {};
  isLoading = false;
  businessGroupID: any;
  firstField = true;
  firstFieldName = 'First Item name';
  buttonname = "Edit/Add";
  isEditItems: boolean;
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  dataSource: any;
  columnsSchema: any = COLUMNS_SCHEMA;
  iseditmode = false;
  reclaimHours: string;
  claimPoints: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  filteredDataSource: any;
  subjectCharacterCount: any = [];
  isVisible = true;

  @ViewChild(MatTable, { static: false }) table: MatTable<any>  // Initialize

  constructor(private _memberservice: RewardService, public toastService: ToastService, private _customLoggerService: CustomLoggerService) {

  }
  showSnackbarAction(message: string, action: string) {
    if (action == "1") {
      this.toastService.showSuccess(message);
    } else if (action == "2") {
      this.toastService.showDanger(message);
    }
  }
  GetRewardDetails() {
    let details = [];
    let i = 0;
    for (let detail of this.dataSource) {
      detail.reclaimHours = this.reclaimHours;
      detail.claimPoints = this.claimPoints;
      this.subjectCharacterCount[i] = detail.rewardName.length;
      if (detail.rewardName != 'undefined' && detail.rewardName != "" && detail.points != 0) {
        let tempdefDetails = {
          "uniqueId": detail.uniqueId,
          "id": detail.type == 1 ? 0 : detail.id,
          "rewardName": detail.rewardName,
          "points": detail.points,
          "businessGroupId": detail.businessGroupId,
          "reclaimHours": detail.reclaimHours,
          "ClaimPoints": detail.claimPoints,
          "type": detail.type,
          "stateId": AppSettings.Approved,
          "isActive": true,
          "createdBy": detail.createdBy,
          "createdDate": detail.createdDate,
          "lastModifiedBy": AppSettings.GetLastModifiedBy(),
          "lastModifiedDate": AppSettings.GetDate()
        }
        details.push(tempdefDetails);
      }
      i = i + 1;
    }
    return details;
  }
  getRandomId() {
    return Math.floor((Math.random() * 6) + 15);
  }

  addDetailsFormGroup() {
    const newUsersArray = this.dataSource;

    let tempdefDetails = {
      "uniqueId": AppSettings.NewGUID(),
      "id": this.getRandomId(),
      "rewardName": "",
      "points": 0,
      "businessGroupId": this.businessGroupID.id,
      "reclaimHours": 0,
      "claimPoints": 0,
      "type": 1,
      "stateId": AppSettings.Approved,
      "isActive": true,
      "createdBy": AppSettings.GetCreatedBy(),
      "createdDate": AppSettings.GetDate(),
      "lastModifiedBy": AppSettings.GetLastModifiedBy(),
      "lastModifiedDate": AppSettings.GetDate()
    }
    newUsersArray.push(tempdefDetails);
    this.dataSource = newUsersArray;
    this.filteredDataSource = this.dataSource.filter(x => x.type != 3);
    this.table.renderRows();
    this.isVisible = true;
  }
  DelDetailsFormGroup(id) {
    console.log(id)

    const index = this.dataSource.findIndex(image => image.id === id);

    console.log(index)
    console.log(this.dataSource)

    if (index !== -1) {
      this.dataSource[index].type = 3;
      this.filteredDataSource = this.dataSource.filter(x => x.type != 3);
      this.table.renderRows();
    }
    this.isVisible = this.dataSource.filter(x => x.type != 3).length == 1 ? false : true;
  }
  Edit() {
    if (this.iseditmode) {
      this.iseditmode = false;
      this.buttonname = "Edit/Add ";
      let rewardDetails = [];
      rewardDetails = this.GetRewardDetails();
      this._memberservice.PostandPutRewardConfig(rewardDetails).pipe()
        .subscribe({
          next: (data) => {
            this.GetRewardsData(false);
            this.isLoading = false;
          },
          error: error => {
            this._customLoggerService.logError(AppSettings.LoggerAppName ,"Reward Settings > Method : Edit()" , error.message);
            this.isLoading = false;
          }
        });
    } else {
      this.iseditmode = true;
      this.buttonname = "Update";
    }
  }
  ngOnInit() {
    this.businessGroupID = JSON.parse(localStorage.getItem('BusinessGroup'));
    this.GetRewardsData(true);
  }
  GetRewardsData(IsWithToast) {
    this.isLoading = true;
    this._memberservice.GetRewardConfigByBusinessGroupId(this.businessGroupID.id).pipe()
      .subscribe({
        next: (data) => {
          let newUsersArray: any = [];
          data.forEach(element => {
            let tempdefDetails = {
              "businessGroupId": element.businessGroupId,
              "claimPoints": element.claimPoints,
              "createdBy": element.createdBy,
              "createdDate": element.createdDate,
              "id": element.id,
              "isActive": element.isActive,
              "lastModifiedBy": element.lastModifiedBy,
              "lastModifiedDate": element.lastModifiedDate,
              "points": element.points,
              "reclaimHours": element.reclaimHours,
              "rewardName": element.rewardName,
              "stateId": element.stateId,
              "uniqueId": element.uniqueId,
              "type": 2
            }
            newUsersArray.push(tempdefDetails);
          });
          this.dataSource = newUsersArray;
          this.filteredDataSource = newUsersArray;

          if (data != undefined && data.length != 0) {
            this.reclaimHours = data[0].reclaimHours;
            this.claimPoints = data[0].claimPoints;
          }
          this.isLoading = false;
        },
        error: error => {
          this._customLoggerService.logError(AppSettings.LoggerAppName ,"Reward Settings > Method : GetRewardsData()" , error.message);
          this.isLoading = false;
        }
      });
  }
}
