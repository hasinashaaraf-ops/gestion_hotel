package com.hoteldereve.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Gestionnaire de connexion JDBC à la base de données relationnelle MySQL / MariaDB (phpMyAdmin)
 * Base de données : hotel_de_reve_db
 */
public class DBConnection {
    // Configuration pour MySQL local (XAMPP / WampServer / Laragon / phpMyAdmin)
    private static final String URL = "jdbc:mysql://localhost:3306/hotel_de_reve_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASSWORD = ""; // Par défaut vide sur XAMPP/WAMP

    private static Connection connection = null;

    public static Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                // Charger le driver MySQL Connector/J
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
                System.out.println("✓ Connexion à MySQL hotel_de_reve_db réussie !");
            }
        } catch (ClassNotFoundException e) {
            System.err.println("Driver MySQL introuvable. Ajoutez mysql-connector-j dans votre pom.xml ou build path.");
        } catch (SQLException e) {
            System.err.println("Erreur de connexion SQL : " + e.getMessage());
        }
        return connection;
    }

    public static void closeConnection() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                System.out.println("Connexion fermée.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
