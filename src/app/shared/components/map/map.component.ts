import { Component, AfterViewInit, ElementRef, ViewChild, input, output, inject, effect, untracked } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import { MapService } from '../../../core/services/map.service';
import { FloodEventCollection } from '../../../core/models/flood-event.model';

@Component({
  selector: 'app-map',
  template: `
    <div [class]="containerClass()" #mapContainer></div>
  `,
  standalone: true
})
export class MapComponent implements AfterViewInit {
  containerClass = input<string>('w-full h-full min-h-[400px]');
  geoJsonData = input<FloodEventCollection | null>(null);
  interactiveMode = input<boolean>(false);
  isDrawingMode = input<boolean>(false);
  clearDrawTrigger = input<number>(0);
  
  eventClick = output<number>();
  shapeDrawn = output<number[][]>();
  
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLElement>;

  private map: L.Map | undefined;
  private mapService = inject(MapService);
  private dataLayer: L.GeoJSON | null = null;
  
  private drawnItems: L.FeatureGroup | null = null;
  private polygonDrawer: (L.Draw.Polygon & { enable(): void; disable(): void }) | null = null;

  constructor() {
    effect(() => {
      const data = this.geoJsonData();
      const interactive = this.interactiveMode();
      
      if (interactive && data && this.map) {
        untracked(() => {
          this.renderGeoJson(data);
        });
      }
    });

    effect(() => {
      const isDrawing = this.isDrawingMode();
      if (this.map && this.polygonDrawer) {
        untracked(() => {
          if (isDrawing) {
            // Hide previous data layer
            if (this.dataLayer) this.map?.removeLayer(this.dataLayer);
            this.drawnItems?.clearLayers();
            this.polygonDrawer?.enable();
          } else {
            this.polygonDrawer?.disable();
            // Restore previous data layer if available
            if (this.dataLayer) this.dataLayer.addTo(this.map!);
          }
        });
      }
    });

    effect(() => {
      const clearTrigger = this.clearDrawTrigger();
      if (clearTrigger > 0 && this.drawnItems) {
        untracked(() => {
          this.drawnItems?.clearLayers();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    if (!this.interactiveMode()) {
      this.loadBorders();
    }
    // initial render if data already exists
    if (this.interactiveMode() && this.geoJsonData()) {
      this.renderGeoJson(this.geoJsonData()!);
    }
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([28.7917, -9.0926], 5);

    L.tileLayer(this.mapService.getBaseTileLayerUrl(), {
      maxZoom: 15,
      attribution: this.mapService.getBaseTileLayerAttribution()
    }).addTo(this.map);

    // Initialize drawing capabilities
    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    this.polygonDrawer = new L.Draw.Polygon(this.map as any) as L.Draw.Polygon & { enable(): void; disable(): void };

    this.map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      this.drawnItems?.addLayer(layer);
      
      const geoJson = layer.toGeoJSON();
      if (geoJson.geometry && geoJson.geometry.coordinates && geoJson.geometry.coordinates.length > 0) {
        // GeoJSON polygon shell exterior is coordinates[0]
        const coordinates = geoJson.geometry.coordinates[0];
        this.shapeDrawn.emit(coordinates);
      }
    });
  }

  private renderGeoJson(data: FloodEventCollection): void {
    if (!this.map || !data || !data.features || data.features.length === 0) return;

    if (this.dataLayer) {
      this.map.removeLayer(this.dataLayer);
    }

    this.dataLayer = L.geoJSON(data, {
      style: (feature) => {
        const severity = feature?.properties?.severity?.toLowerCase();
        let color = '#3388ff'; // default blue
        if (severity === 'critical') color = '#dc2626'; // red-600
        else if (severity === 'high') color = '#f97316'; // orange-500
        else if (severity === 'moderate') color = '#facc15'; // yellow-400
        else if (severity === 'low') color = '#22c55e'; // green-500

        return {
          color: color,
          weight: 2,
          opacity: 1,
          fillOpacity: 0.4
        };
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        if (props) {
          const tooltipContent = `
            <strong>${props.name}</strong><br>
            Date: ${props.eventDate}<br>
            Severity: <span style="text-transform: uppercase">${props.severity}</span><br>
            Area: ${props.areaKm2} km²
          `;
          layer.bindTooltip(tooltipContent, { className: 'text-sm' });
          layer.on('click', () => {
            this.eventClick.emit(props.id);
          });
        }
      }
    });

    this.dataLayer.addTo(this.map);
    this.map.fitBounds(this.dataLayer.getBounds(), { padding: [50, 50] });
  }

  private loadBorders(): void {
    if (!this.map) return;

    this.mapService.getMoroccoCompleteBorders().subscribe({
      next: (geoJsonData) => {
        const borderLayer = L.geoJSON(geoJsonData, {
          style: {
            color: 'red',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.2 // Keep the map visible underneath
          }
        });

        borderLayer.addTo(this.map!);
        
        // Fit the map to exactly the boundaries of Morocco 
        this.map!.fitBounds(borderLayer.getBounds());
      },
      error: (err) => {
        console.error('Failed to load map borders:', err);
      }
    });
  }
}
