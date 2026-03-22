import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FloodEventCollection, FloodEventFeature, CreateFloodEventDto } from '../models/flood-event.model';
import { env } from '../../../environments/env';

@Injectable({
  providedIn: 'root'
})
export class FloodEventService {
  private http = inject(HttpClient);
  private apiUrl = env.apiBaseUrl; 

  getFloodEvents(year?: string, severity?: string): Observable<FloodEventCollection> {
    let params = new HttpParams();

    if (year && year !== 'all') {
      params = params.set('year', year);
    }
    
    if (severity && severity !== 'all') {
      params = params.set('severity', severity);
    }

    return this.http.get<FloodEventCollection>(`${this.apiUrl}/floodevents`, { params });
  }

  getFloodEventById(id: number): Observable<FloodEventFeature> {
    return this.http.get<FloodEventFeature>(`${this.apiUrl}/floodevents/${id}`);
  }

  deleteFloodEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/floodevents/${id}`, { responseType: 'text' });
  }

  createFloodEvent(event: CreateFloodEventDto): Observable<FloodEventFeature> {
    return this.http.post<FloodEventFeature>(`${this.apiUrl}/floodevents`, event);
  }

  updateFloodEvent(id: number, event: CreateFloodEventDto): Observable<FloodEventFeature> {
    return this.http.put<FloodEventFeature>(`${this.apiUrl}/floodevents/${id}`, event);
  }
}

