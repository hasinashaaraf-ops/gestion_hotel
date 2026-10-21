package com.hoteldereve.model;

import java.io.Serializable;

public class Paiement implements Serializable {
    private String id;
    private String numeroPaiement;
    private String idReservation;
    private String datePaiement;
    private double montant; // en Ariary
    private String modePaiement; // Espèces, Carte bancaire, MVola, Orange Money, Airtel Money
    private String statut; // Payé, Partiellement payé, Non payé
    private String reference;

    public Paiement() {}

    public Paiement(String id, String numeroPaiement, String idReservation, String datePaiement,
                    double montant, String modePaiement, String statut, String reference) {
        this.id = id;
        this.numeroPaiement = numeroPaiement;
        this.idReservation = idReservation;
        this.datePaiement = datePaiement;
        this.montant = montant;
        this.modePaiement = modePaiement;
        this.statut = statut;
        this.reference = reference;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNumeroPaiement() { return numeroPaiement; }
    public void setNumeroPaiement(String numeroPaiement) { this.numeroPaiement = numeroPaiement; }

    public String getIdReservation() { return idReservation; }
    public void setIdReservation(String idReservation) { this.idReservation = idReservation; }

    public String getDatePaiement() { return datePaiement; }
    public void setDatePaiement(String datePaiement) { this.datePaiement = datePaiement; }

    public double getMontant() { return montant; }
    public void setMontant(double montant) { this.montant = montant; }

    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
}
