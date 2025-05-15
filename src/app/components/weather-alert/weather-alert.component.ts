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
   styleUrls: ['./weather-alert.component.scss'],
    
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