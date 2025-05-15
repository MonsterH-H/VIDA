import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Farmer } from '../../models/farmer';
import { FarmerService } from '../../services/farmer.service';
import { WeatherService } from '../../services/weather.service';
import { AgricultureWeatherData } from '../../models/weather';

@Component({
  selector: 'app-farmer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './farmer-detail.component.html',
  styleUrls: ['./farmer-detail.component.scss']
})
export class FarmerDetailComponent implements OnInit {
  farmer: Farmer | null = null;
  weatherData: AgricultureWeatherData | null = null;
  isNewFarmer = false;
  loading = true;
  error = '';
  errorMessage = '';
  isEditing = false;
  isEditMode = false;
  farmerForm: any = { valid: true, value: {} }; // Objet temporaire en attendant le NgForm

  constructor(
    private farmerService: FarmerService,
    private weatherService: WeatherService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id === 'new') {
      this.isNewFarmer = true;
      this.isEditMode = false;
      this.loading = false;
      this.initNewFarmer();
    } else if (id) {
      this.isEditMode = true;
      this.loadFarmer(id);
    } else {
      this.error = 'ID d\'agriculteur non spécifié';
      this.loading = false;
    }
  }

  initNewFarmer(): void {
    this.farmer = {
      id: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      codePostal: '',
      ville: '',
      pays: 'France',
      dateInscription: new Date(),
      parcelles: [],
      besoins: [],
      preferences: {
        alertesMeteo: true,
        frequenceNotifications: 'quotidienne',
        uniteTemperature: 'celsius',
        culturesPreferees: [],
        languePreferee: 'fr'
      }
    };
    this.isEditing = true;
  }

  loadFarmer(id: string): void {
    this.loading = true;
    this.farmerService.getFarmerById(id).subscribe({
      next: (data) => {
        this.farmer = data;
        this.loadWeatherData();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'agriculteur: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadWeatherData(): void {
    if (this.farmer) {
      this.weatherService.getAgricultureWeatherData(this.farmer.ville, this.farmer.pays).subscribe({
        next: (data) => {
          this.weatherData = data;
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

  saveFarmer(form: NgForm): void {
    this.farmerForm = form;
    if (this.farmerForm.valid) {
      if (this.isEditMode && this.farmer) {
        // Mettre à jour un agriculteur existant
        const updatedFarmer: Farmer = {
          ...this.farmer,
          nom: this.farmerForm.value.nom,
          prenom: this.farmerForm.value.prenom,
          email: this.farmerForm.value.email,
          telephone: this.farmerForm.value.telephone,
          adresse: this.farmerForm.value.adresse,
          codePostal: this.farmerForm.value.codePostal,
          ville: this.farmerForm.value.ville,
          pays: this.farmerForm.value.pays
        };
        
        this.farmerService.updateFarmer(updatedFarmer).subscribe({
          next: (farmer) => {
            this.farmer = farmer;
            this.showSuccessMessage('Agriculteur mis à jour avec succès');
            this.router.navigate(['/farmers']);
          },
          error: (error) => {
            this.errorMessage = 'Erreur lors de la mise à jour de l\'agriculteur';
            console.error(error);
          }
        });
      } else {
        // Créer un nouvel agriculteur
        const newFarmer: Farmer = {
          id: '',  // Sera généré par le service
          nom: this.farmerForm.value.nom,
          prenom: this.farmerForm.value.prenom,
          email: this.farmerForm.value.email,
          telephone: this.farmerForm.value.telephone,
          adresse: this.farmerForm.value.adresse,
          codePostal: this.farmerForm.value.codePostal,
          ville: this.farmerForm.value.ville,
          pays: this.farmerForm.value.pays,
          dateInscription: new Date(),  // Sera définie par le service
          parcelles: [],  // Sera initialisé par le service
          besoins: [],    // Sera initialisé par le service
          preferences: {
            alertesMeteo: true,
            frequenceNotifications: 'quotidienne',
            uniteTemperature: 'celsius',
            culturesPreferees: [],
            languePreferee: 'fr'
          }
        };
        
        this.farmerService.addFarmer(newFarmer).subscribe({
          next: (farmer) => {
            this.showSuccessMessage('Agriculteur créé avec succès');
            this.router.navigate(['/farmers']);
          },
          error: (error) => {
            this.errorMessage = 'Erreur lors de la création de l\'agriculteur';
            console.error(error);
          }
        });
      }
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.farmerForm.controls).forEach(key => {
        const control = this.farmerForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  cancelEdit(): void {
    if (this.isNewFarmer) {
      this.router.navigate(['/farmers']);
    } else {
      this.isEditing = false;
      // Recharger les données pour annuler les modifications
      if (this.farmer) {
        this.loadFarmer(this.farmer.id);
      }
    }
  }
  
  showSuccessMessage(message: string): void {
    // Implémentation temporaire
    console.log(message);
    // Dans une vraie application, vous pourriez utiliser un service de notification
  }

  updatePreferences(): void {
    if (!this.farmer) return;

    this.farmerService.updatePreferences(this.farmer.id, this.farmer.preferences).subscribe({
      next: (preferences) => {
        if (this.farmer) {
          this.farmer.preferences = preferences;
        }
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour des préférences: ' + err.message;
      }
    });
  }
}
