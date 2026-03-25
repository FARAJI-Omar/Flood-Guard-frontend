import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, signal, computed, effect } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat'; 
import { WeatherService } from '../../../../core/services/weather.service';
import { WeatherLayer, CityWeatherData } from '../../../../core/models/weather.model';
import { MapService } from '../../../../core/services/map.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-weather-map',
  standalone: true,
  templateUrl: './weather-map.component.html'
})
export class WeatherMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLElement>;
  
  private map: L.Map | undefined;
  private heatLayer: any;
  private labelsLayer = L.layerGroup();
  private weatherService = inject(WeatherService);
  private mapService = inject(MapService);
  private destroy$ = new Subject<void>();

  weatherData = signal<CityWeatherData[]>([]);
  activeLayer = signal<WeatherLayer>('temp');

  heatData = computed(() => {
    const data = this.weatherData();
    const layer = this.activeLayer();

    if (!data || data.length === 0) return [];

    return data.map(d => {
      let intensity = 0;
      if (layer === 'temp') intensity = d.weather.current.temperature_2m;
      else if (layer === 'precip') intensity = d.weather.current.precipitation * 10; 
      else if (layer === 'wind') intensity = d.weather.current.wind_speed_10m;
      else if (layer === 'humidity') intensity = d.weather.current.relative_humidity_2m; 
      return [d.city.lat, d.city.lon, intensity] as [number, number, number];
    });
  });

  constructor() {
    effect(() => this.updateMapVisualization(this.heatData(), this.activeLayer()));
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadBorders();
    this.fetchData();
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([28.7917, -9.0926], 5);

    L.tileLayer(this.mapService.getBaseTileLayerUrl(), {
      maxZoom: 19,
      attribution: this.mapService.getBaseTileLayerAttribution()
    }).addTo(this.map);

    this.labelsLayer.addTo(this.map);
  }

  private loadBorders(): void {
    if (!this.map) return;

    this.mapService.getMoroccoCompleteBorders().subscribe({
      next: (geoJsonData) => {
        L.geoJSON(geoJsonData, {
          style: { color: 'red', weight: 2, opacity: 1, fillOpacity: 0 }
        }).addTo(this.map!);
      }
    });
  }

  private fetchData(): void {
    this.weatherService.getCurrentWeather()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.weatherData.set(response),
        error: (err) => console.error('Failed to fetch weather data:', err)
      });
  }

  private updateMapVisualization(heatPoints: [number, number, number][], layerType: WeatherLayer): void {
    if (!this.map) return;

    if (this.heatLayer) this.map.removeLayer(this.heatLayer);
    this.labelsLayer.clearLayers();

    if (heatPoints.length === 0) return;

    const heatOptions: any = { radius: 45, blur: 30, maxZoom: 8 };

    if (layerType === 'temp') {
      heatOptions.max = 45;
      heatOptions.gradient = {0.2: 'blue', 0.5: 'lime', 0.7: 'yellow', 1.0: 'red'};
    } else if (layerType === 'precip') {
      heatOptions.max = 20; 
      heatOptions.gradient = {0.4: 'cyan', 0.7: 'blue', 1: 'purple'};
    } else if (layerType === 'humidity') {
      heatOptions.max = 100;
      heatOptions.gradient = {0.4: 'yellow', 0.7: 'teal', 1: 'blue'};
    } else if (layerType === 'wind') {
      heatOptions.max = 50; 
      heatOptions.gradient = {0.4: 'white', 0.7: 'cyan', 1: 'magenta'};
    }

    this.heatLayer = (L as any).heatLayer(heatPoints, heatOptions).addTo(this.map);
    this.drawCityLabels(layerType);
  }

  private drawCityLabels(layerType: WeatherLayer): void {
    const data = this.weatherData();
    
    data.forEach(d => {
      let valStr = '';
      if (layerType === 'temp') valStr = `${d.weather.current.temperature_2m}°C`;
      else if (layerType === 'precip') valStr = `${d.weather.current.precipitation}mm`;
      else if (layerType === 'humidity') valStr = `${d.weather.current.relative_humidity_2m}%`;
      else if (layerType === 'wind') valStr = `${d.weather.current.wind_speed_10m}km/h`;

      let iconHtml = `
        <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -50%); text-shadow: 0px 0px 3px black;">
          <span style="color:white; font-weight:800; font-size:12px;">${d.city.name}</span>
          <span style="background:rgba(0,0,0,0.7); color:white; border-radius:4px; padding:2px 6px; font-weight:bold; font-size:11px; margin-top:2px;">
            ${valStr}
          </span>
        </div>
      `;

      if (layerType === 'wind') {
        const dir = d.weather.current.wind_direction_10m;
        iconHtml = `
          <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -50%); text-shadow: 0px 0px 3px black;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" style="transform: rotate(${dir}deg); filter: drop-shadow(0px 0px 2px rgba(0,0,0,1));">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v20m0-20L5 9m7-7l7 7" />
            </svg>
            <span style="color:white; font-weight:800; font-size:11px; margin-top:2px;">${d.city.name}</span>
            <span style="background:rgba(0,0,0,0.7); color:white; border-radius:4px; padding:2px 6px; font-weight:bold; font-size:10px; margin-top:1px;">
              ${valStr}
            </span>
          </div>
        `;
      }

      const icon = L.divIcon({
        html: iconHtml,
        className: 'city-label-icon',
        iconSize: [0, 0]
      });

      L.marker([d.city.lat, d.city.lon], { icon, interactive: false }).addTo(this.labelsLayer);
    });
  }
}
