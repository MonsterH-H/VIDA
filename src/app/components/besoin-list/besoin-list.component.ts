import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Farmer, Besoin, TypeBesoin } from '../../models/farmer';
import { FarmerService } from '../../services/farmer.service';

@Component({
  selector: 'app-besoin-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './besoin-list.component.html',
  styleUrls: ['./besoin-list.component.scss']
})
export class BesoinListComponent implements OnInit {
  farmer: Farmer | null = null;
  besoins: Besoin[] = [];
  loading = true;
  error = '';
  farmerId = '';

  constructor(
    private farmerService: FarmerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.farmerId = this.route.snapshot.paramMap.get('id') || '';
    if (this.farmerId) {
      this.loadFarmer();
    } else {
      this.error = 'ID d\'agriculteur non spécifié';
      this.loading = false;
    }
  }

  loadFarmer(): void {
    this.loading = true;
    this.farmerService.getFarmerById(this.farmerId).subscribe({
      next: (data) => {
        this.farmer = data;
        this.besoins = data.besoins;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'agriculteur: ' + err.message;
        this.loading = false;
      }
    });
  }

  deleteBesoin(besoinId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce besoin ?')) {
      this.farmerService.deleteBesoin(this.farmerId, besoinId).subscribe({
        next: () => {
          this.besoins = this.besoins.filter(b => b.id !== besoinId);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression du besoin: ' + err.message;
        }
      });
    }
  }

  getParcelleName(parcelleId: string): string {
    if (!this.farmer || !this.farmer.parcelles) {
      return 'Parcelle inconnue';
    }
    
    const parcelle = this.farmer.parcelles.find(p => p.id === parcelleId);
    return parcelle ? parcelle.nom : 'Parcelle inconnue';
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

  getPrioriteClass(priorite: string): string {
    switch (priorite) {
      case 'haute':
        return 'priority-haute';
      case 'moyenne':
        return 'priority-moyenne';
      case 'faible':
        return 'priority-faible';
      default:
        return '';
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'nouveau':
        return 'status-nouveau';
      case 'en_cours':
        return 'status-en_cours';
      case 'resolu':
        return 'status-resolu';
      default:
        return '';
    }
  }
}
