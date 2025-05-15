import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Weather, Forecast, AgricultureWeatherData, FiveDayForecast, DailyForecast } from '../models/weather';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5';
  private apiKey = 'f3940c105f51ea443fe8d8f04716efe3'; // À remplacer par une vraie clé API

  constructor(private http: HttpClient) { }

  getCurrentWeather(city: string, country?: string): Observable<Weather> {
    let params = new HttpParams()
      .set('q', country ? `${city},${country}` : city)
      .set('units', 'metric')
      .set('appid', this.apiKey);

    return this.http.get<Weather>(`${this.apiUrl}/weather`, { params });
  }

  getWeatherByCoordinates(lat: number, lon: number): Observable<Weather> {
    let params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('units', 'metric')
      .set('appid', this.apiKey);

    return this.http.get<Weather>(`${this.apiUrl}/weather`, { params });
  }

  getForecast(city: string, country?: string): Observable<Forecast> {
    let params = new HttpParams()
      .set('q', country ? `${city},${country}` : city)
      .set('units', 'metric')
      .set('appid', this.apiKey);

    return this.http.get<Forecast>(`${this.apiUrl}/forecast`, { params });
  }

  getForecastByCoordinates(lat: number, lon: number): Observable<Forecast> {
    let params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('units', 'metric')
      .set('appid', this.apiKey);

    return this.http.get<Forecast>(`${this.apiUrl}/forecast`, { params });
  }

  // Méthode spécifique pour les données agricoles
  getAgricultureWeatherData(city: string, country?: string): Observable<AgricultureWeatherData> {
    return this.getCurrentWeather(city, country).pipe(
      map(weather => {
        // Transformation des données météo en données agricoles
        const agricultureData: AgricultureWeatherData = {
          location: weather.name,
          date: new Date(weather.dt * 1000),
          temperature: weather.main.temp,
          humidity: weather.main.humidity,
          precipitation: weather.rain ? (weather.rain['1h'] || weather.rain['3h'] || 0) : 0,
          windSpeed: weather.wind.speed,
          // Valeurs fictives pour les données non disponibles directement via OpenWeatherMap
          soilMoisture: this.calculateSoilMoisture(weather.main.humidity, weather.rain),
          uvIndex: this.calculateUVIndex(weather.clouds.all),
          growingDegreeDays: this.calculateGrowingDegreeDays(weather.main.temp),
          recommendations: this.generateRecommendations(weather)
        };
        return agricultureData;
      })
    );
  }

  // Méthodes utilitaires pour calculer des données agricoles supplémentaires
  private calculateSoilMoisture(humidity: number, rain?: any): number {
    // Calcul simplifié de l'humidité du sol basé sur l'humidité de l'air et les précipitations
    const precipitation = rain ? (rain['1h'] || rain['3h'] || 0) : 0;
    return Math.min(100, humidity * 0.7 + precipitation * 10);
  }

  private calculateUVIndex(cloudCover: number): number {
    // Calcul simplifié de l'indice UV basé sur la couverture nuageuse
    return Math.max(0, 10 - (cloudCover / 10));
  }

  private calculateGrowingDegreeDays(temperature: number): number {
    // Calcul simplifié des degrés-jours de croissance (base 10°C)
    const baseTemperature = 10;
    return Math.max(0, temperature - baseTemperature);
  }

  private generateRecommendations(weather: Weather): string[] {
    const recommendations: string[] = [];
    
    // Recommandations basées sur la température
    if (weather.main.temp > 30) {
      recommendations.push('Risque de stress thermique pour les cultures. Augmentez l\'irrigation.');
    } else if (weather.main.temp < 5) {
      recommendations.push('Risque de gel. Protégez les cultures sensibles.');
    }
    
    // Recommandations basées sur l'humidité
    if (weather.main.humidity > 80) {
      recommendations.push('Humidité élevée. Surveillez les maladies fongiques.');
    } else if (weather.main.humidity < 30) {
      recommendations.push('Humidité faible. Augmentez l\'irrigation.');
    }
    
    // Recommandations basées sur le vent
    if (weather.wind.speed > 10) {
      recommendations.push('Vent fort. Évitez la pulvérisation de produits phytosanitaires.');
    }
    
    // Recommandations basées sur les précipitations
    const precipitation = weather.rain ? (weather.rain['1h'] || weather.rain['3h'] || 0) : 0;
    if (precipitation > 10) {
      recommendations.push('Fortes précipitations. Vérifiez les systèmes de drainage.');
    } else if (precipitation > 0 && precipitation < 2) {
      recommendations.push('Précipitations légères. Complétez avec une irrigation si nécessaire.');
    }
    
    return recommendations;
  }

  // Méthode pour récupérer les prévisions sur 5 jours
  getFiveDayForecast(city: string, country?: string): Observable<FiveDayForecast> {
    return this.getForecast(city, country).pipe(
      map(forecast => {
        const fiveDayForecast: FiveDayForecast = {
          location: forecast.city.name,
          current: {
            temperature: forecast.list[0].main.temp,
            feelsLike: forecast.list[0].main.feels_like,
            weather: forecast.list[0].weather[0].main,
            icon: forecast.list[0].weather[0].icon
          },
          daily: this.processDailyForecasts(forecast)
        };
        return fiveDayForecast;
      })
    );
  }

  // Méthode pour récupérer les prévisions sur 5 jours par coordonnées
  getFiveDayForecastByCoordinates(lat: number, lon: number): Observable<FiveDayForecast> {
    return this.getForecastByCoordinates(lat, lon).pipe(
      map(forecast => {
        const fiveDayForecast: FiveDayForecast = {
          location: forecast.city.name,
          current: {
            temperature: forecast.list[0].main.temp,
            feelsLike: forecast.list[0].main.feels_like,
            weather: forecast.list[0].weather[0].main,
            icon: forecast.list[0].weather[0].icon
          },
          daily: this.processDailyForecasts(forecast)
        };
        return fiveDayForecast;
      })
    );
  }

  // Méthode privée pour traiter les prévisions par jour
  private processDailyForecasts(forecast: Forecast): DailyForecast[] {
    // Organiser les prévisions par jour (OpenWeatherMap renvoie des prévisions toutes les 3 heures)
    const dailyData: { [key: string]: any[] } = {};
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
      
      if (!dailyData[day]) {
        dailyData[day] = [];
      }
      
      dailyData[day].push(item);
    });
    
    // Convertir les données en tableau de DailyForecast
    const days = Object.keys(dailyData).slice(0, 5); // Limiter à 5 jours
    
    return days.map(day => {
      const dayData = dailyData[day];
      const date = new Date(day);
      
      // Calculer les températures min et max pour la journée
      const temperatures = dayData.map(item => item.main.temp);
      const minTemp = Math.min(...temperatures);
      const maxTemp = Math.max(...temperatures);
      
      // Trouver les données de midi (ou les plus proches)
      const midDayData = this.findMidDayForecast(dayData);
      
      // Calculer les précipitations totales pour la journée
      const precipitation = dayData.reduce((total, item) => {
        const rain = item.rain ? item.rain['3h'] || 0 : 0;
        return total + rain;
      }, 0);
      
      // Générer des recommandations basées sur la météo
      const recommendations = this.generateDailyRecommendations(midDayData, minTemp, maxTemp, precipitation);
      
      return {
        date: date,
        day: this.getDayName(date),
        temperature: {
          min: minTemp,
          max: maxTemp,
          day: midDayData.main.temp
        },
        weather: {
          main: midDayData.weather[0].main,
          description: midDayData.weather[0].description,
          icon: midDayData.weather[0].icon
        },
        precipitation: precipitation,
        humidity: midDayData.main.humidity,
        windSpeed: midDayData.wind.speed,
        uv: this.calculateUVIndex(midDayData.clouds.all),
        recommendations: recommendations
      };
    });
  }

  // Trouve les prévisions de midi (ou les plus proches)
  private findMidDayForecast(dayForecasts: any[]): any {
    // Trier les prévisions par proximité à midi
    return dayForecasts.sort((a, b) => {
      const dateA = new Date(a.dt * 1000);
      const dateB = new Date(b.dt * 1000);
      const midDayDiffA = Math.abs(dateA.getHours() - 12);
      const midDayDiffB = Math.abs(dateB.getHours() - 12);
      return midDayDiffA - midDayDiffB;
    })[0];
  }

  // Obtenir le nom du jour
  private getDayName(date: Date): string {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[date.getDay()];
  }

  // Générer des recommandations spécifiques pour la journée
  private generateDailyRecommendations(forecast: any, minTemp: number, maxTemp: number, precipitation: number): string[] {
    const recommendations: string[] = [];
    
    // Recommandations basées sur la température
    if (maxTemp > 30) {
      recommendations.push('Risque de stress thermique. Prévoyez une irrigation supplémentaire.');
    } else if (minTemp < 5) {
      recommendations.push('Risque de gel matinal. Protégez les cultures sensibles.');
    }
    
    // Recommandations basées sur les précipitations
    if (precipitation > 15) {
      recommendations.push('Fortes précipitations prévues. Vérifiez vos systèmes de drainage.');
    } else if (precipitation > 0 && precipitation < 5) {
      recommendations.push('Pluie légère prévue. Adaptez l\'irrigation en conséquence.');
    } else if (precipitation === 0 && maxTemp > 25) {
      recommendations.push('Journée sèche et chaude. Assurez une irrigation suffisante.');
    }
    
    // Recommandations basées sur le vent
    if (forecast.wind.speed > 30) {
      recommendations.push('Vents violents. Évitez les traitements et sécurisez les structures.');
    } else if (forecast.wind.speed > 20) {
      recommendations.push('Vents forts. Report des pulvérisations recommandé.');
    }
    
    // Recommandations basées sur l'humidité
    if (forecast.main.humidity > 85) {
      recommendations.push('Humidité élevée. Risque accru de maladies fongiques.');
    }
    
    // Limiter à 2 recommandations
    return recommendations.slice(0, 2);
  }

  /**
   * Obtient les alertes météo en fonction des prévisions et des conditions actuelles
   * Cette fonction analyse les données météo et génère des alertes pertinentes
   */
  getWeatherAlerts(city: string, country?: string): Observable<any[]> {
    // On combine les données météo actuelles et les prévisions
    return this.getFiveDayForecast(city, country).pipe(
      map(forecast => {
        const alerts = [];
        
        // Extraction des données actuelles
        const currentWeather = forecast.current;
        const location = forecast.location;
        const dailyForecasts = forecast.daily;
        
        // Vérification des conditions actuelles extrêmes
        
        // 1. Alerte de température
        if (currentWeather.temperature > 35) {
          alerts.push({
            id: `temp-high-${Date.now()}`,
            type: 'danger',
            title: 'Alerte Canicule',
            message: `Températures très élevées (${Math.round(currentWeather.temperature)}°C) attendues. Prenez des précautions contre la déshydratation et protégez vos cultures sensibles.`,
            timestamp: new Date(),
            location: location,
            icon: 'thermostat',
            dismissed: false
          });
        } else if (currentWeather.temperature < 0) {
          alerts.push({
            id: `temp-low-${Date.now()}`,
            type: 'warning',
            title: 'Alerte Gel',
            message: `Températures négatives (${Math.round(currentWeather.temperature)}°C). Risque de gel pour les cultures. Prenez des mesures de protection.`,
            timestamp: new Date(),
            location: location,
            icon: 'ac_unit',
            dismissed: false
          });
        }
        
        // 2. Alertes basées sur les prévisions à venir
        if (dailyForecasts && dailyForecasts.length > 0) {
          // Recherche de pluies importantes dans les prochaines 48h
          const heavyRainForecast = dailyForecasts.slice(0, 2).find(day => day.precipitation > 20);
          if (heavyRainForecast) {
            alerts.push({
              id: `rain-heavy-${Date.now()}`,
              type: 'warning',
              title: 'Fortes Précipitations à Venir',
              message: `Précipitations importantes prévues le ${this.formatDate(heavyRainForecast.date)}. Préparez vos systèmes de drainage et évitez la fertilisation.`,
              timestamp: new Date(),
              location: location,
              icon: 'water',
              dismissed: false
            });
          }
          
          // Recherche de vents forts dans les prochaines 48h
          const strongWindForecast = dailyForecasts.slice(0, 2).find(day => day.windSpeed > 50);
          if (strongWindForecast) {
            alerts.push({
              id: `wind-strong-${Date.now()}`,
              type: 'danger',
              title: 'Vents Violents Annoncés',
              message: `Vents forts prévus le ${this.formatDate(strongWindForecast.date)}. Sécurisez les structures et reportez les pulvérisations.`,
              timestamp: new Date(),
              location: location,
              icon: 'air',
              dismissed: false
            });
          }
          
          // Alerte UV élevé
          const highUVForecast = dailyForecasts.slice(0, 3).find(day => day.uv > 8);
          if (highUVForecast) {
            alerts.push({
              id: `uv-high-${Date.now()}`,
              type: 'info',
              title: 'Indice UV Élevé',
              message: `Indice UV élevé prévu le ${this.formatDate(highUVForecast.date)}. Protégez les cultures sensibles et le personnel travaillant en extérieur.`,
              timestamp: new Date(),
              location: location,
              icon: 'wb_sunny',
              dismissed: false
            });
          }
        }
        
        return alerts;
      })
    );
  }
  
  /**
   * Formater une date en format lisible français
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }
}
