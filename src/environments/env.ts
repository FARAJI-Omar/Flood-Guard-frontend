export const env = {
  apiBaseUrl: 'http://localhost:8080/api',
  map: {
    tileLayerUrl: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    moroccoGeoJsonUrl: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/MAR.geo.json',
    westernSaharaGeoJsonUrl: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/ESH.geo.json'
  },
  weather: {
    apiUrl: 'https://api.open-meteo.com/v1/forecast'
  }
};
