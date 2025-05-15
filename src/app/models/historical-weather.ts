export interface CitySearchResult {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
  }
  
  export interface HistoricalWeatherResponse {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    data: {
      dt: number;
      sunrise: number;
      sunset: number;
      temp: number;
      feels_like: number;
      pressure: number;
      humidity: number;
      dew_point: number;
      uvi: number;
      clouds: number;
      visibility: number;
      wind_speed: number;
      wind_deg: number;
      wind_gust?: number;
      weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
      }[];
      rain?: {
        '1h'?: number;
      };
    }[];
  }
  
  export interface HistoricalWeatherData {
    date: Date;
    location: {
      lat: number;
      lon: number;
      timezone: string;
    };
    timestamp: number;
    temperature: number;
    feels_like: number;
    humidity: number;
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    rain?: number;
    uvi: number;
    clouds: number;
    pressure: number;
    visibility: number;
  }
  
  export interface DateRange {
    start: Date;
    end: Date;
  }