import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonService } from 'src/app/services/CommonService';
import { LicenseApplicantService } from 'src/app/services/LicenseApplicantService';
import { PeriodicElement } from '../autopilotsetting/autopilotsetting.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-UpcomingBusiness',
  templateUrl: './UpcomingBusiness.component.html',
  styleUrls: ['./UpcomingBusiness.component.scss']
})
export class UpcomingBusinessComponent {
  bussinessData: any = [];
  selectedItems: any;
  dropdownSettings: IDropdownSettings = {};
  selectedbusinessGroup: any;
  selectedMonth: any;
  selectedYear: any;
  selectedmiles: any;
  isLoading = false;
  public dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  displayedColumns: string[] = ['LicenseName', 'LicenseNumber', 'DBAName', 'Address', 'City', 'Zip', 'StatusDate', 'LicenseType', 'Distance'];
  miles = [
    { id: 1, name: '1 mile' },
    { id: 2, name: '2 miles' },
    { id: 3, name: '3 miles' },
    { id: 4, name: '4 miles' },
    { id: 5, name: '5 miles' },
    { id: 10, name: '10 miles' }
  ];
  constructor(private _commonService: CommonService, private router: Router,
    private _dashBoardservice: LicenseApplicantService) {
    this.selectedbusinessGroup = JSON.parse(localStorage.getItem('BusinessGroup'));
    this.getBussiness();
    this.GenerateDayWiseChart();
  }
  ngOnInit() {

  }
  resetCalculationsYearWise(){
    this.dataSource.data = null;
  }
  getBussiness() {
    this._commonService.GetBussinessProfilesByGroupID(this.selectedbusinessGroup.id)
      .subscribe({
        next: (data) => {
          this.bussinessData = data;
          localStorage.setItem('Business', JSON.stringify(this.bussinessData));
        },
        error: error => {
        }
      });
  }
  async businessChange(newValue) {
    this.selectedItems = newValue.id;
    await this.GenerateDayWiseChart();
  }
  async milesChange(newValue) {
    console.log(newValue)
    this.selectedmiles = newValue.id;
    await this.GenerateDayWiseChart();
  }
  ngAfterViewInit() {
    console.log(this.paginator);
    this.dataSource.paginator = this.paginator;
  }
  async GenerateDayWiseChart() {
    this.isLoading = true;
    let businessLocationID: any, distance: any, MonthID: any, YearID: any
    businessLocationID = this.selectedItems != undefined ? this.selectedItems : 0;
    distance = this.selectedmiles != undefined ? this.selectedmiles : 0;

    if (businessLocationID != 0 && distance != 0) {
      await this._dashBoardservice.GetPendingApplicants(businessLocationID, distance).subscribe({
        next: async (data) => {
          console.log(data.amountplayedDTO);
          this.dataSource.data = data.amountplayedDTO;
          this.isLoading = false;
        },
        error: error => {

        }
      });
    } else {
      this.isLoading = false;
    }

  }
}
