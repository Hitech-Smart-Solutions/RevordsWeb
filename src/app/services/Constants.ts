import * as uuid from "uuid";

export class AppSettings {
    public static API_ENDPOINT = "https://api.dev.revords.com";
    // public static API_ENDPOINT = "https://dashboard.revords.com/liveapi";
    public static DocAPI_ENDPOINT = "/wwwroot/Templates";
    // public static Root_ENDPOINT = "/wwwroot"; 
    
    public static Root_ENDPOINT = "https://s3-us-west-1.amazonaws.com/revords.live.files/";
    public static Approved = 3;
    public static Draft = 1;
    public static Active = true;
    public static Bronze = 1;
    public static Silver = 2;
    public static Gold = 3;
    public static Platinum = 4;
    public static userData: any = JSON.parse(localStorage.getItem('UserData'));
    public static RefreshLocalStorage(){
        this.userData = JSON.parse(localStorage.getItem('UserData'));
    }
    public static GetCreatedBy() {
        this.RefreshLocalStorage();
        return this.userData != null && this.userData.userId != null && this.userData.userId != undefined ? this.userData.userId : 1;
    }
    public static GetLastModifiedBy() {
        this.RefreshLocalStorage();
        return this.userData != null && this.userData.userId != null && this.userData.userId != undefined ? this.userData.userId : 1;
    }
    public static GetDate() {
        return new Date();
    }
    public static NewGUID(): uuid {
        return uuid.v4();
    }
}