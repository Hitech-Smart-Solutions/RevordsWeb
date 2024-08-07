import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MemberProfileRoutingModule } from './member-profile-routing.module';

import { MemberProfileComponent } from './member-profile.component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PhonePipeModule } from '../../../phone.pipe.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatSortModule } from '@angular/material/sort';
import { UtcToLocalTimePipeModule } from 'src/app/utctolocaltime.pipe.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    MemberProfileRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    NgbTooltipModule,
    PhonePipeModule, 
    MatFormFieldModule, 
    MatSelectModule,
    MatButtonModule,
    UtcToLocalTimePipeModule,
    MatCheckboxModule,
    MatSortModule,
    MatPaginatorModule,
    NgSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot({
      theme: {
        extendsFromRoot: true,
        height: '30px',
      },
    }),
  ],
  declarations: [MemberProfileComponent]
})
export class MemberProfiledModule {
}
