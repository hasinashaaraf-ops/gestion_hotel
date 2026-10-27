package com.hoteldereve.service;

import com.hoteldereve.model.*;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.*;

public class HotelService {
    private static HotelService instance;

    private List<Chambre> chambres = new ArrayList<>();
    private List<Client> clients = new ArrayList<>();
    private List<Reservation> reservations = new ArrayList<>();
    private List<Paiement> paiements = new ArrayList<>();
    private List<Facture> factures = new ArrayList<>();
    private List<Utilisateur> utilisateurs = new ArrayList<>();
    private Utilisateur currentUser;

    private static final DecimalFormat ARIARY_FORMAT;

    static {
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.FRENCH);
        symbols.setGroupingSeparator(' ');
        ARIARY_FORMAT = new DecimalFormat("#,###", symbols);
    }

    private HotelService() {
        initDefaultData();
    }

    public static synchronized HotelService getInstance() {
        if (instance == null) {
            instance = new HotelService();
        }
        return instance;
    }

    public static String formatAriary(double amount) {
        return ARIARY_FORMAT.format((long) amount) + " Ar";
    }

    private void initDefaultData() {
        // Utilisateurs
        Utilisateur admin = new Utilisateur("USR-1", "Rakoto", "Jean", "admin", "admin123", "ADMIN");
        Utilisateur reception = new Utilisateur("USR-2", "Rasoa", "Marie", "reception", "1234", "RECEPTIONIST");
        utilisateurs.add(admin);
        utilisateurs.add(reception);
        currentUser = admin;

        // Chambres
        chambres.add(new Chambre("CH-101", "101", "Simple", 1, 1, 80000, "Disponible", "Chambre simple cosy avec vue jardin"));
        chambres.add(new Chambre("CH-102", "102", "Double", 1, 2, 120000, "Occupée", "Lit double Queen-size, climatisation"));
        chambres.add(new Chambre("CH-103", "103", "Twin", 1, 2, 130000, "En nettoyage", "Deux lits simples, bureau de travail"));
        chambres.add(new Chambre("CH-201", "201", "Suite", 2, 3, 250000, "Occupée", "Suite Prestige avec salon et balcon"));
        chambres.add(new Chambre("CH-202", "202", "Familiale", 2, 4, 200000, "Réservée", "Chambre spacieuse pour 4 personnes"));
        chambres.add(new Chambre("CH-203", "203", "Double", 2, 2, 120000, "Disponible", "Chambre double rénovée"));
        chambres.add(new Chambre("CH-301", "301", "Suite", 3, 2, 320000, "Disponible", "Suite Panoramique dernier étage"));
        chambres.add(new Chambre("CH-302", "302", "Simple", 3, 1, 85000, "Hors service", "Maintenance plomberie en cours"));

        // Clients
        Client c1 = new Client("CLI-01", "Andriantsitohaina", "Hery", "M", "034 12 345 67", "hery@gmail.com", "Ankorondrano, Antananarivo", "CIN 101234567890", "2026-03-01");
        Client c2 = new Client("CLI-02", "Ramananarivo", "Voahirana", "F", "033 98 765 43", "voahirana@yahoo.fr", "Ivandry, Antananarivo", "CIN 101987654321", "2026-03-05");
        Client c3 = new Client("CLI-03", "Dupont", "Christian", "M", "+33 6 12 34 56 78", "c.dupont@orange.fr", "Paris, France", "PASSEPORT 21AB12345", "2026-03-10");
        clients.add(c1);
        clients.add(c2);
        clients.add(c3);

        // Réservations
        Reservation r1 = new Reservation("RES-001", "REV-2026-001", c1.getId(), "CH-102", "2026-03-15", "2026-03-18", "2026-03-22", 2, 4, 480000, "En cours", "Arrivée tardive");
        r1.setDateCheckInEffectif("2026-03-18 14:30");
        Reservation r2 = new Reservation("RES-002", "REV-2026-002", c2.getId(), "CH-201", "2026-03-16", "2026-03-19", "2026-03-23", 2, 4, 1000000, "En cours", "Petit déjeuner inclus");
        r2.setDateCheckInEffectif("2026-03-19 12:15");
        Reservation r3 = new Reservation("RES-003", "REV-2026-003", c3.getId(), "CH-202", "2026-03-17", "2026-03-24", "2026-03-28", 3, 4, 800000, "Confirmée", "Navette aéroport demandée");
        reservations.add(r1);
        reservations.add(r2);
        reservations.add(r3);

        // Paiements
        PaiementsAdd(new Paiement("PAY-01", "PAY-2026-001", r1.getId(), "2026-03-18", 480000, "MVola", "Payé", "MVOLA-894721"));
        PaiementsAdd(new Paiement("PAY-02", "PAY-2026-002", r2.getId(), "2026-03-19", 500000, "Carte bancaire", "Partiellement payé", "CB-77321"));

        // Factures
        factures.add(new Facture("FAC-01", "FAC-2026-001", r1.getId(), "2026-03-18", 480000, 480000, 0, "MVola"));
        factures.add(new Facture("FAC-02", "FAC-2026-002", r2.getId(), "2026-03-19", 1000000, 500000, 500000, "Carte bancaire"));
    }

    private void PaiementsAdd(Paiement p) {
        paiements.add(p);
    }

    // Getters & Collections
    public List<Chambre> getChambres() { return chambres; }
    public List<Client> getClients() { return clients; }
    public List<Reservation> getReservations() { return reservations; }
    public List<Paiement> getPaiements() { return paiements; }
    public List<Facture> getFactures() { return factures; }
    public List<Utilisateur> getUtilisateurs() { return utilisateurs; }

    public Utilisateur getCurrentUser() { return currentUser; }
    public void setCurrentUser(Utilisateur currentUser) { this.currentUser = currentUser; }

    public Chambre findChambreById(String id) {
        for (Chambre ch : chambres) {
            if (ch.getId().equalsIgnoreCase(id)) return ch;
        }
        return null;
    }

    public Client findClientById(String id) {
        for (Client c : clients) {
            if (c.getId().equalsIgnoreCase(id)) return c;
        }
        return null;
    }

    public Reservation findReservationById(String id) {
        for (Reservation r : reservations) {
            if (r.getId().equalsIgnoreCase(id)) return r;
        }
        return null;
    }

    // Actions métier
    public void ajouterChambre(Chambre ch) {
        chambres.add(ch);
    }

    public void updateStatutChambre(String idChambre, String newStatut) {
        Chambre ch = findChambreById(idChambre);
        if (ch != null) {
            ch.setStatut(newStatut);
        }
    }

    public void ajouterClient(Client client) {
        clients.add(client);
    }

    public void ajouterReservation(Reservation res) {
        reservations.add(res);
        Chambre ch = findChambreById(res.getIdChambre());
        if (ch != null) {
            ch.setStatut("Réservée");
        }
    }

    public boolean checkIn(String idReservation) {
        Reservation res = findReservationById(idReservation);
        if (res != null) {
            res.setStatut("En cours");
            res.setDateCheckInEffectif("Effectué maintenant");
            Chambre ch = findChambreById(res.getIdChambre());
            if (ch != null) {
                ch.setStatut("Occupée");
            }
            return true;
        }
        return false;
    }

    public boolean checkOut(String idReservation) {
        Reservation res = findReservationById(idReservation);
        if (res != null) {
            res.setStatut("Terminée");
            res.setDateCheckOutEffectif("Effectué maintenant");
            Chambre ch = findChambreById(res.getIdChambre());
            if (ch != null) {
                ch.setStatut("En nettoyage");
            }
            return true;
        }
        return false;
    }

    public void enregistrerPaiement(Paiement paiement) {
        paiements.add(paiement);
    }

    public void enregistrerFacture(Facture facture) {
        factures.add(facture);
    }

    public void ajouterUtilisateur(Utilisateur user) {
        utilisateurs.add(user);
    }
}
