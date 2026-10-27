package com.hoteldereve.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Chambre implements Serializable {
    private String id;
    private String numero;
    private String type; // Simple, Double, Twin, Suite, Familiale
    private int etage;
    private int capacite;
    private double prixNuit; // en Ariary (MGA)
    private String statut; // Disponible, Occupée, Réservée, En nettoyage, Hors service
    private String description;
    private List<String> equipements;

    public Chambre() {
        this.equipements = new ArrayList<>();
    }

    public Chambre(String id, String numero, String type, int etage, int capacite, double prixNuit, String statut, String description) {
        this.id = id;
        this.numero = numero;
        this.type = type;
        this.etage = etage;
        this.capacite = capacite;
        this.prixNuit = prixNuit;
        this.statut = statut;
        this.description = description;
        this.equipements = new ArrayList<>();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getEtage() { return etage; }
    public void setEtage(int etage) { this.etage = etage; }

    public int getCapacite() { return capacite; }
    public void setCapacite(int capacite) { this.capacite = capacite; }

    public double getPrixNuit() { return prixNuit; }
    public void setPrixNuit(double prixNuit) { this.prixNuit = prixNuit; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getEquipements() { return equipements; }
    public void setEquipements(List<String> equipements) { this.equipements = equipements; }

    @Override
    public String toString() {
        return "Chambre " + numero + " (" + type + " - " + (long)prixNuit + " Ar)";
    }
}
