import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AppSettings } from './Constants';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(private _http: HttpClient, private _Route: Router) {
        // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        // this.currentUser = this.currentUserSubject.asObservable();
    }

    private apiUrl = AppSettings.API_ENDPOINT + "/api/Users/";

    public login(details) {
        return this._http.post<any>(this.apiUrl + "GetUserByUserName", details)
            .pipe(map(user => {
                localStorage.setItem('currentUser', JSON.stringify(user));
                return user;
            }));
    }

    public PutUserAccountInfoInWeb(userData) {
        return this._http.put<any>(this.apiUrl + "PutUserAccountInfoInWeb/", userData)
            .pipe(map(data => {
                return data;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('UserData');
        localStorage.removeItem('selectedBusiness');
        localStorage.removeItem('Business');
        // this.currentUserSubject.next(null);
    }
}
