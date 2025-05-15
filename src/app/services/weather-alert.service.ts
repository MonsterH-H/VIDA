import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { WeatherAlert } from '../components/weather-alert/weather-alert.component';
import { WeatherService } from './weather.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherAlertService {
  getUnreadAlertsCount(): Observable<number> {
    return this.alertsSubject.pipe(
      map(alerts => alerts.filter(alert => !alert.dismissed).length)
    );
  }
  private alertsSubject = new BehaviorSubject<WeatherAlert[]>([]);
  private dismissedAlertsSubject = new BehaviorSubject<WeatherAlert[]>([]);
  
  readonly alerts$: Observable<WeatherAlert[]> = this.alertsSubject.asObservable();
  readonly dismissedAlerts$: Observable<WeatherAlert[]> = this.dismissedAlertsSubject.asObservable();
  
  private readonly STORAGE_KEY_ALERTS = 'agrimeteo_weather_alerts';
  private readonly STORAGE_KEY_DISMISSED = 'agrimeteo_dismissed_alerts';
  private currentLocation = 'Paris'; // Valeur par défaut, à remplacer par géolocalisation ou préférence utilisateur
  
  constructor(private weatherService: WeatherService) {
    // Charger les alertes depuis le stockage local
    this.loadFromStorage();
    
    // Chargement initial des alertes
    this.loadMockAlerts();
    
    // Dans une application réelle, on pourrait:
    // 1. Configurer un intervalle pour vérifier de nouvelles alertes
    // this.startAlertPolling();
  }
  
  /**
   * Retourne toutes les alertes actives (non ignorées)
   */
  getAlerts(): WeatherAlert[] {
    return this.alertsSubject.value;
  }
  
  /**
   * Retourne les alertes récemment ignorées
   */
  getDismissedAlerts(): WeatherAlert[] {
    return this.dismissedAlertsSubject.value;
  }
  
  /**
   * Ajoute une nouvelle alerte
   */
  addAlert(alert: WeatherAlert): void {
    const currentAlerts = this.alertsSubject.value;
    this.alertsSubject.next([...currentAlerts, alert]);
    this.saveToStorage();
  }
  
  /**
   * Ignore une alerte par son ID
   */
  dismissAlert(id: string): void {
    const currentAlerts = this.alertsSubject.value;
    const alertIndex = currentAlerts.findIndex(a => a.id === id);
    
    if (alertIndex >= 0) {
      // Marquer l'alerte comme ignorée
      const alert = {...currentAlerts[alertIndex], dismissed: true};
      
      // Ajouter aux alertes ignorées
      const currentDismissed = this.dismissedAlertsSubject.value;
      this.dismissedAlertsSubject.next([alert, ...currentDismissed]);
      
      // Retirer des alertes actives
      this.alertsSubject.next(
        currentAlerts.filter(a => a.id !== id)
      );
      
      this.saveToStorage();
    }
  }
  
  /**
   * Supprime définitivement une alerte ignorée
   */
  removeDismissedAlert(id: string): void {
    const currentDismissed = this.dismissedAlertsSubject.value;
    this.dismissedAlertsSubject.next(
      currentDismissed.filter(a => a.id !== id)
    );
    this.saveToStorage();
  }
  
  /**
   * Marque toutes les alertes comme lues
   */
  markAllAsRead(): void {
    const currentAlerts = this.alertsSubject.value;
    const currentDismissed = this.dismissedAlertsSubject.value;
    
    // Marquer toutes les alertes comme ignorées
    const dismissedAlerts = currentAlerts.map(alert => ({
      ...alert, 
      dismissed: true
    }));
    
    // Ajouter au début des alertes ignorées
    this.dismissedAlertsSubject.next([
      ...dismissedAlerts,
      ...currentDismissed
    ]);
    
    // Vider les alertes actives
    this.alertsSubject.next([]);
    
    this.saveToStorage();
  }
  
  /**
   * Efface toutes les alertes ignorées
   */
  clearDismissedAlerts(): void {
    this.dismissedAlertsSubject.next([]);
    this.saveToStorage();
  }
  
  /**
   * Actualise les alertes en demandant les données à l'API météo
   */
  refreshAlerts(): void {
    // Dans une application réelle, on ferait appel à l'API pour récupérer
    // les dernières alertes météo pour la zone de l'utilisateur
    
    // Pour ce prototype, on utilise notre service météo pour générer des alertes
    // basées sur les conditions actuelles et les prévisions
    this.weatherService.getWeatherAlerts(this.currentLocation).subscribe({
      next: (alerts) => {
        if (alerts && alerts.length > 0) {
          // Vérifier quelles alertes sont nouvelles
          const currentAlerts = this.alertsSubject.value;
          const existingIds = currentAlerts.map(a => a.id.split('-')[0]); // On prend la première partie de l'ID pour la comparaison
          
          // Filtrer pour ne garder que les types d'alertes qui n'existent pas déjà
          const newAlerts = alerts.filter(alert => {
            const alertType = alert.id.split('-')[0]; // ex: "temp", "rain"
            return !existingIds.includes(alertType);
          });
          
          if (newAlerts.length > 0) {
            this.alertsSubject.next([...newAlerts, ...currentAlerts]);
            this.saveToStorage();
          }
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des alertes météo:', err);
        // En cas d'erreur, on charge les données fictives
        this.loadMockAlerts();
      }
    });
  }
  
  /**
   * Sauvegarde les alertes dans le stockage local
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_ALERTS, JSON.stringify(this.alertsSubject.value));
      localStorage.setItem(this.STORAGE_KEY_DISMISSED, JSON.stringify(this.dismissedAlertsSubject.value));
    } catch (e) {
      console.warn('Erreur lors de l\'enregistrement des alertes dans le stockage local:', e);
    }
  }
  
  /**
   * Charge les alertes depuis le stockage local
   */
  private loadFromStorage(): void {
    try {
      const storedAlerts = localStorage.getItem(this.STORAGE_KEY_ALERTS);
      const storedDismissed = localStorage.getItem(this.STORAGE_KEY_DISMISSED);
      
      if (storedAlerts) {
        const alerts = JSON.parse(storedAlerts);
        // Convertir les chaînes de date en objets Date
        alerts.forEach((alert: any) => {
          alert.timestamp = new Date(alert.timestamp);
        });
        this.alertsSubject.next(alerts);
      }
      
      if (storedDismissed) {
        const dismissed = JSON.parse(storedDismissed);
        // Convertir les chaînes de date en objets Date
        dismissed.forEach((alert: any) => {
          alert.timestamp = new Date(alert.timestamp);
        });
        this.dismissedAlertsSubject.next(dismissed);
      }
    } catch (e) {
      console.warn('Erreur lors du chargement des alertes depuis le stockage local:', e);
    }
  }
  
  /**
   * Charge des données fictives pour démonstration
   */
  private loadMockAlerts(): void {
    // On vérifie d'abord si nous avons déjà des alertes (du stockage local)
    if (this.alertsSubject.value.length > 0) {
      return;
    }
    
    const mockAlerts: WeatherAlert[] = [
      {
        id: '1',
        type: 'danger',
        title: 'Avis de tempête',
        message: 'Vents violents attendus de 90 à 110 km/h. Restez à l\'intérieur et sécurisez les objets extérieurs.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        location: 'Région Nord',
        icon: 'thunderstorm',
        dismissed: false
      },
      {
        id: '2',
        type: 'warning',
        title: 'Risque d\'inondation',
        message: 'Précipitations importantes prévues. Risque de crue dans les zones basses.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        location: 'Vallée Sud',
        icon: 'water',
        dismissed: false
      },
      {
        id: '3',
        type: 'info',
        title: 'Épisode de chaleur',
        message: 'Températures élevées attendues. Hydratez-vous régulièrement et évitez les activités physiques intenses.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        location: 'Centre-Est',
        icon: 'wb_sunny',
        dismissed: false
      }
    ];
    
    this.alertsSubject.next(mockAlerts);
    this.saveToStorage();
  }
  
  /**
   * Démarre un intervalle pour vérifier régulièrement les nouvelles alertes
   * (à implémenter dans une application réelle)
   */
  private startAlertPolling(): void {
    // Exemple: vérifier toutes les 15 minutes
    setInterval(() => {
      this.refreshAlerts();
    }, 15 * 60 * 1000);
  }
}