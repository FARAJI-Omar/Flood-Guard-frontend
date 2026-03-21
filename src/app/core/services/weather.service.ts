import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { OpenMeteoResponse, CityWeatherData } from '../models/weather.model';
import { getMoroccoCitiesGrid } from '../utils/geo.utils';
import { env } from '../../../environments/env';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);

  getCurrentWeather(): Observable<CityWeatherData[]> {
    const cities = getMoroccoCitiesGrid();
    const lats = cities.map(p => p.lat.toFixed(2)).join(',');
    const lons = cities.map(p => p.lon.toFixed(2)).join(',');
    
    const url = `${env.weather.apiUrl}?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        const dataArr: OpenMeteoResponse[] = Array.isArray(response) ? response : [response];
        return dataArr.map((weatherData, index) => ({
          city: cities[index],
          weather: weatherData
        }));
      })
    );
  }
}
