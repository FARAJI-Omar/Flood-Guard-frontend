export interface CityCoord {
  name: string;
  lat: number;
  lon: number;
}

/**
 * Returns a list of major Moroccan cities 
 */
export function getMoroccoCitiesGrid(): CityCoord[] {
  return [
    { name: 'Tangier', lat: 35.7595, lon: -5.8340 },
    { name: 'Al Hoceima', lat: 35.2517, lon: -3.9317 },
    { name: 'Nador', lat: 35.1681, lon: -2.9333 },
    { name: 'Oujda', lat: 34.6867, lon: -1.9114 },
    { name: 'Rabat', lat: 34.0209, lon: -6.8416 },
    { name: 'Casablanca', lat: 33.5731, lon: -7.5898 },
    { name: 'Fes', lat: 34.0331, lon: -5.0003 },
    { name: 'Marrakech', lat: 31.6295, lon: -7.9811 },
    { name: 'Errachidia', lat: 31.9314, lon: -4.4244 },
    { name: 'Agadir', lat: 30.4202, lon: -9.5982 },
    { name: 'Guelmim', lat: 28.9869, lon: -10.0573 },
    { name: 'Tan-Tan', lat: 28.4380, lon: -11.1032 },
    { name: 'Laayoune', lat: 27.1418, lon: -13.1932 },
    { name: 'Smara', lat: 26.7384, lon: -11.6719 },
    { name: 'Boujdour', lat: 26.1257, lon: -14.4828 },
    { name: 'Dakhla', lat: 23.7196, lon: -15.9388 },
    { name: 'Lagouira', lat: 20.8355, lon: -17.0851 }
  ];
}
