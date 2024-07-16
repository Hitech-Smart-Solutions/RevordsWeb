import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PromotionRoutingModule } from './promotion-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PromotionComponent } from './promotion.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { WheelComponent } from '../../../spinWheel/wheel/wheel.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UtcToLocalTimePipeModule } from 'src/app/utctolocaltime.pipe.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    PromotionComponent,
    WheelComponent
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    DatePipe
  ],
  imports: [
    CommonModule,
    AngularEditorModule,
    PromotionRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatTreeModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatGridListModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    UtcToLocalTimePipeModule,
    NgbTooltipModule,
    NgSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class PromotionModule { }
