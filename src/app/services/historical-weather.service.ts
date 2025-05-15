import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoricalWeatherService {
  private geoUrl = 'http://api.openweathermap.org/geo/1.0/direct';
  private apiKey = 'f3940c105f51ea443fe8d8f04716efe3';

  constructor(private http: HttpClient) { }

  getHistoricalWeather(city: string, date: Date): Observable<any> {
    const dateStr = date.toISOString().split('T')[0];

    return this.http.get<any[]>(`${this.geoUrl}?q=${city}&limit=1&appid=${this.apiKey}`).pipe(
      switchMap(geoData => {
        if (!geoData || geoData.length === 0) {
          throw new Error('Ville non trouvée');
        }

        const { lat, lon, country, name } = geoData[0];
        const meteoUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${dateStr}&end_date=${dateStr}&hourly=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m&timezone=auto`;

        return this.http.get<any>(meteoUrl).pipe(
          map(data => {
            const hourlyData = [];

            for (let i = 0; i < data.hourly.time.length; i++) {
              hourlyData.push({
                time: data.hourly.time[i],
                temp: data.hourly.temperature_2m[i],
                humidity: data.hourly.relative_humidity_2m[i],
                weather_code: data.hourly.weathercode[i],
                wind_speed: data.hourly.windspeed_10m[i]
              });
            }

            return {
              city: name,
              country: country,
              date: dateStr,
              hourly: hourlyData
            };
          })
        );
      }),
      catchError(err => {
        return throwError(() => new Error(
          err.error?.message || 'Impossible de récupérer les données météo'
        ));
      })
    );
  }
}
