import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SpinWheelService } from 'src/app/services/SpinWheelConfigurationService';
import { AppSettings } from '../../../services/Constants';
import { ToastService } from 'src/app/services/ToastService';
import { CustomLoggerService } from 'src/app/services/CustomLoggerService';

@Component({
  selector: 'app-spinwheelSetting',
  templateUrl: './spinwheelSetting.component.html',
  styleUrls: ['./spinwheelSetting.component.scss']
})
export class SpinwheelSettingComponent {
  isLoading = false;
  isReset = false;
  spinWheelControls: any;
  submitted = false;
  businessGroupID: any;
  headerId: any;
  isSpinEnable: any;
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
      IsInteger: [false]
    }),
    2: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.required],
      IsInteger: [false]
    }),
    3: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.required],
      IsInteger: [false]
    }),
    4: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.required],
      IsInteger: [false]
    }),
    5: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.required],
      IsInteger: [false]
    }),
    6: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.required],
      IsInteger: [false]
    }),
    7: this._formBuilder.group({
      indexID: [0],
      text: ['', Validators.required],
      Probability: ['', Validators.required],
      IsInteger: [false]
    })
  });
  firstFormGroup = this._formBuilder.group({
    spinRequired: [false]
  });
  _defaultOpts: {
    indexID: number;
    arctext: string;
    colorCode: string;
    probability: number;
    IsPoints: boolean;
    headerId: number;
    isSpinEnable: boolean;
  }[] = [];
  totalPoints: number = 0;
  indexwiseCharacters: { index: number; length: number }[] = [];

  constructor(private _formBuilder: FormBuilder, private _spinwheel: SpinWheelService, public toastService: ToastService,
    private _customLoggerService: CustomLoggerService) {
    this.businessGroupID = JSON.parse(localStorage.getItem('BusinessGroup'));
  }

  ngOnInit() {
    this.GetSpinWheeldefaultConfigByBusinessGroupID();
  }

  async GetSpinWheeldefaultConfigByBusinessGroupID() {
    this._spinwheel
      .GetSpinWheeldefaultConfigByBusinessGroupID(this.businessGroupID.id)
      .pipe()
      .subscribe({
        next: (data) => {
          localStorage.removeItem('OPTS');
          this._defaultOpts = [];
          data.forEach((element) => {
            this._defaultOpts.push({
              indexID: element.indexID,
              arctext: element.arctext,
              colorCode: element.colorCode,
              probability: element.probability,
              IsPoints: element.isInteger,
              headerId: element.headerId,
              isSpinEnable: element.isSpinEnable
            });
          });
          localStorage.setItem('OPTS', JSON.stringify(this._defaultOpts));
          this.setSpinWheelData();
        },
        error: (error) => {
          this._customLoggerService.logError(AppSettings.LoggerAppName, "Spinwheel Settings > Method : GetSpinWheeldefaultConfigByBusinessGroupID()", error.message);
          console.log(error);
        }
      });
  }

  async setSpinWheelData() {
    this.totalPoints = 0;
    let spinWheelData = JSON.parse(localStorage.getItem('OPTS'));
    this.headerId = spinWheelData[0].headerId;
    this.isSpinEnable = spinWheelData[0].isSpinEnable;
    this.firstFormGroup.controls['spinRequired'].setValue(this.isSpinEnable);
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
      });
    }
    this.isReset = false;
  }

  resetSpinWheelData() {
    this.isReset = true;
    this.GetSpinWheeldefaultConfigByBusinessGroupID();
  }

  GetSpinWheelDetails() {
    let details = [];
    this.spinWheelControls = Object.keys(this.spinFormGroup.controls);
    for (let index = 0; index < this.spinWheelControls.length; index++) {
      let tempdefDetails = {
        uniqueId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        id: 0,
        indexId: this.spinFormGroup.controls[index].controls['indexID'].value,
        headerId: this.headerId,
        colorCode: '',
        arctext: this.spinFormGroup.controls[index].controls['text'].value,
        probability: this.spinFormGroup.controls[index].controls['Probability'].value,
        stateId: 3,
        isActive: AppSettings.Active,
        createdBy: AppSettings.GetCreatedBy(),
        createdDate: AppSettings.GetDate(),
        lastModifiedBy: AppSettings.GetLastModifiedBy(),
        lastModifiedDate: AppSettings.GetDate(),
        isInteger: this.spinFormGroup.controls[index].controls['IsInteger'].value
      };
      details.push(tempdefDetails);
    }
    return details;
  }

  onEventLog(controlName: any, data: any, index: any): void {
    if (controlName == 'arcText') {
      this.indexwiseCharacters[index].length = 15 - data.srcElement.value.length;
    }
    if (controlName == 'IsPoints') {
      let text: any = this.spinFormGroup.controls[index].controls['text'].value;
      let IsPoints: any = this.spinFormGroup.controls[index].controls['IsInteger'].value;

      if (isNaN(Number(text))) {
        this.spinFormGroup.controls[index].controls['text'].setValue('');
        this.indexwiseCharacters[index].length = 15;
      }
    }
    if (controlName == 'probability') {
      this.totalPoints = 0;
      this.spinWheelControls = Object.keys(this.spinFormGroup.controls);
      for (let index = 0; index < this.spinWheelControls.length; index++) {
        this.totalPoints += parseInt(this.spinFormGroup.controls[index].controls['Probability'].value);
      }
      this.spinFormGroup.controls['0'].controls['totalPoints'].setValue(this.totalPoints);
    }
  }
  numberOnly(controlName: any, event: any, index: any): boolean {
    if (controlName == 'arcText') {
      let IsPoints: any = this.spinFormGroup.controls[index].controls['IsInteger'].value;
      if (IsPoints) {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
      }
    }
    if (controlName == 'probability') {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
  }

  Save() {
    this.submitted = true;
    if (this.firstFormGroup.invalid || this.spinFormGroup.invalid) {
      return;
    }
    this.isLoading = true;
    let obj = {
      uniqueId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      id: 0,
      isActive: AppSettings.Active,
      createdBy: AppSettings.GetCreatedBy(),
      createdDate: AppSettings.GetDate(),
      lastModifiedBy: AppSettings.GetLastModifiedBy(),
      lastModifiedDate: AppSettings.GetDate(),
      businessGroupId: this.businessGroupID.id,
      configName: 'Config 1',
      spinWheelDefaultConfigurationDetails: this.GetSpinWheelDetails()
    };

    let isSpin = this.firstFormGroup.controls['spinRequired'].value;

    this._spinwheel.PutSpinWheeldefaultConfigurationDetails(this.headerId, isSpin, obj).subscribe({
      next: (data) => {
        this.isLoading = false;
        localStorage.removeItem('OPTS');
        this.toastService.showSuccess('Changed Successfully!');
        this.GetSpinWheeldefaultConfigByBusinessGroupID();
      },
      error: (error) => {
        this._customLoggerService.logError(AppSettings.LoggerAppName, "Spinwheel Settings > Method : Save()", error.message);
        this.isLoading = false;
      }
    });
  }
}
