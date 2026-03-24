import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-simulation-params',
  imports: [CommonModule, FormsModule],
  templateUrl: './simulation-params.html',
})
export class SimulationParams {
  params = input.required<any>();
  isRunning = input.required<boolean>();
  
  toggleDraw = output<void>();
  clearDraw = output<void>();
  triggerSimulate = output<void>();
  updateParam = output<{ key: string; value: any }>();
  clearAll = output<void>();
  
  isDrawingMode = false;

  soilTypes = [
    { id: 'A', name: 'A', description: 'Sandy or gravelly soils with high water absorption capacity. Water infiltrates rapidly with minimal runoff. Common in coastal dunes and sandy plains.' },
    { id: 'B', name: 'B', description: 'Loamy soils with moderate water absorption. Balanced texture allowing reasonable infiltration. Common in agricultural valleys and moderate terrain.' },
    { id: 'C', name: 'C', description: 'Clay loam soils with slow water absorption. Water infiltrates slowly, generating moderate to high runoff. Common in semi-arid plateaus and compacted areas.' },
    { id: 'D', name: 'D', description: 'Heavy clay or shallow bedrock with very poor drainage. Water infiltrates minimally, producing maximum runoff. Common in impermeable urban areas and rocky terrain.' }
  ];

  landCovers = [
    { id: 'URBAN_DENSE', name: 'Urban Dense' },
    { id: 'URBAN_SPARSE', name: 'Urban Sparse' },
    { id: 'VEGETATION', name: 'Vegetation' },
    { id: 'BARE_SOIL', name: 'Bare Soil' }
  ];

  get currentSoilDescription() {
    const current = this.params().hydrologicSoilType;
    if (!current) return 'Select a soil type to see details.';
    return this.soilTypes.find(t => t.id === current)?.description;
  }

  onUpdateParam(key: string, value: any) {
    this.updateParam.emit({ key, value });
  }

  onToggleDraw() {
    this.isDrawingMode = !this.isDrawingMode;
    if(this.isDrawingMode && this.params().polygon) {
       this.updateParam.emit({ key: 'polygon', value: null });
       this.clearDraw.emit();
    }
    this.toggleDraw.emit();
  }

  runSimulation() {
    const p = this.params();
    if (p.rainfallIntensity && p.hydrologicSoilType && p.landCoverUsage && p.polygon) {
      this.triggerSimulate.emit();
    }
  }

  onClearAll() {
    this.isDrawingMode = false;
    this.clearAll.emit();
  }
}
