package com.hoteldereve.ui;

import com.hoteldereve.model.Chambre;
import com.hoteldereve.model.Client;
import com.hoteldereve.model.Reservation;
import com.hoteldereve.service.HotelService;
import com.hoteldereve.ui.components.RoundedButton;
import com.hoteldereve.ui.components.RoundedPanel;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class CheckInOutPanel extends JPanel {
    private final HotelService hotelService = HotelService.getInstance();
    private DefaultTableModel checkInModel;
    private DefaultTableModel checkOutModel;
    private JTable checkInTable;
    private JTable checkOutTable;

    public CheckInOutPanel() {
        setLayout(new BorderLayout(0, 16));
        setOpaque(false);
        setBorder(new EmptyBorder(16, 20, 20, 20));

        initUI();
    }

    private void initUI() {
        // Top Header
        JPanel topBar = new JPanel(new GridLayout(2, 1, 0, 2));
        topBar.setOpaque(false);
        JLabel title = new JLabel("Check-in & Check-out des Voyageurs");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(new Color(15, 23, 42));

        JLabel sub = new JLabel("Enregistrez les arrivées (remise des clés) et les départs (facturation & nettoyage)");
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        sub.setForeground(new Color(100, 116, 139));
        topBar.add(title);
        topBar.add(sub);
        add(topBar, BorderLayout.NORTH);

        // Center: Two cards split horizontally
        JPanel center = new JPanel(new GridLayout(1, 2, 16, 0));
        center.setOpaque(false);

        // Left: Check-in (Arrivées)
        center.add(createCheckInCard());

        // Right: Check-out (Départs)
        center.add(createCheckOutCard());

        add(center, BorderLayout.CENTER);
    }

    private JPanel createCheckInCard() {
        RoundedPanel card = new RoundedPanel(16, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout(0, 10));
        card.setBorder(new EmptyBorder(16, 16, 16, 16));

        JLabel title = new JLabel("Arrivées en attente de Check-In");
        title.setFont(new Font("Segoe UI", Font.BOLD, 14));
        title.setForeground(new Color(28, 79, 216));
        card.add(title, BorderLayout.NORTH);

        String[] cols = {"N° Réservation", "Client", "Chambre", "Statut"};
        checkInModel = new DefaultTableModel(cols, 0) {
            @Override
            public boolean isCellEditable(int r, int c) { return false; }
        };
        checkInTable = new JTable(checkInModel);
        checkInTable.setRowHeight(32);
        card.add(new JScrollPane(checkInTable), BorderLayout.CENTER);

        RoundedButton btnValiderCheckIn = RoundedButton.createRoyalBlueButton("✓ Valider le Check-In");
        btnValiderCheckIn.addActionListener(e -> {
            int row = checkInTable.getSelectedRow();
            if (row >= 0) {
                String resNum = (String) checkInModel.getValueAt(row, 0);
                for (Reservation r : hotelService.getReservations()) {
                    if (r.getNumeroReservation().equals(resNum)) {
                        hotelService.checkIn(r.getId());
                        break;
                    }
                }
                refreshData();
                JOptionPane.showMessageDialog(this, "Check-in validé ! La chambre est maintenant OCCUPÉE.", "Succès", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, "Sélectionnez une réservation à enregistrer.", "Information", JOptionPane.INFORMATION_MESSAGE);
            }
        });

        JPanel bot = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        bot.setOpaque(false);
        bot.add(btnValiderCheckIn);
        card.add(bot, BorderLayout.SOUTH);

        return card;
    }

    private JPanel createCheckOutCard() {
        RoundedPanel card = new RoundedPanel(16, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout(0, 10));
        card.setBorder(new EmptyBorder(16, 16, 16, 16));

        JLabel title = new JLabel("Séjours en cours (Prêts pour Check-Out)");
        title.setFont(new Font("Segoe UI", Font.BOLD, 14));
        title.setForeground(new Color(15, 23, 42));
        card.add(title, BorderLayout.NORTH);

        String[] cols = {"N° Réservation", "Client", "Chambre", "Total (Ar)"};
        checkOutModel = new DefaultTableModel(cols, 0) {
            @Override
            public boolean isCellEditable(int r, int c) { return false; }
        };
        checkOutTable = new JTable(checkOutModel);
        checkOutTable.setRowHeight(32);
        card.add(new JScrollPane(checkOutTable), BorderLayout.CENTER);

        RoundedButton btnValiderCheckOut = RoundedButton.createDarkButton("⎋ Valider le Check-Out");
        btnValiderCheckOut.addActionListener(e -> {
            int row = checkOutTable.getSelectedRow();
            if (row >= 0) {
                String resNum = (String) checkOutModel.getValueAt(row, 0);
                for (Reservation r : hotelService.getReservations()) {
                    if (r.getNumeroReservation().equals(resNum)) {
                        hotelService.checkOut(r.getId());
                        break;
                    }
                }
                refreshData();
                JOptionPane.showMessageDialog(this, "Check-out validé ! La chambre passe en statut 'EN NETTOYAGE'.", "Succès", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, "Sélectionnez un séjour pour effectuer le check-out.", "Information", JOptionPane.INFORMATION_MESSAGE);
            }
        });

        JPanel bot = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        bot.setOpaque(false);
        bot.add(btnValiderCheckOut);
        card.add(bot, BorderLayout.SOUTH);

        return card;
    }

    public void refreshData() {
        checkInModel.setRowCount(0);
        checkOutModel.setRowCount(0);

        List<Reservation> list = hotelService.getReservations();
        for (Reservation r : list) {
            Client c = hotelService.findClientById(r.getIdClient());
            Chambre ch = hotelService.findChambreById(r.getIdChambre());
            String cName = c != null ? c.getNomComplet() : "Client";
            String chNum = ch != null ? "Ch. " + ch.getNumero() : "Chambre";

            if ("Confirmée".equalsIgnoreCase(r.getStatut()) || "En attente".equalsIgnoreCase(r.getStatut())) {
                checkInModel.addRow(new Object[]{r.getNumeroReservation(), cName, chNum, r.getStatut()});
            } else if ("En cours".equalsIgnoreCase(r.getStatut())) {
                checkOutModel.addRow(new Object[]{r.getNumeroReservation(), cName, chNum, HotelService.formatAriary(r.getPrixTotal())});
            }
        }
    }
}
