import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from './Constants';

@Injectable({
  providedIn: 'root'
})
export class CustomLoggerService {

  private apiUrl = AppSettings.API_ENDPOINT + "/api/Logging/";

  constructor(private httpClient: HttpClient) {

  }

  /**
   * Override log method to send logs to server
   */
  public logDebug(message: string, ...args: any[]) {
    this.sendLogToServer(message, 'DEBUG');
  }

  public logError(message: string, message1: string, message2: string, ...args: any[]) {
    this.sendLogToServer(message + "  " +  message1 + "  " + message2, 'ERROR');
  }

  private sendLogToServer(message: string, level: string) {
    const logEntry = { message, level };
    this.httpClient.post(this.apiUrl + "FrontEndLogError", logEntry).subscribe(
      response => console.log('Log sent to server:', logEntry),
      error => console.error('Error sending log:', error)
    );
  }
}