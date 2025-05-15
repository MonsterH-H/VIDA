import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { WeatherForecastComponent } from '../weather-forecast/weather-forecast.component';
import { LogoComponent } from '../logo/logo.component';
import { ThemeService } from '../../services/theme.service';
import { WeatherAlertService } from '../../services/weather-alert.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
    MatBadgeModule,
    LogoComponent
  ]
})
export class AppHeaderComponent implements OnInit {
  darkMode = false;
  unreadNotifications = 0;
  
  constructor(
    private themeService: ThemeService,
    private alertService: WeatherAlertService
  ) { }

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe(isDarkMode => {
      this.darkMode = isDarkMode;
    });

    this.alertService.getUnreadAlertsCount().subscribe((count: number) => {
      this.unreadNotifications = count;
    });
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  createAlert(): void {
    // Implémenter la logique de création d'alerte
    console.log('Création d\'une nouvelle alerte');
  }

  addEvent(): void {
    // Implémenter la logique d'ajout d'événement
    console.log('Ajout d\'un nouvel événement');
  }

  viewNotifications(): void {
    // Implémenter la logique de visualisation des notifications
    console.log('Affichage des notifications');
    // Réinitialiser le compteur de notifications
    this.unreadNotifications = 0;
  }
}
