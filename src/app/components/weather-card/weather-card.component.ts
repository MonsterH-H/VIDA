import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WeatherIconComponent } from '../weather-icons/weather-icons.component';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    WeatherIconComponent
  ],
  template: `
    <div class="weather-card" 
         [ngClass]="{'dark-theme': darkMode, 
                     'animate-rain': animated && weather.condition === 'rainy',
                     'animate-snow': animated && weather.condition === 'snowy',
                     'animate-lightning': animated && weather.condition === 'stormy',
                     'animate-fog': animated && weather.condition === 'foggy'}">
      <div class="card-bg" [style.background-image]="getBackgroundStyle()"></div>
      <div class="card-content">
        <div class="card-header">
          <div class="location">
            <mat-icon class="location-icon">location_on</mat-icon>
            <h2 class="location-name">{{ weather.city }}</h2>
          </div>
          <div class="date">{{ formatDate() }}</div>
        </div>
        
        <div class="card-main">
          <div class="temperature">
            <span class="temp-value">{{ weather.temperature }}</span>
            <span class="temp-unit">°C</span>
          </div>
          
          <div class="weather-icon-wrapper">
            <app-weather-icon [weather]="weather.condition" size="lg" [animated]="animated"></app-weather-icon>
            <div class="weather-description">{{ getWeatherDescription() }}</div>
          </div>
        </div>
        
        <div class="card-details">
          <div class="detail-item">
            <mat-icon>opacity</mat-icon>
            <span class="detail-value">{{ weather.humidity }}%</span>
            <span class="detail-label">Humidité</span>
          </div>
          
          <div class="detail-item">
            <mat-icon>air</mat-icon>
            <span class="detail-value">{{ weather.wind }} km/h</span>
            <span class="detail-label">Vent</span>
          </div>
          
          <div class="detail-item">
            <mat-icon>wb_twilight</mat-icon>
            <span class="detail-value">{{ weather.uvIndex }}</span>
            <span class="detail-label">UV</span>
          </div>
        </div>
        
        <div class="forecast-preview" *ngIf="weather.forecast && weather.forecast.length > 0">
          <div class="preview-item" *ngFor="let day of weather.forecast.slice(0, 3)">
            <div class="preview-day">{{ formatDay(day.date) }}</div>
            <app-weather-icon [weather]="day.condition" size="sm" [animated]="false"></app-weather-icon>
            <div class="preview-temp">
              <span class="high">{{ day.high }}°</span>
              <span class="low">{{ day.low }}°</span>
            </div>
          </div>
        </div>
        
        <div class="card-actions">
          <button mat-button class="action-button" (click)="onViewDetails()" matTooltip="Voir les détails">
            <mat-icon>visibility</mat-icon>
            <span>Détails</span>
          </button>
          
          <button mat-button class="action-button" (click)="onShare()" matTooltip="Partager">
            <mat-icon>share</mat-icon>
            <span>Partager</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'src/app/styles/_variables' as *;
    @use 'src/app/styles/_mixins' as *;
    @use 'src/app/styles/_animations' as animations;
    
    :host {
      display: block;
      width: 100%;
    }
    
    .weather-card {
      @include card-modern;
      position: relative;
      height: 100%;
      min-height: 380px;
      border-radius: $radius-lg;
      overflow: hidden;
      transition: $transition-standard;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: $shadow-lg;
        
        .dark-theme & {
          box-shadow: $shadow-dark-lg;
        }
        
        .card-bg {
          transform: scale(1.05);
        }
      }
    }
    
    .card-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      opacity: 0.12;
      transition: transform 0.5s ease-out;
      z-index: 0;
      
      .dark-theme & {
        opacity: 0.08;
      }
    }
    
    .card-content {
      position: relative;
      z-index: 1;
      padding: $spacing-lg;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: $spacing-lg;
      
      .location {
        display: flex;
        align-items: center;
        
        .location-icon {
          color: $primary;
          margin-right: $spacing-xs;
          
          .dark-theme & {
            color: $primary-light;
          }
        }
        
        .location-name {
          font-size: $font-size-xl;
          font-weight: 600;
          margin: 0;
        }
      }
      
      .date {
        font-size: $font-size-sm;
        color: $on-surface-light-medium;
        
        .dark-theme & {
          color: $on-surface-dark-medium;
        }
      }
    }
    
    .card-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-xl;
      
      .temperature {
        display: flex;
        align-items: baseline;
        
        .temp-value {
          font-size: 3.5rem;
          font-weight: 300;
          line-height: 1;
        }
        
        .temp-unit {
          font-size: 1.5rem;
          margin-left: $spacing-xs;
          color: $on-surface-light-medium;
          
          .dark-theme & {
            color: $on-surface-dark-medium;
          }
        }
      }
      
      .weather-icon-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .weather-description {
          font-size: $font-size-sm;
          color: $on-surface-light-medium;
          margin-top: $spacing-xs;
          text-transform: capitalize;
          
          .dark-theme & {
            color: $on-surface-dark-medium;
          }
        }
      }
    }
    
    .card-details {
      display: flex;
      justify-content: space-between;
      padding: $spacing-md;
      margin-bottom: $spacing-md;
      background: rgba($surface-gray, 0.5);
      border-radius: $radius-md;
      
      .dark-theme & {
        background: rgba($surface-dark-elevated, 0.4);
      }
      
      .detail-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        mat-icon {
          font-size: 20px;
          height: 20px;
          width: 20px;
          color: $primary;
          margin-bottom: $spacing-xs;
          
          .dark-theme & {
            color: $primary-light;
          }
        }
        
        .detail-value {
          font-size: $font-size-base;
          font-weight: 500;
        }
        
        .detail-label {
          font-size: $font-size-xs;
          color: $on-surface-light-medium;
          
          .dark-theme & {
            color: $on-surface-dark-medium;
          }
        }
      }
    }
    
    .forecast-preview {
      display: flex;
      justify-content: space-between;
      margin-bottom: $spacing-lg;
      
      .preview-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .preview-day {
          font-size: $font-size-xs;
          font-weight: 600;
          margin-bottom: $spacing-xs;
        }
        
        .preview-temp {
          display: flex;
          align-items: baseline;
          gap: $spacing-xs;
          
          .high {
            font-weight: 500;
          }
          
          .low {
            color: $on-surface-light-medium;
            font-size: $font-size-xs;
            
            .dark-theme & {
              color: $on-surface-dark-medium;
            }
          }
        }
      }
    }
    
    .card-actions {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      
      .action-button {
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        
        span {
          margin-left: $spacing-xs;
        }
      }
    }
    
    // Variations de couleur basées sur la météo
    .sunny {
      .weather-icon-wrapper {
        color: $sunny-color;
      }
      
      .card-bg {
        background-image: linear-gradient(135deg, rgba(255, 152, 0, 0.4), rgba(255, 193, 7, 0.2));
      }
    }
    
    .cloudy, .partly-cloudy {
      .weather-icon-wrapper {
        color: $cloudy-color;
      }
      
      .card-bg {
        background-image: linear-gradient(135deg, rgba(120, 144, 156, 0.4), rgba(176, 190, 197, 0.2));
      }
    }
    
    .rainy, .heavy-rain {
      .weather-icon-wrapper {
        color: $rainy-color;
      }
      
      .card-bg {
        background-image: linear-gradient(135deg, rgba(41, 182, 246, 0.4), rgba(79, 195, 247, 0.2));
      }
    }
    
    .stormy {
      .weather-icon-wrapper {
        color: $stormy-color;
      }
      
      .card-bg {
        background-image: linear-gradient(135deg, rgba(126, 87, 194, 0.4), rgba(149, 117, 205, 0.2));
      }
    }
    
    .snowy {
      .weather-icon-wrapper {
        color: $snowy-color;
      }
      
      .card-bg {
        background-image: linear-gradient(135deg, rgba(144, 202, 249, 0.4), rgba(187, 222, 251, 0.2));
      }
    }
    
    .foggy {
      .weather-icon-wrapper {
        color: $foggy-color;
      }
      
      .card-bg {
        background-image: linear-gradient(135deg, rgba(176, 190, 197, 0.4), rgba(207, 216, 220, 0.2));
      }
    }
  `]
})
export class WeatherCardComponent implements OnInit {
  @Input() weather: any = {
    city: 'Paris',
    date: new Date(),
    temperature: 22,
    condition: 'sunny',
    humidity: 65,
    wind: 12,
    uvIndex: 5,
    forecast: [
      { date: new Date(Date.now() + 86400000), condition: 'partly-cloudy', high: 24, low: 18 },
      { date: new Date(Date.now() + 172800000), condition: 'rainy', high: 20, low: 17 },
      { date: new Date(Date.now() + 259200000), condition: 'cloudy', high: 22, low: 16 }
    ]
  };
  
  @Input() darkMode: boolean = false;
  @Input() animated: boolean = true;
  
  ngOnInit() {
    // Initialisation si nécessaire
  }
  
  formatDate(): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(this.weather.date).toLocaleDateString('fr-FR', options);
  }
  
  formatDay(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  }
  
  getWeatherDescription(): string {
    const descriptions: {[key: string]: string} = {
      'sunny': 'Ensoleillé',
      'partly-cloudy': 'Partiellement nuageux',
      'cloudy': 'Nuageux',
      'rainy': 'Pluvieux',
      'heavy-rain': 'Fortes pluies',
      'stormy': 'Orageux',
      'snowy': 'Neigeux',
      'foggy': 'Brumeux',
      'windy': 'Venteux'
    };
    
    return descriptions[this.weather.condition] || 'Inconnu';
  }
  
  getBackgroundStyle(): string {
    return `url('assets/weather-patterns/${this.weather.condition}.svg')`;
  }
  
  onViewDetails() {
    // Logique pour afficher les détails
    console.log('Voir les détails pour', this.weather.city);
  }
  
  onShare() {
    // Logique pour partager
    console.log('Partager la météo pour', this.weather.city);
  }
} 