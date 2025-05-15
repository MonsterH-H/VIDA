import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="weather-icon-container" [ngClass]="iconClass">
      <div class="weather-icon {{ weather | lowercase }}">
        <!-- Éléments spécifiques pour chaque type de météo -->
        <ng-container [ngSwitch]="weather">
          <!-- Sunny -->
          <ng-container *ngSwitchCase="'sunny'">
            <div class="sun"></div>
            <div class="rays" *ngFor="let i of [1,2,3,4,5,6,7,8]"></div>
          </ng-container>
          
          <!-- Partly Cloudy -->
          <ng-container *ngSwitchCase="'partly-cloudy'">
            <div class="sun partly-cloudy-sun"></div>
            <div class="cloud cloud-small"></div>
          </ng-container>
          
          <!-- Cloudy -->
          <ng-container *ngSwitchCase="'cloudy'">
            <div class="cloud"></div>
            <div class="cloud cloud-small"></div>
          </ng-container>
          
          <!-- Rainy -->
          <ng-container *ngSwitchCase="'rainy'">
            <div class="cloud"></div>
            <div class="rain" *ngFor="let i of [1,2,3,4,5]"></div>
          </ng-container>
          
          <!-- Heavy Rain -->
          <ng-container *ngSwitchCase="'heavy-rain'">
            <div class="cloud"></div>
            <div class="rain" *ngFor="let i of [1,2,3,4,5,6,7,8]"></div>
          </ng-container>
          
          <!-- Stormy -->
          <ng-container *ngSwitchCase="'stormy'">
            <div class="cloud"></div>
            <div class="lightning"></div>
          </ng-container>
          
          <!-- Snowy -->
          <ng-container *ngSwitchCase="'snowy'">
            <div class="cloud"></div>
            <div class="snowflake" *ngFor="let i of [1,2,3,4,5]"></div>
          </ng-container>
          
          <!-- Foggy -->
          <ng-container *ngSwitchCase="'foggy'">
            <div class="fog fog-1"></div>
            <div class="fog fog-2"></div>
            <div class="fog fog-3"></div>
          </ng-container>
          
          <!-- Windy -->
          <ng-container *ngSwitchCase="'windy'">
            <div class="wind wind-1"></div>
            <div class="wind wind-2"></div>
            <div class="wind wind-3"></div>
          </ng-container>
          
          <!-- Défaut -->
          <ng-container *ngSwitchDefault>
            <div class="unknown">?</div>
          </ng-container>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    @use 'src/app/styles/variables' as *;
    @use 'src/app/styles/animations' as animations;
    @use 'sass:math';
    
    :host {
      display: block;
    }
    
    .weather-icon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      
      &.size-sm {
        font-size: 0.8em;
      }
      
      &.size-md {
        font-size: 1em;
      }
      
      &.size-lg {
        font-size: 1.5em;
      }
      
      &.size-xl {
        font-size: 2em;
      }
    }
    
    .weather-icon {
      position: relative;
      width: 6em;
      height: 6em;
      border-radius: 50%;
      background-color: transparent;
      overflow: visible;
      
      // Soleil
      .sun {
        position: absolute;
        top: 1.5em;
        left: 1.5em;
        width: 3em;
        height: 3em;
        background: radial-gradient($sunny-color, darken($sunny-color, 10%));
        border-radius: 50%;
        box-shadow: 0 0 0.5em rgba($sunny-color, 0.4);
        animation: animations.sun-pulse 3s infinite ease-in-out;
        
        &.partly-cloudy-sun {
          transform: translate(-0.5em, -0.5em);
          width: 2.5em;
          height: 2.5em;
          opacity: 0.9;
        }
      }
      
      .rays {
        position: absolute;
        top: 3em;
        left: 3em;
        width: 0.2em;
        height: 1.8em;
        background-color: $sunny-color;
        border-radius: 0.1em;
        transform-origin: center bottom;
        box-shadow: 0 0 0.3em rgba($sunny-color, 0.4);
        
        @for $i from 1 through 8 {
          &:nth-child(#{$i + 1}) {
            transform: rotate(#{$i * 45}deg) translateY(-3.5em);
            animation-delay: #{$i * 0.1}s;
          }
        }
      }
      
      // Nuage
      .cloud {
        position: absolute;
        top: 2em;
        left: 1em;
        width: 4em;
        height: 2em;
        background-color: white;
        border-radius: 1em;
        box-shadow: 0 0.2em 0.3em rgba(0, 0, 0, 0.1);
        animation: animations.cloud-drift 5s infinite ease-in-out;
        
        &:before, &:after {
          content: '';
          position: absolute;
          background-color: white;
          border-radius: 50%;
        }
        
        &:before {
          width: 1.8em;
          height: 1.8em;
          top: -1em;
          left: 0.8em;
        }
        
        &:after {
          width: 1.4em;
          height: 1.4em;
          top: -0.6em;
          right: 0.6em;
        }
        
        &.cloud-small {
          top: 1.2em;
          left: 3.2em;
          width: 2.5em;
          height: 1.2em;
          opacity: 0.9;
          animation-delay: 0.5s;
          z-index: 1;
          
          &:before {
            width: 1.3em;
            height: 1.3em;
            top: -0.7em;
            left: 0.4em;
          }
          
          &:after {
            width: 1em;
            height: 1em;
            top: -0.5em;
            right: 0.4em;
          }
        }
        
        .dark-theme & {
          background-color: #e1e1e1;
          
          &:before, &:after {
            background-color: #e1e1e1;
          }
        }
      }
      
      // Pluie
      .rain {
        position: absolute;
        bottom: 0.5em;
        width: 0.1em;
        height: 1.2em;
        background: linear-gradient(to bottom, rgba(#29B6F6, 0.2), #29B6F6);
        border-radius: 0 0 0.1em 0.1em;
        animation: animations.rain-drop 1.5s infinite linear;
        
        @for $i from 1 through 8 {
          &:nth-child(#{$i + 2}) {
            left: #{0.7 + ($i - 1) * 0.5}em;
            height: #{0.9 + math.random() * 0.4}em;
            animation-delay: #{math.random() * 1.5}s;
          }
        }
      }
      
      // Éclair
      .lightning {
        position: absolute;
        bottom: 0;
        left: 2.2em;
        width: 1.6em;
        height: 3em;
        background-color: rgba(255, 255, 255, 0.95);
        clip-path: polygon(
          40% 0%, 100% 50%, 70% 50%, 
          90% 100%, 0% 50%, 30% 50%
        );
        animation: animations.lightning-flash 4s infinite;
        filter: drop-shadow(0 0 0.5em rgba(255, 255, 255, 0.7));
      }
      
      // Neige
      .snowflake {
        position: absolute;
        bottom: 0.5em;
        width: 0.5em;
        height: 0.5em;
        background-color: white;
        border-radius: 50%;
        box-shadow: 0 0 0.1em rgba(255, 255, 255, 0.8);
        animation: animations.snow-fall 3s infinite linear;
        
        @for $i from 1 through 5 {
          &:nth-child(#{$i + 2}) {
            left: #{0.7 + ($i - 1) * 0.8}em;
            width: #{0.4 + math.random() * 0.2}em;
            height: #{0.4 + math.random() * 0.2}em;
            animation-delay: #{math.random() * 3}s;
          }
        }
      }
      
      // Brouillard
      .fog {
        position: absolute;
        height: 0.8em;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 1em;
        animation: animations.fog-pulse 3s infinite ease-in-out;
        
        &.fog-1 {
          top: 2em;
          left: 0.5em;
          width: 5em;
          animation-delay: 0s;
        }
        
        &.fog-2 {
          top: 3.2em;
          left: 1em;
          width: 4em;
          animation-delay: 0.5s;
        }
        
        &.fog-3 {
          top: 4.4em;
          left: 0.8em;
          width: 4.5em;
          animation-delay: 1s;
        }
        
        .dark-theme & {
          background-color: rgba(225, 225, 225, 0.7);
        }
      }
      
      // Vent
      .wind {
        position: absolute;
        height: 0.4em;
        background-color: rgba(150, 180, 210, 0.7);
        border-radius: 0.2em;
        animation: animations.cloud-drift 3s infinite ease-in-out;
        
        &.wind-1 {
          top: 2em;
          left: 1em;
          width: 4em;
          animation-delay: 0s;
        }
        
        &.wind-2 {
          top: 3.2em;
          left: 2em;
          width: 3em;
          animation-delay: 0.3s;
        }
        
        &.wind-3 {
          top: 4.4em;
          left: 1.5em;
          width: 3.5em;
          animation-delay: 0.6s;
        }
      }
      
      // Météo inconnue
      .unknown {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: 3em;
        font-weight: bold;
        color: $on-surface-light-medium;
        
        .dark-theme & {
          color: $on-surface-dark-medium;
        }
      }
    }
  `]
})
export class WeatherIconComponent implements OnInit {
  @Input() weather: string = 'sunny';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() animated: boolean = true;
  
  iconClass: string = '';
  
  ngOnInit() {
    this.iconClass = `size-${this.size}`;
    if (!this.animated) {
      this.iconClass += ' no-animation';
    }
  }
} 