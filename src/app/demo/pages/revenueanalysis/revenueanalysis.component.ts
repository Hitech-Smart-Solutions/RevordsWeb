import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers, ApexNoData, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonService } from 'src/app/services/CommonService';
import { LicenseApplicantService } from 'src/app/services/LicenseApplicantService';

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

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};
interface datalinechart {
  name: string;
  data: any[];
  color: string;
}
@Component({
  selector: 'app-revenueanalysis',
  templateUrl: './revenueanalysis.component.html',
  styleUrls: ['./revenueanalysis.component.scss']
})
export class RevenueanalysisComponent {
  bussinessData: any = [];
  selectedItems: any;
  dropdownSettings: IDropdownSettings = {};
  selectedbusinessGroup: any;
  selectedMonth: any;
  selectedYear: any;
  selectedmiles: any;
  isLoadingDayWiseChart = false;
  isLoadingYearWiseChart = false;
  chartOptions2: Partial<ChartOptions2>;
  chartOptions3: Partial<ChartOptions2>;
  chartOptions2AmountPlayedData: any = [];
  chartOptions2AmountPlayedXaxis: any = [];
  chartOptions3NTIData: any = [];
  chartOptions3NTIXaxis: any = [];
  insightsDayWise: any = [];
  NTIData: any = [];

  lineChartYearwiseAmountPlayed: any = [];
  lineChartYearwiseNTI: any = [];

  chartOptions4: Partial<ChartOptions>;
  chartOptions5: Partial<ChartOptions>;
  chartOptions4AmountPlayedData: any = [];
  chartOptions4AmountPlayedXaxis: any = [];
  chartOptions5NTIName: datalinechart[] = [];
  chartOptions5NTIData: any = [];
  chartOptions5NTIXaxis: any = [];

