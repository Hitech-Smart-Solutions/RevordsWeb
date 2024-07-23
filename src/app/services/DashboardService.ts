import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AppSettings } from './Constants';

@Injectable({
    providedIn: 'root'
})

export class DashboardService {
    constructor(private _http: HttpClient, private _Route: Router) {

    }

    private apiUrl = AppSettings.API_ENDPOINT + "/api/DashBoard/";

    public GetDashboardCountByBusinessGroupID(businessGroupID) {
        return this._http.get<any>(this.apiUrl + "GetDashboardCountByBusinessGroupID/" + businessGroupID)
            .pipe(map(data => {
                return data;
            }));
    }

    public PutMonthlyGoal(MonthlyGoal) {
        return this._http.put<any>(this.apiUrl + "PutMonthlyGoal", MonthlyGoal)
            .pipe(map(res => {
                return res;
            }));
    }

    public GetActiveMemberByBusinessGroupId(businessGroupID) {
        return this._http.get<any>(this.apiUrl + "GetActiveMemberByBusinessGroupId/" + businessGroupID)
            .pipe(map(data => {
                return data;
            }));
    }

    public GetTodaysVisitByBusinessGroupId(businessGroupID) {
        return this._http.get<any>(this.apiUrl + "GetTodaysVisitByBusinessGroupId/" + businessGroupID)
            .pipe(map(data => {
                return data;
            }));
    }
    public GetActiveMemberDetailByBusinessGroupId(businessGroupID) {
        return this._http.get<any>(this.apiUrl + "GetActiveMemberDetailByBusinessGroupId/" + businessGroupID)
            .pipe(map(data => {
                return data;
            }));
    }

    public GetTodaysVisitDetailByBusinessGroupId(businessGroupID) {
        return this._http.get<any>(this.apiUrl + "GetTodaysVisitDetailByBusinessGroupId/" + businessGroupID)
            .pipe(map(data => {
                return data;
            }));
    }
    public GetVisitorInsightsByBusinessGroupId(businessGroupID, filterType, startDate, endDate) {
        return this._http.get<any>(this.apiUrl + `GetVisitorInsightsByBusinessGroupId/${businessGroupID}/${filterType}/${startDate}/${endDate}`)
            .pipe(map(data => {
                return data;
            }));
    }
    public GetDayAndWeekInsightsByBusinessGroupId(details) {
        return this._http.get<any>(this.apiUrl + "GetDayAndWeekInsightsByBusinessGroupId", { params: details })
            .pipe(map(data => {
                return data;
            }));
    }
}