import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-plot-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatTabsModule,
    MatChipsModule,
    MatDialogModule,
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="plot-management" [ngClass]="{'dark-theme': darkMode}">
      <!-- En-tête du tableau de bord -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Gestion des Parcelles</h1>
          <p class="subtitle">Suivi et optimisation des cultures par parcelle</p>
        </div>
        <div class="header-actions">
          <button mat-icon-button [matMenuTriggerFor]="filterMenu" class="filter-btn">
            <mat-icon>filter_list</mat-icon>
          </button>
          <mat-menu #filterMenu="matMenu">
            <button mat-menu-item>
              <mat-icon>agriculture</mat-icon>
              <span>Filtrer par culture</span>
            </button>
            <button mat-menu-item>
              <mat-icon>calendar_today</mat-icon>
              <span>Filtrer par période</span>
            </button>
            <button mat-menu-item>
              <mat-icon>location_on</mat-icon>
              <span>Filtrer par zone</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <!-- Vue d'ensemble des parcelles -->
      <div class="plots-overview">
        <mat-card class="overview-card">
          <div class="overview-content">
            <div class="overview-icon">
              <mat-icon>grid_view</mat-icon>
            </div>
            <div class="overview-info">
              <h3>Parcelles Actives</h3>
              <p class="overview-value">{{activePlots}}</p>
              <p class="overview-label">sur {{totalPlots}} parcelles</p>
            </div>
          </div>
          <mat-progress-bar mode="determinate" [value]="(activePlots/totalPlots)*100" color="primary"></mat-progress-bar>
        </mat-card>

        <mat-card class="overview-card">
          <div class="overview-content">
            <div class="overview-icon">
              <mat-icon>water_drop</mat-icon>
            </div>
            <div class="overview-info">
              <h3>Irrigation Optimale</h3>
              <p class="overview-value">{{optimalIrrigation}}%</p>
              <p class="overview-label">des parcelles</p>
            </div>
          </div>
          <mat-progress-bar mode="determinate" [value]="optimalIrrigation" color="accent"></mat-progress-bar>
        </mat-card>

        <mat-card class="overview-card">
          <div class="overview-content">
            <div class="overview-icon">
              <mat-icon>eco</mat-icon>
            </div>
            <div class="overview-info">
              <h3>Santé Moyenne</h3>
              <p class="overview-value">{{averageHealth}}%</p>
              <p class="overview-label">des cultures</p>
            </div>
          </div>
          <mat-progress-bar mode="determinate" [value]="averageHealth" color="warn"></mat-progress-bar>
        </mat-card>
      </div>

      <!-- Liste des parcelles -->
      <div class="plots-list">
        <mat-card class="plot-card" *ngFor="let plot of plots">
          <div class="plot-header">
            <div class="plot-icon">
              <mat-icon>{{getPlotIcon(plot.type)}}</mat-icon>
            </div>
            <div class="plot-title">
              <h3>{{plot.name}}</h3>
              <p class="plot-location">{{plot.location}}</p>
            </div>
            <div class="plot-status" [ngClass]="plot.status">
              {{plot.status}}
            </div>
          </div>
          <div class="plot-content">
            <div class="plot-metrics">
              <div class="metric">
                <span class="metric-label">Surface</span>
                <span class="metric-value">{{plot.area}}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Culture</span>
                <span class="metric-value">{{plot.crop}}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Phase</span>
                <span class="metric-value">{{plot.phase}}</span>
              </div>
            </div>
            <div class="plot-sensors">
              <mat-chip-list>
                <mat-chip *ngFor="let sensor of plot.sensors" [color]="sensor.status === 'actif' ? 'primary' : 'warn'">
                  <mat-icon>{{getSensorIcon(sensor.type)}}</mat-icon>
                  {{sensor.name}}
                </mat-chip>
              </mat-chip-list>
            </div>
            <div class="plot-progress">
              <div class="progress-info">
                <span>Progression</span>
                <span>{{plot.progress}}%</span>
              </div>
              <mat-progress-bar mode="determinate" [value]="plot.progress" color="primary"></mat-progress-bar>
            </div>
          </div>
          <div class="plot-footer">
            <div class="plot-actions">
              <button mat-button color="primary">
                <mat-icon>visibility</mat-icon>
                <span>Détails</span>
              </button>
              <button mat-button color="accent">
                <mat-icon>edit</mat-icon>
                <span>Modifier</span>
              </button>
              <button mat-button color="warn">
                <mat-icon>delete</mat-icon>
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .plot-management {
      padding: 24px;
      background-color: var(--background-color);
      min-height: 100vh;
      
      &.dark-theme {
        background-color: var(--background-dark);
      }
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      
      .header-content {
        h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .subtitle {
          color: var(--text-secondary);
          margin: 8px 0 0;
        }
      }
      
      .header-actions {
        .filter-btn {
          background-color: var(--card-background);
          border-radius: 12px;
          padding: 8px;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }

    .plots-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
      
      .overview-card {
        background-color: var(--card-background);
        border-radius: 16px;
        padding: 24px;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        .overview-content {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          
          .overview-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(33, 150, 243, 0.1);
            color: #2196f3;
            
            mat-icon {
              font-size: 24px;
              width: 24px;
              height: 24px;
            }
          }
          
          .overview-info {
            h3 {
              font-size: 1rem;
              font-weight: 500;
              margin: 0;
              color: var(--text-secondary);
            }
            
            .overview-value {
              font-size: 2rem;
              font-weight: 700;
              margin: 4px 0;
              color: var(--text-primary);
            }
            
            .overview-label {
              font-size: 0.875rem;
              color: var(--text-secondary);
              margin: 0;
            }
          }
        }
      }
    }

    .plots-list {
      display: grid;
      gap: 24px;
      
      .plot-card {
        background-color: var(--card-background);
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        .plot-header {
          display: flex;
          align-items: center;
          padding: 16px;
          gap: 16px;
          
          .plot-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(33, 150, 243, 0.1);
            color: #2196f3;
            
            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
            }
          }
          
          .plot-title {
            flex: 1;
            
            h3 {
              font-size: 1.125rem;
              font-weight: 600;
              margin: 0;
              color: var(--text-primary);
            }
            
            .plot-location {
              font-size: 0.875rem;
              color: var(--text-secondary);
              margin: 4px 0 0;
            }
          }
          
          .plot-status {
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 0.75rem;
            font-weight: 500;
            
            &.active {
              background-color: rgba(76, 175, 80, 0.1);
              color: #4caf50;
            }
            
            &.inactive {
              background-color: rgba(158, 158, 158, 0.1);
              color: #9e9e9e;
            }
            
            &.maintenance {
              background-color: rgba(255, 152, 0, 0.1);
              color: #ff9800;
            }
          }
        }
        
        .plot-content {
          padding: 16px;
          
          .plot-metrics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 16px;
            
            .metric {
              text-align: center;
              
              .metric-label {
                display: block;
                font-size: 0.75rem;
                color: var(--text-secondary);
                margin-bottom: 4px;
              }
              
              .metric-value {
                display: block;
                font-size: 1.125rem;
                font-weight: 600;
                color: var(--text-primary);
              }
            }
          }
          
          .plot-sensors {
            margin-bottom: 16px;
            
            mat-chip {
              display: flex;
              align-items: center;
              gap: 8px;
              
              mat-icon {
                font-size: 16px;
                width: 16px;
                height: 16px;
              }
            }
          }
          
          .plot-progress {
            .progress-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              
              span {
                font-size: 0.875rem;
                color: var(--text-secondary);
              }
            }
          }
        }
        
        .plot-footer {
          padding: 16px;
          border-top: 1px solid var(--border-color);
          
          .plot-actions {
            display: flex;
            gap: 16px;
            
            button {
              display: flex;
              align-items: center;
              gap: 8px;
              
              mat-icon {
                font-size: 18px;
                width: 18px;
                height: 18px;
              }
            }
          }
        }
      }
    }
  `]
})
export class PlotManagementComponent implements OnInit {
  darkMode = false;
  
  activePlots = 8;
  totalPlots = 12;
  optimalIrrigation = 75;
  averageHealth = 85;
  
  plots = [
    {
      name: 'Parcelle A1',
      type: 'vegetable',
      location: 'Zone Nord',
      status: 'active',
      area: '0.5 ha',
      crop: 'Tomates',
      phase: 'Floraison',
      progress: 75,
      sensors: [
        { name: 'Humidité', type: 'humidity', status: 'actif' },
        { name: 'Température', type: 'temperature', status: 'actif' },
        { name: 'Luminosité', type: 'light', status: 'inactif' }
      ]
    },
    {
      name: 'Parcelle B2',
      type: 'cereal',
      location: 'Zone Sud',
      status: 'active',
      area: '2 ha',
      crop: 'Blé',
      phase: 'Tallage',
      progress: 60,
      sensors: [
        { name: 'Humidité', type: 'humidity', status: 'actif' },
        { name: 'Température', type: 'temperature', status: 'actif' }
      ]
    },
    {
      name: 'Parcelle C3',
      type: 'cereal',
      location: 'Zone Est',
      status: 'maintenance',
      area: '1.5 ha',
      crop: 'Maïs',
      phase: 'Levée',
      progress: 40,
      sensors: [
        { name: 'Humidité', type: 'humidity', status: 'inactif' },
        { name: 'Température', type: 'temperature', status: 'inactif' }
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getPlotIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'vegetable': 'eco',
      'cereal': 'grass',
      'fruit': 'spa',
      'legume': 'local_florist'
    };
    return icons[type] || 'eco';
  }

  getSensorIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'humidity': 'water_drop',
      'temperature': 'thermostat',
      'light': 'light_mode',
      'soil': 'grass'
    };
    return icons[type] || 'sensors';
  }
} 