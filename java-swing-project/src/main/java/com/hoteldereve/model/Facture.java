package com.hoteldereve.model;

import java.io.Serializable;

public class Facture implements Serializable {
    private String id;
    private String numeroFacture;
    private String idReservation;
    private String dateFacture;
    private double montantTotal;
    private double montantPaye;
    private double resteAPayer;
    private String modePaiement;

    public Facture() {}

    public Facture(String id, String numeroFacture, String idReservation, String dateFacture,
                   double montantTotal, double montantPaye, double resteAPayer, String modePaiement) {
        this.id = id;
        this.numeroFacture = numeroFacture;
        this.idReservation = idReservation;
        this.dateFacture = dateFacture;
        this.montantTotal = montantTotal;
        this.montantPaye = montantPaye;
        this.resteAPayer = resteAPayer;
        this.modePaiement = modePaiement;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNumeroFacture() { return numeroFacture; }
    public void setNumeroFacture(String numeroFacture) { this.numeroFacture = numeroFacture; }

    public String getIdReservation() { return idReservation; }
    public void setIdReservation(String idReservation) { this.idReservation = idReservation; }

    public String getDateFacture() { return dateFacture; }
    public void setDateFacture(String dateFacture) { this.dateFacture = dateFacture; }

    public double getMontantTotal() { return montantTotal; }
    public void setMontantTotal(double montantTotal) { this.montantTotal = montantTotal; }

    public double getMontantPaye() { return montantPaye; }
    public void setMontantPaye(double montantPaye) { this.montantPaye = montantPaye; }

    public double getResteAPayer() { return resteAPayer; }
    public void setResteAPayer(double resteAPayer) { this.resteAPayer = resteAPayer; }

    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }
}
