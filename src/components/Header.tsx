import React from 'react';
import { Search, Calendar, UserCheck, Shield, RotateCcw } from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenQuickSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onOpenQuickSearch }) => {
  const { currentUser, resetToDefaultData } = useHotel();

  const getTabTitle = (tab: ActiveTab): { title: string; subtitle: string } => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'Tableau de bord',
          subtitle: 'Vue d’ensemble des indicateurs de performance, réservations et occupation',
        };
      case 'rooms':
        return {
          title: 'Gestion des Chambres',
          subtitle: 'Inventaire des 30 chambres, statuts en temps réel, tarifs et équipements',
        };
      case 'clients':
        return {
          title: 'Gestion des Clients',
          subtitle: 'Fichier clients, coordonnées, pièces d’identité et historique des séjours',
        };
      case 'reservations':
        return {
          title: 'Gestion des Réservations',
          subtitle: 'Planning, disponibilités en temps réel, validation et calendrier',
        };
      case 'checkinout':
        return {
          title: 'Arrivées & Départs (Check-in / Check-out)',
          subtitle: 'Enregistrement des arrivées, départs, calcul du solde et facturation instantanée',
        };
      case 'payments':
        return {
          title: 'Gestion des Paiements',
          subtitle: 'Encaissements, modes de règlement (Espèces, CB, MVola, OM, Airtel) et soldes',
        };
      case 'invoices':
        return {
          title: 'Factures & Reçus',
          subtitle: 'Édition, impression et téléchargement des factures clients officielles',
        };
      case 'housekeeping':
        return {
          title: 'Service d’Étages & Nettoyage',
          subtitle: 'Suivi des chambres à nettoyer après départ et validation de propreté',
        };
      case 'reports':
        return {
          title: 'Rapports & Statistiques',
          subtitle: 'Rapports financiers, taux d’occupation et historique exportable',
        };
      case 'users':
        return {
          title: 'Gestion du Personnel',
          subtitle: 'Contrôle des accès, rôles Administrateur et Réceptionniste',
        };
      default:
        return { title: 'Hôtel de Rêve Manager', subtitle: 'Système de gestion hôtelière' };
    }
  };

  const { title } = getTabTitle(activeTab);

  return (
    <header className="h-16 px-6 bg-[#1c4fd8] text-white flex items-center justify-between gap-6 shrink-0 z-10 shadow-sm border-b border-blue-700/60">
      {/* Zone 1: Breadcrumb & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xs font-bold text-blue-200 tracking-wider">
          HÔTEL DE RÊVE
        </span>
        <span className="text-blue-300/60">/</span>
        <h1 className="text-sm font-bold text-white tracking-tight truncate">
          {title}
        </h1>
      </div>

      {/* Zone 2: Pill Search Bar (exact match to screenshot) */}
      <div className="flex-1 max-w-md hidden sm:flex justify-center">
        <button
          onClick={onOpenQuickSearch}
          className="w-full max-w-xs flex items-center gap-2.5 px-4 py-2 text-xs text-blue-100 bg-white/15 hover:bg-white/20 rounded-full border border-white/30 transition-all cursor-pointer text-left shadow-xs backdrop-blur-xs"
        >
          <Search className="w-3.5 h-3.5 text-white/80 shrink-0" />
          <span className="flex-1 truncate placeholder-text text-white/80 font-medium">Rechercher...</span>
          <kbd className="hidden md:inline-block font-mono text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full border border-white/30">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Quick icons & User profile capsule */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenQuickSearch}
          title="Recherche rapide"
          className="sm:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>

        <div className="hidden lg:flex items-center gap-1 text-white/80 text-xs">
          <button
            onClick={() => {
              if (confirm('Réinitialiser les données de démonstration de l’hôtel ?')) {
                resetToDefaultData();
              }
            }}
            title="Réinitialiser les données de démo"
            className="p-2 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>20 Octobre 2026</span>
          </div>
        </div>

        {/* Separator line as shown in screenshot */}
        <div className="h-5 w-[1px] bg-white/30 hidden sm:block" />

        {/* User profile capsule matching screenshot */}
        {currentUser && (
          <div className="flex items-center gap-2.5 pl-1">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold uppercase tracking-wider text-white leading-tight">
                {currentUser.prenom} {currentUser.nom}
              </div>
              <div className="text-[10px] text-blue-200 font-medium flex items-center justify-end gap-1">
                {currentUser.role === 'ADMIN' ? (
                  <span className="flex items-center gap-0.5">
                    <Shield className="w-2.5 h-2.5" /> Administrateur
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5">
                    <UserCheck className="w-2.5 h-2.5" /> Réceptionniste
                  </span>
                )}
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white text-[#1c4fd8] flex items-center justify-center font-bold text-xs ring-2 ring-white/50 shadow-sm shrink-0">
              {currentUser.prenom[0]}
              {currentUser.nom[0]}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
