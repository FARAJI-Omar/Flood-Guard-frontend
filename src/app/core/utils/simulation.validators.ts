import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class SimulationValidators {
  static validCoordinates(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const coords = control.value;
      if (!Array.isArray(coords) || coords.length < 3) {
        return { invalidCoordinates: 'At least 3 coordinate pairs are required' };
      }

      for (const point of coords) {
        if (!Array.isArray(point) || point.length !== 2) {
          return { invalidCoordinates: 'Each point must be an array of [longitude, latitude]' };
        }
        const [lng, lat] = point;
        if (typeof lng !== 'number' || lng < -180 || lng > 180) {
          return { invalidCoordinates: `Invalid longitude: ${lng}. Must be between -180 and 180.` };
        }
        if (typeof lat !== 'number' || lat < -90 || lat > 90) {
          return { invalidCoordinates: `Invalid latitude: ${lat}. Must be between -90 and 90.` };
        }
      }

      return null;
    };
  }

  static validSoilClass(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const validClasses = ['A', 'B', 'C', 'D'];
      if (!validClasses.includes(value)) {
        return { invalidSoilClass: `Soil class must be one of: ${validClasses.join(', ')}` };
      }
      return null;
    };
  }

  static validLandCover(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const validCovers = ['URBAN_DENSE', 'URBAN_SPARSE', 'VEGETATION', 'BARE_SOIL'];
      if (!validCovers.includes(value)) {
        return { invalidLandCover: `Land cover must be one of: ${validCovers.join(', ')}` };
      }
      return null;
    };
  }
}
