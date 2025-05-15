import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WeatherAlertComponent, WeatherAlert } from '../weather-alert/weather-alert.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { WeatherAlertService } from '../../services/weather-alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    WeatherAlertComponent
  ],
  animations: [
    trigger('alertAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ],
  template: `
    <div class="alert-container">
      <mat-card class="alert-header">
        <div class="alert-title">
          <mat-icon class="alert-icon">notifications</mat-icon>
          <h2>Alertes Météo</h2>
        </div>
        <div class="alert-actions">
          <button mat-button color="primary" (click)="markAllAsRead()" 
                  [disabled]="!hasUnreadAlerts()" 
                  matTooltip="Marquer toutes comme lues">
            <mat-icon>done_all</mat-icon>
            Tout marquer comme lu
          </button>
          <button mat-icon-button (click)="refreshAlerts()" matTooltip="Actualiser les alertes">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </mat-card>
      
      <div class="alert-list">
        <div *ngIf="alerts.length === 0" class="no-alerts">
          <mat-icon>notifications_off</mat-icon>
          <p>Aucune alerte météo active</p>
        </div>
        
        <app-weather-alert 
          *ngFor="let alert of visibleAlerts" 
          [@alertAnimation]
          [id]="alert.id"
          [type]="alert.type"
          [title]="alert.title"
          [message]="alert.message"
          [timestamp]="alert.timestamp"
          [location]="alert.location"
          [icon]="alert.icon"
          [dismissed]="alert.dismissed || false"
          (view)="viewAlert($event)"
          (dismiss)="dismissAlert($event)">
        </app-weather-alert>
      </div>
      
      <div class="dismissed-alerts" *ngIf="hasRecentlyDismissed()">
        <mat-divider></mat-divider>
        <div class="dismissed-header">
          <h3>Récemment ignorées</h3>
          <button mat-button (click)="clearDismissed()">Effacer l'historique</button>
        </div>
        
        <app-weather-alert 
          *ngFor="let alert of recentlyDismissed" 
          [@alertAnimation]
          [id]="alert.id"
          [type]="alert.type"
          [title]="alert.title"
          [message]="alert.message"
          [timestamp]="alert.timestamp"
          [location]="alert.location"
          [icon]="alert.icon"
          [dismissed]="true"
          (view)="viewAlert($event)"
          (dismiss)="removeDismissed($event)">
        </app-weather-alert>
      </div>
    </div>
  `,
  styles: [`
    @use 'src/app/styles/variables' as *;
    @use 'src/app/styles/mixins' as *;
    
    .alert-container {
      max-width: 800px;
      margin: 0 auto;
      padding: $spacing-md;
    }
    
    .alert-header {
      @include card-modern;
      margin-bottom: $spacing-md;
      padding: $spacing-md $spacing-lg;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: $spacing-md;
      
      @media (max-width: $breakpoint-sm) {
        flex-direction: column;
        align-items: flex-start;
      }
    }
    
    .alert-title {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      
      h2 {
        margin: 0;
        font-weight: 500;
      }
      
      .alert-icon {
        color: $accent-primary;
        font-size: 28px;
        height: 28px;
        width: 28px;
      }
    }
    
    .alert-actions {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      
      @media (max-width: $breakpoint-sm) {
        width: 100%;
        justify-content: space-between;
      }
    }
    
    .alert-list {
      margin-bottom: $spacing-lg;
    }
    
    .no-alerts {
      @include card-modern;
      padding: $spacing-xl;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: $on-surface-light-medium;
      gap: $spacing-md;
      
      .dark-theme & {
        color: $on-surface-dark-medium;
      }
      
      mat-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        opacity: 0.7;
      }
      
      p {
        font-size: $font-size-lg;
        margin: 0;
      }
    }
    
    .dismissed-alerts {
      margin-top: $spacing-xl;
      
      .dismissed-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: $spacing-md 0;
        
        h3 {
          font-size: $font-size-md;
          font-weight: 500;
          margin: 0;
          color: $on-surface-light-medium;
          
          .dark-theme & {
            color: $on-surface-dark-medium;
          }
        }
      }
    }
  `]
})
export class AlertListComponent implements OnInit, OnDestroy {
  alerts: WeatherAlert[] = [];
  dismissedAlerts: WeatherAlert[] = [];
  
  private alertsSubscription: Subscription | null = null;
  private dismissedAlertsSubscription: Subscription | null = null;
  
  constructor(private alertService: WeatherAlertService) {}
  
  get visibleAlerts(): WeatherAlert[] {
    return this.alerts.filter(alert => !alert.dismissed);
  }
  
  get recentlyDismissed(): WeatherAlert[] {
    // Afficher seulement les 3 dernières alertes ignorées
    return this.dismissedAlerts.slice(0, 3);
  }
  
  ngOnInit() {
    // S'abonner aux alertes du service
    this.alertsSubscription = this.alertService.alerts$.subscribe(alerts => {
      this.alerts = alerts;
    });
    
    // S'abonner aux alertes ignorées du service
    this.dismissedAlertsSubscription = this.alertService.dismissedAlerts$.subscribe(alerts => {
      this.dismissedAlerts = alerts;
    });
  }
  
  ngOnDestroy() {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.alertsSubscription) {
      this.alertsSubscription.unsubscribe();
    }
    
    if (this.dismissedAlertsSubscription) {
      this.dismissedAlertsSubscription.unsubscribe();
    }
  }
  
  hasUnreadAlerts(): boolean {
    return this.visibleAlerts.length > 0;
  }
  
  hasRecentlyDismissed(): boolean {
    return this.dismissedAlerts.length > 0;
  }
  
  viewAlert(id: string) {
    console.log(`Affichage des détails de l'alerte ${id}`);
    // Ici on implémenterait l'ouverture d'un dialogue avec plus d'informations
  }
  
  dismissAlert(id: string) {
    this.alertService.dismissAlert(id);
  }
  
  removeDismissed(id: string) {
    this.alertService.removeDismissedAlert(id);
  }
  
  markAllAsRead() {
    this.alertService.markAllAsRead();
  }
  
  clearDismissed() {
    this.alertService.clearDismissedAlerts();
  }
  
  refreshAlerts() {
    this.alertService.refreshAlerts();
  }
} 