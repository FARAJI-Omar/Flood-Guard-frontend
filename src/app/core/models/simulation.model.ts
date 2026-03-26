export interface SimulationRequest {
  rainfallMm: number;
  soilClass: 'A' | 'B' | 'C' | 'D';
  landCover: 'URBAN_DENSE' | 'URBAN_SPARSE' | 'VEGETATION' | 'BARE_SOIL';
  coordinates: [number, number][];
}

export interface SimulationResponse {
  id: number;
  createdAt: string;
  userId: number;
  username: string;
  rainfallMm: number;
  soilClass: 'A' | 'B' | 'C' | 'D';
  landCover: 'URBAN_DENSE' | 'URBAN_SPARSE' | 'VEGETATION' | 'BARE_SOIL';
  cnValue: number;
  runoffMm: number;
  infiltrationMm: number;
  areaKm2: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  resultGeojson: string;
}
