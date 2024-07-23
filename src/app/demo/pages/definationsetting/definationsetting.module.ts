import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefinationsettingRoutingModule } from './definationsetting-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { DefinationsettingComponent } from './definationsetting.component';
import { PhonePipeModule } from 'src/app/phone.pipe.module';
import { UtcToLocalTimePipeModule } from 'src/app/utctolocaltime.pipe.module';

@NgModule({
  declarations: [DefinationsettingComponent],
  imports: [
    DefinationsettingRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatListModule,
    MatTabsModule,
    PhonePipeModule,
    UtcToLocalTimePipeModule
  ]
})
export class DefinationsettingModule { }
