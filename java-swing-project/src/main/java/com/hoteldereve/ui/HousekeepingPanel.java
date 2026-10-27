package com.hoteldereve.ui;

import com.hoteldereve.model.Chambre;
import com.hoteldereve.service.HotelService;
import com.hoteldereve.ui.components.RoundedButton;
import com.hoteldereve.ui.components.RoundedPanel;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.util.List;
import java.util.stream.Collectors;

public class HousekeepingPanel extends JPanel {
    private final HotelService hotelService = HotelService.getInstance();
    private JTable table;
    private DefaultTableModel tableModel;
    private JLabel lblStatusInfo;

    public HousekeepingPanel() {
        setLayout(new BorderLayout(0, 16));
        setOpaque(false);
        setBorder(new EmptyBorder(16, 20, 20, 20));

        initUI();
    }

    private void initUI() {
        // Top Action Bar
        JPanel topBar = new JPanel(new BorderLayout());
        topBar.setOpaque(false);

        JPanel left = new JPanel(new GridLayout(2, 1, 0, 2));
        left.setOpaque(false);
        JLabel title = new JLabel("Service d'Étages & Gouvernante");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(new Color(15, 23, 42));

        lblStatusInfo = new JLabel("Chambres à nettoyer en priorité après départ client");
        lblStatusInfo.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lblStatusInfo.setForeground(new Color(100, 116, 139));
        left.add(title);
        left.add(lblStatusInfo);

        JPanel rightActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        rightActions.setOpaque(false);

        RoundedButton btnValidate = RoundedButton.createRoyalBlueButton("✔ Valider propreté (Remise en Disponible)");
        btnValidate.addActionListener(e -> validerNettoyage());

        RoundedButton btnMaintenance = new RoundedButton("Mettre hors service", new Color(254, 226, 226), new Color(185, 28, 28));
        btnMaintenance.setPreferredSize(new Dimension(160, 36));
        btnMaintenance.addActionListener(e -> mettreEnMaintenance());

        rightActions.add(btnMaintenance);
        rightActions.add(btnValidate);

        topBar.add(left, BorderLayout.WEST);
        topBar.add(rightActions, BorderLayout.EAST);
        add(topBar, BorderLayout.NORTH);

        // Center Table Card
        RoundedPanel card = new RoundedPanel(16, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(8, 8, 8, 8));

        String[] columns = {"Numéro", "Étage", "Type", "État Actuel", "Priorité Nettoyage", "Consignes d'entretien"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        table = new JTable(tableModel);
        table.setRowHeight(40);
        table.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        table.setSelectionBackground(new Color(239, 246, 255));
        table.setSelectionForeground(new Color(28, 79, 216));
        table.setShowGrid(false);

        JTableHeader th = table.getTableHeader();
        th.setFont(new Font("Segoe UI", Font.BOLD, 11));
        th.setBackground(new Color(248, 250, 252));
        th.setForeground(new Color(100, 116, 139));
        th.setPreferredSize(new Dimension(0, 36));

        DefaultTableCellRenderer center = new DefaultTableCellRenderer();
        center.setHorizontalAlignment(SwingConstants.CENTER);
        table.getColumnModel().getColumn(0).setCellRenderer(center);
        table.getColumnModel().getColumn(1).setCellRenderer(center);
        table.getColumnModel().getColumn(2).setCellRenderer(center);

        table.getColumnModel().getColumn(3).setCellRenderer((t, value, isSelected, hasFocus, row, column) -> {
            String val = value != null ? value.toString() : "";
            JLabel badge = new JLabel(val, SwingConstants.CENTER);
            badge.setOpaque(true);
            badge.setFont(new Font("Segoe UI", Font.BOLD, 11));
            badge.setBorder(new EmptyBorder(4, 8, 4, 8));

            if ("En nettoyage".equalsIgnoreCase(val)) {
                badge.setBackground(new Color(224, 242, 254)); // Sky blue
                badge.setForeground(new Color(3, 105, 161));
            } else if ("Hors service".equalsIgnoreCase(val)) {
                badge.setBackground(new Color(254, 226, 226)); // Red
                badge.setForeground(new Color(185, 28, 28));
            } else {
                badge.setBackground(new Color(241, 245, 249));
                badge.setForeground(new Color(71, 85, 105));
            }
            return badge;
        });

        table.getColumnModel().getColumn(4).setCellRenderer((t, value, isSelected, hasFocus, row, column) -> {
            String val = value != null ? value.toString() : "Normale";
            JLabel badge = new JLabel(val, SwingConstants.CENTER);
            badge.setOpaque(true);
            badge.setFont(new Font("Segoe UI", Font.BOLD, 11));
            badge.setBorder(new EmptyBorder(4, 8, 4, 8));

            if ("URGENTE".equalsIgnoreCase(val)) {
                badge.setBackground(new Color(254, 242, 242));
                badge.setForeground(new Color(220, 38, 38));
            } else {
                badge.setBackground(new Color(241, 245, 249));
                badge.setForeground(new Color(100, 116, 139));
            }
            return badge;
        });

        JScrollPane scroll = new JScrollPane(table);
        scroll.setBorder(BorderFactory.createEmptyBorder());
        scroll.getViewport().setBackground(Color.WHITE);
        card.add(scroll, BorderLayout.CENTER);

        add(card, BorderLayout.CENTER);

        refreshTable();
    }

    public void refreshTable() {
        tableModel.setRowCount(0);
        List<Chambre> rooms = hotelService.getChambres();

        // Filtre les chambres nécessitant une attention (En nettoyage ou Hors service)
        List<Chambre> alertRooms = rooms.stream()
                .filter(r -> "En nettoyage".equalsIgnoreCase(r.getStatut()) || "Hors service".equalsIgnoreCase(r.getStatut()))
                .collect(Collectors.toList());

        long cleanCount = rooms.stream().filter(r -> "En nettoyage".equalsIgnoreCase(r.getStatut())).count();
        long outCount = rooms.stream().filter(r -> "Hors service".equalsIgnoreCase(r.getStatut())).count();

        lblStatusInfo.setText(cleanCount + " chambre(s) à nettoyer après départ client · " + outCount + " chambre(s) en maintenance");

        if (alertRooms.isEmpty()) {
            tableModel.addRow(new Object[]{"-", "-", "-", "Toutes propres", "Aucune", "Toutes les chambres de l'hôtel sont impeccables et prêtes."});
            return;
        }

        for (Chambre c : alertRooms) {
            String priorite = "En nettoyage".equalsIgnoreCase(c.getStatut()) ? "URGENTE" : "Standard";
            String consigne = "En nettoyage".equalsIgnoreCase(c.getStatut())
                    ? "Changer les draps, désinfecter la salle de bain, réapprovisionner savon/serviettes."
                    : "Maintenance technique plomberie / électricité en cours.";

            tableModel.addRow(new Object[]{
                    "Chambre " + c.getNumero(),
                    "Étage " + c.getEtage(),
                    c.getType(),
                    c.getStatut(),
                    priorite,
                    consigne
            });
        }
    }

    private void validerNettoyage() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Sélectionnez une chambre dans le tableau pour valider son nettoyage.", "Sélection requise", JOptionPane.INFORMATION_MESSAGE);
            return;
        }

        String numStr = (String) tableModel.getValueAt(row, 0);
        if (numStr == null || numStr.startsWith("-")) return;

        String roomNum = numStr.replace("Chambre ", "").trim();
        Chambre target = null;
        for (Chambre c : hotelService.getChambres()) {
            if (c.getNumero().equalsIgnoreCase(roomNum)) {
                target = c;
                break;
            }
        }

        if (target != null) {
            target.setStatut("Disponible");
            refreshTable();
            JOptionPane.showMessageDialog(this, "La Chambre " + roomNum + " est maintenant certifiée propre et DISPONIBLE à la réception !", "Propreté Validée", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void mettreEnMaintenance() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Sélectionnez une chambre pour changer son statut.", "Sélection requise", JOptionPane.INFORMATION_MESSAGE);
            return;
        }

        String numStr = (String) tableModel.getValueAt(row, 0);
        if (numStr == null || numStr.startsWith("-")) return;

        String roomNum = numStr.replace("Chambre ", "").trim();
        for (Chambre c : hotelService.getChambres()) {
            if (c.getNumero().equalsIgnoreCase(roomNum)) {
                c.setStatut("Hors service");
                break;
            }
        }
        refreshTable();
    }
}
