import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import LoginComponent from './demo/pages/authentication/login/login.component';
import { AutopilotsettingComponent } from './demo/pages/autopilotsetting/autopilotsetting.component';
import { MemberProfileComponent } from './demo/pages/member-profile/member-profile.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { ClaimRevordsComponent } from './demo/pages/claim-revords/claim-revords.component';
import ResetPasswordComponent from './demo/pages/authentication/resetPassword/resetPassword.component';
import { AppLinksComponent } from './demo/pages/applinks/applinks.component';
import { UnSubscribeEmailComponent } from './demo/pages/unsubscribeEmail/unsubscribeEmail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'applinks',
    redirectTo: 'applinks',
    pathMatch: 'full'
  },
  {
    path: 'ClaimRevords',
    redirectTo: 'ClaimRevords',
    pathMatch: 'full'
  },
  {
    path: 'unsubscribeemail',
    redirectTo: 'unsubscribeemail',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./demo/pages/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'member',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () => import('./demo/pages/member-profile/member-profile.module').then((m) => m.MemberProfiledModule)
      },
      {
        path: 'badgeDefinition',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () =>
          import('./demo/pages/definationsetting/definationsetting.module').then((m) => m.DefinationsettingModule)
      },
      {
        path: 'tagDefinition',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () =>
          import('./demo/pages/tag-definition/tagdefinition.module').then((m) => m.TagdefinitionModule)
      },
      {
        path: 'spinwheelSetting',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () =>
          import('./demo/pages/spinwheelSetting/spinwheelSetting.module').then((m) => m.SpinwheelSettingModule)
      },
      {
        path: 'activity',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () =>
          import('./demo/pages/activitydashboard/activitydashboard.module').then((m) => m.ActivitydashboardModule)
      },
      {
        path: 'autopilotsettings',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () =>
          import('./demo/pages/autopilotsetting/autopilotsetting.module').then((m) => m.AutopilotsettingModule)
      },
      {
        path: 'rewardsettings',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () =>
          import('./demo/pages/rewardsetting/rewardsetting.module').then((m) => m.RewardsettingModule)
      },
      {
        path: 'profile',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () =>
          import('./demo/pages/profilesetting/profilesetting.module').then((m) => m.ProfilesettingModule)
      },
      {
        path: 'autopilot',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () =>
          import('./demo/pages/autopilot/autopilot.module').then((m) => m.AutopilotModule)
      },
      {
        path: 'promotion',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () =>
          import('./demo/pages/promotion/promotion.module').then((m) => m.PromotionModule)
      },
      {
        path: 'announcement',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () =>
          import('./demo/pages/announcement/announcement.module').then((m) => m.AnnouncementModule)
      },
      {
        path: 'campaignreach',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () =>
          import('./demo/pages/campaignreach/campaignreach.module').then((m) => m.CampaignreachModule)
      },
      {
        path: 'accountinfo',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () =>
          import('./demo/pages/accountInfo/accountInfo.module').then((m) => m.AccountInfoModule)
      },
      {
        path: 'billing',
        data: { preload: true, loadAfterSeconds: 2 },
        loadChildren: () =>
          import('./demo/pages/billing/billing-routing.module').then((m) => m.BillingRoutingModule)
      },
      {
        path: 'User',
        loadChildren: () =>
          import('./demo/pages/UserProfile/UserProfile.module').then((m) => m.UserProfileModule)
      },
      {
        path: 'BusinessGroup',
        loadChildren: () =>
          import('./demo/pages/BusinessGroup/BusinessGroup.module').then((m) => m.BusinessGroupModule)
      },
      {
        path: 'Sources',
        loadChildren: () =>
          import('./demo/pages/Sources/Sources.module').then((m) => m.SourcesModule)
      },
      {
        path: 'BusinessProfile',
        loadChildren: () =>
          import('./demo/pages/BusinessProfile/BusinessProfile.module').then((m) => m.BusinessProfileModule)
      },
      {
        path: 'revenueanalysis',
        loadChildren: () =>
          import('./demo/pages/revenueanalysis/revenueanalysis.module').then((m) => m.RevenueanalysisModule)
      },
      {
        path: 'upcomingbusiness',
        loadChildren: () =>
          import('./demo/pages/UpcomingBusiness/UpcomingBusiness.module').then((m) => m.UpcomingBusinessModule)
      },
      {
        path: 'admin-panel',
        loadChildren: () =>
          import('./demo/pages/admin-panel/admin-panel-routing.module').then((m) => m.AdminPanelRoutingModule)
      },
      {
        path: 'App',
        loadChildren: () =>
          import('./demo/pages/applinks/applinks.routing-module').then((m) => m.AppLinksRoutingModule)
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'SetPassword',
    component: ResetPasswordComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'member',
    component: MemberProfileComponent,
    data: {
      title: 'Member Page'
    }
  },
  {
    path: 'autopilotsetting',
    component: AutopilotsettingComponent,
    data: {
      title: 'Autopilot Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' },
  {
    path: 'ClaimRevords',
    component: ClaimRevordsComponent,
    data: {
      title: 'Claim Revords'
    }
  },
  {
    path: 'unsubscribeemail',
    component: UnSubscribeEmailComponent,
    data: {
      title: 'unsubscribeemail'
    }
  },
  {
    path: 'applinks',
    component: AppLinksComponent,
    data: {
      title: 'app'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
