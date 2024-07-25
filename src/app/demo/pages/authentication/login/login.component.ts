import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from 'src/app/services/LoginService';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from 'src/app/services/ToastService';
import { ToastsContainer } from '../../toastcontainer.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { ProfileSettingService } from 'src/app/services/ProfileSettingService';
import { AdminComponent } from 'src/app/theme/layout/admin/admin.component';
import { UserService } from 'src/app/services/UserService';
import { CustomLoggerService } from 'src/app/services/CustomLoggerService';
import { AppSettings } from 'src/app/services/Constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatSnackBarModule, ToastsContainer, NgbTooltipModule,
    ReactiveFormsModule],
  providers: [ToastService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  button = 'Login';
  isLoading = false;
  UserName: any;
  Password: any;
  loading = false;
  show = false;
  bussinessData: any;
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });
  submitted = false;
  sentResetMail: boolean = false;
  sentResetMailDisable: boolean = false;

  constructor(private _loginservice: LoginService, public toastService: ToastService,
    private _Route: Router, private _snackBar: MatSnackBar,
    private _userservice: UserService, private formBuilder: FormBuilder,
    private _profileService: ProfileSettingService, private _customLoggerService: CustomLoggerService) {
    this.form = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required
          ]
        ],
        password: [
          '',
          [
            Validators.required
          ]
        ]
      }
    );
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  showSnackbarAction(message: string, action: string) {

    if (action == "1") {
      this.toastService.showSuccess(message);
    } else if (action == "2") {
      this.toastService.showDanger(message);
    } else if (action == "3") {
      this.toastService.show(message);
    }
  }
  onclicktoggle() {
    this.show = !this.show;
  }
  async SetBusinessGroup(userId) {
    this._profileService.GetBusinessGroupesByUserID(userId)
      .subscribe({
        next: async (data) => {
          this.bussinessData = data;
          localStorage.setItem('BusinessGroup', JSON.stringify(this.bussinessData[0]));
          this._Route.navigate(['dashboard']);
        },
        error: error => {
          this._customLoggerService.logError(AppSettings.LoggerAppName ,"Login > Method : SetBusinessGroup()" , error.message);
        }
      });
  }

  forgotPassword() {
    if (!this.sentResetMailDisable) {
      this.isLoading = true;
      this.button = 'Processing';
      this.sentResetMailDisable = true;
      if (this.form.controls['username'].value != '' && this.form.controls['username'].value != null && this.form.controls['username'].value != undefined) {
        this._userservice.PutUserForgotPasswordSendMail(this.form.controls['username'].value).pipe()
          .subscribe({
            next: async (data) => {
              this.sentResetMail = true;
              this.button = 'Login';
              this.isLoading = false;
              // this.showSnackbarAction("Reset link will be sent to your Email!", "1");
            },
            error: error => {
              if (error.status == 404) {
                this.sentResetMail = false;
                this.sentResetMailDisable = false;
                this.button = 'Login';
                this.isLoading = false;
                this.showSnackbarAction("User doesn't exist!", "3");
              }
              this._customLoggerService.logError(AppSettings.LoggerAppName ,"Login > Method : forgotPassword()" , error.message);
            }
          });
      } else {
        this.isLoading = false;
        this.button = 'Login';
        this.showSnackbarAction("Enter Valid Username", "3");
      }
    }
  }

  async DoLogin() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.button = 'Processing';
    this.UserName = this.form.controls['username'].value;
    this.Password = this.form.controls['password'].value;

    let details = {
      "userName": this.UserName,
      "password": this.Password
    }

    this._loginservice.login(details).subscribe({
      next: async (data) => {
        localStorage.setItem('PackageDetails', JSON.stringify(data.package));
        localStorage.setItem('IsSpinRequired', JSON.stringify(data.business[0].isSpinRequired));
        localStorage.setItem('UserData', JSON.stringify(data));
        this.showSnackbarAction("Login successfully", "1");
        this.loading = false;
        this.isLoading = false;
        localStorage.setItem('UserID', JSON.stringify(data.userId));
        this.button = 'Login';
        await this.SetBusinessGroup(data.userId);

      },
      error: error => {
        this._customLoggerService.logError(AppSettings.LoggerAppName ,"Login > Method : DoLogin()" , error.message);
        this.showSnackbarAction("Invalid UserName Password", "3");
        this.isLoading = false;
        this.button = 'Login';
      }
    });
  }
}
