import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';

export interface WeatherAlert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  location: string;
  icon: string;
  dismissed?: boolean;
}

@Component({
  selector: 'app-weather-alert',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatRippleModule
  ],
  template: `
    <div class="alert-card" 
         [class.animate-alert]="type === 'danger' && !dismissed"
         [ngClass]="'alert-' + type"
         [class.dismissed]="dismissed"
         matRipple
         [matRippleDisabled]="dismissed">
      <div class="alert-icon">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <div class="alert-content">
        <div class="alert-header">
          <h3 class="alert-title">{{ title }}</h3>
          <span class="alert-timestamp">{{ formatTimestamp() }}</span>
        </div>
        <p class="alert-message">{{ message }}</p>
        <div class="alert-location" *ngIf="location">
          <mat-icon class="location-icon">location_on</mat-icon>
          <span>{{ location }}</span>
        </div>
      </div>
      <div class="alert-actions">
        <button mat-icon-button (click)="onView($event)" matTooltip="Voir les détails">
          <mat-icon>visibility</mat-icon>
        </button>
        <button mat-icon-button (click)="onDismiss($event)" matTooltip="Ignorer">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @use 'src/app/styles/variables' as *;
    @use 'src/app/styles/mixins' as *;
    
    :host {
      display: block;
      margin: $spacing-md 0;
    }
    
    .alert-card {
      @include card-modern;
      display: flex;
      align-items: stretch;
      padding: 0;
      overflow: hidden;
      border-left-width: 4px;
      transition: $transition-standard;
      
      &:hover {
        transform: translateY(-3px);
      }
      
      &.dismissed {
        opacity: 0.6;
        transform: translateX(100%);
        height: 0;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    }
    
    .alert-icon {
      @include flex-center;
      padding: $spacing-md;
      min-width: 56px;
      
      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }
    
    .alert-content {
      flex: 1;
      padding: $spacing-md $spacing-lg $spacing-md 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .alert-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-xs;
    }
    
    .alert-title {
      font-size: $font-size-lg;
      font-weight: 600;
      margin: 0;
    }
    
    .alert-timestamp {
      font-size: $font-size-xs;
      color: $on-surface-light-medium;
      
      .dark-theme & {
        color: $on-surface-dark-medium;
      }
    }
    
    .alert-message {
      margin: 0 0 $spacing-sm 0;
      font-size: $font-size-sm;
    }
    
    .alert-location {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      font-size: $font-size-xs;
      color: $on-surface-light-medium;
      
      .dark-theme & {
        color: $on-surface-dark-medium;
      }
      
      .location-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
    }
    
    .alert-actions {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 $spacing-sm;
      
      button {
        margin: $spacing-xs 0;
      }
    }
    
    // Types d'alertes
    .alert-warning {
      border-left-color: $accent-warning;
      
      .alert-icon {
        color: $accent-warning;
      }
    }
    
    .alert-danger {
      border-left-color: $accent-alert;
      
      .alert-icon {
        color: $accent-alert;
      }
    }
    
    .alert-info {
      border-left-color: $accent-info;
      
      .alert-icon {
        color: $accent-info;
      }
    }
    
    .alert-success {
      border-left-color: $accent-success;
      
      .alert-icon {
        color: $accent-success;
      }
    }
    
    // Animation d'urgence
    .animate-alert {
      animation: alertPulse 2s infinite;
      
      @keyframes alertPulse {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba($accent-alert, 0.5);
        }
        50% {
          box-shadow: 0 0 10px 0 rgba($accent-alert, 0.8);
        }
      }
    }
  `]
})
export class WeatherAlertComponent implements OnInit {
  @Input() id: string = '';
  @Input() type: 'warning' | 'danger' | 'info' | 'success' = 'info';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() timestamp: Date = new Date();
  @Input() location: string = '';
  @Input() icon: string = 'info';
  @Input() dismissed: boolean = false;
  
  @Output() view = new EventEmitter<string>();
  @Output() dismiss = new EventEmitter<string>();
  
  ngOnInit() {
    // Assignation d'icône par défaut selon le type si non spécifié
    if (!this.icon) {
      switch (this.type) {
        case 'warning':
          this.icon = 'warning_amber';
          break;
        case 'danger':
          this.icon = 'error';
          break;
        case 'success':
          this.icon = 'check_circle';
          break;
        case 'info':
        default:
          this.icon = 'info';
          break;
      }
    }
  }
  
  formatTimestamp(): string {
    const now = new Date();
    const diff = now.getTime() - this.timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) {
      return 'À l\'instant';
    } else if (minutes < 60) {
      return `Il y a ${minutes} min`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `Il y a ${hours} h`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `Il y a ${days} j`;
    }
  }
  
  onView(event: Event) {
    event.stopPropagation();
    this.view.emit(this.id);
  }
  
  onDismiss(event: Event) {
    event.stopPropagation();
    this.dismissed = true;
    setTimeout(() => {
      this.dismiss.emit(this.id);
    }, 300); // Temps pour l'animation avant de signaler au parent
  }
} 