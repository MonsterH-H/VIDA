import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Farmer, Parcelle } from '../../models/farmer';
import { FarmerService } from '../../services/farmer.service';

@Component({
  selector: 'app-parcelle-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './parcelle-list.component.html',
  styleUrls: ['./parcelle-list.component.scss']
})
export class ParcelleListComponent implements OnInit {
  farmer: Farmer | null = null;
  parcelles: Parcelle[] = [];
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
        this.parcelles = data.parcelles;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'agriculteur: ' + err.message;
        this.loading = false;
      }
    });
  }

  deleteParcelle(parcelleId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette parcelle ?')) {
      this.farmerService.deleteParcelle(this.farmerId, parcelleId).subscribe({
        next: () => {
          this.parcelles = this.parcelles.filter(p => p.id !== parcelleId);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de la parcelle: ' + err.message;
        }
      });
    }
  }
}
