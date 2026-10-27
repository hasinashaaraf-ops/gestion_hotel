-- ==========================================================
-- BASE DE DONNÉES : hotel_de_reve_db
-- Système de Gestion Hôtelière - Hôtel de Rêve
-- Compatible : MySQL, MariaDB (phpMyAdmin / XAMPP / WampServer)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS hotel_de_reve_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_de_reve_db;

-- 1. Table des Utilisateurs & Personnel
CREATE TABLE IF NOT EXISTS utilisateurs (
    id_utilisateur VARCHAR(50) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'RECEPTIONIST') NOT NULL DEFAULT 'RECEPTIONIST',
    email VARCHAR(150),
    telephone VARCHAR(30),
    date_creation DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table des Chambres
CREATE TABLE IF NOT EXISTS chambres (
    id_chambre VARCHAR(50) PRIMARY KEY,
    numero VARCHAR(20) NOT NULL UNIQUE,
    type ENUM('Simple', 'Double', 'Twin', 'Suite', 'Familiale') NOT NULL,
    etage INT NOT NULL DEFAULT 1,
    capacite INT NOT NULL DEFAULT 2,
    prix_nuit DECIMAL(12, 2) NOT NULL, -- en Ariary (MGA)
    statut ENUM('Disponible', 'Occupée', 'Réservée', 'En nettoyage', 'Hors service') NOT NULL DEFAULT 'Disponible',
    description TEXT,
    amenities TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table des Clients
CREATE TABLE IF NOT EXISTS clients (
    id_client VARCHAR(50) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    sexe ENUM('M', 'F') NOT NULL DEFAULT 'M',
    telephone VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    adresse VARCHAR(255),
    piece_identite VARCHAR(100) NOT NULL,
    date_enregistrement DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table des Réservations
CREATE TABLE IF NOT EXISTS reservations (
    id_reservation VARCHAR(50) PRIMARY KEY,
    numero_reservation VARCHAR(50) NOT NULL UNIQUE,
    id_client VARCHAR(50) NOT NULL,
    id_chambre VARCHAR(50) NOT NULL,
    date_reservation DATE NOT NULL,
    date_arrivee DATE NOT NULL,
    date_depart DATE NOT NULL,
    date_checkin_effectif DATETIME NULL,
    date_checkout_effectif DATETIME NULL,
    nombre_personnes INT NOT NULL DEFAULT 1,
    nombre_nuits INT NOT NULL DEFAULT 1,
    prix_total DECIMAL(12, 2) NOT NULL, -- en Ariary
    statut ENUM('En attente', 'Confirmée', 'En cours', 'Terminée', 'Annulée') NOT NULL DEFAULT 'Confirmée',
    remarques TEXT,
    CONSTRAINT fk_res_client FOREIGN KEY (id_client) REFERENCES clients(id_client) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_res_chambre FOREIGN KEY (id_chambre) REFERENCES chambres(id_chambre) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Table des Paiements
CREATE TABLE IF NOT EXISTS paiements (
    id_paiement VARCHAR(50) PRIMARY KEY,
    numero_paiement VARCHAR(50) NOT NULL UNIQUE,
    id_reservation VARCHAR(50) NOT NULL,
    date_paiement DATE NOT NULL,
    montant DECIMAL(12, 2) NOT NULL, -- en Ariary
    mode_paiement ENUM('Espèces', 'Carte bancaire', 'MVola', 'Orange Money', 'Airtel Money') NOT NULL DEFAULT 'Espèces',
    statut ENUM('Payé', 'Partiellement payé', 'Non payé') NOT NULL DEFAULT 'Payé',
    reference VARCHAR(100),
    CONSTRAINT fk_pay_reservation FOREIGN KEY (id_reservation) REFERENCES reservations(id_reservation) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Table des Factures
CREATE TABLE IF NOT EXISTS factures (
    id_facture VARCHAR(50) PRIMARY KEY,
    numero_facture VARCHAR(50) NOT NULL UNIQUE,
    id_reservation VARCHAR(50) NOT NULL,
    date_facture DATE NOT NULL,
    montant_total DECIMAL(12, 2) NOT NULL,
    montant_paye DECIMAL(12, 2) NOT NULL DEFAULT 0,
    reste_a_payer DECIMAL(12, 2) NOT NULL DEFAULT 0,
    mode_paiement VARCHAR(50),
    CONSTRAINT fk_fac_reservation FOREIGN KEY (id_reservation) REFERENCES reservations(id_reservation) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- JEU DE DONNÉES INITIALES (Exemples réels en Ariary MGA)
-- ==========================================================

INSERT INTO utilisateurs (id_utilisateur, nom, prenom, username, password, role, email, telephone, date_creation) VALUES
('usr_1', 'Andrianina', 'Hery', 'admin', 'admin123', 'ADMIN', 'admin@hotel-de-reve.mg', '+261 34 11 222 33', '2026-01-15'),
('usr_2', 'Rasoa', 'Mireille', 'reception', 'reception123', 'RECEPTIONIST', 'reception@hotel-de-reve.mg', '+261 33 44 555 66', '2026-02-01');

INSERT INTO chambres (id_chambre, numero, type, etage, capacite, prix_nuit, statut, description) VALUES
('rm_101', '101', 'Simple', 1, 1, 80000.00, 'Disponible', 'Chambre simple confortable'),
('rm_102', '102', 'Double', 1, 2, 120000.00, 'Occupée', 'Lit double King-size, climatisée'),
('rm_103', '103', 'Twin', 1, 2, 130000.00, 'En nettoyage', 'Deux lits jumeaux'),
('rm_201', '201', 'Suite', 2, 3, 250000.00, 'Occupée', 'Suite Prestige avec salon privé'),
('rm_202', '202', 'Familiale', 2, 4, 200000.00, 'Réservée', 'Chambre familiale spacieuse'),
('rm_301', '301', 'Suite', 3, 2, 320000.00, 'Disponible', 'Suite panoramique vue colline');

INSERT INTO clients (id_client, nom, prenom, sexe, telephone, email, adresse, piece_identite, date_enregistrement) VALUES
('cli_1', 'Rakoto', 'Jean', 'M', '034 12 345 67', 'jean.rakoto@gmail.com', 'Ankorondrano, Antananarivo', 'CIN 101234567890', '2026-03-01'),
('cli_2', 'Ramananarivo', 'Voahirana', 'F', '033 98 765 43', 'voahirana@yahoo.fr', 'Ivandry, Antananarivo', 'CIN 101987654321', '2026-03-05');

INSERT INTO reservations (id_reservation, numero_reservation, id_client, id_chambre, date_reservation, date_arrivee, date_depart, nombre_personnes, nombre_nuits, prix_total, statut, remarques) VALUES
('res_1', 'REV-2026-001', 'cli_1', 'rm_102', '2026-03-15', '2026-03-18', '2026-03-22', 2, 4, 480000.00, 'En cours', 'Arrivée tardive'),
('res_2', 'REV-2026-002', 'cli_2', 'rm_201', '2026-03-16', '2026-03-19', '2026-03-23', 2, 4, 1000000.00, 'En cours', 'Navette aéroport');

INSERT INTO paiements (id_paiement, numero_paiement, id_reservation, date_paiement, montant, mode_paiement, statut, reference) VALUES
('pay_1', 'PAY-2026-001', 'res_1', '2026-03-18', 480000.00, 'MVola', 'Payé', 'MVOLA-894721');

INSERT INTO factures (id_facture, numero_facture, id_reservation, date_facture, montant_total, montant_paye, reste_a_payer, mode_paiement) VALUES
('fac_1', 'FAC-2026-001', 'res_1', '2026-03-18', 480000.00, 480000.00, 0.00, 'MVola');
