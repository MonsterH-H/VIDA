import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Farmer } from '../../models/farmer';
import { FarmerService } from '../../services/farmer.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-farmer-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './farmer-list.component.html',
  styleUrls: ['./farmer-list.component.scss']
})
export class FarmerListComponent implements OnInit {
  farmers: Farmer[] = [];
  loading = true;
  error = '';
  isDarkTheme = false;

  constructor(
    private farmerService: FarmerService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.loadFarmers();
    this.themeService.darkMode$.subscribe((isDark: boolean) => {
      this.isDarkTheme = isDark;
      this.applyTheme();
    });
  }

  loadFarmers(): void {
    this.loading = true;
    this.farmerService.getAllFarmers().subscribe({
      next: (data) => {
        this.farmers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des agriculteurs: ' + err.message;
        this.loading = false;
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
  
  private applyTheme(): void {
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  deleteFarmer(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet agriculteur ?')) {
      this.farmerService.deleteFarmer(id).subscribe({
        next: () => {
          this.farmers = this.farmers.filter(farmer => farmer.id !== id);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression: ' + err.message;
        }
      });
    }
  }
}
