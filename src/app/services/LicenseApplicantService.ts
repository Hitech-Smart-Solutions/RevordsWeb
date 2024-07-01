import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from './Constants';

@Injectable({
    providedIn: 'root'
})

export class LicenseApplicantService {
    constructor(private _http: HttpClient) { }

    private apiUrl = AppSettings.API_ENDPOINT + "/api/LicensedApplicants/";

    public GetRevenueDataMonthwise(businessLocationID, distance, monthID, yearID) {
        return this._http.get<any>(this.apiUrl + "GetRevenueDataMonthwise/" + businessLocationID + "/" + distance + "/" + monthID + "/" + yearID)
            .pipe(map(data => {
                return data;
            }));
    }
    
    public GetRevenueDataYearwise(businessLocationID, distance) {
        return this._http.get<any>(this.apiUrl + "GetRevenueDataYearwise/" + businessLocationID + "/" + distance)
            .pipe(map(data => {
                return data;
            }));
    }

    public GetPendingApplicants(businessLocationID, distance) {
        return this._http.get<any>(this.apiUrl + "GetPendingApplicants/" + businessLocationID + "/" + distance)
            .pipe(map(data => {
                return data;
            }));
    }
}