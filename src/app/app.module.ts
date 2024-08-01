import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { DialogDataExampleDialog, NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavLogoComponent } from './theme/layout/admin/nav-bar/nav-logo/nav-logo.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { SharedModule } from './theme/shared/shared.module';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './services/LoginService';
import { DashboardService } from './services/DashboardService';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { AutopilotComponent } from './demo/pages/autopilot/autopilot.component';
import { AnnouncementComponent } from './demo/pages/announcement/announcement.component';
import { AppLinksComponent } from './demo/pages/applinks/applinks.component';
import { ProfilesettingComponent } from './demo/pages/profilesetting/profilesetting.component';
import { CampaignreachComponent } from './demo/pages/campaignreach/campaignreach.component';
import { RewardService } from './services/RewardService';
import { AutopilotConfigService } from './services/AutopilotConfigService';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ToastService } from './services/ToastService';
import { DefinationService } from './services/DefinationService';
import { ToastsContainer } from './demo/pages/toastcontainer.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CommonService } from './services/CommonService';
import { ActivityHistoryService } from './services/ActivityHistoryService';
import { TagDefinitionComponent } from './demo/pages/tag-definition/tagdefinition.component';
import { TagDefinationService } from './services/TagDefinitionService';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatRadioModule } from '@angular/material/radio';
import { FileUploadService } from './services/fileuploadservie';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PhonePipeModule } from './phone.pipe.module';
import { SpinWheelService } from './services/SpinWheelConfigurationService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ActivityTypeService } from './services/ActivityTypeService';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatTableModule } from '@angular/material/table';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PromotionFilterpipeModule } from './PromotionFilter.pipe.module';
import { UtcConverterService } from '../app/services/UtcConverterService';
import { UtcToLocalTimePipeModule } from './utctolocaltime.pipe.module';
import { BillingComponent } from './demo/pages/billing/billing.component';
import { BillingService } from '../app/services/billingService';
import { BusinessGroupComponent } from './demo/pages/BusinessGroup/BusinessGroup.component';
import { UserProfileComponent } from './demo/pages/UserProfile/UserProfile.component';
import { BusinessGroupService } from './services/BusinessGroupService';
import { SourceService } from './services/SourceService';
import { UserService } from './services/UserService';
import { SourcesComponent } from './demo/pages/Sources/Sources.component';
import { AdminPanelComponent } from './demo/pages/admin-panel/admin-panel.component';
import { BusinessProfileComponent } from './demo/pages/BusinessProfile/BusinessProfile.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { LicenseApplicantService } from './services/LicenseApplicantService';
import { CustomLoggerService } from './services/CustomLoggerService';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    NavBarComponent,
    NavLeftComponent,
    NavRightComponent,
    NavigationComponent,
    NavLogoComponent,
    NavContentComponent,
    NavGroupComponent,
    NavItemComponent,
    NavCollapseComponent,
    ConfigurationComponent,
    GuestComponent,
    AutopilotComponent,
    AnnouncementComponent,
    CampaignreachComponent,
    ProfilesettingComponent,
    CampaignreachComponent,
    DialogDataExampleDialog,
    TagDefinitionComponent,
    BillingComponent,
    BusinessGroupComponent,
    UserProfileComponent,
    SourcesComponent,
    AdminPanelComponent,
    BusinessProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    ToastsContainer,
    MatRadioModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatInputModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatListModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatListModule,
    MatTabsModule,
    UtcToLocalTimePipeModule,
    NgSelectModule,
    NgxDaterangepickerMd.forRoot(),
    NgCircleProgressModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot({
      theme: {
        extendsFromRoot: true,
        height: '30px'
      }
    }),
    MatIconModule,
    MatCheckboxModule,
    MatTreeModule,
    PhonePipeModule,
    AngularEditorModule,
    PromotionFilterpipeModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    GoogleMapsModule
  ],
  exports: [
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    NgCircleProgressModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatListModule,
    MatTabsModule,
    NgMultiSelectDropDownModule,
    NgxSkeletonLoaderModule,
    UtcToLocalTimePipeModule,
    RouterModule
  ],
  providers: [
    NavigationItem,
    RewardService,
    DefinationService,
    ToastService,
    LoginService,
    ToastrService,
    DashboardService,
    AutopilotConfigService,
    DialogDataExampleDialog,
    CommonService,
    ActivityHistoryService,
    TagDefinationService,
    FileUploadService,
    SpinWheelService,
    ActivityTypeService,
    UtcConverterService,
    BillingService,
    BusinessGroupService,
    SourceService,
    UserService,
    LicenseApplicantService,
    CustomLoggerService,
    { provide: LOCALE_ID, useValue: 'en-US' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
