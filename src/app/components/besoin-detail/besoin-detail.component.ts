import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Farmer, Besoin, TypeBesoin, Parcelle } from '../../models/farmer';
import { FarmerService } from '../../services/farmer.service';

@Component({
  selector: 'app-besoin-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './besoin-detail.component.html',
  styleUrls: ['./besoin-detail.component.scss']
})
export class BesoinDetailComponent implements OnInit {
  farmer: Farmer | null = null;
  besoin: Besoin | null = null;
  parcelles: Parcelle[] = [];
  isNewBesoin = false;
  loading = true;
  error = '';
  errorMessage = '';
  isEditing = false;
  isEditMode = false;
  farmerId = '';
  besoinId = '';
  typesBesoins = Object.values(TypeBesoin);
  besoinForm: any = { valid: true, value: {} }; // Objet temporaire en attendant le NgForm

  constructor(
    private farmerService: FarmerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.farmerId = this.route.snapshot.paramMap.get('id') || '';
    this.besoinId = this.route.snapshot.paramMap.get('besoinId') || '';
    
    if (!this.farmerId) {
      this.error = 'ID d\'agriculteur non spécifié';
      this.loading = false;
      return;
    }
    
    if (this.besoinId === 'new') {
      this.isNewBesoin = true;
      this.isEditing = true;
      this.isEditMode = false;
      this.loadFarmer();
    } else if (this.besoinId) {
      this.isEditMode = true;
      this.loadFarmerAndBesoin();
    } else {
      this.error = 'ID de besoin non spécifié';
      this.loading = false;
    }
  }

  loadFarmer(): void {
    this.farmerService.getFarmerById(this.farmerId).subscribe({
      next: (data) => {
        this.farmer = data;
        this.parcelles = data.parcelles;
        if (this.isNewBesoin) {
          this.initNewBesoin();
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'agriculteur: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadFarmerAndBesoin(): void {
    this.loading = true;
    this.farmerService.getFarmerById(this.farmerId).subscribe({
      next: (data) => {
        this.farmer = data;
        this.parcelles = data.parcelles;
        const besoin = data.besoins.find(b => b.id === this.besoinId);
        if (besoin) {
          this.besoin = besoin;
        } else {
          this.error = 'Besoin non trouvé';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'agriculteur: ' + err.message;
        this.loading = false;
      }
    });
  }

  initNewBesoin(): void {
    this.besoin = {
      id: '',
      type: TypeBesoin.CONSEIL,
      description: '',
      dateCreation: new Date(),
      priorite: 'moyenne',
      statut: 'nouveau',
      alerteMeteo: false
    };
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveBesoin(form: NgForm): void {
    this.besoinForm = form;
    if (this.besoinForm.valid) {
      const besoinData: Besoin = {
        id: '',  // Sera généré par le service
        type: this.besoinForm.value.type,
        description: this.besoinForm.value.description,
        dateCreation: new Date(),  // Sera définie par le service
        priorite: this.besoinForm.value.priorite,
        statut: this.besoinForm.value.statut,
        parcelleId: this.besoinForm.value.parcelleId,
        alerteMeteo: this.besoinForm.value.alerteMeteo
      };

      if (this.isEditMode && this.besoin) {
        // Mise à jour d'un besoin existant
        besoinData.id = this.besoin.id;
        besoinData.dateCreation = this.besoin.dateCreation;
        this.farmerService.updateBesoin(this.farmerId, besoinData).subscribe({
          next: (updatedBesoin) => {
            this.showSuccessMessage('Besoin mis à jour avec succès');
            this.router.navigate(['/farmers', this.farmerId, 'besoins']);
          },
          error: (error) => {
            this.errorMessage = `Erreur lors de la mise à jour du besoin: ${error.message}`;
          }
        });
      } else {
        // Création d'un nouveau besoin
        this.farmerService.addBesoin(this.farmerId, besoinData).subscribe({
          next: (newBesoin) => {
            this.showSuccessMessage('Besoin créé avec succès');
            this.router.navigate(['/farmers', this.farmerId, 'besoins']);
          },
          error: (error) => {
            this.errorMessage = `Erreur lors de la création du besoin: ${error.message}`;
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.besoinForm);
    }
  }

  cancelEdit(): void {
    if (this.isNewBesoin) {
      this.router.navigate(['/farmers', this.farmerId, 'besoins']);
    } else {
      this.isEditing = false;
      // Recharger les données pour annuler les modifications
      this.loadFarmerAndBesoin();
    }
  }

  getTypeBesoinLabel(type: string): string {
    switch (type) {
      case TypeBesoin.IRRIGATION:
        return 'Irrigation';
      case TypeBesoin.TRAITEMENT:
        return 'Traitement';
      case TypeBesoin.FERTILISATION:
        return 'Fertilisation';
      case TypeBesoin.RECOLTE:
        return 'Récolte';
      case TypeBesoin.CONSEIL:
        return 'Conseil';
      case TypeBesoin.AUTRE:
        return 'Autre';
      default:
        return type;
    }
  }

  getParcelleNom(parcelleId: string): string {
    const parcelle = this.parcelles.find(p => p.id === parcelleId);
    return parcelle ? parcelle.nom : 'Parcelle inconnue';
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
