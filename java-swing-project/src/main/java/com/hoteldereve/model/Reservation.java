package com.hoteldereve.model;

import java.io.Serializable;

public class Reservation implements Serializable {
    private String id;
    private String numeroReservation;
    private String idClient;
    private String idChambre;
    private String dateReservation;
    private String dateArrivee;
    private String dateDepart;
    private String dateCheckInEffectif;
    private String dateCheckOutEffectif;
    private int nombrePersonnes;
    private int nombreNuits;
    private double prixTotal; // en Ariary
    private String statut; // En attente, Confirmée, En cours, Terminée, Annulée
    private String remarques;

    public Reservation() {}

    public Reservation(String id, String numeroReservation, String idClient, String idChambre,
                       String dateReservation, String dateArrivee, String dateDepart,
                       int nombrePersonnes, int nombreNuits, double prixTotal, String statut, String remarques) {
        this.id = id;
        this.numeroReservation = numeroReservation;
        this.idClient = idClient;
        this.idChambre = idChambre;
        this.dateReservation = dateReservation;
        this.dateArrivee = dateArrivee;
        this.dateDepart = dateDepart;
        this.nombrePersonnes = nombrePersonnes;
        this.nombreNuits = nombreNuits;
        this.prixTotal = prixTotal;
        this.statut = statut;
        this.remarques = remarques;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNumeroReservation() { return numeroReservation; }
    public void setNumeroReservation(String numeroReservation) { this.numeroReservation = numeroReservation; }

    public String getIdClient() { return idClient; }
    public void setIdClient(String idClient) { this.idClient = idClient; }

    public String getIdChambre() { return idChambre; }
    public void setIdChambre(String idChambre) { this.idChambre = idChambre; }

    public String getDateReservation() { return dateReservation; }
    public void setDateReservation(String dateReservation) { this.dateReservation = dateReservation; }

    public String getDateArrivee() { return dateArrivee; }
    public void setDateArrivee(String dateArrivee) { this.dateArrivee = dateArrivee; }

    public String getDateDepart() { return dateDepart; }
    public void setDateDepart(String dateDepart) { this.dateDepart = dateDepart; }

    public String getDateCheckInEffectif() { return dateCheckInEffectif; }
    public void setDateCheckInEffectif(String dateCheckInEffectif) { this.dateCheckInEffectif = dateCheckInEffectif; }

    public String getDateCheckOutEffectif() { return dateCheckOutEffectif; }
    public void setDateCheckOutEffectif(String dateCheckOutEffectif) { this.dateCheckOutEffectif = dateCheckOutEffectif; }

    public int getNombrePersonnes() { return nombrePersonnes; }
    public void setNombrePersonnes(int nombrePersonnes) { this.nombrePersonnes = nombrePersonnes; }

    public int getNombreNuits() { return nombreNuits; }
    public void setNombreNuits(int nombreNuits) { this.nombreNuits = nombreNuits; }

    public double getPrixTotal() { return prixTotal; }
    public void setPrixTotal(double prixTotal) { this.prixTotal = prixTotal; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getRemarques() { return remarques; }
    public void setRemarques(String remarques) { this.remarques = remarques; }
}
