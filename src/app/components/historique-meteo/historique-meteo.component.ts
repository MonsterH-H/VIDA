// 1. Mettre à jour le composant HistoriqueMeteoComponent

import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DatePipe } from '@angular/common';
import { HistoricalWeatherService } from '../../services/historical-weather.service';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

// Enregistrer tous les composants Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-historique-meteo',
  templateUrl: './historique-meteo.component.html',
  styleUrls: ['./historique-meteo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    DatePipe
  ]
})
export class HistoriqueMeteoComponent implements AfterViewInit {
  weatherForm: FormGroup;
  weatherData: any = null;
  loading = false;
  error = '';
  
  // Références pour les canvas des graphiques
  @ViewChild('temperatureChart') temperatureChartRef!: ElementRef;
  @ViewChild('humidityChart') humidityChartRef!: ElementRef;
  @ViewChild('windChart') windChartRef!: ElementRef;
  
  // Instances des graphiques
  tempChart: Chart | null = null;
  humidityChart: Chart | null = null;
  windChart: Chart | null = null;

  constructor(
    private fb: FormBuilder,
    private weatherService: HistoricalWeatherService,
    private snackBar: MatSnackBar
  ) {
    this.weatherForm = this.fb.group({
      city: ['Paris, FR', [Validators.required]],
      date: ['', [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    // On initialise les graphiques si les données sont déjà disponibles
    if (this.weatherData) {
      this.createCharts();
    }
  }

  getWeather() {
    if (this.weatherForm.valid) {
      this.loading = true;
      this.error = '';
      const { city, date } = this.weatherForm.value;

      this.weatherService.getHistoricalWeather(city, date)
        .subscribe({
          next: (data) => {
            this.weatherData = data;
            this.loading = false;
            
            // Attendre le prochain cycle de rendu pour créer les graphiques
            setTimeout(() => {
              this.createCharts();
            }, 0);
          },
          error: (err) => {
            this.error = err.message || 'Erreur lors de la récupération des données';
            this.loading = false;
            this.snackBar.open(this.error, 'OK', { duration: 5000 });
          }
        });
    }
  }

  getWeatherIcon(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  getWeatherDescription(code: number): string {
    const weatherMap: Record<number, string> = {
      0: 'Ciel dégagé',
      1: 'Principalement clair',
      2: 'Partiellement nuageux',
      3: 'Nuageux',
      45: 'Brouillard',
      51: 'Bruine légère',
      53: 'Bruine modérée',
      55: 'Bruine dense',
      56: 'Bruine verglaçante légère',
      57: 'Bruine verglaçante dense',
      61: 'Pluie légère',
      63: 'Pluie modérée',
      65: 'Pluie forte',
      66: 'Pluie verglaçante légère',
      67: 'Pluie verglaçante forte',
      71: 'Chute de neige légère',
      73: 'Chute de neige modérée',
      75: 'Chute de neige forte',
      77: 'Grains de neige',
      80: 'Averses de pluie légères',
      81: 'Averses de pluie modérées',
      82: 'Averses de pluie violentes',
      85: 'Averses de neige légères',
      86: 'Averses de neige fortes',
      95: 'Orage modéré ou fort',
      96: 'Orage avec grêle légère',
      99: 'Orage avec grêle forte'
    };
    return weatherMap[code] || `Code: ${code}`;
  }
  
  getWeatherColor(code: number): string {
    if (code < 3) return '#4FC3F7'; // Dégagé à partiellement nuageux - bleu clair
    if (code < 50) return '#90A4AE'; // Nuageux et brouillard - gris
    if (code < 60) return '#81D4FA'; // Bruine - bleu très clair
    if (code < 70) return '#29B6F6'; // Pluie - bleu
    if (code < 80) return '#E1F5FE'; // Neige - bleu très pâle
    if (code < 90) return '#0288D1'; // Averses - bleu foncé
    return '#FFA000'; // Orage - orange ambré
  }

  createCharts() {
    if (!this.weatherData || !this.weatherData.hourly || this.weatherData.hourly.length === 0) {
      return;
    }
    
    // Extraction des données pour les graphiques
    const times = this.weatherData.hourly.map((h: any) => {
      const date = new Date(h.time);
      return date.getHours() + 'h';
    });
    
    const temps = this.weatherData.hourly.map((h: any) => h.temp);
    const humidity = this.weatherData.hourly.map((h: any) => h.humidity);
    const windSpeed = this.weatherData.hourly.map((h: any) => h.wind_speed);
    const weatherCodes = this.weatherData.hourly.map((h: any) => h.weather_code);
    
    // Création des couleurs pour les points de données selon le code météo
    const pointColors = weatherCodes.map((code: number) => this.getWeatherColor(code));
    
    // Détruire les graphiques existants s'il y en a
    if (this.tempChart) this.tempChart.destroy();
    if (this.humidityChart) this.humidityChart.destroy();
    if (this.windChart) this.windChart.destroy();

    // Créer le graphique de température
    if (this.temperatureChartRef) {
      this.tempChart = new Chart(this.temperatureChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: times,
          datasets: [{
            label: 'Température (°C)',
            data: temps,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: pointColors
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Évolution de la température sur 24h'
            },
            tooltip: {
              callbacks: {
                afterBody: (context) => {
                  const idx = context[0].dataIndex;
                  return this.getWeatherDescription(weatherCodes[idx]);
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Température (°C)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Heure'
              }
            }
          }
        }
      });
    }
    
    // Créer le graphique d'humidité
    if (this.humidityChartRef) {
      this.humidityChart = new Chart(this.humidityChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: times,
          datasets: [{
            label: 'Humidité (%)',
            data: humidity,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Évolution de l\'humidité sur 24h'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Humidité (%)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Heure'
              }
            }
          }
        }
      });
    }
    
    // Créer le graphique de vent
    if (this.windChartRef) {
      this.windChart = new Chart(this.windChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: times,
          datasets: [{
            label: 'Vitesse du vent (km/h)',
            data: windSpeed,
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Vitesse du vent sur 24h'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Vitesse (km/h)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Heure'
              }
            }
          }
        }
      });
    }
  }
  
  // Méthode pour obtenir les données de répartition météo pour le graphique en camembert
  getWeatherDistribution() {
    if (!this.weatherData || !this.weatherData.hourly) return [];
    
    const weatherCountMap = new Map();
    
    // Compter les occurrences de chaque type de météo
    this.weatherData.hourly.forEach((hour: any) => {
      const desc = this.getWeatherDescription(hour.weather_code);
      weatherCountMap.set(desc, (weatherCountMap.get(desc) || 0) + 1);
    });
    
    const result = [];
    for (const [desc, count] of weatherCountMap.entries()) {
      result.push({ description: desc, count });
    }
    
    return result;
  }
}