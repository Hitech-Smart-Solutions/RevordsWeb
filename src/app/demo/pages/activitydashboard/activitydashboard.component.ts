import { Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { ToastService } from 'src/app/services/ToastService';
import { ActivityHistoryService } from 'src/app/services/ActivityHistoryService';
import { ActivityTypeService } from 'src/app/services/ActivityTypeService';
import { MatDatepicker } from '@angular/material/datepicker';
import { CommonService } from 'src/app/services/CommonService';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as moment from "moment";
import { Time, formatDate } from '@angular/common';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import * as XLSX from 'xlsx';
import { UtcConverterService, UtcToLocalTimeFormat } from 'src/app/services/UtcConverterService';
import * as dayjs from 'dayjs';

export interface PeriodicElement {
  membername: string;
  tagname: string,
  phone: any;
  datetime: string;
  activityType: string;
  points: string;
  rewardName: string;
  timeDuration: Time;
  businessLocationId: string;
  businessName: string;
}
export interface Activityhistory {
  'Name': string;
  'Tag Name': string,
  'Phone': any;
  'Date Time': string;
  'Activity Type': string;
  'Activity Details': string;
  'Duration': string;
  'Points': string;
  'Business Location Name': string;
}
@Component({
  selector: 'app-activitydashboard',
  templateUrl: './activitydashboard.component.html',
  styleUrls: ['./activitydashboard.component.scss']
})

export class ActivitydashboardComponent {
  button = 'Login';
  isLoading = false;
  Password: string;
  searchText: string = "";
  earned: number;
  tooltipbronzemembers: string;
  redeemed: number;
  tooltipsilvermembers: string;
  apredeemed: number;
  promoredeemed: number;
  tooltipgoldmembers: string;
  // loading = false;
  isDataLoaded = false;
  startDate: any;
  endDate: any;
  SelectedActivityName: any = "";
  SelectedBUisnessName: any = "";
  SelectedSearchText: any = "";
  fileName = 'ExcelSheet.xlsx';
  displayedColumns: string[] = ['membername', 'phone', 'datetime', 'businessName', 'activityType', 'rewardName', 'timeDuration', 'points'];
  public dataSource = new MatTableDataSource<PeriodicElement>();
  public dataSourceForFilter: any = new MatTableDataSource<PeriodicElement>();
  public filtereddata: any = [];
  dataAll = [];
  activityType: any = [];
  allActivity: any = 'All Activity';
  fromDate: Date;
  toDate: Date;
  bussinessData: any = [];
  ActivityDashboardGroup: FormGroup;
  disableBtnPrevious: boolean = true;
  disableBtnNext: boolean = true;
  allSelected = false;
  businessGroupID: any;
  now: any = Date.now();
  selected: any;
  dropdownSettingsSingle: IDropdownSettings = {};
  tagList: any = [{ name: 'Tags' }, { name: 'Best' },
  { name: 'Loyal' }, { name: 'New' }, { name: 'At Risk' }, { name: 'InActive' }, { name: 'New Customer' }
    , { name: '#HighRoller$' }];

  dropdownSettings: IDropdownSettings = {};

  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    '3 Months': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'days')],
    '1 Year': [moment().subtract(12, 'month').startOf('month'), moment().subtract(1, 'days')]
  };
  label: any;
  selectedRange: any;
  isGenerating: any = false;

  constructor(public _activityTypeService: ActivityTypeService, private _activityHistoryService: ActivityHistoryService,
    public toastService: ToastService, private _liveAnnouncer: LiveAnnouncer, private _dateConverter: UtcConverterService) {
    this.businessGroupID = JSON.parse(localStorage.getItem('BusinessGroup'));
    this.ActivityDashboardGroup = new FormGroup({
      activity: new FormControl(),
      business: new FormControl(),
      search: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl()
    })

    this.dropdownSettings = {
      idField: 'id',
      textField: 'businessName',
      itemsShowLimit: 1
    };
    this.dropdownSettingsSingle = {
      idField: 'id',
      textField: 'activityName',
      itemsShowLimit: 1
    }
    this.selected = {
      startDate: dayjs().subtract(6, 'days'),
      endDate: dayjs()
    };
    this.label = "Last 7 Days";
    this.selectedRange = "Last 7 Days";
    this.bussinessData = JSON.parse(localStorage.getItem('Business'));
    this.startDate = formatDate((moment().subtract(6, 'days'))['_d'], 'yyyy-MM-dd', 'en-US');
    this.endDate = formatDate((moment())['_d'], 'yyyy-MM-dd', 'en-US');
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  @ViewChild('fromPicker') fromPicker !: MatDatepicker<Date>
  @ViewChild('toPicker') toPicker !: MatDatepicker<Date>
  @ViewChild('select') select: MatSelect;
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;

  datesUpdated(e) {
    this.selectedRange = this.selectedRange == "" ? "Custom range" : this.selectedRange;
    let start: string = formatDate(dayjs(new Date(e.startDate.$y, e.startDate.$M, e.startDate.$D)).toString(), 'yyyy-MM-dd', 'en-US');
    let end: string = formatDate(dayjs(new Date(e.endDate.$y, e.endDate.$M, e.endDate.$D)).toString(), 'yyyy-MM-dd', 'en-US');
    this.selected = {
      startDate: start,
      endDate: end
    };
    this.GetMembersData(start, end);
  }

  rangeClicked(e) {
    this.selectedRange = e.label;
  }

  open() {
    this.picker.open();
    this.selectedRange = "";
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

  async common(type: any) {
    this.isDataLoaded = false;
    this.isLoading = true;

    let businessInput = this.ActivityDashboardGroup.controls['business'].value;
    let searchInput = this.ActivityDashboardGroup.controls['search'].value;

    this.SelectedBUisnessName = businessInput;
    this.SelectedSearchText = searchInput;

    this.filtereddata = this.dataSourceForFilter.data;
    this.paginator.firstPage();

    if (type == 0) {
      this.filtereddata = this.filtereddata;
    }
    let item: { 'id': any; activityName: any }[] = [];
    if (type == 6) {
      this.ActivityDashboardGroup.controls['activity'].setValue(null);
      this.filtereddata = this.filtereddata.filter((t) => t.activityType == "Points Earned");
      let value = this.activityType.filter(x => x.activityName.toString().toLowerCase() == ("Points Earned").toLowerCase())[0];
      item.push({
        id: value.id,
        activityName: value.activityName.toString()
      })
      this.ActivityDashboardGroup.controls['activity'].setValue(item);
    } else if (type == 7) {
      this.ActivityDashboardGroup.controls['activity'].setValue(null);
      this.filtereddata = this.filtereddata.filter((t) => t.activityType == "Rewards Redeemed");
      let value = this.activityType.filter(x => x.activityName.toString().toLowerCase() == ("Rewards Redeemed").toLowerCase())[0];
      item.push({
        id: value.id,
        activityName: value.activityName.toString()
      })
      this.ActivityDashboardGroup.controls['activity'].setValue(item);
    } else if (type == 8) {
      this.ActivityDashboardGroup.controls['activity'].setValue(null);
      this.filtereddata = this.filtereddata.filter((t) => t.activityType == "Autopilot Redeemed");
      let value = this.activityType.filter(x => x.activityName.toString().toLowerCase() == ("Autopilot Redeemed").toLowerCase())[0];
      item.push({
        id: value.id,
        activityName: value.activityName.toString()
      })
      this.ActivityDashboardGroup.controls['activity'].setValue(item);
    } else if (type == 9) {
      this.ActivityDashboardGroup.controls['activity'].setValue(null);
      this.filtereddata = this.filtereddata.filter((t) => t.activityType == "Promotion Redeemed");
      let value = this.activityType.filter(x => x.activityName.toString().toLowerCase() == ("Promotion Redeemed").toLowerCase())[0];
      item.push({
        id: value.id,
        activityName: value.activityName.toString()
      })
      this.ActivityDashboardGroup.controls['activity'].setValue(item);
    }

    let activityInput = this.ActivityDashboardGroup.controls['activity'].value;
    this.SelectedActivityName = activityInput;

    if (businessInput != null && businessInput != undefined) {
      for (let index = 0; index < businessInput.length; index++) {
        if (index == 0) {
          this.filtereddata = this.filtereddata.filter((t: any) => t.businessLocationId == businessInput[index].id.toString());
        } else {
          this.filtereddata = this.filtereddata.concat(this.dataSourceForFilter.data.filter((t) => t.businessLocationId == businessInput[index].id));
        }
      }
    }

    if (activityInput != null && activityInput != undefined) {
      for (let index = 0; index < activityInput.length; index++) {
        if (index == 0) {
          this.filtereddata = this.filtereddata.filter((t: any) => t.activityID == activityInput[index].id.toString());
        } else {
          this.filtereddata = this.filtereddata.concat(this.dataSourceForFilter.data.filter((t) => t.activityID == activityInput[index].id));
        }
      }
    }

    if (searchInput != null && searchInput != undefined && searchInput != '') {
      if (searchInput.length >= 3) {
        this.filtereddata = this.filtereddata.
          filter((t) => (t.membername.replace(/\s/g, "").toLowerCase().includes(searchInput.replace(/\s/g, "").toLowerCase()))
            || (t.phone.toString().includes(searchInput.replace(/\s/g, "").toLowerCase()))
            || (t.tagname != null && t.tagname.replace(/\s/g, "").toLowerCase().includes(searchInput.replace(/\s/g, "").toLowerCase())));
      }
    }

    if (businessInput != null && businessInput != undefined && type != 6 && type != 7 && type != 8) {
      let x = this.filtereddata.filter((t) => t.activityType == "Points Earned")?.map((item) => +item.points).reduce((sum, current) => sum + current, 0);
      this.earned = x;
      this.redeemed = this.filtereddata.filter((t) => t.activityType == "Rewards Redeemed").length;
      this.apredeemed = this.filtereddata.filter((t) => t.activityType == "Autopilot Redeemed").length;
      this.promoredeemed = this.filtereddata.filter((t) => t.activityType == "Promotion Redeemed").length;
    }

    this.dataSource.data = this.filtereddata;
    this.isLoading = false;
    this.isDataLoaded = true;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  DatetimeFormat(date: any): any {
    return date != "" && date != null ? new Date(date).toLocaleDateString("en-US") + " " +
      (new Date(date).getHours() > 9 ? new Date(date).getHours() : "0" + new Date(date).getHours()) + ":" +
      (new Date(date).getMinutes() > 9 ? new Date(date).getMinutes() : "0" + new Date(date).getMinutes()) : "";
  }

  formatPhoneNumber(num) {
    var s2 = ("" + num).replace(/\D/g, '');
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
  }

  exportexcel(): void {
    this.isGenerating = true;
    let excelData = this.dataSource.data;
    let datadump: Activityhistory[] = [];
    excelData.forEach(x => {
      let d: any = {};
      d.Name = x.membername;
      d['Tag Name'] = x.tagname;
      d.Phone = this.formatPhoneNumber(x.phone);
      d['Date Time'] = this._dateConverter.convertUtcToLocalTime(x.datetime, UtcToLocalTimeFormat.SHORT);
      d['Business Location Name'] = x.businessName;
      d['Activity Type'] = x.activityType;
      d['Activity Details'] = x.rewardName;
      d.Duration = x.timeDuration;
      d.Points = x.points;
      datadump.push(d);
    });

    var table1: HTMLTableElement = <HTMLTableElement>document.getElementById("tabl");

    var row = table1.insertRow(0);
    var cell = row.insertCell(0);
    cell.innerHTML = "Data Filtered By : ";

    var row1 = table1.insertRow(1);
    var cell1 = row1.insertCell(0);
    var cell2 = row1.insertCell(1);

    let activityInput = this.ActivityDashboardGroup.controls['activity'].value;
    this.SelectedActivityName = "";
    if (activityInput != null && activityInput != undefined && activityInput != '' && activityInput.length) {
      for (let index = 0; index < activityInput.length; index++) {
        this.SelectedActivityName += activityInput[index].activityName + ', '
      }
    }
    cell1.innerHTML = "ActivityName : ";
    cell2.innerHTML = this.SelectedActivityName;

    var row2 = table1.insertRow(2);
    var cell3 = row2.insertCell(0);
    var cell4 = row2.insertCell(1);
    cell3.innerHTML = "Search Text : ";
    cell4.innerHTML = this.SelectedSearchText != null && this.SelectedSearchText != '' && this.SelectedSearchText != undefined ?
      this.SelectedSearchText : '';

    let businessInput = this.ActivityDashboardGroup.controls['business'].value;
    this.SelectedBUisnessName = "";
    if (businessInput != null && businessInput != undefined && businessInput != '' && businessInput.length) {
      for (let index = 0; index < businessInput.length; index++) {
        this.SelectedBUisnessName += businessInput[index].businessName + ', '
      }
    }

    var row3 = table1.insertRow(3);
    var cell5 = row3.insertCell(0);
    var cell6 = row3.insertCell(1);
    cell5.innerHTML = "Business Location : ";
    cell6.innerHTML = this.SelectedBUisnessName;

    var row4 = table1.insertRow(4);
    var cell7 = row4.insertCell(0);
    var cell8 = row4.insertCell(1);
    cell7.innerHTML = "Downloaded on : ";
    cell8.innerHTML = new Date().toLocaleDateString("en-US") + " " + new Date().toLocaleTimeString("en-US");

    let worksheet_tmp3 = XLSX.utils.table_to_sheet(table1);
    let worksheet_tmp4 = XLSX.utils.json_to_sheet(datadump);

    let c = XLSX.utils.sheet_to_json(worksheet_tmp3, { header: 1 })
    let d = XLSX.utils.sheet_to_json(worksheet_tmp4, { header: 1 })

    c = c.concat(d)
    let worksheet = XLSX.utils.json_to_sheet(c, { skipHeader: true })

    const new_workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(new_workbook, worksheet, "worksheet")
    XLSX.writeFile(new_workbook, this.fileName);

    table1.deleteRow(4);
    table1.deleteRow(3);
    table1.deleteRow(2);
    table1.deleteRow(1);
    table1.deleteRow(0);

    this.isGenerating = false;
  }
  ngOnInit() {
    this.getBussiness();
    this.GetMembersData(this.startDate, this.endDate);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this._activityTypeService.GetActivityTypes().subscribe({
      next: (response) => {
        this.activityType = response
      }
    })
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  getBussiness() {
    this.bussinessData = JSON.parse(localStorage.getItem('Business'));
  }

  async GetMembersData(start: string, end: string) {
    this.isLoading = true;
    this.button = 'Processing';
    this._activityHistoryService.GetActivityDashboardByBusinessGroupId(this.businessGroupID.id, start, end).pipe()
      .subscribe({
        next: async (data) => {
          this.dataSource.data = data;
          this.dataSource.data.forEach(async element => {
            element.phone = await element.phone.toString()
          });
          this.dataSourceForFilter.data = this.dataSource.data;
          let x = this.dataSource.data.filter((t) => t.activityType == "Points Earned").map((item) => +item.points).reduce((sum, current) => sum + current, 0);
          this.earned = x;
          this.redeemed = this.dataSource.data.filter((t) => t.activityType == "Rewards Redeemed").length;
          this.apredeemed = this.dataSource.data.filter((t) => t.activityType == "Autopilot Redeemed").length;
          this.promoredeemed = this.dataSource.data.filter((t) => t.activityType == "Promotion Redeemed").length;

          await this.common(0);

          this.isDataLoaded = true;
          this.isLoading = false;
        },
        error: error => {
          this.earned = 0;
          this.redeemed = 0;
          this.apredeemed = 0;
          this.promoredeemed = 0;
          this.isDataLoaded = false;
          this.isLoading = false;
        }
      });
  }

  //#region BusinessDropdown
  async onItemSelectAll(items) {
    this.ActivityDashboardGroup.controls['business'].setValue(items);
    this.common(0);
  }

  async onDeSelectAll(items) {
    this.ActivityDashboardGroup.controls['business'].setValue(items);
    this.common(0);
  }
  //#endregion

  //#region ActivityDropdown
  async onActivitySelectAll(items) {
    this.ActivityDashboardGroup.controls['activity'].setValue(items);
    this.common(0);
  }

  async onDeActivitySelectAll(items) {
    this.ActivityDashboardGroup.controls['activity'].setValue(items);
    this.common(0);
  }
  //#endregion
}
