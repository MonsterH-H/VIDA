import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { FarmerService } from '../../services/farmer.service';
import { Farmer } from '../../models/farmer';
import { AgricultureWeatherData } from '../../models/weather';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.scss']
})
export class WeatherDashboardComponent implements OnInit, OnDestroy {
  farmers: Farmer[] = [];
  weatherData: Map<string, AgricultureWeatherData> = new Map();
  loading = true;
  error = '';
  darkMode = false;
  private destroy$ = new Subject<void>();
  
  // Ajout de nouvelles propriétés pour le tableau de bord
  culturesCount: {nom: string, count: number, icon: string}[] = [];
  regionsDistribution = {nord: 0, sud: 0};
  monthlyBesoins: {month: string, irrigation: number, traitement: number}[] = [];

  constructor(
    private weatherService: WeatherService,
    private farmerService: FarmerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadFarmers();
    this.loadThemePreference();
    this.initializeMonthlyData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadThemePreference(): void {
    // Vérifier les préférences de thème dans le localStorage
    const savedTheme = localStorage.getItem('darkMode');
    this.darkMode = savedTheme === 'true';
  }
  
  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode.toString());
  }

  refreshData(): void {
    this.weatherData.clear();
    this.loadFarmers();
  }

  loadFarmers(): void {
    this.loading = true;
    this.farmerService.getAllFarmers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.farmers = data;
          this.loadWeatherData();
          this.calculateCulturesCount();
          this.calculateRegionsDistribution();
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des agriculteurs: ' + err.message;
          this.loading = false;
        }
      });
  }

  loadWeatherData(): void {
    if (this.farmers.length === 0) {
      this.loading = false;
      return;
    }

    let loadedCount = 0;
    const totalCount = this.farmers.length;

    this.farmers.forEach(farmer => {
      // Utiliser la ville de l'agriculteur pour obtenir les données météo
      this.weatherService.getAgricultureWeatherData(farmer.ville, farmer.pays)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            // Ajouter la propriété "feelsLike" si elle n'existe pas
            if (!data.feelsLike && data.temperature) {
              data.feelsLike = data.temperature - Math.random() * 3;
            }
            this.weatherData.set(farmer.id, data);
            loadedCount++;
            if (loadedCount === totalCount) {
              this.loading = false;
            }
          },
          error: (err) => {
            console.error(`Erreur lors du chargement des données météo pour ${farmer.prenom} ${farmer.nom}:`, err);
            loadedCount++;
            if (loadedCount === totalCount) {
              this.loading = false;
            }
          }
        });
    });
  }

  getWeatherForFarmer(farmerId: string): AgricultureWeatherData | undefined {
    return this.weatherData.get(farmerId);
  }

  hasWeatherAlerts(farmerId: string): boolean {
    const weather = this.weatherData.get(farmerId);
    if (!weather || !weather.recommendations) {
      return false;
    }
    return weather.recommendations.length > 0;
  }

  getTotalParcelles(): number {
    return this.farmers.reduce((total, farmer) => total + farmer.parcelles.length, 0);
  }

  getTotalBesoins(): number {
    return this.farmers.reduce((total, farmer) => total + farmer.besoins.length, 0);
  }

  getAverageTemperature(): number {
    if (this.weatherData.size === 0) return 0;
    
    let totalTemp = 0;
    this.weatherData.forEach(data => {
      if (data.temperature) {
        totalTemp += data.temperature;
      }
    });
    
    return totalTemp / this.weatherData.size;
  }
  
  // Nouvelles méthodes pour les fonctionnalités du tableau de bord
  
  initializeMonthlyData(): void {
    // Données fictives pour le graphique des besoins par mois
    this.monthlyBesoins = [
      { month: 'Jan', irrigation: 12, traitement: 8 },
      { month: 'Fév', irrigation: 15, traitement: 10 },
      { month: 'Mar', irrigation: 18, traitement: 6 },
      { month: 'Avr', irrigation: 14, traitement: 9 },
      { month: 'Mai', irrigation: 16, traitement: 11 },
      { month: 'Jui', irrigation: 19, traitement: 7 }
    ];
  }
  
  calculateCulturesCount(): void {
    // Extraction des cultures uniques et compte de leur fréquence
    const cultures = new Map<string, number>();
    
    this.farmers.forEach(farmer => {
      farmer.parcelles.forEach(parcelle => {
        const count = cultures.get(parcelle.culture) || 0;
        cultures.set(parcelle.culture, count + 1);
      });
    });
    
    // Conversion en tableau pour l'affichage
    this.culturesCount = Array.from(cultures.entries())
      .map(([nom, count]) => ({ 
        nom, 
        count, 
        icon: this.getCultureIcon(nom)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 cultures
  }
  
  getCultureIcon(culture: string): string {
    // Attribution d'icônes aux cultures
    const icons: {[key: string]: string} = {
      'Blé': '🌾',
      'Maïs': '🌽',
      'Pommes de terre': '🥔',
      'Tomates': '🍅',
      'Carottes': '🥕',
      'Laitue': '🥬',
      'Oignons': '🧅',
      'Fraises': '🍓',
      'Raisins': '🍇'
    };
    
    return icons[culture] || '🌱'; // Icône par défaut
  }
  
  calculateRegionsDistribution(): void {
    // Répartition simplifiée nord/sud basée sur le code postal
    let nordCount = 0;
    let sudCount = 0;
    
    this.farmers.forEach(farmer => {
      // Simple algorithme de classification basé sur le premier chiffre du code postal
      const codePostal = parseInt(farmer.codePostal);
      if (codePostal < 50000) {
        nordCount++;
      } else {
        sudCount++;
      }
    });
    
    this.regionsDistribution = {
      nord: nordCount,
      sud: sudCount
    };
  }
  
  getParcellesThisMonth(): number {
    // Simuler le nombre de parcelles ajoutées ce mois-ci
    // Dans une application réelle, vous filtreriez par date d'ajout
    return Math.round(this.getTotalParcelles() * 0.3);
  }
  
  getCurrentDate(): Date {
    return new Date();
  }
}
