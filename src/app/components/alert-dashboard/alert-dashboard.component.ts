import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-alert-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatTooltipModule,
    RouterModule
  ],
  template: `
    <div class="alert-dashboard" [ngClass]="{'dark-theme': darkMode}">
      <!-- En-tête du tableau de bord -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Tableau de Bord des Alertes</h1>
          <p class="subtitle">Surveillance et gestion des alertes météo</p>
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
              <span>Filtrer par date</span>
            </button>
            <button mat-menu-item>
              <mat-icon>warning</mat-icon>
              <span>Filtrer par gravité</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <!-- Statistiques des alertes -->
      <div class="alert-stats">
        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon critical">
              <mat-icon>warning</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Alertes Critiques</h3>
              <p class="stat-value">12</p>
              <p class="stat-label">aujourd'hui</p>
            </div>
          </div>
          <mat-progress-bar mode="determinate" value="75" color="warn"></mat-progress-bar>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon warning">
              <mat-icon>notifications</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Alertes de Vigilance</h3>
              <p class="stat-value">24</p>
              <p class="stat-label">aujourd'hui</p>
            </div>
          </div>
          <mat-progress-bar mode="determinate" value="45" color="accent"></mat-progress-bar>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon info">
              <mat-icon>info</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Informations</h3>
              <p class="stat-value">8</p>
              <p class="stat-label">aujourd'hui</p>
            </div>
          </div>
          <mat-progress-bar mode="determinate" value="20" color="primary"></mat-progress-bar>
        </mat-card>
      </div>

      <!-- Liste des alertes -->
      <div class="alert-list">
        <mat-card class="alert-card" *ngFor="let alert of alerts">
          <div class="alert-header" [ngClass]="alert.severity">
            <div class="alert-icon">
              <mat-icon>{{getAlertIcon(alert.type)}}</mat-icon>
            </div>
            <div class="alert-title">
              <h3>{{alert.title}}</h3>
              <p class="alert-time">{{alert.time}}</p>
            </div>
            <div class="alert-actions">
              <button mat-icon-button [matMenuTriggerFor]="alertMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #alertMenu="matMenu">
                <button mat-menu-item>
                  <mat-icon>visibility</mat-icon>
                  <span>Voir les détails</span>
                </button>
                <button mat-menu-item>
                  <mat-icon>edit</mat-icon>
                  <span>Modifier</span>
                </button>
                <button mat-menu-item>
                  <mat-icon>delete</mat-icon>
                  <span>Supprimer</span>
                </button>
              </mat-menu>
            </div>
          </div>
          <div class="alert-content">
            <p>{{alert.description}}</p>
            <div class="alert-tags">
              <span class="tag" *ngFor="let tag of alert.tags">{{tag}}</span>
            </div>
          </div>
          <div class="alert-footer">
            <div class="alert-actions">
              <button mat-button color="primary">
                <mat-icon>check_circle</mat-icon>
                <span>Marquer comme lu</span>
              </button>
              <button mat-button color="accent">
                <mat-icon>share</mat-icon>
                <span>Partager</span>
              </button>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .alert-dashboard {
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

    .alert-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
      
      .stat-card {
        background-color: var(--card-background);
        border-radius: 16px;
        padding: 24px;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        .stat-content {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          
          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            
            &.critical {
              background-color: rgba(244, 67, 54, 0.1);
              color: #f44336;
            }
            
            &.warning {
              background-color: rgba(255, 152, 0, 0.1);
              color: #ff9800;
            }
            
            &.info {
              background-color: rgba(33, 150, 243, 0.1);
              color: #2196f3;
            }
            
            mat-icon {
              font-size: 24px;
              width: 24px;
              height: 24px;
            }
          }
          
          .stat-info {
            h3 {
              font-size: 1rem;
              font-weight: 500;
              margin: 0;
              color: var(--text-secondary);
            }
            
            .stat-value {
              font-size: 2rem;
              font-weight: 700;
              margin: 4px 0;
              color: var(--text-primary);
            }
            
            .stat-label {
              font-size: 0.875rem;
              color: var(--text-secondary);
              margin: 0;
            }
          }
        }
      }
    }

    .alert-list {
      display: grid;
      gap: 24px;
      
      .alert-card {
        background-color: var(--card-background);
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        .alert-header {
          display: flex;
          align-items: center;
          padding: 16px;
          gap: 16px;
          
          &.critical {
            background-color: rgba(244, 67, 54, 0.1);
            border-left: 4px solid #f44336;
          }
          
          &.warning {
            background-color: rgba(255, 152, 0, 0.1);
            border-left: 4px solid #ff9800;
          }
          
          &.info {
            background-color: rgba(33, 150, 243, 0.1);
            border-left: 4px solid #2196f3;
          }
          
          .alert-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
            
            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
            }
          }
          
          .alert-title {
            flex: 1;
            
            h3 {
              font-size: 1.125rem;
              font-weight: 600;
              margin: 0;
              color: var(--text-primary);
            }
            
            .alert-time {
              font-size: 0.875rem;
              color: var(--text-secondary);
              margin: 4px 0 0;
            }
          }
          
          .alert-actions {
            button {
              color: var(--text-secondary);
              
              &:hover {
                color: var(--primary-color);
              }
            }
          }
        }
        
        .alert-content {
          padding: 16px;
          
          p {
            margin: 0;
            color: var(--text-primary);
            line-height: 1.5;
          }
          
          .alert-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 16px;
            
            .tag {
              background-color: rgba(33, 150, 243, 0.1);
              color: #2196f3;
              padding: 4px 12px;
              border-radius: 16px;
              font-size: 0.75rem;
              font-weight: 500;
            }
          }
        }
        
        .alert-footer {
          padding: 16px;
          border-top: 1px solid var(--border-color);
          
          .alert-actions {
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
export class AlertDashboardComponent implements OnInit {
  darkMode = false;
  
  alerts = [
    {
      title: 'Alerte de Gel',
      description: 'Températures négatives prévues demain matin pour vos cultures de tomates. Prévoyez une protection contre le gel.',
      time: 'Il y a 2 heures',
      type: 'freeze',
      severity: 'critical',
      tags: ['Gel', 'Tomates', 'Urgent']
    },
    {
      title: 'Vent Fort',
      description: 'Vents forts prévus dans les prochaines 24 heures. Évitez les traitements phytosanitaires.',
      time: 'Il y a 4 heures',
      type: 'wind',
      severity: 'warning',
      tags: ['Vent', 'Traitements']
    },
    {
      title: 'Humidité Élevée',
      description: 'Période d\'humidité élevée prévue. Surveillez les risques de maladies fongiques.',
      time: 'Il y a 6 heures',
      type: 'humidity',
      severity: 'info',
      tags: ['Humidité', 'Maladies']
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getAlertIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'freeze': 'ac_unit',
      'wind': 'air',
      'humidity': 'water_drop',
      'rain': 'water',
      'heat': 'wb_sunny',
      'storm': 'thunderstorm'
    };
    return icons[type] || 'warning';
  }
} 