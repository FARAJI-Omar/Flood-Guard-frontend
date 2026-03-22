export interface Alert {
  id: string | number;
  cityName: string;
  precipitation: number;
  threshold: number;
  timestamp: Date | string;
  severity: 'warning' | 'danger' | 'WARNING' | 'DANGER';
  status: 'active' | 'read';
}

export interface AlertsResponse {
  content: Alert[];
  totalElements: number;
  number: number;
  size: number;
  totalPages: number;
}

export interface ThresholdResponse {
  value: number;
}
