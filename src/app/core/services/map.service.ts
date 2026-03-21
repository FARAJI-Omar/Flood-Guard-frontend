import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map } from 'rxjs';
import { env } from '../../../environments/env';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private http = inject(HttpClient);

  getBaseTileLayerUrl(): string {
    return env.map.tileLayerUrl;
  }

  getBaseTileLayerAttribution(): string {
    return env.map.attribution;
  }

  getMoroccoCompleteBorders(): Observable<any> {
    return forkJoin({
      morocco: this.http.get<any>(env.map.moroccoGeoJsonUrl),
      sahara: this.http.get<any>(env.map.westernSaharaGeoJsonUrl)
    }).pipe(
      map(({ morocco, sahara }) => ({
        type: 'FeatureCollection',
        features: [
          morocco.type === 'FeatureCollection' ? morocco.features[0] : morocco,
          sahara.type === 'FeatureCollection' ? sahara.features[0] : sahara
        ]
      }))
    );
  }
}
