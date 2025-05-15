export interface Farmer {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  dateInscription: Date;
  parcelles: Parcelle[];
  besoins: Besoin[];
  preferences: Preferences;
}

export interface Parcelle {
  id: string;
  nom: string;
  superficie: number; // en hectares
  culture: string;
  datePlantation: Date;
  dateRecolteEstimee: Date;
  coordonnees: {
    latitude: number;
    longitude: number;
  };
  typeSol: string;
  irrigation: boolean;
  historiqueCultures?: string[];
}

export interface Besoin {
  id: string;
  type: TypeBesoin;
  description: string;
  dateCreation: Date;
  priorite: 'faible' | 'moyenne' | 'haute';
  statut: 'nouveau' | 'en_cours' | 'resolu';
  parcelleId?: string; // Référence à une parcelle spécifique si applicable
  alerteMeteo?: boolean; // Si le besoin est lié à une alerte météo
}

export enum TypeBesoin {
  IRRIGATION = 'irrigation',
  TRAITEMENT = 'traitement',
  FERTILISATION = 'fertilisation',
  RECOLTE = 'recolte',
  CONSEIL = 'conseil',
  AUTRE = 'autre'
}

export interface Preferences {
  alertesMeteo: boolean;
  frequenceNotifications: 'quotidienne' | 'hebdomadaire' | 'mensuelle' | 'aucune';
  uniteTemperature: 'celsius' | 'fahrenheit';
  culturesPreferees: string[];
  languePreferee: string;
}
