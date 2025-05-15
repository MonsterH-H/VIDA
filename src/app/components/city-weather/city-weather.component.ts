import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WeatherService } from '../../services/weather.service';
import { Weather, AgricultureWeatherData, FiveDayForecast } from '../../models/weather';

@Component({
  selector: 'app-city-weather',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './city-weather.component.html',
  styleUrls: ['./city-weather.component.scss']
})
export class CityWeatherComponent implements OnInit {
  cityName: string = '';
  weatherData: Weather | null = null;
  agricultureData: AgricultureWeatherData | null = null;
  forecast: FiveDayForecast | null = null;
  loading: boolean = false;
  forecastLoading: boolean = false;
  error: string = '';
  recentSearches: string[] = [];
  darkMode: boolean = false;
  
  private weatherService = inject(WeatherService);
  private snackBar = inject(MatSnackBar);

  constructor() { }

  ngOnInit(): void {
    // Charger les recherches récentes depuis le stockage local
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      this.recentSearches = JSON.parse(savedSearches);
    }
    
    // Vérifier la préférence de thème
    const savedTheme = localStorage.getItem('darkMode');
    this.darkMode = savedTheme === 'true';
    
    // Charger la météo pour la dernière ville recherchée
    if (this.recentSearches.length > 0) {
      this.cityName = this.recentSearches[0];
      this.searchWeather();
    }
  }

  searchWeather(): void {
    if (!this.cityName.trim()) {
      this.snackBar.open('Veuillez entrer un nom de ville', 'Fermer', {
        duration: 3000,
        panelClass: this.darkMode ? 'dark-snackbar' : ''
      });
      return;
    }

    this.loading = true;
    this.error = '';
    this.forecast = null;

    // Ajouter aux recherches récentes
    if (!this.recentSearches.includes(this.cityName)) {
      this.recentSearches.unshift(this.cityName);
      if (this.recentSearches.length > 5) {
        this.recentSearches.pop();
      }
      localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    }

    // Obtenir les données météo standard
    this.weatherService.getCurrentWeather(this.cityName).subscribe({
      next: (data) => {
        this.weatherData = data;
        
        // Obtenir les données agricoles
        this.weatherService.getAgricultureWeatherData(this.cityName).subscribe({
          next: (agriData) => {
            this.agricultureData = agriData;
            this.loading = false;
          },
          error: (err) => {
            console.error('Erreur lors du chargement des données agricoles:', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.error = 'Impossible de trouver les données météo pour cette ville. Veuillez vérifier l\'orthographe.';
        this.loading = false;
        this.weatherData = null;
        this.agricultureData = null;
      }
    });
  }

  loadForecast(): void {
    if (!this.cityName.trim()) {
      this.snackBar.open('Veuillez d\'abord rechercher une ville', 'Fermer', {
        duration: 3000,
        panelClass: this.darkMode ? 'dark-snackbar' : ''
      });
      return;
    }

    this.forecastLoading = true;
    
    this.weatherService.getFiveDayForecast(this.cityName).subscribe({
      next: (data) => {
        this.forecast = data;
        this.forecastLoading = false;
      },
      error: (err) => {
        this.forecastLoading = false;
        this.snackBar.open('Erreur lors du chargement des prévisions', 'Fermer', {
          duration: 3000,
          panelClass: this.darkMode ? 'dark-snackbar' : ''
        });
        console.error('Erreur de chargement des prévisions', err);
      }
    });
  }

  useRecentSearch(city: string): void {
    this.cityName = city;
    this.searchWeather();
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode.toString());
    document.body.classList.toggle('dark-theme', this.darkMode);
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
  
  getWeatherIcon(icon: string): string {
    const iconMap: { [key: string]: string } = {
      '01d': 'wb_sunny',          // Ciel dégagé (jour)
      '01n': 'nightlight_round',  // Ciel dégagé (nuit)
      '02d': 'partly_cloudy_day', // Quelques nuages (jour)
      '02n': 'nights_stay',       // Quelques nuages (nuit)
      '03d': 'cloud',             // Nuages épars
      '03n': 'cloud',
      '04d': 'cloud',             // Nuages
      '04n': 'cloud',
      '09d': 'grain',             // Averses
      '09n': 'grain',
      '10d': 'rainy',             // Pluie
      '10n': 'rainy',
      '11d': 'thunderstorm',      // Orages
      '11n': 'thunderstorm',
      '13d': 'ac_unit',           // Neige
      '13n': 'ac_unit',
      '50d': 'foggy',             // Brouillard
      '50n': 'foggy'
    };
    
    return iconMap[icon] || 'help_outline';
  }
  
  getWeatherClass(weather: string): string {
    const classes: { [key: string]: string } = {
      'Clear': 'sunny',
      'Clouds': 'cloudy',
      'Rain': 'rainy',
      'Drizzle': 'rainy',
      'Thunderstorm': 'stormy',
      'Snow': 'snowy',
      'Mist': 'foggy',
      'Fog': 'foggy',
      'Haze': 'foggy'
    };
    
    return classes[weather] || '';
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }
  
  getUVClass(index: number | undefined): string {
    if (index === undefined) return '';
    
    if (index < 3) {
      return 'uv-low';
    } else if (index < 6) {
      return 'uv-moderate';
    } else if (index < 8) {
      return 'uv-high';
    } else {
      return 'uv-extreme';
    }
  }
  
  // Nouvelles méthodes ajoutées
  
  getPressureClass(pressure: number): string {
    if (pressure < 1000) {
      return 'pressure-low';
    } else if (pressure > 1020) {
      return 'pressure-high';
    } else {
      return 'pressure-normal';
    }
  }
  
  getMoistureClass(moisture: number): string {
    if (moisture < 30) {
      return 'moisture-dry';
    } else if (moisture > 70) {
      return 'moisture-wet';
    } else {
      return 'moisture-optimal';
    }
  }
  
  getMoistureStatus(moisture: number): string {
    if (moisture < 30) {
      return 'Sol sec - Irrigation recommandée';
    } else if (moisture > 70) {
      return 'Sol humide - Réduire l\'irrigation';
    } else {
      return 'Humidité optimale';
    }
  }
}
