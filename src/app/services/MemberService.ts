import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from './Constants';

@Injectable({
    providedIn: 'root'
})

export class MemberService {
    constructor(private _http: HttpClient) { }

    private apiUrl = AppSettings.API_ENDPOINT + "/api/MemberProfiles/";

    public GetMemberProfileByBusinessGroupId(details): Observable<any> {
        return this._http.get<any>(this.apiUrl + "GetMemberProfileByBusinessGroupId", { params: details })
    }

    public GetMemberProfileByProfileID(profileId) {
        return this._http.get<any>(this.apiUrl + "GetMemberProfileByProfileID/" + profileId)
            .pipe(map(member => {
                return member;
            }));
    }

    public PostMemberProfileByPhone(tag) {
        console.log(tag);
        return this._http.post<any>(this.apiUrl + "PostMemberProfileByPhone", tag)
            .pipe(map(member => {
                return member;
            }));
    }

    public PutMemberProfileInCustomerScreen(profileid, memberprofile) {
        return this._http.put<any>(this.apiUrl + "PutMemberProfileInCustomerScreen/" + profileid, memberprofile)
            .pipe(map(member => {
                return member;
            }));
    }

    public GetMemberByPhoneNo(phoneNo) {
        return this._http.get<any>(this.apiUrl + "GetMemberByPhoneNo/" + phoneNo)
            .pipe(map(member => {
             
                return member;
            }));
    }

    public GetMembersDataForPromotion(details): Promise<any> {
        return this._http.get<any>(this.apiUrl + "GetMembersDataForPromotion", { params: details }).toPromise()
    }
    public GetMembersDataForAnnouncement(details): Promise<any> {
        return this._http.get<any>(this.apiUrl + "GetMembersDataForAnnouncement", { params: details }).toPromise()
    }
    public GetLastSMSDetails(){
        return this._http.get<any>(this.apiUrl + "GetLastSMSDetails");
    }
}