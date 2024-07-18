import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AppSettings } from './Constants';

@Injectable({
    providedIn: 'root'
})

export class PromotionService {
    constructor(private _http: HttpClient, private _Route: Router) { }

    private apiUrl = AppSettings.API_ENDPOINT + "/api/Promotions/";

    public GetPromotionsByBusinessGroupID(businessGroupID, businessLocationID) {
        return this._http.get<any>(this.apiUrl + "GetPromotionsByBusinessGroupID/" + businessGroupID + "/" + businessLocationID)
            .pipe(map(member => {
                return member;
            }));
    }
    public GetPromotionByID(ID) {
        return this._http.get<any>(this.apiUrl + ID)
            .pipe(map(member => {
                return member;
            }));
    }
    public MultiPromotions(promotion) {
        return this._http.post<any>(this.apiUrl, promotion)
            .pipe(map(member => {
                return member;
            }));
    }

    uploadFile(file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();

        formData.append('file', file);

        const req = new HttpRequest('POST', `${this.apiUrl}UploadFile`, formData, {
            reportProgress: true,
            responseType: 'text',
        });
        return this._http.request(req);
    }
    uploadPromotionalfile(file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();

        formData.append('file', file);

        const req = new HttpRequest('POST', `${this.apiUrl}UploadPromotionalFile`, formData, {
            reportProgress: true,
            responseType: 'text',
        });
        return this._http.request(req);
    }

    public GetPromotionHistoryByBusinessGroupId(bussinessGroupID, startDate, endDate, businessLocationID) {
        return this._http.get<any>(this.apiUrl + "GetPromotionHistoryByBusinessGroupId/" + bussinessGroupID + "/" + startDate + "/" + endDate + "/" + businessLocationID)
            .pipe(map(member => {
                return member;
            }));
    }

    public GetRewardsByActivityTypeAndUID(type, UID) {
        return this._http.get<any>(this.apiUrl + "GetRewardsByActivityTypeAndUID/" + type + "/" + UID)
            .pipe(map(member => {
                return member;
            }));
    }
    public GetUnSubScribeEmailByActivityTypeAndUID(type, UID) {
        return this._http.get<any>(this.apiUrl + "GetUnSubScribeEmailByActivityTypeAndUID/" + type + "/" + UID)
            .pipe(map(member => {
                return member;
            }));
    }

    public GetDraftPromotionByBusinessGroupID(businessGroupID) {
        return this._http.get<any>(this.apiUrl + "GetDraftPromotionByBusinessGroupID/" + businessGroupID)
            .pipe(map(member => {
                return member;
            }));
    }

    public GetLastPromotionSentDateByBusinessGroupID(businessGroupID) {
        return this._http.get<any>(this.apiUrl + "GetLastPromotionSentDateByBusinessGroupID/" + businessGroupID)
            .pipe(map(member => {
                return member;
            }));
    }

    public DeletePromotionByID(ID) {
        return this._http.delete<any>(this.apiUrl + ID)
            .pipe(map(member => {
                return member;
            }));
    }

    public GetPreviousPromotionalWheelByBusinessGroupID(bussinessGroupID) {
        return this._http.get<any>(this.apiUrl + "GetPreviousPromotionalWheelByBusinessGroupID/" + bussinessGroupID)
            .pipe(map(member => {
                return member;
            }));
    }
}