package com.hoteldereve.model;

import java.io.Serializable;

public class Client implements Serializable {
    private String id;
    private String nom;
    private String prenom;
    private String sexe; // M ou F
    private String telephone;
    private String email;
    private String adresse;
    private String pieceIdentite;
    private String dateEnregistrement;

    public Client() {}

    public Client(String id, String nom, String prenom, String sexe, String telephone, String email, String pieceIdentite, String adresse) {
        this(id, nom, prenom, sexe, telephone, email, adresse, pieceIdentite, "2026-03-26");
    }

    public Client(String id, String nom, String prenom, String sexe, String telephone, String email, String adresse, String pieceIdentite, String dateEnregistrement) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.sexe = sexe;
        this.telephone = telephone;
        this.email = email;
        this.adresse = adresse;
        this.pieceIdentite = pieceIdentite;
        this.dateEnregistrement = dateEnregistrement;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getNomComplet() { return nom + " " + prenom; }

    public String getSexe() { return sexe; }
    public void setSexe(String sexe) { this.sexe = sexe; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getPieceIdentite() { return pieceIdentite; }
    public void setPieceIdentite(String pieceIdentite) { this.pieceIdentite = pieceIdentite; }

    public String getNumeroPieceIdentite() { return pieceIdentite; }
    public String getNationalite() { return adresse; }

    public String getDateEnregistrement() { return dateEnregistrement; }
    public void setDateEnregistrement(String dateEnregistrement) { this.dateEnregistrement = dateEnregistrement; }

    @Override
    public String toString() {
        return getNomComplet() + " (" + telephone + ")";
    }
}
