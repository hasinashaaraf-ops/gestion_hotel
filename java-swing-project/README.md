# 🏨 Hôtel de Rêve - Application Java Swing Desktop

Projet de Gestion Hôtelière moderne développé en **Java Swing** avec le Look & Feel moderne (FlatLaf), reprenantfidèlement le design SaaS du tableau de bord (Sidebar Noire `#0A0A0C`, Top bar Bleu Royal `#1C4FD8`, cartes à coins arrondis et graphiques personnalisés).

---

## 🚀 Fonctionnalités Incluses

1. **Dashboard Moderne**
   - 3 cartes KPI supérieures (dont la carte dégradée Bleu Royal pour le Chiffre d'Affaires).
   - Graphique en vague spline (Wave Chart) dessiné avec antialiasing Graphics2D.
   - Sélecteur de date / Timeline journalière sous forme de capsules.
   - Graphique circulaire Donut de répartition des sources de réservation.

2. **Gestion des Chambres**
   - Liste des chambres avec numéros, étages, types (Simple, Double, Suite, etc.) et tarifs en **Ariary (MGA)**.
   - Badges de statuts en couleur (*Disponible*, *Occupée*, *En nettoyage*, *Réservée*).
   - Formulaire d'ajout de chambre avec validation.
   - Action rapide "Marquer comme nettoyée".

3. **Réservations**
   - Création de réservations avec sélection du client et de la chambre.
   - Calcul automatique de la durée et du montant total en Ariary.
   - Suivi des statuts (*Confirmée*, *En cours*, *Terminée*).

4. **Check-In / Check-Out**
   - Validation de l'arrivée du voyageur -> Changement automatique du statut de la chambre en **Occupée**.
   - Validation du départ du voyageur -> Changement automatique du statut de la chambre en **En nettoyage**.

---

## 🛠️ Comment Exécuter le Projet

### Option 1 : Avec Maven (Recommandé)

```bash
# Compiler le projet
mvn clean compile

# Lancer l'application
mvn exec:java
```

### Option 2 : Dans IntelliJ IDEA
1. Ouvrez IntelliJ IDEA -> `File` -> `Open...` -> sélectionnez le dossier contenant `pom.xml`.
2. Laissez Maven synchroniser les dépendances (FlatLaf).
3. Ouvrez `src/main/java/com/hoteldereve/MainApp.java`.
4. Cliquez sur le bouton vert **Run** (ou `Shift + F10`).

### Option 3 : Dans Eclipse
1. `File` -> `Import...` -> `Existing Maven Projects`.
2. Sélectionnez le dossier racine.
3. Faites un clic droit sur `MainApp.java` -> `Run As` -> `Java Application`.

### Option 4 : Dans NetBeans
1. `File` -> `Open Project...`. NetBeans reconnaîtra automatiquement le projet Maven.
2. Faites un clic droit sur le projet -> `Run`.

---

## 📦 Structure du Code

```text
java-swing-project/
├── pom.xml
├── README.md
└── src/
    └── main/
        └── java/
            └── com/
                └── hoteldereve/
                    ├── MainApp.java                      # Point d'entrée JFrame & Layout principal
                    ├── model/
                    │   ├── Chambre.java                  # Entité Chambre
                    │   ├── Client.java                   # Entité Client
                    │   ├── Reservation.java              # Entité Réservation
                    │   ├── Paiement.java                 # Entité Paiement (Ariary, MVola, etc.)
                    │   ├── Facture.java                  # Entité Facture
                    │   └── Utilisateur.java              # Entité Utilisateur / Rôles
                    ├── service/
                    │   └── HotelService.java             # Singleton & Gestion des données
                    └── ui/
                        ├── DashboardPanel.java           # Vue Tableau de bord (KPIs, Charts)
                        ├── ChambresPanel.java            # Vue Tableau des chambres
                        ├── ReservationsPanel.java        # Vue Réservations & Planning
                        ├── CheckInOutPanel.java          # Vue Arrivées & Départs
                        └── components/
                            ├── RoundedPanel.java         # Panneau Swing à coins arrondis
                            ├── RoundedButton.java        # Bouton moderne personnalisé
                            ├── WaveChartPanel.java       # Graphique en vague antialiasé
                            └── DonutChartPanel.java      # Graphique Donut antialiasé
```
