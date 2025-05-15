export interface Weather {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Forecast {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      '3h': number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface AgricultureWeatherData {
  location: string;
  date: Date;
  temperature: number;
  feelsLike?: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  soilMoisture?: number;
  uvIndex?: number;
  growingDegreeDays?: number;
  recommendations?: string[];
}

export interface DailyForecast {
  date: Date;
  day: string;
  temperature: {
    min: number;
    max: number;
    day: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  precipitation: number;
  humidity: number;
  windSpeed: number;
  uv: number;
  recommendations?: string[];
}

export interface FiveDayForecast {
  location: string;
  current: {
    temperature: number;
    feelsLike: number;
    weather: string;
    icon: string;
  };
  daily: DailyForecast[];
}