  miles = [
    { id: 1, name: '1 mile' },
    { id: 2, name: '2 miles' },
    { id: 3, name: '3 miles' },
    { id: 4, name: '4 miles' },
    { id: 5, name: '5 miles' },
    { id: 10, name: '10 miles' }
  ];
  months = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' },
  ];
  years = [
    { id: 2023, name: '2023' },
    { id: 2024, name: '2024' }
  ];
  constructor(private _commonService: CommonService, private router: Router,
    private _dashBoardservice: LicenseApplicantService) {
    this.selectedbusinessGroup = JSON.parse(localStorage.getItem('BusinessGroup'));
    this.getBussiness();
    this.GenerateDayWiseChart();
    this.GenerateYearWiseChart();
  }
  resetCalculationsMonthWise() {
    this.chartOptions2AmountPlayedData = [];
    this.chartOptions2AmountPlayedXaxis = [];

    this.chartOptions3NTIData = [];
    this.chartOptions3NTIXaxis = [];

    this.BindDayWiseVisitCountChart();
    this.BindNTIChart();
  }
  resetCalculationsYearWise() {
    this.resetCalculationsMonthWise();
    this.chartOptions4AmountPlayedData = [];
    this.chartOptions4AmountPlayedXaxis = [];

    this.chartOptions5NTIName = [];
    this.chartOptions5NTIData = [];
    this.chartOptions5NTIXaxis = [];

    this.BindYearWiseAmountPlayedChart();
    this.BindYearWiseNTIChart();
  }

  async businessChange(newValue) {
    this.selectedItems = newValue.id;
    await this.GenerateDayWiseChart();
    await this.GenerateYearWiseChart();
  }
  async milesChange(newValue) {
    this.selectedmiles = newValue.id;
    await this.GenerateDayWiseChart();
    await this.GenerateYearWiseChart();
  }
  async monthChange(newValue) {
    this.selectedMonth = newValue.id;
    await this.GenerateDayWiseChart();
    await this.GenerateYearWiseChart();
  }
  async yearChange(newValue) {
    this.selectedYear = newValue.id;
    await this.GenerateDayWiseChart();
    await this.GenerateYearWiseChart();
  }
  numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  async GenerateDayWiseChart() {
    this.isLoadingDayWiseChart = true;
    let businessLocationID: any, distance: any, MonthID: any, YearID: any
    businessLocationID = this.selectedItems != undefined ? this.selectedItems : 0;
    distance = this.selectedmiles != undefined ? this.selectedmiles : 0;
    MonthID = this.selectedMonth != undefined ? this.selectedMonth : 0;
    YearID = this.selectedYear != undefined ? this.selectedYear : 0;

    this.chartOptions2AmountPlayedData = [];
    this.chartOptions2AmountPlayedXaxis = [];

    this.chartOptions3NTIData = [];
    this.chartOptions3NTIXaxis = [];

    if (businessLocationID != 0 && distance != 0 && MonthID != 0 && YearID != 0) {
      await this._dashBoardservice.GetRevenueDataMonthwise(businessLocationID, distance, MonthID, YearID).subscribe({
        next: async (data) => {
          this.chartOptions2AmountPlayedData = [];
          this.chartOptions2AmountPlayedXaxis = [];

          this.chartOptions3NTIData = [];
          this.chartOptions3NTIXaxis = [];
          this.insightsDayWise = data.amountplayedDTO;
          this.NTIData = data.netTerminalIncomeDTO;
          this.insightsDayWise.forEach(element => {
            let dbaName = [];
            if (element.dbaName.length > 18) {
              var lastIndex = element.dbaName.substring(0, 18).lastIndexOf(" ");
              dbaName.push(element.dbaName.substring(0, lastIndex));
              dbaName.push(element.dbaName.substring(lastIndex, element.dbaName.length));
            }
            else {
              dbaName = element.dbaName;
            }
            let commasepratedAmount = element.amountPlayed;//.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            let newx: any = { x: dbaName, y: commasepratedAmount, zdesc: element.licenseName, isCurrentLocation: element.isCurrentLocation, Address: element.address, City: element.city, State: element.state };
            this.chartOptions2AmountPlayedData.push(newx);
            this.chartOptions2AmountPlayedXaxis.push(dbaName);
          });
          this.NTIData.forEach(element => {
            let dbaName = [];
            if (element.dbaName.length > 18) {
              var lastIndex = element.dbaName.substring(0, 18).lastIndexOf(" ");
              dbaName.push(element.dbaName.substring(0, lastIndex));
              dbaName.push(element.dbaName.substring(lastIndex, element.dbaName.length));
            }
            else {
              dbaName = element.dbaName;
            }
            let newx: any = { x: element.dbaName, y: element.nti, zdesc: element.licenseName, isCurrentLocation: element.isCurrentLocation, Address: element.address, City: element.city, State: element.state };
            this.chartOptions3NTIData.push(newx);
            this.chartOptions3NTIXaxis.push(dbaName);
          });
          await this.BindDayWiseVisitCountChart();
          await this.BindNTIChart();
          this.isLoadingDayWiseChart = false;
        },
        error: error => {

        }
      });
    } else {
      await this.BindDayWiseVisitCountChart();
      await this.BindNTIChart();
      this.isLoadingDayWiseChart = false;
    }

  }
  async GenerateYearWiseChart() {
    this.isLoadingYearWiseChart = true;
    let businessLocationID: any, distance: any, MonthID: any, YearID: any
    businessLocationID = this.selectedItems != undefined ? this.selectedItems : 0;
    distance = this.selectedmiles != undefined ? this.selectedmiles : 0;
    MonthID = this.selectedMonth != undefined ? this.selectedMonth : 0;
    YearID = this.selectedYear != undefined ? this.selectedYear : 0;
    this.chartOptions4AmountPlayedData = [];
    this.chartOptions4AmountPlayedXaxis = [];

    this.chartOptions5NTIName = [];
    this.chartOptions5NTIData = [];
    this.chartOptions5NTIXaxis = [];

    if (businessLocationID != 0 && distance != 0 && MonthID != 0 && YearID != 0) {
      await this._dashBoardservice.GetRevenueDataYearwise(businessLocationID, distance).subscribe({
        next: async (data) => {
          this.lineChartYearwiseAmountPlayed = data.amountplayedDTO;
          this.lineChartYearwiseNTI = data.netTerminalIncomeDTO;
          //for NTI
          console.log(this.lineChartYearwiseNTI);
          let tempData: any = [];
          tempData = [...new Map(this.lineChartYearwiseNTI.map(item =>
            [item['licensedApplicantID'], item.licensedApplicantID])).values()];
          this.chartOptions5NTIXaxis = [...new Map(this.lineChartYearwiseNTI.map(item =>
            [item['monthName'], item.monthName])).values()];
          let colors = ["#7da3ba", "#003943", "#6d6d6d", "#a17c43", "#83c5be", "#b4bec9", "#FDD835"];
          tempData.forEach((element, index) => {
            let newobj = [];
            this.lineChartYearwiseNTI.forEach(async element1 => {
              if (element == element1.licensedApplicantID) {
                await newobj.push(element1.nti)
              }
            })

            let m: datalinechart = { name: "", data: [], color: "" };
            console.log(element);
            console.log(this.lineChartYearwiseAmountPlayed);
            if (this.lineChartYearwiseAmountPlayed.filter(x => parseInt(x.licensedApplicantID) == parseInt(element)).length > 0) {
              m.name = this.lineChartYearwiseAmountPlayed.filter(x => parseInt(x.licensedApplicantID) == parseInt(element))[0].dbaName;
            }
            m.data = newobj;
            m.color = colors[index];
            this.chartOptions5NTIName.push(m)
          });
          //For Amount played
          let tempData1: any = [];
          tempData1 = [...new Map(this.lineChartYearwiseAmountPlayed.map(item =>
            [item['licensedApplicantID'], item.licensedApplicantID])).values()];
          this.chartOptions4AmountPlayedXaxis = [...new Map(this.lineChartYearwiseAmountPlayed.map(item =>
            [item['monthName'], item.monthName])).values()];
          tempData1.forEach((element, index) => {
            let newobj = []
            this.lineChartYearwiseAmountPlayed.forEach(async element1 => {
              if (element == element1.licensedApplicantID) {
                await newobj.push(element1.amountPlayed)
              }
            })
            let m: datalinechart = { name: "", data: [], color: "" };
            m.name = this.lineChartYearwiseAmountPlayed.filter(x => x.licensedApplicantID == element)[0].dbaName;
            m.data = newobj;
            m.color = colors[index];
            this.chartOptions4AmountPlayedData.push(m)
          });
          await this.BindYearWiseAmountPlayedChart();
          await this.BindYearWiseNTIChart();
          this.isLoadingYearWiseChart = false;
        },
        error: error => {

        }
      });

    } else {
      await this.BindYearWiseAmountPlayedChart();
      await this.BindYearWiseNTIChart();
      this.isLoadingYearWiseChart = false;
    }
  }
  BindDayWiseVisitCountChart() {
    this.chartOptions2 = {
      series: [
        {
          name: "Amount Played",
          data: this.chartOptions2AmountPlayedData
        }
      ],
      chart: {
        type: "bar",
        toolbar: {
          show: false
        },
        height: 450
      },
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
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%",
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
        categories: this.chartOptions2AmountPlayedXaxis,
        floating: false,
        labels: {
          style: {
            fontSize: '12px',
            colors: "black"
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return "$" + val.toFixed(0).toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        },
        decimalsInFloat: 0,
        title: {
          text: ""
        }
      },
      fill: {
        opacity: 1,
        colors: [
          function (opts) {
            const desc =
              opts.w.config.series[opts.seriesIndex].data[
                opts.dataPointIndex
              ].isCurrentLocation
            if (desc == true) {
              return '#7DA3BA';
            } else {
              return '#a17c43';
            }
          }
        ]
      },
      tooltip: {
        custom: function (opts) {
          const desc =
            opts.ctx.w.config.series[opts.seriesIndex].data[
              opts.dataPointIndex
            ].zdesc
          const dbaName =
            opts.ctx.w.config.series[opts.seriesIndex].data[
              opts.dataPointIndex
            ].x
          const address =
            opts.ctx.w.config.series[opts.seriesIndex].data[
              opts.dataPointIndex
            ].Address
          const city =
            opts.ctx.w.config.series[opts.seriesIndex].data[
              opts.dataPointIndex
            ].City
          const state =
            opts.ctx.w.config.series[opts.seriesIndex].data[
              opts.dataPointIndex
            ].State
          const value = opts.series[opts.seriesIndex][opts.dataPointIndex].toFixed(0).toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          return '<div style="padding: 15px;width:300px;text-wrap: wrap;"> <span> Business Name:  </span> <b>' + desc + '</b>'
            + '<br/> <span> DBA Name:  </span> <b>' + dbaName + '</b>'
            + '<br/> <span> Address:  </span> <b>' + address + '</b>'
            + '<br/> <span> City:  </span> <b>' + city + '</b>'
            + '<br/> <span> State:  </span> <b>' + state + '</b>'
            + '<br/> <span> Amount Played:  </span> <b>' + '$' + value + '</b>'
            + '</div>'
        },
        fixed: {
          enabled: false,
          position: 'topRight',
          offsetX: 0,
          offsetY: 0,
      },
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
  BindNTIChart() {
    this.chartOptions3 = {
      series: [
        {
          name: "NTI",
          data: this.chartOptions3NTIData
        }
      ],
      chart: {
        type: "bar",
        toolbar: {
          show: false
        },
        height: 450
      },
      noData: {
        text: this.isLoadingDayWiseChart ? "Loading..." : "No Data present in the graph!",
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: "#000000",
          fontSize: '12px',
          fontFamily: "Helvetica"
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%",
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
        categories: this.chartOptions3NTIXaxis
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return "$" + val.toFixed(0).toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        },
        decimalsInFloat: 0,
        title: {
          text: ""
        }
      },
      fill: {
        opacity: 1,
        colors: [
          function (opts) {
            const desc =
              opts.w.config.series[opts.seriesIndex].data[
                opts.dataPointIndex
              ].isCurrentLocation
            if (desc == true) {
              return '#7DA3BA';
            } else {
              return '#a17c43';
            }
          }
        ]
      },
      tooltip: {
        custom: function (opts) {
          const desc =
            opts.ctx.w.config.series[opts.seriesIndex].data[
              opts.dataPointIndex
            ].zdesc
          const dbaName =
            opts.ctx.w.config.series[opts.seriesIndex].data[
              opts.dataPointIndex
            ].x
          const address =
            opts.ctx.w.config.series[opts.seriesIndex].data[
              opts.dataPointIndex
            ].Address
          const city =
            opts.ctx.w.config.series[opts.seriesIndex].data[
              opts.dataPointIndex
            ].City
          const state =
            opts.ctx.w.config.series[opts.seriesIndex].data[
              opts.dataPointIndex
            ].State
          const value = opts.series[opts.seriesIndex][opts.dataPointIndex].toFixed(0).toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return '<div style="padding: 15px;width:300px;text-wrap: wrap;"> <span> Business Name:  </span> <b>' + desc + '</b>'
            + '<br/> <span> DBA Name:  </span> <b>' + dbaName + '</b>'
            + '<br/> <span> Address:  </span> <b>' + address + '</b>'
            + '<br/> <span> City:  </span> <b>' + city + '</b>'
            + '<br/> <span> State:  </span> <b>' + state + '</b>'
            + '<br/> <span> Net Terminal Income:  </span> <b>' + '$' + value + '</b>'
            + '</div>'
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
  ngOnInit() {

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
  BindYearWiseAmountPlayedChart() {
    this.chartOptions4 = {
      series: this.chartOptions4AmountPlayedData,
      chart: {
        height: 450,
        type: "line",
        toolbar: {
          show: false
        },
      },
      stroke: {
        width: 3,
        curve: "smooth"
      },
      xaxis: {
        type: "category",
        categories: this.chartOptions4AmountPlayedXaxis
      },
      title: {
        text: "",
        align: "left",
        style: {
          fontSize: "16px",
          color: "#666"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#7da3ba", "#003943", "#6d6d6d", "#a17c43", "#83c5be", "#b4bec9", "#FDD835"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [100, 100, 100, 100]
        },
        colors: ["#7da3ba", "#003943", "#6d6d6d", "#a17c43", "#83c5be", "#b4bec9", "#FDD835"]
      },
      markers: {
        size: 4,
        colors: ["#FFA41B"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 4
        }
      },
      yaxis: {
        title: {
          text: ""
        },
        labels: {
          formatter: function (val) {
            return "$" + val.toFixed(0).toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        },
      }
    };
  }
  BindYearWiseNTIChart() {
    this.chartOptions5 = {
      series: this.chartOptions5NTIName,
      chart: {
        height: 450,
        type: "line",
        toolbar: {
          show: false
        },
      },
      stroke: {
        width: 3,
        curve: "smooth"
      },
      xaxis: {
        type: "category",
        categories: this.chartOptions5NTIXaxis
      },
      title: {
        text: "",
        align: "left",
        style: {
          fontSize: "16px",
          color: "#666"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#7da3ba", "#003943", "#6d6d6d", "#a17c43", "#83c5be", "#b4bec9", "#FDD835"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [100, 100, 100, 100]
        }
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 4,
        colors: ["#FFA41B"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 4
        }
      },
      yaxis: {
        title: {
          text: ""
        },
        labels: {
          formatter: function (val) {
            return "$" + val.toFixed(0).toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        }
      }
    };
  }
}
