export type UserRole = 'ADMIN' | 'RECEPTIONIST';

export interface User {
  id_utilisateur: string;
  nom: string;
  prenom: string;
  username: string;
  password?: string;
  role: UserRole;
  email?: string;
  telephone?: string;
  date_creation?: string;
}

export type RoomType = 'Simple' | 'Double' | 'Twin' | 'Suite' | 'Familiale';

export type RoomStatus =
  | 'Disponible'
  | 'Occupée'
  | 'Réservée'
  | 'En nettoyage'
  | 'Hors service';

export interface Room {
  id_chambre: string;
  numero: string;
  type: RoomType;
  etage: number;
  capacite: number;
  prix_nuit: number;
  statut: RoomStatus;
  description: string;
  amenities: string[];
}

export interface Client {
  id_client: string;
  nom: string;
  prenom: string;
  sexe: 'M' | 'F';
  telephone: string;
  email: string;
  adresse: string;
  piece_identite: string;
  date_enregistrement: string;
}

export type ReservationStatus =
  | 'En attente'
  | 'Confirmée'
  | 'En cours'
  | 'Terminée'
  | 'Annulée';

export interface Reservation {
  id_reservation: string;
  numero_reservation: string;
  id_client: string;
  id_chambre: string;
  date_reservation: string;
  date_arrivee: string;
  date_depart: string;
  date_checkin_effectif?: string;
  date_checkout_effectif?: string;
  nombre_personnes: number;
  nombre_nuits: number;
  prix_total: number;
  statut: ReservationStatus;
  remarques?: string;
}

export type PaymentMethod =
  | 'Espèces'
  | 'Carte bancaire'
  | 'MVola'
  | 'Orange Money'
  | 'Airtel Money';

export type PaymentStatus = 'Payé' | 'Partiellement payé' | 'Non payé';

export interface Payment {
  id_paiement: string;
  numero_paiement: string;
  id_reservation: string;
  date_paiement: string;
  montant: number;
  mode_paiement: PaymentMethod;
  statut: PaymentStatus;
  reference?: string;
}

export interface Invoice {
  id_facture: string;
  numero_facture: string;
  id_reservation: string;
  date_facture: string;
  montant_total: number;
  montant_paye: number;
  reste_a_payer: number;
  mode_paiement: PaymentMethod | string;
}
