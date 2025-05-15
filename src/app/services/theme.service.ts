import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Observable pour suivre l'état du thème
  private darkModeSubject = new BehaviorSubject<boolean>(true); // Par défaut en mode sombre
  darkMode$ = this.darkModeSubject.asObservable();
  private isBrowser: boolean;

  // Définir les couleurs de thème pour le mode sombre et clair
  private darkTheme: Record<string, string> = {
    '--background-color': '#111827',
    '--background-secondary': '#1f2937',
    '--card-background': '#1e293b',
    '--text-primary': 'rgba(255, 255, 255, 0.95)',
    '--text-secondary': 'rgba(255, 255, 255, 0.7)',
    '--border-color': 'rgba(255, 255, 255, 0.1)',
    '--shadow-light': '0 2px 10px rgba(0, 0, 0, 0.4)',
    '--shadow-medium': '0 5px 15px rgba(0, 0, 0, 0.45)',
    '--shadow-hover': '0 8px 25px rgba(0, 0, 0, 0.5)'
  };

  private lightTheme: Record<string, string> = {
    '--background-color': '#f8fafc',
    '--background-secondary': '#f1f5f9',
    '--card-background': '#ffffff',
    '--text-primary': '#1e293b',
    '--text-secondary': '#475569',
    '--border-color': 'rgba(0, 0, 0, 0.1)',
    '--shadow-light': '0 2px 10px rgba(0, 0, 0, 0.05)',
    '--shadow-medium': '0 5px 15px rgba(0, 0, 0, 0.08)',
    '--shadow-hover': '0 8px 25px rgba(0, 0, 0, 0.1)'
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Initialiser le thème basé sur les préférences utilisateur
  initTheme(): void {
    if (!this.isBrowser) return;

    // Vérifier si un thème est sauvegardé dans le localStorage
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedTheme !== null) {
      // Utiliser le thème sauvegardé
      this.setDarkMode(savedTheme === 'true');
    } else {
      // Sinon, utiliser les préférences du système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setDarkMode(prefersDark);
    }
    
    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Ne mettre à jour que si l'utilisateur n'a pas défini manuellement de préférence
      if (localStorage.getItem('darkMode') === null) {
        this.setDarkMode(e.matches);
      }
    });
  }

  // Définir le mode sombre/clair
  setDarkMode(isDarkMode: boolean): void {
    this.darkModeSubject.next(isDarkMode);
    
    // Appliquer les variables CSS du thème
    const theme = isDarkMode ? this.darkTheme : this.lightTheme;
    
    Object.keys(theme).forEach(key => {
      document.documentElement.style.setProperty(key, theme[key]);
    });
    
    if (this.isBrowser) {
      localStorage.setItem('darkMode', isDarkMode.toString());
    }
  }

  // Basculer entre mode sombre et clair
  toggleDarkMode(): void {
    this.setDarkMode(!this.darkModeSubject.value);
  }

  // Obtenir l'état actuel du mode sombre
  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
} 