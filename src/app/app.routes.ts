import { Routes } from '@angular/router';
import { FarmerListComponent } from './components/farmer-list/farmer-list.component';
import { FarmerDetailComponent } from './components/farmer-detail/farmer-detail.component';
import { ParcelleListComponent } from './components/parcelle-list/parcelle-list.component';
import { ParcelleDetailComponent } from './components/parcelle-detail/parcelle-detail.component';
import { BesoinListComponent } from './components/besoin-list/besoin-list.component';
import { BesoinDetailComponent } from './components/besoin-detail/besoin-detail.component';
import { WeatherDashboardComponent } from './components/weather-dashboard/weather-dashboard.component';
import { CityWeatherComponent } from './components/city-weather/city-weather.component';
import { AgriculturalDashboardComponent } from './components/agricultural-dashboard/agricultural-dashboard.component';
import { HistoriqueMeteoComponent } from './components/historique-meteo/historique-meteo.component';


export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: WeatherDashboardComponent },
  { path: 'city-weather', component: CityWeatherComponent },
  { path: 'agricultural-dashboard', component: AgriculturalDashboardComponent },
  { path: 'farmers', component: FarmerListComponent },
  { path: 'farmers/:id', component: FarmerDetailComponent },
  { path: 'farmers/:id/parcelles', component: ParcelleListComponent },
  { path: 'farmers/:id/parcelles/:parcelleId', component: ParcelleDetailComponent },
  { path: 'farmers/:id/besoins', component: BesoinListComponent },
  { path: 'farmers/:id/besoins/:besoinId', component: BesoinDetailComponent },
  {path: 'history', component: HistoriqueMeteoComponent},
  { path: '**', redirectTo: 'dashboard' }
];
