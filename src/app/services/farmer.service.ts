import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Farmer, Parcelle, Besoin, TypeBesoin } from '../models/farmer';
import { v4 as uuidv4 } from 'uuid';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FarmerService {
  // Pour cette démo, nous utilisons un stockage local
  private farmers: Farmer[] = [];
  private readonly STORAGE_KEY = 'farmers';
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadFarmers();
  }

  // Charger les agriculteurs depuis le stockage local
  private loadFarmers(): void {
    if (!this.isBrowser) {
      // Données par défaut pour le SSR
      this.farmers = this.getDefaultFarmers();
      return;
    }

    const storedFarmers = localStorage.getItem(this.STORAGE_KEY);
    if (storedFarmers) {
      this.farmers = JSON.parse(storedFarmers, (key, value) => {
        if (key === 'dateInscription' || key === 'datePlantation' || key === 'dateRecolteEstimee' || key === 'dateCreation') {
          return new Date(value);
        }
        return value;
      });
    } else {
      // Données de démonstration si aucune donnée n'est stockée
      this.farmers = this.getDefaultFarmers();
      this.saveFarmers();
    }
  }

  // Sauvegarder les agriculteurs dans le stockage local
  private saveFarmers(): void {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.farmers));
    }
  }

  // Obtenir tous les agriculteurs
  getAllFarmers(): Observable<Farmer[]> {
    return of(this.farmers);
  }

  // Obtenir un agriculteur par son ID
  getFarmerById(farmerId: string): Observable<Farmer> {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (farmer) {
      return of(farmer);
    }
    return throwError(() => new Error(`Agriculteur avec l'ID ${farmerId} non trouvé`));
  }

  // Ajouter un nouvel agriculteur
  addFarmer(farmer: Farmer): Observable<Farmer> {
    farmer.id = uuidv4();
    farmer.dateInscription = new Date();
    farmer.parcelles = [];
    farmer.besoins = [];
    
    this.farmers.push(farmer);
    this.saveFarmers();
    
    return of(farmer);
  }

  // Mettre à jour un agriculteur existant
  updateFarmer(farmer: Farmer): Observable<Farmer> {
    const index = this.farmers.findIndex(f => f.id === farmer.id);
    if (index === -1) {
      return throwError(() => new Error(`Agriculteur avec l'ID ${farmer.id} non trouvé`));
    }
    
    this.farmers[index] = farmer;
    this.saveFarmers();
    
    return of(farmer);
  }

  // Supprimer un agriculteur
  deleteFarmer(farmerId: string): Observable<boolean> {
    const initialLength = this.farmers.length;
    this.farmers = this.farmers.filter(f => f.id !== farmerId);
    
    if (initialLength !== this.farmers.length) {
      this.saveFarmers();
      return of(true);
    }
    
    return throwError(() => new Error(`Agriculteur avec l'ID ${farmerId} non trouvé`));
  }

  // Méthodes pour les parcelles
  getParcelles(farmerId: string): Observable<Parcelle[]> {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (farmer) {
      return of(farmer.parcelles);
    }
    return throwError(() => new Error(`Agriculteur avec l'ID ${farmerId} non trouvé`));
  }

  getParcelleById(farmerId: string, parcelleId: string): Observable<Parcelle> {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (farmer) {
      const parcelle = farmer.parcelles.find(p => p.id === parcelleId);
      if (parcelle) {
        return of(parcelle);
      }
      return throwError(() => new Error(`Parcelle avec l'ID ${parcelleId} non trouvée`));
    }
    return throwError(() => new Error(`Agriculteur avec l'ID ${farmerId} non trouvé`));
  }

  addParcelle(farmerId: string, parcelle: Parcelle): Observable<Parcelle> {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (farmer) {
      parcelle.id = uuidv4();
      farmer.parcelles.push(parcelle);
      this.saveFarmers();
      return of(parcelle);
    }
    return throwError(() => new Error(`Agriculteur avec l'ID ${farmerId} non trouvé`));
  }

  updateParcelle(farmerId: string, parcelle: Parcelle): Observable<Parcelle> {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (farmer) {
      const index = farmer.parcelles.findIndex(p => p.id === parcelle.id);
      if (index !== -1) {
        farmer.parcelles[index] = parcelle;
        this.saveFarmers();
        return of(parcelle);
      }
      return throwError(() => new Error(`Parcelle avec l'ID ${parcelle.id} non trouvée`));
    }
    return throwError(() => new Error(`Agriculteur avec l'ID ${farmerId} non trouvé`));
  }

  deleteParcelle(farmerId: string, parcelleId: string): Observable<boolean> {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (farmer) {
      const initialLength = farmer.parcelles.length;
      farmer.parcelles = farmer.parcelles.filter(p => p.id !== parcelleId);
      
      if (initialLength !== farmer.parcelles.length) {
        this.saveFarmers();
        return of(true);
      }
      
      return throwError(() => new Error(`Parcelle avec l'ID ${parcelleId} non trouvée`));
    }
    return throwError(() => new Error(`Agriculteur avec l'ID ${farmerId} non trouvé`));
  }

  // Méthodes pour les besoins
  getBesoins(farmerId: string): Observable<Besoin[]> {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (farmer) {
      return of(farmer.besoins);
    }
    return throwError(() => new Error(`Agriculteur avec l'ID ${farmerId} non trouvé`));
  }

  getBesoinById(farmerId: string, besoinId: string): Observable<Besoin> {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (farmer) {
      const besoin = farmer.besoins.find(b => b.id === besoinId);
      if (besoin) {
        return of(besoin);
      }
      return throwError(() => new Error(`Besoin avec l'ID ${besoinId} non trouvé`));
    }
    return throwError(() => new Error(`Agriculteur avec l'ID ${farmerId} non trouvé`));
  }

  addBesoin(farmerId: string, besoin: Besoin): Observable<Besoin> {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (farmer) {
      besoin.id = uuidv4();
      besoin.dateCreation = new Date();
      farmer.besoins.push(besoin);
      this.saveFarmers();
      return of(besoin);
    }
    return throwError(() => new Error(`Agriculteur avec l'ID ${farmerId} non trouvé`));
  }

  updateBesoin(farmerId: string, besoin: Besoin): Observable<Besoin> {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (farmer) {
      const index = farmer.besoins.findIndex(b => b.id === besoin.id);
      if (index !== -1) {
        farmer.besoins[index] = besoin;
        this.saveFarmers();
        return of(besoin);
      }
      return throwError(() => new Error(`Besoin avec l'ID ${besoin.id} non trouvé`));
    }
    return throwError(() => new Error(`Agriculteur avec l'ID ${farmerId} non trouvé`));
  }

  deleteBesoin(farmerId: string, besoinId: string): Observable<boolean> {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (farmer) {
      const initialLength = farmer.besoins.length;
      farmer.besoins = farmer.besoins.filter(b => b.id !== besoinId);
      
      if (initialLength !== farmer.besoins.length) {
        this.saveFarmers();
        return of(true);
      }
      
      return throwError(() => new Error(`Besoin avec l'ID ${besoinId} non trouvé`));
    }
    return throwError(() => new Error(`Agriculteur avec l'ID ${farmerId} non trouvé`));
  }

  updatePreferences(farmerId: string, preferences: any): Observable<any> {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (farmer) {
      farmer.preferences = preferences;
      this.saveFarmers();
      return of(preferences);
    }
    return throwError(() => new Error(`Agriculteur avec l'ID ${farmerId} non trouvé`));
  }

  private getDefaultFarmers(): Farmer[] {
    return [
      {
        id: '1',
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        telephone: '06 12 34 56 78',
        adresse: '123 Rue des Agriculteurs',
        codePostal: '75001',
        ville: 'Paris',
        pays: 'France',
        dateInscription: new Date('2022-01-15'),
        parcelles: [],
        besoins: [],
        preferences: {
          alertesMeteo: true,
          frequenceNotifications: 'quotidienne',
          uniteTemperature: 'celsius',
          culturesPreferees: ['Blé', 'Maïs', 'Tournesol'],
          languePreferee: 'fr'
        }
      },
      {
        id: '2',
        nom: 'Martin',
        prenom: 'Marie',
        email: 'marie.martin@example.com',
        telephone: '06 98 76 54 32',
        adresse: '456 Avenue des Champs',
        codePostal: '69002',
        ville: 'Lyon',
        pays: 'France',
        dateInscription: new Date('2022-03-22'),
        parcelles: [],
        besoins: [],
        preferences: {
          alertesMeteo: true,
          frequenceNotifications: 'hebdomadaire',
          uniteTemperature: 'celsius',
          culturesPreferees: ['Pommes', 'Poires', 'Prunes'],
          languePreferee: 'fr'
        }
      },
      {
        id: '3',
        nom: 'Durand',
        prenom: 'Pierre',
        email: 'pierre.durand@example.com',
        telephone: '07 45 67 89 10',
        adresse: '789 Chemin des Vignes',
        codePostal: '33000',
        ville: 'Bordeaux',
        pays: 'France',
        dateInscription: new Date('2021-11-05'),
        parcelles: [],
        besoins: [],
        preferences: {
          alertesMeteo: true,
          frequenceNotifications: 'mensuelle',
          uniteTemperature: 'celsius',
          culturesPreferees: ['Raisin', 'Olivier'],
          languePreferee: 'fr'
        }
      }
    ];
  }
}
