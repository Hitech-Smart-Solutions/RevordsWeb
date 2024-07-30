import { Component, OnInit, ViewChild, ViewEncapsulation, TemplateRef, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApexFill, ApexYAxis, ApexTitleSubtitle, ApexNoData } from 'ng-apexcharts';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexGrid,
  ApexStroke,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexLegend
} from 'ng-apexcharts';
import { ToastService } from '../../../services/ToastService';
import { AdminComponent } from '../../../theme/layout/admin/admin.component';
import { DashboardService } from '../../../services/DashboardService';
import { CommonService } from 'src/app/services/CommonService';
import * as moment from "moment";
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { ProfileSettingService } from 'src/app/services/ProfileSettingService';
import { AppSettings } from 'src/app/services/Constants';

export type ChartOptions = {
  title: ApexTitleSubtitle;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  noData: ApexNoData;
};
export type ChartOptions2 = {
  title: ApexTitleSubtitle;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  noData: ApexNoData;
};

export type ChartOptions1 = {
  title: ApexTitleSubtitle;
  series: ApexNonAxisChartSeries;
  plotOptions: ApexPlotOptions;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  noData: ApexNoData;
  tooltip: ApexTooltip;
};

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebuttonGroup') closebuttonGroup;
  @ViewChild('wizard')
  public wizardRef: TemplateRef<any>;
  @Output() refresh = new EventEmitter<string>();
  chartOptions: Partial<ChartOptions>;
  chartOptions1: Partial<ChartOptions1>;
  chartOptions2: Partial<ChartOptions2>;
  public timerInterval: any;
  totalmembers: Number = 0;
  thismonthvisit: any = 0;
  totalvisits: Number = 0;
  isLoading = false;
  isLoadingTotals = false;
  isLoadingDonutChart = false;
  isLoadingInsightChart = false;
  isLoadingDayWiseChart = false;
  isLoadingTotalMembers = false;
  isLoadingMemberVisitCounts = false;
  ThismonthText: string;
  Tillnowsignups: string;
  Pendingsignups: string;
  percentage: number;
  goalValue: number = 0;
  oldGoalValue: number;
  chartOptions1Value: any = [];
  chartOptions1label: any = [];
  chartOptions1Color: any = [];
  chartOptionsVisitCountData: any = [];
  chartOptionsNewSignupData: any = [];
  chartOptionsVisitCountXaxis: any = [];
  selectedItems: any = [];
  chartOptions2VisitCountData: any = [];
  chartOptions2NewSignupData: any = [];
  chartOptions2VisitCountXaxis: any = [];
  charttype: any;
  charttypbool: any;
  selectedbusinessGroup: any;
  bussinessData: any = [];
  businessGroupData: any = [];
  goalData: any;
  allSelected = false;
  selected: { startDate: any, endDate: any };
  dropdownList = [];
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
  dashboardData: any;
  filterdashData: any;
  activeMemberData: any;
  detailactiveMemberData: any;
  detailactiveFullMemberData: any;
  visitMemberData: any;
  detailvisitMemberData: any;
  activeTabId: any = 1;
  insights: {
    date: any,
    fromHour: any,
    month: any,
    newSignupCount: any,
    toHour: any,
    visitorCount: any,
    year: any
  }[] = [];
  insightsDayWise: {
    fromHour: any,
    averageCount: any,
    visitorCount: any
  }[] = [];
  barchartData: any;
  CumulativeBarchartData: any;
  barchartDataDayWise: any;
  trafficInsightsCumulative: any;
  filtertype: Number = 2;
  bronze: number = 0;
  silver: number = 0;
  gold: number = 0;
  platinum: number = 0;
  bronzeVisitCount: number = 0;
  silverVisitCount: number = 0;
  goldVisitCount: number = 0;
  platinumVisitCount: number = 0;
  bronzeMonthVisitCount: number = 0;
  silverMonthVisitCount: number = 0;
  goldMonthVisitCount: number = 0;
  platinumMonthVisitCount: number = 0;
  businessLocationName: string = '';
  activeTab: number = 1;
  selectedRange: any;
  startDate: any;
  endDate: any;
  dataSource: any;
  totalNewSignUpsThisMonth: number = 0;
  isAdministrator: boolean = false;
  isSignOutRequired: boolean = false;

  constructor(private _dashBoardservice: DashboardService, private _commonService: CommonService,
    public toastService: ToastService, private router: Router, private modalService: NgbModal,
    private appService: AdminComponent, private _profileService: ProfileSettingService) {
    this.selected = {
      startDate: dayjs().subtract(6, 'days'),
      endDate: dayjs()
    };
    this.label = "Last 7 Days";
    this.selectedRange = "Last 7 Days";

    this.startDate = formatDate((moment().subtract(6, 'days'))['_d'], 'yyyy-MM-dd', 'en-US');
    this.endDate = formatDate((moment())['_d'], 'yyyy-MM-dd', 'en-US');

    this.charttype = 2;
    this.charttypbool = true;
    this.ClearNumbers();
    this.selectedbusinessGroup = JSON.parse(localStorage.getItem('BusinessGroup'));
  }
  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;

  public generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }
  rangeClicked(e) {
    this.selectedRange = e.label;
    this.isLoadingInsightChart = true;
    this.chartOptionsVisitCountData = [];
    this.chartOptionsNewSignupData = [];
    this.chartOptionsVisitCountXaxis = [];

    this.BindVisitCountChart();
    this.label = e.label;
    let type;

    let start: string = formatDate(dayjs(new Date(e.dates[0].$y, e.dates[0].$M, e.dates[0].$D)).toString(), 'yyyy-MM-dd', 'en-US');
    let end: string = formatDate(dayjs(new Date(e.dates[1].$y, e.dates[1].$M, e.dates[1].$D)).toString(), 'yyyy-MM-dd', 'en-US');
    this.selected = {
      startDate: start,
      endDate: end
    };

    if (this.label == "Today" || this.label == "Yesterday") {
      type = 1;
      this.filtertype = 1;
    } else if (this.label == "Last 7 Days" || this.label == "Last 30 Days" || this.label == "This Month" || this.label == "Last Month") {
      type = 2;
      this.filtertype = 2;
    } else if (this.label == "3 Months" || this.label == "1 Year") {
      type = 3;
      this.filtertype = 3;
    }
    this.GenerateChart(this.selectedbusinessGroup.id, type, start, end);
  }
  async GenerateDayWiseChart(businessGroupID: any, locationID: any, type: any) {
    this.chartOptions2VisitCountData = [];
    this.chartOptions2NewSignupData = [];
    this.chartOptions2VisitCountXaxis = [];
    this.insightsDayWise = [];
    this.barchartDataDayWise = [];
    this.trafficInsightsCumulative = [];
    this.goalData = [];
    this.goalValue = 0;
    this.isLoadingDayWiseChart = true;
    this.isLoadingTotalMembers = true;
    this.isLoadingTotals = true;

    let businesslocationids: any = '';
    if (locationID != null && locationID != undefined && locationID != '' && locationID.length > 0) {
      locationID.forEach(element => {
        businesslocationids += element.id + ',';
      });
    }

    let details = {
      "businessGroupId": businessGroupID,
      "p_businesslocationid": businesslocationids,
      "filterType": type
    }

    await this._dashBoardservice.GetDayAndWeekInsightsByBusinessGroupId(details).subscribe({
      next: async (data) => {
        this.barchartDataDayWise = data['table1'];
        this.trafficInsightsCumulative = data['table2'];
        this.dataSource = data['table3'];
        this.dashboardData = data['table4'];
        console.log(this.dashboardData);
        await this.ClearNumbers();
        this.dataSource.filter((t) => t.businesslocationid == -1).forEach(element => {
          this.totalmembers += element.membercount;
          if (element.badgeid == 1) {
            this.bronze += element.membercount;
          } else if (element.badgeid == 2) {
            this.silver += element.membercount;
          } else if (element.badgeid == 3) {
            this.gold += element.membercount;
          } else if (element.badgeid == 4) {
            this.platinum += element.membercount;
          }
          this.bronzeVisitCount += element.bronzevisitcount;
          this.silverVisitCount += element.silvervisitcount;
          this.goldVisitCount += element.goldvisitcount;
          this.platinumVisitCount += element.platinumvisitcount;
          this.bronzeMonthVisitCount += element.bronzemonthvisitcount;
          this.silverMonthVisitCount += element.silvermonthvisitcount;
          this.goldMonthVisitCount += element.goldmonthvisitcount;
          this.platinumMonthVisitCount += element.platinummonthvisitcount;
          this.totalvisits += element.visitcount;
          this.thismonthvisit += element.thismonthvisitcount;
        });

        this.dashboardData.forEach(element => {
          if (element.businesslocationid == -1) {
            this.goalValue = element.signupgoals;
            this.totalNewSignUpsThisMonth = element.thismonthactualsignup;
          }
          if (element.businesslocationid != -1) {
            let percCalc = element.signupgoals > 0 ? Math.round((element.thismonthactualsignup / element.signupgoals) * 100) : 0;
            let goal = {
              businessLocationId: element.businesslocationid,
              BName: element.businessname,
              Goal: element.signupgoals,
              Actual: element.thismonthactualsignup,
              percentage: (percCalc)
            }
            this.goalData.push(goal);
          }
        });
        this.calculateGoalData();

        this.isLoadingTotalMembers = false;
        this.isLoadingTotals = false;

        if (type == 1) {
          this.trafficInsightsCumulative.forEach(element => {
            this.insightsDayWise.push({
              fromHour: (element.fromhour) == 0 ? '12 AM' :
                ((element.fromhour > 0 && element.fromhour <= 11) ? (element.fromhour + ' AM') :
                  ((element.fromhour == 12) ? (element.fromhour + ' PM') : ((Number(element.fromhour) - 12) + ' PM'))),
              averageCount: element.visitoravgcount,
              visitorCount: element.visitortodaytotal
            });
          });
        }
        else if (type == 2) {
          this.trafficInsightsCumulative.forEach(element => {
            this.insightsDayWise.push({
              fromHour: element.dayname,
              averageCount: element.visitoravgcount,
              visitorCount: element.visitortodaytotal
            });
          });
        }
        this.insightsDayWise.forEach(element => {
          this.chartOptions2VisitCountData.push(element.visitorCount);
          this.chartOptions2NewSignupData.push(element.averageCount);
          this.chartOptions2VisitCountXaxis.push(element.fromHour);
        });
        this.isLoadingDayWiseChart = false;
        this.isLoadingTotalMembers = false;
        this.isLoadingTotals = false;
      },
      error: error => {
        this.isLoadingDayWiseChart = false;
        this.isLoadingTotalMembers = false;
        this.isLoadingTotals = false;
      }
    });
    this.BindDayWiseVisitCountChart();
  }
  async GenerateChart(businessGroupID: any, type: any, start: string, end: string) {
    this.chartOptionsVisitCountData = [];
    this.chartOptionsNewSignupData = [];
    this.chartOptionsVisitCountXaxis = [];
    this.insights = [];
    this.barchartData = [];
    this.CumulativeBarchartData = [];
    this.isLoadingInsightChart = true;

    await this._dashBoardservice.GetVisitorInsightsByBusinessGroupId(businessGroupID, type, start, end).subscribe({
      next: (data) => {
        this.barchartData = data['table1'];
        this.CumulativeBarchartData = data['table2'];
        this.CumulativeBarchartData.forEach(element => {
          this.insights.push({
            date: element.date,
            fromHour: element.fromhour,
            month: element.month,
            newSignupCount: element.newsignupcount,
            toHour: element.tohour,
            visitorCount: element.visitorcount,
            year: element.year
          });
        });

        if (type == 1) {
          this.insights.forEach(element => {
            this.chartOptionsVisitCountData.push(element.visitorCount);
            this.chartOptionsNewSignupData.push(element.newSignupCount);
            this.chartOptionsVisitCountXaxis.push(element.fromHour + "-" + element.toHour);
          });
        }
        else if (type == 2) {
          this.insights.forEach(element => {
            this.chartOptionsVisitCountData.push(element.visitorCount);
            this.chartOptionsNewSignupData.push(element.newSignupCount);
            this.chartOptionsVisitCountXaxis.push(formatDate(element.date, 'dd MMM', 'en-US'));
          });
        }
        else if (type == 3) {
          this.insights.forEach(element => {
            this.chartOptionsVisitCountData.push(element.visitorCount);
            this.chartOptionsNewSignupData.push(element.newSignupCount);
            this.chartOptionsVisitCountXaxis.push(element.month);
          });
        }

        if (this.selectedItems != null && this.selectedItems != undefined && this.selectedItems.length > 0) {
          this.common();
        }
        this.isLoadingInsightChart = false;
      },
      error: error => {
        this.isLoadingInsightChart = false;
      }
    });
    this.BindVisitCountChart();
  }
  BindVisitCountChart() {
    this.chartOptions = {
      series: [
        {
          name: "New SignUps",
          data: this.chartOptionsNewSignupData

        },
        {
          name: "Visit Counts",
          data: this.chartOptionsVisitCountData
        }
      ],
      chart: {
        type: "bar",
        toolbar: {
          show: false
        },
        height: 447
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          isFunnel3d: true
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: this.chartOptionsVisitCountXaxis
      },
      yaxis: {
        title: {
          text: "Customers Visit Counts"
        },
        max: function (max) { return max + 1 }
      },
      fill: {
        opacity: 1,
        colors: ['#a17c43', '#7da3ba']
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " Members";
          }
        }
      },
      grid: {
        show: false
      },
      legend: {
        markers: {
          fillColors: ['#a17c43', '#7da3ba']
        }
      }
    };
  }
  BindDayWiseVisitCountChart() {
    this.chartOptions2 = {
      series: [
        {
          name: "Average Visits",
          data: this.chartOptions2NewSignupData
        },
        {
          name: "Visit Counts",
          data: this.chartOptions2VisitCountData
        }
      ],
      chart: {
        type: "bar",
        toolbar: {
          show: false
        },
        height: 413
      },
      noData: {
        text: this.isLoadingInsightChart ? "Loading..." : "No Data present in the graph!",
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: "#000000",
          fontSize: '14px',
          fontFamily: "Helvetica"
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          isFunnel3d: true
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: this.chartOptions2VisitCountXaxis
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val.toFixed(0);
          }
        },
        decimalsInFloat: 0,
        title: {
          text: ""
        }
      },
      fill: {
        opacity: 1,
        colors: ['#a17c43', '#7da3ba']
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " Members";
          }
        }
      },
      grid: {
        show: false
      },
      legend: {
        markers: {
          fillColors: ['#a17c43', '#7da3ba']
        }
      }
    };
  }
  open() {
    this.picker.open();
  }
  datesUpdated(e) {
    let start: string = formatDate(dayjs(new Date(e.startDate.$y, e.startDate.$M, e.startDate.$D)).toString(), 'yyyy-MM-dd', 'en-US');
    let end: string = formatDate(dayjs(new Date(e.endDate.$y, e.endDate.$M, e.endDate.$D)).toString(), 'yyyy-MM-dd', 'en-US');
    let type;
    this.selected = {
      startDate: start,
      endDate: end
    };

    if (this.selectedRange == "Today" || this.selectedRange == "Yesterday") {
      type = 1;
      this.filtertype = 1;
    } else if (this.selectedRange == "Last 7 Days" || this.selectedRange == "Last 30 Days" || this.selectedRange == "This Month" || this.selectedRange == "Last Month") {
      type = 2;
      this.filtertype = 2;
    } else if (this.selectedRange == "Last 3 Month" || this.selectedRange == "Last 1 Year") {
      type = 3;
      this.filtertype = 3;
    }
  }
  async onItemSelectAll(items) {
    this.selectedItems = [];
    items.forEach(element => {
      this.selectedItems.push(element);
    });
    this.ClearNumbers();
    await this.common();
  }

  async onItemSelect(item: any) {
    let exists = false;
    this.selectedItems.forEach(async (element) => {
      if (element.id == item.id) {
        exists = true;
      }
    })
    if (!exists) {
      this.selectedItems.push(item);
    }
    this.ClearNumbers();
    await this.common();
  }
  async onItemDeSelect(item) {
    this.ClearNumbers();
    this.selectedItems.slice(item);
    await this.common();
  }
  async onItemDeSelectAll(items) {
    this.ClearNumbers();
    this.selectedItems = [];
    await this.common();
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

  GetDonutChart() {
    this.isLoading = true;
    this.isLoadingDonutChart = true;
    this.GetActiveMembers();
    this.GetTodaysVisit();
    this.isLoading = false;
  }

  GetActiveMembers() {
    this.isLoadingDonutChart = true;
    this._dashBoardservice.GetActiveMemberByBusinessGroupId(this.selectedbusinessGroup.id).pipe()
      .subscribe({
        next: (data) => {
          this.activeMemberData = data.filter(t => t.count > 0);
          this.activeMemberData.forEach(element => {
            this.chartOptions1Value.push(element.count);
            this.chartOptions1label.push(element.businessLocationName);
            this.chartOptions1Color.push(element.colorCode);
          });
          this.isLoadingDonutChart = false;
        },
        error: (error) => {
          console.log(error)
          this.isLoading = false;
        }
      });
  }

  async GetTodaysVisit() {
    this.isLoadingDonutChart = true;
    await this._dashBoardservice.GetTodaysVisitByBusinessGroupId(this.selectedbusinessGroup.id).pipe()
      .subscribe({
        next: (data) => {
          this.visitMemberData = data.filter(t => t.count > 0);
          this.isLoadingDonutChart = false;
        },
        error: (error) => {
          console.log(error)
          this.isLoading = false;
        }
      });
  }

  onNavChange1(item) {
    this.chartOptions1Value = [];
    this.chartOptions1label = [];
    this.chartOptions1Color = [];
    this.activeTabId = item;
    if (this.selectedItems != null && this.selectedItems != undefined && this.selectedItems.length != 0) {
      for (let index = 0; index < this.selectedItems.length; index++) {
        if (index == 0) {
          if (this.activeTabId == 1) {
            this.activeMemberData.forEach(element => {
              if (element.businessLocationId == this.selectedItems[index].id) {
                this.chartOptions1Value.push(element.count);
                this.chartOptions1label.push(element.businessLocationName);
                this.chartOptions1Color.push(element.colorCode);
              }
            });
            this.chartOptions1.series = this.chartOptions1Value;
            this.chartOptions1.labels = this.chartOptions1label;
          } else if (this.activeTabId == 2) {
            this.visitMemberData.forEach(element => {
              if (element.businessLocationId == this.selectedItems[index].id) {
                this.chartOptions1Value.push(element.count);
                this.chartOptions1label.push(element.businessLocationName);
                this.chartOptions1Color.push(element.colorCode);
              }
            });
            this.chartOptions1.series = this.chartOptions1Value;
            this.chartOptions1.labels = this.chartOptions1label;
          }
        }
        else {
          if (this.activeTabId == 1) {
            this.activeMemberData.forEach(element => {
              if (element.businessLocationId == this.selectedItems[index].id) {
                this.chartOptions1Value.push(element.count);
                this.chartOptions1label.push(element.businessLocationName);
                this.chartOptions1Color.push(element.colorCode);
              }
            });
            this.chartOptions1.series = this.chartOptions1Value;
            this.chartOptions1.labels = this.chartOptions1label;
          } else if (this.activeTabId == 2) {
            this.visitMemberData.forEach(element => {
              if (element.businessLocationId == this.selectedItems[index].id) {
                this.chartOptions1Value.push(element.count);
                this.chartOptions1label.push(element.businessLocationName);
                this.chartOptions1Color.push(element.colorCode);
              }
              this.chartOptions1.series = this.chartOptions1Value;
              this.chartOptions1.labels = this.chartOptions1label;
            });
          }
        }
      }
    }
    else if (this.selectedItems == undefined || this.selectedItems.length == 0) {
      this.getfilterReduceDonutElseIf();
    }
  }

  async getActiveDetailData() {
    await this._dashBoardservice.GetActiveMemberDetailByBusinessGroupId(this.selectedbusinessGroup.id).pipe()
      .subscribe({
        next: (data) => {
          data.forEach(element => {
            let today = new Date();
            var startTime = new Date(element.inTime);
            var endTime = new Date(today.getUTCFullYear(), (today.getUTCMonth()), today.getUTCDate(),
              today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds());
            var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
            var resultInMinutes = Math.round(difference / 60000);
            var hours = Math.trunc(resultInMinutes / 60);
            var minutes = resultInMinutes % 60;
            element.inTime = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
          });
          this.detailactiveFullMemberData = data;
          this.detailactiveMemberData = data;

          this.isSignOutRequired = (data != null && data != '' && data != undefined && data.length > 0) ? data[0].isSignOutRequired : this.isSignOutRequired;
        },
        error: (error) => {
          console.log(error)
        }
      });
  }
  async ClearNumbers() {
    this.totalmembers = 0;
    this.bronze = 0;
    this.silver = 0;
    this.gold = 0;
    this.platinum = 0;
    this.bronzeVisitCount = 0;
    this.silverVisitCount = 0;
    this.goldVisitCount = 0;
    this.platinumVisitCount = 0;
    this.bronzeMonthVisitCount = 0;
    this.silverMonthVisitCount = 0;
    this.goldMonthVisitCount = 0;
    this.platinumMonthVisitCount = 0;
    this.totalvisits = 0;
    this.thismonthvisit = 0;
  }
  removeDuplicates(myArray, Prop) {
    return myArray.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[Prop]).indexOf(obj[Prop]) === pos;
    });
  }
  async common() {
    this.filterdashData = this.dataSource;

    this.ClearNumbers();
    this.chartOptions1Value = [];
    this.chartOptions1label = [];
    this.chartOptions1Color = [];
    if (this.selectedItems != null && this.selectedItems != undefined && this.selectedItems.length != 0) {
      let barFilter = [];
      this.insights = [];
      this.chartOptionsVisitCountData = [];
      this.chartOptionsNewSignupData = [];
      this.chartOptionsVisitCountXaxis = [];
      this.chartOptions2VisitCountData = [];
      this.chartOptions2NewSignupData = [];
      this.chartOptions2VisitCountXaxis = [];
      this.chartOptions.series[0].data = [];
      this.chartOptions.series[1].data = [];
      this.chartOptions.xaxis.categories = [];
      this.chartOptions2.series[0].data = [];
      this.chartOptions2.series[1].data = [];
      this.chartOptions2.xaxis.categories = [];
      for (let index = 0; index < this.selectedItems.length; index++) {
        if (index == 0) {
          this.filterdashData = this.dataSource.filter((t) => t.businesslocationid == this.selectedItems[index].id);
          this.dataSource.filter((t) => t.businesslocationid == this.selectedItems[index].id.toString()).forEach(element => {
            this.totalmembers += element.membercount;
            if (element.badgeid == 1) {
              this.bronze += element.membercount;
            } else if (element.badgeid == 2) {
              this.silver += element.membercount;
            } else if (element.badgeid == 3) {
              this.gold += element.membercount;
            } else if (element.badgeid == 4) {
              this.platinum += element.membercount;
            }
            this.bronzeVisitCount += element.bronzevisitcount > 0 ? element.bronzevisitcount : 0;
            this.silverVisitCount += element.silvervisitcount > 0 ? element.silvervisitcount : 0;
            this.goldVisitCount += element.goldvisitcount > 0 ? element.goldvisitcount : 0;
            this.platinumVisitCount += element.platinumvisitcount > 0 ? element.platinumvisitcount : 0;
            this.bronzeMonthVisitCount += element.bronzemonthvisitcount > 0 ? element.bronzemonthvisitcount : 0;
            this.silverMonthVisitCount += element.silvermonthvisitcount > 0 ? element.silvermonthvisitcount : 0;
            this.goldMonthVisitCount += element.goldmonthvisitcount > 0 ? element.goldmonthvisitcount : 0;
            this.platinumMonthVisitCount += element.platinummonthvisitcount > 0 ? element.platinummonthvisitcount : 0;
            this.totalvisits += element.visitcount > 0 ? element.visitcount : 0;
            this.thismonthvisit += element.thismonthvisitcount > 0 ? element.thismonthvisitcount : 0;
          });

          barFilter = this.barchartData.filter(x => x.businesslocationid == this.selectedItems[index].id);
          barFilter.forEach(element => {
            this.insights.push({
              date: element.date,
              fromHour: element.fromhour,
              month: element.month,
              newSignupCount: element.newsignupcount,
              toHour: element.tohour,
              visitorCount: element.visitorcount,
              year: element.year
            });
          });

          this.addDataToInsights();

          this.chartOptions.series[0].data = this.chartOptionsVisitCountData;
          this.chartOptions.series[1].data = this.chartOptionsNewSignupData;

          this.BindVisitCountChart();
          this.activeTabToggle(index)

          let arr = this.barchartDataDayWise.filter(x => x.businesslocationid == this.selectedItems[index].id);
          this.insightsDayWise = [];

          if (this.charttype == 2) {
            arr.forEach(x => {
              this.insightsDayWise.push({
                fromHour: x.dayname,
                averageCount: x.visitoravgcount,
                visitorCount: x.visitortodaytotal
              });
            });
          }
          else {
            arr.forEach(x => {
              this.insightsDayWise.push({
                fromHour: (x.fromhour) == 0 ? '12 AM' :
                  ((x.fromhour > 0 && x.fromhour <= 11) ? (x.fromhour + ' AM') :
                    ((x.fromhour == 12) ? (x.fromhour + ' PM') : ((Number(x.fromhour) - 12) + ' PM'))),
                averageCount: x.visitoravgcount,
                visitorCount: x.visitortodaytotal
              });
            });
          }
        }
        else {
          this.filterdashData = this.filterdashData.concat(this.dashboardData.filter((t) => t.businesslocationid == this.selectedItems[index].id));
          this.dataSource.filter((t) => t.businesslocationid == this.selectedItems[index].id.toString()).forEach(element => {
            this.totalmembers += element.membercount;
            if (element.badgeid == 1) {
              this.bronze += element.membercount;
            } else if (element.badgeid == 2) {
              this.silver += element.membercount;
            } else if (element.badgeid == 3) {
              this.gold += element.membercount;
            } else if (element.badgeid == 4) {
              this.platinum += element.membercount;
            }

            this.bronzeVisitCount += element.bronzevisitcount > 0 ? element.bronzevisitcount : 0;
            this.silverVisitCount += element.silvervisitcount > 0 ? element.silvervisitcount : 0;
            this.goldVisitCount += element.goldvisitcount > 0 ? element.goldvisitcount : 0;
            this.platinumVisitCount += element.platinumvisitcount > 0 ? element.platinumvisitcount : 0;
            this.bronzeMonthVisitCount += element.bronzemonthvisitcount > 0 ? element.bronzemonthvisitcount : 0;
            this.silverMonthVisitCount += element.silvermonthvisitcount > 0 ? element.silvermonthvisitcount : 0;
            this.goldMonthVisitCount += element.goldmonthvisitcount > 0 ? element.goldmonthvisitcount : 0;
            this.platinumMonthVisitCount += element.platinummonthvisitcount > 0 ? element.platinummonthvisitcount : 0;
            this.totalvisits += element.visitcount > 0 ? element.visitcount : 0;
            this.thismonthvisit += element.thismonthvisitcount > 0 ? element.thismonthvisitcount : 0;
          });

          barFilter = this.barchartData.filter(x => x.businesslocationid == this.selectedItems[index].id);
          barFilter.forEach(element => {
            this.incCount(element)
          });

          this.chartOptionsVisitCountData = [];
          this.chartOptionsNewSignupData = [];
          this.chartOptionsVisitCountXaxis = [];

          this.addDataToInsights();
          this.chartOptions.series[0].data = [];
          this.chartOptions.series[1].data = [];
          this.chartOptions.series[0].data = this.chartOptionsVisitCountData;
          this.chartOptions.series[1].data = this.chartOptionsNewSignupData;
          this.BindVisitCountChart();

          this.activeTabToggle(index);

          let arr = this.barchartDataDayWise.filter(x => x.businesslocationid == this.selectedItems[index].id);

          if (this.charttype == 2) {
            arr.forEach(element => {
              this.insightsDayWise.filter(x => x.fromHour == element.dayname)[0].visitorCount += element.visitortodaytotal;
              this.insightsDayWise.filter(x => x.fromHour == element.dayname)[0].averageCount += element.visitoravgcount;
            });
          }
          else {
            arr.forEach(element => {
              this.insightsDayWise.filter(x => x.fromHour == element.fromhour)[0].visitorCount += element.visitortodaytotal;
              this.insightsDayWise.filter(x => x.fromHour == element.fromhour)[0].averageCount += element.visitoravgcount;
            });
          }
        }
      }

      this.insightsDayWise.forEach(element => {
        this.chartOptions2VisitCountData.push(element.visitorCount);
        this.chartOptions2NewSignupData.push(element.averageCount);
        this.chartOptions2VisitCountXaxis.push(element.fromHour);
      });
      this.BindDayWiseVisitCountChart();
    }
    else if (this.selectedItems.length == 0) {
      this.filterdashData.filter(t => t.businesslocationid == -1).forEach(element => {
        this.bronzeVisitCount += element.bronzevisitcount;
        this.silverVisitCount += element.silvervisitcount;
        this.goldVisitCount += element.goldvisitcount;
        this.platinumVisitCount += element.platinumvisitcount;
        this.bronzeMonthVisitCount += element.bronzemonthvisitcount;
        this.silverMonthVisitCount += element.silvermonthvisitcount;
        this.goldMonthVisitCount += element.goldmonthvisitcount;
        this.platinumMonthVisitCount += element.platinummonthvisitcount;
        this.totalvisits += element.visitcount;
        this.thismonthvisit += element.thismonthvisitcount;
      });
      this.insights = [];
      this.chartOptionsVisitCountData = [];
      this.chartOptionsNewSignupData = [];
      this.chartOptionsVisitCountXaxis = [];
      this.chartOptions.series[0].data = [];
      this.chartOptions.series[1].data = [];
      this.chartOptions.xaxis.categories = [];

      this.CumulativeBarchartData.forEach(element => {
        this.insights.push({
          date: element.date,
          fromHour: element.fromhour,
          month: element.month,
          newSignupCount: element.newsignupcount,
          toHour: element.tohour,
          visitorCount: element.visitorcount,
          year: element.year
        });
      });

      // let location: any = '';
      // if (this.bussinessData.length > 0 && this.bussinessData != null) {
      //   this.bussinessData.forEach(element => {
      //     location += element.id + ',';
      //   });
      // }

      this.chartOptionsVisitCountData = [];
      this.chartOptionsNewSignupData = [];
      this.chartOptionsVisitCountXaxis = [];
      this.getActiveDetailData();
      this.addDataToInsights();

      this.chartOptions.series[0].data = [];
      this.chartOptions.series[1].data = [];
      this.chartOptions.xaxis.categories = [];

      this.chartOptions.series[0].data = this.chartOptionsVisitCountData;
      this.chartOptions.series[1].data = this.chartOptionsNewSignupData;
      this.BindVisitCountChart();
      this.GenerateDayWiseChart(this.selectedbusinessGroup.id, this.selectedItems, this.charttype);
      this.getfilterReduceDonutElseIf();
    }
  }

  addDataToInsights() {
    this.insights.forEach(element => {
      this.chartOptionsVisitCountData.push(element.visitorCount);
      this.chartOptionsNewSignupData.push(element.newSignupCount);
      if (this.filtertype == 1) {
        this.chartOptionsVisitCountXaxis.push(element.fromHour + "-" + element.toHour);
      }
      else if (this.filtertype == 2) {
        this.chartOptionsVisitCountXaxis.push(formatDate(element.date, 'dd MMM', 'en-US'));
      }
      else if (this.filtertype == 3) {
        this.chartOptionsVisitCountXaxis.push(element.month);
      }
    });
  }

  activeTabToggle(index) {
    if (this.activeTabId == 1) {
      this.activeMemberData.forEach(element => {
        if (element.businessLocationId == this.selectedItems[index].id) {
          this.chartOptions1Value.push(element.count);
          this.chartOptions1label.push(element.businessLocationName);
          this.chartOptions1Color.push(element.colorCode);
        }
      });
    } else if (this.activeTabId == 2) {
      this.visitMemberData.forEach(element => {
        if (element.businessLocationId == this.selectedItems[index].id) {
          this.chartOptions1Value.push(element.count);
          this.chartOptions1label.push(element.businessLocationName);
          this.chartOptions1Color.push(element.colorCode);
        }
      });
    }
    this.chartOptions1.series = this.chartOptions1Value;
    this.chartOptions1.labels = this.chartOptions1label;
    this.chartOptions1.fill = {
      opacity: 1,
      colors: this.chartOptions1Color
    }
  }

  incCount(element) {
    if (this.filtertype == 1) {
      this.insights.filter(x => x.fromHour == element.fromHour && x.toHour == element.toHour)[0].visitorCount += element.visitorCount;
      this.insights.filter(x => x.fromHour == element.fromHour && x.toHour == element.toHour)[0].newSignupCount += element.newSignupCount;
    }
    else if (this.filtertype == 2) {
      this.insights.filter(x => x.date == element.date)[0].visitorCount += element.visitorCount;
      this.insights.filter(x => x.date == element.date)[0].newSignupCount += element.newSignupCount;
    }
    else if (this.filtertype == 3) {
      this.insights.filter(x => x.month == element.month && x.year == element.year)[0].visitorCount += element.visitorCount;
      this.insights.filter(x => x.month == element.month && x.year == element.year)[0].newSignupCount += element.newSignupCount;
    }
  }

  calculateGoalData() {
    var today = new Date();
    today = today.getHours() <= 2 ? (new Date(today.setDate(today.getDate() - 1))) : today;

    var month = today.toLocaleString('default', { month: 'long' });
    this.ThismonthText = month + " Goal: " + this.goalValue + " Signups";
    this.Tillnowsignups = this.totalNewSignUpsThisMonth + " Signups.";
    this.Pendingsignups = (this.goalValue - this.totalNewSignUpsThisMonth) > 0 ? (this.goalValue - this.totalNewSignUpsThisMonth) + " more to go!" : "Congrats !";
    var percCalc = Math.round((this.totalNewSignUpsThisMonth / this.goalValue) * 100);
    this.percentage = percCalc;
  }

  getfilterReduceDonutElseIf() {
    if (this.activeTabId == 1) {
      this.activeMemberData.forEach(element => {
        this.chartOptions1Value.push(element.count);
        this.chartOptions1label.push(element.businessLocationName);
        this.chartOptions1Color.push(element.colorCode);
      });
    } else if (this.activeTabId == 2) {
      this.visitMemberData.forEach(element => {
        this.chartOptions1Value.push(element.count);
        this.chartOptions1label.push(element.businessLocationName);
        this.chartOptions1Color.push(element.colorCode);
      });
    }

    this.chartOptions1.series = this.chartOptions1Value;
    this.chartOptions1.labels = this.chartOptions1label;
    this.chartOptions1.fill = {
      opacity: 1,
      colors: this.chartOptions1Color
    }
  }

  OpenGoalModal() {
    this.oldGoalValue = this.goalValue;
  }

  OpendataModal() {

    this.modalService.open(this.wizardRef);
  }

  onNavChange(item) {
    this.activeTab = item;
  }

  formatLabel(value: number): string {
    this.goalValue = value;
    return `${value}`;
  }
  onInputChange(event: Event) {
    this.oldGoalValue = 0;
    this.goalData.forEach(element => {
      this.oldGoalValue += element.Goal;
    });
  }
  async SaveGoal() {
    this.ClearNumbers();
    await this.UpdateGoals();
    this.closebutton.nativeElement.click();
    this.showSnackbarAction("Monthly Goal Set...!", "1");
    this.isLoading = false;
  }
  async UpdateGoals() {
    var today = new Date();
    today = today.getHours() <= 2 ? new Date(today.setDate(today.getDate() - 1)) : today;

    let Goaldata: any = [];
    this.goalData.forEach((element) => {
      let MonthlyGoal = {
        uniqueId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        id: 0,
        signUpGoals: element.Goal,
        monthId: (today.getMonth() + 1).toString(),
        yearId: today.getFullYear().toString(),
        stateId: 3,
        isActive: 1,
        createdBy: 1,
        createdDate: AppSettings.GetDate(),
        lastModifiedBy: 1,
        lastModifiedDate: AppSettings.GetDate(),
        businessGroupId: this.selectedbusinessGroup.id,
        businessLocationId: element.businessLocationId
      };
      Goaldata.push(MonthlyGoal);
    });
    this._dashBoardservice.PutMonthlyGoal(Goaldata).subscribe({
      next: async (data) => {
        await this.GenerateDayWiseChart(this.selectedbusinessGroup.id, this.selectedItems, this.charttype);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  showSnackbarAction(message: string, action: string) {
    if (action == "1") {
      this.toastService.showSuccess(message);
    } else if (action == "2") {
      this.toastService.showDanger(message);
    }
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard']);
    });
  }
  async btnAddPromo() {
    this.ClearNumbers();
    if (this.charttype == 1) {
      this.charttype = 2;
      this.charttypbool = true;
      await this.GenerateDayWiseChart(this.selectedbusinessGroup.id, this.selectedItems, 2);
    } else {
      this.charttype = 1;
      this.charttypbool = false;
      await this.GenerateDayWiseChart(this.selectedbusinessGroup.id, this.selectedItems, 1);
    }
  }
  async getbusinessGroups() {
    let userID = JSON.parse(localStorage.getItem('UserID'))
    await this._profileService.GetBusinessGroupesByUserID(userID)
      .subscribe({
        next: async (data) => {
          this.selectedbusinessGroup = data[0];
          localStorage.setItem('BusinessGroup', JSON.stringify(data[0]));
          let userData = JSON.parse(localStorage.getItem('UserData'));
          this.isAdministrator = userData.isAdministrator;
        },
        error: error => { }
      });
  }
  async ngOnInit() {
    if (this.selectedbusinessGroup == null) {
      await this.getbusinessGroups();
      this.GetAllData();
    } else {
      this.selectedbusinessGroup = JSON.parse(localStorage.getItem('BusinessGroup'));
      let userData = JSON.parse(localStorage.getItem('UserData'));
      this.isAdministrator = userData.isAdministrator;
      this.GetAllData();
    }
  }
  public selectedBar(x) {
    this.detailactiveMemberData = this.detailactiveFullMemberData.filter(y => y.businessLocationName == this.chartOptions1label[x]);
    this.businessLocationName = this.detailactiveMemberData[0].businessLocationName
    this.OpendataModal();
  }
  justAlert() {
    alert('Wait..');
  }
  async GetAllData() {
    if (!this.isLoadingMemberVisitCounts) {
      this.isLoadingMemberVisitCounts = true;
      this.chartOptionsVisitCountData = [];
      this.chartOptionsNewSignupData = [];
      this.chartOptionsVisitCountXaxis = [];
      this.chartOptions1Value = [];
      this.chartOptions1label = [];
      this.chartOptions1Color = [];
      this.chartOptionsVisitCountData = [];
      this.chartOptionsNewSignupData = [];
      this.chartOptionsVisitCountXaxis = [];
      this.selectedItems = [];
      this.chartOptions2VisitCountData = [];
      this.chartOptions2NewSignupData = [];
      this.chartOptions2VisitCountXaxis = [];

      this.goalData = [];
      this.oldGoalValue = 0;
      this.Tillnowsignups = "";
      this.ThismonthText = "";
      this.goalValue = 0;
      this.activeTabId = 1;
      let bussiness = JSON.parse(localStorage.getItem('Business'));
      if (bussiness == null || bussiness == undefined) {
        this.getBussiness();
      }
      this.getBussiness();
      this.GetDonutChart();
      this.dropdownSettings = {
        idField: 'id',
        textField: 'businessName',
        itemsShowLimit: 1
      };
      let s = formatDate((moment().subtract(6, 'days'))['_d'], 'yyyy-MM-dd', 'en-US');
      let e = formatDate((moment())['_d'], 'yyyy-MM-dd', 'en-US');
      this.GenerateChart(this.selectedbusinessGroup.id, 2, s, e);
      this.GenerateDayWiseChart(this.selectedbusinessGroup.id, this.selectedItems, this.charttype);
      this.getActiveDetailData();

      this.isLoadingMemberVisitCounts = false;
      this.chartOptions = {
        series: [
          {
            name: "New SignUps",
            data: this.chartOptionsNewSignupData

          },
          {
            name: "Visit Counts",
            data: this.chartOptionsVisitCountData
          }
        ],
        noData: {
          text: this.isLoadingInsightChart ? "Loading..." : "No Data present in the graph!",
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: "#000000",
            fontSize: '14px',
            fontFamily: "Helvetica"
          }
        },
        chart: {
          type: "bar",
          toolbar: {
            show: false
          },
          height: 447
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: this.chartOptionsVisitCountXaxis
        },
        yaxis: {
          title: {
            text: "Customers Visit Counts"
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val + " thousands";
            }
          }
        }
      };
      this.chartOptions2 = {
        series: [
          {
            name: "New SignUps",
            data: this.chartOptions2NewSignupData
          },
          {
            name: "Visit Counts",
            data: this.chartOptions2VisitCountData
          }
        ],
        noData: {
          text: this.isLoadingDayWiseChart ? "Loading..." : "No Data present in the graph!",
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: "#000000",
            fontSize: '14px',
            fontFamily: "Helvetica"
          }
        },
        chart: {
          type: "bar",
          toolbar: {
            show: false
          },
          height: 413
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: this.chartOptions2VisitCountXaxis
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val.toFixed(0);
            }
          },
          decimalsInFloat: 0,
          title: {
            text: ""
          }
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val + " thousands";
            }
          }
        }
      };

      this.chartOptions1 = {
        series: this.chartOptions1Value,
        labels: this.chartOptions1label,
        chart: {
          width: '340',
          type: "donut",
          height: 340,
          events: {
            dataPointSelection: (event: any, chartContext: any, config: any) => {
              if (this.activeTabId == 1) {
                this.selectedBar(config.dataPointIndex);
              }
            }
          }
        },
        fill: {
          opacity: 1,
          colors: this.chartOptions1Color
        },
        noData: {
          text: this.isLoadingDonutChart ? "Loading..." : "No Data present in the graph!",
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: "#000000",
            fontSize: '14px',
            fontFamily: "Helvetica"
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            return opts.w.config.series[opts.seriesIndex]
          },
          style: {
            fontSize: '20px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: ['#fff']
          }
        },
        legend: {
          show: false
        },
        plotOptions: {
          pie: {
            startAngle: 0,
            endAngle: 360,
            expandOnClick: true,
            offsetX: 0,
            offsetY: 0,
            customScale: 1,
            dataLabels: {
              offset: 0,
              minAngleToShowLabel: 10
            },
            donut: {
              size: '60%',
              background: 'transparent',
              labels: {
                show: true,
                total: {
                  show: true,
                  showAlways: true,
                  label: 'Total',
                  fontSize: '25px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#373d3f',
                  formatter: function (w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return a + b
                    }, 0)
                  }
                }
              },
            },
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };
    }
  }
}

