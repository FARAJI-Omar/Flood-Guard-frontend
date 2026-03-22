import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Alert, AlertsResponse, ThresholdResponse } from '../models/alert.model';
import { env } from '../../../environments/env';


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private http = inject(HttpClient);
  private apiUrl = env.apiBaseUrl + '/alerts';

  getThreshold(): Observable<number> {
    return this.http.get<ThresholdResponse>(`${this.apiUrl}/threshold`).pipe(
      map(response => response.value)
    );
  }

  updateThreshold(threshold: number): Observable<number> {
    return this.http.put<ThresholdResponse>(`${this.apiUrl}/threshold`, { value: threshold }).pipe(
      map(response => response.value)
    );
  }

  getAlerts(page: number = 0, pageSize: number = 10): Observable<AlertsResponse> {
    return this.http.get<AlertsResponse>(`${this.apiUrl}?page=${page}&size=${pageSize}`);
  }

  saveAlert(alert: Partial<Alert>): Observable<Alert> {
    return this.http.post<Alert>(this.apiUrl, alert);
  }
}
