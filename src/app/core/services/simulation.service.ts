import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SimulationRequest, SimulationResponse } from '../models/simulation.model';
import { env } from '../../../environments/env';


@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private http = inject(HttpClient);
  private apiUrl =  `${env.apiBaseUrl}/simulations`;

  create(request: SimulationRequest): Observable<SimulationResponse> {
    return this.http.post<SimulationResponse>(this.apiUrl, request);
  }

  getMine(): Observable<SimulationResponse[]> {
    return this.http.get<SimulationResponse[]>(`${this.apiUrl}/my`);
  }

  getHistory(userId?: number): Observable<SimulationResponse[]> {
    let params = new HttpParams();
    if (userId !== undefined) {
      params = params.set('userId', userId.toString());
    }
    return this.http.get<SimulationResponse[]>(`${this.apiUrl}/history`, { params });
  }

  getById(id: number): Observable<SimulationResponse> {
    return this.http.get<SimulationResponse>(`${this.apiUrl}/${id}`);
  }

  // totla simulations
  totalSimulations(): Observable<{count: number}>{
    return this.http.get<any[]>(`${this.apiUrl}/history`).pipe(
        map(simulations => ({ count: simulations.length }))
      );
    }


}
