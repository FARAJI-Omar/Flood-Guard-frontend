import type { Feature, MultiPolygon, Polygon, FeatureCollection } from 'geojson';

export type Severity = 'low' | 'moderate' | 'high' | 'critical';

export interface FloodEventProperties {
  id: number;
  name: string;
  eventDate: string;
  severity: Severity;
  areaKm2: number;
  source: string;
}

export type FloodEventFeature = Feature<MultiPolygon | Polygon, FloodEventProperties>;
export type FloodEventCollection = FeatureCollection<MultiPolygon | Polygon, FloodEventProperties>;

export interface CreateFloodEventDto {
  name: string;
  eventDate: string;
  severity: string;
  areaKm2?: number;
  source?: string;
  coordinates: number[][];
}
