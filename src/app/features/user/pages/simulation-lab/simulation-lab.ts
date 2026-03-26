import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { SimulationParams } from './components/simulation-params/simulation-params';
import { SimulationResults } from './components/simulation-results/simulation-results';
import * as SimulationsActions from '../../../../core/state/simulations/simulations.actions';
import * as SimulationsSelectors from '../../../../core/state/simulations/simulations.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-simulation-lab',
  standalone: true,
  imports: [CommonModule, MapComponent, SimulationParams, SimulationResults],
  templateUrl: './simulation-lab.html',
})
export class SimulationLab {
  store = inject(Store);

  params = signal<any>({
    rainfallIntensity: 0,
    hydrologicSoilType: 'A',
    landCoverUsage: 'URBAN_DENSE',
    polygon: null,
  });
  isRunning = signal(false);
  progress = signal(0);
  results = signal<any>(null);

  isDrawingMode = false;
  clearDrawTrigger = 0;
  isParamsOpenMobile = false;

  updateParam(key: string, value: any) {
    this.params.update(p => ({ ...p, [key]: value }));
  }

  clearParams() {
    this.params.set({
      rainfallIntensity: 0,
      hydrologicSoilType: 'A',
      landCoverUsage: 'URBAN_DENSE',
      polygon: null,
    });
    this.results.set(null);
    this.clearPolygonDraw();
  }

  private progressInterval: any;
  private mySimulations = toSignal(this.store.select(SimulationsSelectors.selectMySimulations));
  private lastSimulationCount = 0;
  private simulationStartTime = 0;

  constructor() {
    effect(() => {
      const sims = this.mySimulations();
      if (sims && sims.length > this.lastSimulationCount) {
        this.lastSimulationCount = sims.length;
        const latest = sims[0];
        
        const elapsed = Date.now() - this.simulationStartTime;
        const remaining = Math.max(0, 10000 - elapsed);
        
        setTimeout(() => {
          this.results.set({
            scsCurveNumber: latest.cnValue,
            runoffDepth: latest.runoffMm,
            infiltration: latest.infiltrationMm,
            affectedArea: latest.areaKm2,
            riskLevel: latest.riskLevel
          });
          clearInterval(this.progressInterval);
          this.progress.set(100);
          setTimeout(() => {
            this.isRunning.set(false);
          }, 500);
        }, remaining);
      }
    });
  }

  onTriggerSimulate() {
    const p = this.params();
    if (!p.rainfallIntensity || !p.hydrologicSoilType || !p.landCoverUsage || !p.polygon) return;

    this.isRunning.set(true);
    this.progress.set(0);
    this.results.set(null);
    this.simulationStartTime = Date.now();

    // Progress animation -  10 seconds
    let step = 0;
    this.progressInterval = setInterval(() => {
      step += 10;
      this.progress.set(step);
      if (step >= 100) {
        clearInterval(this.progressInterval);
      }
    }, 1000);

    const request = {
      rainfallMm: p.rainfallIntensity,
      soilClass: p.hydrologicSoilType as 'A' | 'B' | 'C' | 'D',
      landCover: p.landCoverUsage as 'URBAN_DENSE' | 'URBAN_SPARSE' | 'VEGETATION' | 'BARE_SOIL',
      coordinates: p.polygon as [number, number][]
    };

    this.store.dispatch(SimulationsActions.createSimulation({ request }));
  }

  onPolygonDrawn(coordinates: number[][]) {
    this.params.update(p => ({ ...p, polygon: coordinates }));
    this.isDrawingMode = false;
  }

  toggleDrawMode() {
    this.isDrawingMode = !this.isDrawingMode;
  }

  clearPolygonDraw() {
    this.clearDrawTrigger++;
  }

  toggleMobileParams() {
    this.isParamsOpenMobile = !this.isParamsOpenMobile;
  }
}
