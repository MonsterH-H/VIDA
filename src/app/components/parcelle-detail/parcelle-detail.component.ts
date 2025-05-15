import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Farmer, Parcelle } from '../../models/farmer';
import { FarmerService } from '../../services/farmer.service';
import { WeatherService } from '../../services/weather.service';
import { AgricultureWeatherData } from '../../models/weather';

@Component({
  selector: 'app-parcelle-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './parcelle-detail.component.html',
  styleUrls: ['./parcelle-detail.component.scss']
})
export class ParcelleDetailComponent implements OnInit {
  farmer: Farmer | null = null;
  parcelle: Parcelle | null = null;
  weatherData: AgricultureWeatherData | null = null;
  isNewParcelle = false;
  loading = true;
  error = '';
  errorMessage = '';
  isEditing = false;
  isEditMode = false;
  farmerId = '';
  parcelleId = '';
  parcelleForm: any = { valid: true, value: {} }; // Objet temporaire en attendant le NgForm

  constructor(
    private farmerService: FarmerService,
    private weatherService: WeatherService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.farmerId = this.route.snapshot.paramMap.get('id') || '';
    this.parcelleId = this.route.snapshot.paramMap.get('parcelleId') || '';
    
    if (!this.farmerId) {
      this.error = 'ID d\'agriculteur non spécifié';
      this.loading = false;
      return;
    }
    
    if (this.parcelleId === 'new') {
      this.isNewParcelle = true;
      this.isEditing = true;
      this.isEditMode = false;
      this.loadFarmer();
    } else if (this.parcelleId) {
      this.isEditMode = true;
      this.loadFarmerAndParcelle();
    } else {
      this.error = 'ID de parcelle non spécifié';
      this.loading = false;
    }
  }

  loadFarmer(): void {
    this.farmerService.getFarmerById(this.farmerId).subscribe({
      next: (data) => {
        this.farmer = data;
        if (this.isNewParcelle) {
          this.initNewParcelle();
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'agriculteur: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadFarmerAndParcelle(): void {
    this.loading = true;
    this.farmerService.getFarmerById(this.farmerId).subscribe({
      next: (data) => {
        this.farmer = data;
        const parcelle = data.parcelles.find(p => p.id === this.parcelleId);
        if (parcelle) {
          this.parcelle = parcelle;
          this.loadWeatherData();
        } else {
          this.error = 'Parcelle non trouvée';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'agriculteur: ' + err.message;
        this.loading = false;
      }
    });
  }

  initNewParcelle(): void {
    const today = new Date();
    const harvestDate = new Date();
    harvestDate.setMonth(today.getMonth() + 4); // Estimation de 4 mois pour la récolte
    
    this.parcelle = {
      id: '',
      nom: '',
      superficie: 0,
      culture: '',
      datePlantation: today,
      dateRecolteEstimee: harvestDate,
      coordonnees: {
        latitude: 0,
        longitude: 0
      },
      typeSol: '',
      irrigation: false,
      historiqueCultures: []
    };
  }

  loadWeatherData(): void {
    if (this.parcelle && this.parcelle.coordonnees && this.parcelle.coordonnees.latitude && this.parcelle.coordonnees.longitude) {
      this.weatherService.getWeatherByCoordinates(
        this.parcelle.coordonnees.latitude,
        this.parcelle.coordonnees.longitude
      ).subscribe({
        next: (data) => {
          // Convertir les données météo standard en données agricoles
          this.weatherService.getAgricultureWeatherData(data.name).subscribe({
            next: (agriData) => {
              this.weatherData = agriData;
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors du chargement des données météo:', err);
        }
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveParcelle(form: NgForm): void {
    this.parcelleForm = form;
    if (this.parcelleForm.valid) {
      const parcelleData: Parcelle = {
        id: this.isEditMode && this.parcelle ? this.parcelle.id : '',
        nom: this.parcelleForm.value.nom,
        superficie: this.parcelleForm.value.superficie,
        culture: this.parcelleForm.value.culture,
        datePlantation: this.parcelleForm.value.datePlantation,
        dateRecolteEstimee: this.parcelleForm.value.dateRecolteEstimee,
        coordonnees: {
          latitude: this.parcelleForm.value.latitude,
          longitude: this.parcelleForm.value.longitude
        },
        typeSol: this.parcelleForm.value.typeSol,
        irrigation: this.parcelleForm.value.irrigation,
        historiqueCultures: this.parcelleForm.value.historiqueCultures?.split(',').map((c: string) => c.trim()) || []
      };

      if (this.isEditMode && this.parcelle) {
        // Mise à jour d'une parcelle existante
        this.farmerService.updateParcelle(this.farmerId, parcelleData).subscribe({
          next: (updatedParcelle) => {
            this.showSuccessMessage('Parcelle mise à jour avec succès');
            this.router.navigate(['/farmers', this.farmerId, 'parcelles']);
          },
          error: (error) => {
            this.errorMessage = `Erreur lors de la mise à jour de la parcelle: ${error.message}`;
          }
        });
      } else {
        // Création d'une nouvelle parcelle
        this.farmerService.addParcelle(this.farmerId, parcelleData).subscribe({
          next: (newParcelle) => {
            this.showSuccessMessage('Parcelle créée avec succès');
            this.router.navigate(['/farmers', this.farmerId, 'parcelles']);
          },
          error: (error) => {
            this.errorMessage = `Erreur lors de la création de la parcelle: ${error.message}`;
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.parcelleForm);
    }
  }

  cancelEdit(): void {
    if (this.isNewParcelle) {
      this.router.navigate(['/farmers', this.farmerId, 'parcelles']);
    } else {
      this.isEditing = false;
      // Recharger les données pour annuler les modifications
      this.loadFarmerAndParcelle();
    }
  }

  addHistoriqueCulture(culture: string): void {
    if (!this.parcelle) return;
    
    if (!this.parcelle.historiqueCultures) {
      this.parcelle.historiqueCultures = [];
    }
    
    if (culture && !this.parcelle.historiqueCultures.includes(culture)) {
      this.parcelle.historiqueCultures.push(culture);
    }
  }

  removeHistoriqueCulture(culture: string): void {
    if (!this.parcelle || !this.parcelle.historiqueCultures) return;
    
    this.parcelle.historiqueCultures = this.parcelle.historiqueCultures.filter(c => c !== culture);
  }
  
  showSuccessMessage(message: string): void {
    // Implémentation temporaire
    console.log(message);
    // Dans une vraie application, vous pourriez utiliser un service de notification
  }
  
  markFormGroupTouched(form: any): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
    });
  }
}
