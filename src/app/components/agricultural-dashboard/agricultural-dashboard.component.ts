import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

interface Crop {
  id: number;
  name: string;
  location: string;
  status: string;
  growth: number;
  health: number;
  yield: number;
  progress: number;
  phase: string;
  age: string;
  area: string;
}

@Component({
  selector: 'app-agricultural-dashboard',
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
    RouterModule,
    NgxChartsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  template: `
    <div class="agricultural-dashboard" [ngClass]="{'dark-theme': darkMode}">
      <!-- En-tête du tableau de bord -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Tableau de Bord Agricole</h1>
          <p class="subtitle">Suivi et analyse des cultures</p>
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
              <span>Filtrer par parcelle</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <!-- Indicateurs clés -->
      <div class="key-indicators">
        <mat-card class="indicator-card">
          <div class="indicator-content">
            <div class="indicator-icon growth">
              <mat-icon>trending_up</mat-icon>
            </div>
            <div class="indicator-info">
              <h3>Indice de Croissance</h3>
              <p class="indicator-value">85%</p>
              <p class="indicator-label">vs objectif</p>
            </div>
          </div>
          <mat-progress-bar mode="determinate" value="85" color="primary"></mat-progress-bar>
        </mat-card>

        <mat-card class="indicator-card">
          <div class="indicator-content">
            <div class="indicator-icon health">
              <mat-icon>favorite</mat-icon>
            </div>
            <div class="indicator-info">
              <h3>Santé des Cultures</h3>
              <p class="indicator-value">92%</p>
              <p class="indicator-label">bonne santé</p>
            </div>
          </div>
          <mat-progress-bar mode="determinate" value="92" color="accent"></mat-progress-bar>
        </mat-card>

        <mat-card class="indicator-card">
          <div class="indicator-content">
            <div class="indicator-icon yield">
              <mat-icon>bar_chart</mat-icon>
            </div>
            <div class="indicator-info">
              <h3>Prévision de Rendement</h3>
              <p class="indicator-value">+12%</p>
              <p class="indicator-label">vs année précédente</p>
            </div>
          </div>
          <mat-progress-bar mode="determinate" value="75" color="warn"></mat-progress-bar>
        </mat-card>
      </div>

      <!-- Graphiques et données -->
      <mat-tab-group class="dashboard-tabs">
        <mat-tab label="Croissance">
          <div class="tab-content">
            <div class="chart-container">
              <ngx-charts-line-chart
                [results]="growthData"
                [gradient]="true"
                [xAxis]="true"
                [yAxis]="true"
                [legend]="true"
                [showXAxisLabel]="true"
                [showYAxisLabel]="true"
                xAxisLabel="Jours"
                yAxisLabel="Croissance"
                [autoScale]="true">
              </ngx-charts-line-chart>
            </div>
          </div>
        </mat-tab>
        
        <mat-tab label="Degrés-Jours">
          <div class="tab-content">
            <div class="chart-container">
              <ngx-charts-bar-vertical
                [results]="degreeDaysData"
                [gradient]="true"
                [xAxis]="true"
                [yAxis]="true"
                [legend]="true"
                [showXAxisLabel]="true"
                [showYAxisLabel]="true"
                xAxisLabel="Semaines"
                yAxisLabel="Degrés-Jours">
              </ngx-charts-bar-vertical>
            </div>
          </div>
        </mat-tab>
        
        <mat-tab label="Rendements">
          <div class="tab-content">
            <div class="chart-container">
              <ngx-charts-pie-chart
                [results]="yieldData"
                [gradient]="true"
                [legend]="true"
                [labels]="true">
              </ngx-charts-pie-chart>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>

      <!-- Liste des cultures -->
      <div class="crops-list">
        <mat-card class="crop-card" *ngFor="let crop of crops">
          <div class="crop-header">
            <div class="crop-icon">
              <mat-icon>{{ getCropIcon(crop.name) }}</mat-icon>
            </div>
            <div class="crop-title">
              <h3>{{ crop.name }}</h3>
              <p class="crop-location">{{ crop.location }}</p>
            </div>
            <div class="crop-status" [ngClass]="crop.status">
              {{crop.status}}
            </div>
          </div>
          <div class="crop-content">
            <div class="crop-metrics">
              <div class="metric">
                <span class="metric-label">Phase</span>
                <span class="metric-value">{{crop.phase}}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Âge</span>
                <span class="metric-value">{{crop.age}}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Surface</span>
                <span class="metric-value">{{crop.area}}</span>
              </div>
            </div>
            <div class="crop-progress">
              <div class="progress-info">
                <span>Progression</span>
                <span>{{crop.progress}}%</span>
              </div>
              <mat-progress-bar mode="determinate" [value]="crop.progress" color="primary"></mat-progress-bar>
            </div>
          </div>
          <div class="crop-footer">
            <div class="crop-actions">
              <button mat-button color="primary">
                <mat-icon>visibility</mat-icon>
                <span>Détails</span>
              </button>
              <button mat-button color="accent">
                <mat-icon>edit</mat-icon>
                <span>Modifier</span>
              </button>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .agricultural-dashboard {
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

    .key-indicators {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
      
      .indicator-card {
        background-color: var(--card-background);
        border-radius: 16px;
        padding: 24px;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        .indicator-content {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          
          .indicator-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            
            &.growth {
              background-color: rgba(33, 150, 243, 0.1);
              color: #2196f3;
            }
            
            &.health {
              background-color: rgba(76, 175, 80, 0.1);
              color: #4caf50;
            }
            
            &.yield {
              background-color: rgba(255, 152, 0, 0.1);
              color: #ff9800;
            }
            
            mat-icon {
              font-size: 24px;
              width: 24px;
              height: 24px;
            }
          }
          
          .indicator-info {
            h3 {
              font-size: 1rem;
              font-weight: 500;
              margin: 0;
              color: var(--text-secondary);
            }
            
            .indicator-value {
              font-size: 2rem;
              font-weight: 700;
              margin: 4px 0;
              color: var(--text-primary);
            }
            
            .indicator-label {
              font-size: 0.875rem;
              color: var(--text-secondary);
              margin: 0;
            }
          }
        }
      }
    }

    .dashboard-tabs {
      margin-bottom: 32px;
      
      .tab-content {
        padding: 24px;
        background-color: var(--card-background);
        border-radius: 16px;
        
        .chart-container {
          height: 400px;
        }
      }
    }

    .crops-list {
      display: grid;
      gap: 24px;
      
      .crop-card {
        background-color: var(--card-background);
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        .crop-header {
          display: flex;
          align-items: center;
          padding: 16px;
          gap: 16px;
          
          .crop-icon {
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
          
          .crop-title {
            flex: 1;
            
            h3 {
              font-size: 1.125rem;
              font-weight: 600;
              margin: 0;
              color: var(--text-primary);
            }
            
            .crop-location {
              font-size: 0.875rem;
              color: var(--text-secondary);
              margin: 4px 0 0;
            }
          }
          
          .crop-status {
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 0.75rem;
            font-weight: 500;
            
            &.excellent {
              background-color: rgba(76, 175, 80, 0.1);
              color: #4caf50;
            }
            
            &.good {
              background-color: rgba(33, 150, 243, 0.1);
              color: #2196f3;
            }
            
            &.warning {
              background-color: rgba(255, 152, 0, 0.1);
              color: #ff9800;
            }
          }
        }
        
        .crop-content {
          padding: 16px;
          
          .crop-metrics {
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
          
          .crop-progress {
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
        
        .crop-footer {
          padding: 16px;
          border-top: 1px solid var(--border-color);
          
          .crop-actions {
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
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AgriculturalDashboardComponent implements OnInit {
  darkMode = false;
  
  growthData = [
    {
      name: 'Croissance',
      series: [
        { name: 'Jan', value: 65 },
        { name: 'Fév', value: 72 },
        { name: 'Mar', value: 78 },
        { name: 'Avr', value: 85 },
        { name: 'Mai', value: 92 }
      ]
    }
  ];
  
  degreeDaysData = [
    {
      name: 'Degrés-Jours',
      value: 1250
    }
  ];
  
  yieldData = [
    {
      name: 'Rendement',
      series: [
        { name: '2020', value: 3.2 },
        { name: '2021', value: 3.5 },
        { name: '2022', value: 3.8 },
        { name: '2023', value: 4.1 }
      ]
    }
  ];
  
  crops: Crop[] = [];
  cropForm: FormGroup;
  isEditing = false;
  selectedCrop: Crop | null = null;

  // Options pour les phases de culture
  phases = [
    'Semis',
    'Levée',
    'Tallage',
    'Montaison',
    'Épiage',
    'Floraison',
    'Maturation',
    'Récolte'
  ];

  constructor(private fb: FormBuilder) {
    this.cropForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      phase: ['', Validators.required],
      age: ['', Validators.required],
      area: ['', Validators.required],
      growth: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      health: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      yield: [0, [Validators.required, Validators.min(0)]],
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    // Charger les cultures existantes depuis le stockage local
    const savedCrops = localStorage.getItem('crops');
    if (savedCrops) {
      this.crops = JSON.parse(savedCrops);
    }
  }

  addCrop(): void {
    this.isEditing = true;
    this.selectedCrop = null;
    this.cropForm.reset();
  }

  editCrop(crop: Crop): void {
    this.isEditing = true;
    this.selectedCrop = crop;
    this.cropForm.patchValue(crop);
  }

  saveCrop(): void {
    if (this.cropForm.valid) {
      const cropData = this.cropForm.value;
      
      if (this.selectedCrop) {
        // Mise à jour d'une culture existante
        const index = this.crops.findIndex(c => c.id === this.selectedCrop?.id);
        if (index !== -1) {
          this.crops[index] = { ...this.crops[index], ...cropData };
        }
      } else {
        // Ajout d'une nouvelle culture
        const newCrop: Crop = {
          id: this.crops.length + 1,
          ...cropData,
          status: this.calculateStatus(cropData.health)
        };
        this.crops.push(newCrop);
      }

      // Sauvegarder dans le stockage local
      localStorage.setItem('crops', JSON.stringify(this.crops));
      
      this.isEditing = false;
      this.selectedCrop = null;
      this.cropForm.reset();
    }
  }

  deleteCrop(crop: Crop): void {
    const index = this.crops.findIndex(c => c.id === crop.id);
    if (index !== -1) {
      this.crops.splice(index, 1);
      localStorage.setItem('crops', JSON.stringify(this.crops));
    }
  }

  calculateStatus(health: number): string {
    if (health >= 80) return 'excellent';
    if (health >= 60) return 'good';
    return 'warning';
  }

  getCropIcon(cropType: string): string {
    switch (cropType.toLowerCase()) {
      case 'blé':
        return 'grass';
      case 'maïs':
        return 'eco';
      case 'orge':
        return 'grain';
      default:
        return 'crop';
    }
  }
} 