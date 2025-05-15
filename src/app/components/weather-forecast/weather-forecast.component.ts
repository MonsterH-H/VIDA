import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { FiveDayForecast } from '../../models/weather';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-weather-forecast',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit, OnDestroy {
  forecast: FiveDayForecast | null = null;
  loading = true;
  error: string | null = null;
  darkMode = false;
  selectedLocation = '';
  countryCode: string = 'MA'; // Code du pays par défaut
  loadingFlag = false;
  
  private themeSubscription: Subscription | null = null;

  constructor(
    private weatherService: WeatherService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.darkMode$.subscribe(isDarkMode => {
      this.darkMode = isDarkMode;
    });
    
    this.loadForecast();
  }
  
  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
  
  loadForecast(): void {
    if (!this.selectedLocation.trim()) {
      this.loading = false;
      return;
    }
    // Your existing code here
  }

  // Add the missing getWeatherIcon method
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

  // You might also need to implement getWeatherClass method which is used in the template
  getWeatherClass(weather: string): string {
    const weatherLower = weather.toLowerCase();
    if (weatherLower.includes('sun') || weatherLower.includes('clear')) {
      return 'sunny';
    } else if (weatherLower.includes('cloud') && (weatherLower.includes('part') || weatherLower.includes('few'))) {
      return 'partly-cloudy';
    } else if (weatherLower.includes('cloud')) {
      return 'cloudy';
    } else if (weatherLower.includes('rain') && (weatherLower.includes('heavy') || weatherLower.includes('intense'))) {
      return 'heavy-rain';
    } else if (weatherLower.includes('rain')) {
      return 'rainy';
    } else if (weatherLower.includes('thunder') || weatherLower.includes('storm')) {
      return 'stormy';
    } else if (weatherLower.includes('snow')) {
      return 'snowy';
    } else if (weatherLower.includes('fog') || weatherLower.includes('mist')) {
      return 'foggy';
    }
    return '';
  }

  // You might also need to implement getFlagUrl method which is used in the template
  getFlagUrl(style: string, size: number): string {
    return `https://flagcdn.com/${style}/${this.countryCode.toLowerCase()}.png`;
  }
}
