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

public class ChambresPanel extends JPanel {
    private final HotelService hotelService = HotelService.getInstance();
    private JTable table;
    private DefaultTableModel tableModel;

    // Filtres interactifs
    private JComboBox<String> cbFilterStatut;
    private JComboBox<String> cbFilterType;
    private JTextField tfSearchRoom;

    public ChambresPanel() {
        setLayout(new BorderLayout(0, 14));
        setOpaque(false);
        setBorder(new EmptyBorder(16, 20, 20, 20));

        initUI();
    }

    private void initUI() {
        // Top Section: Title & Actions
        JPanel topSection = new JPanel(new BorderLayout(0, 12));
        topSection.setOpaque(false);

        JPanel headerBar = new JPanel(new BorderLayout());
        headerBar.setOpaque(false);

        JPanel left = new JPanel(new GridLayout(2, 1, 0, 2));
        left.setOpaque(false);
        JLabel title = new JLabel("Gestion du Parc des Chambres");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(new Color(15, 23, 42));

        JLabel sub = new JLabel("Consultez, filtrez par statut/type et mettez à jour les disponibilités");
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        sub.setForeground(new Color(100, 116, 139));
        left.add(title);
        left.add(sub);

        RoundedButton btnAdd = RoundedButton.createRoyalBlueButton("+ Ajouter une chambre");
        btnAdd.addActionListener(e -> showAddChambreDialog());

        headerBar.add(left, BorderLayout.WEST);
        headerBar.add(btnAdd, BorderLayout.EAST);
        topSection.add(headerBar, BorderLayout.NORTH);

        // Filter Bar (Barre de filtres interactive)
        RoundedPanel filterCard = new RoundedPanel(14, Color.WHITE, new Color(226, 232, 240));
        filterCard.setLayout(new FlowLayout(FlowLayout.LEFT, 12, 8));

        JLabel lblFilter = new JLabel("Filtres :");
        lblFilter.setFont(new Font("Segoe UI", Font.BOLD, 12));
        lblFilter.setForeground(new Color(71, 85, 105));
        filterCard.add(lblFilter);

        // 1. Filtre par Statut
        cbFilterStatut = new JComboBox<>(new String[]{
                "Tous les statuts", "Disponible", "Occupée", "Réservée", "En nettoyage", "Hors service"
        });
        cbFilterStatut.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        cbFilterStatut.addActionListener(e -> refreshTable());
        filterCard.add(new JLabel("Statut :"));
        filterCard.add(cbFilterStatut);

        // 2. Filtre par Type de Chambre
        cbFilterType = new JComboBox<>(new String[]{
                "Tous les types", "Simple", "Double", "Twin", "Suite", "Familiale"
        });
        cbFilterType.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        cbFilterType.addActionListener(e -> refreshTable());
        filterCard.add(new JLabel("Type :"));
        filterCard.add(cbFilterType);

        // 3. Recherche instantanée par N°
        tfSearchRoom = new JTextField(10);
        tfSearchRoom.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        tfSearchRoom.putClientProperty("JTextField.placeholderText", "N° Chambre (ex: 101)");
        tfSearchRoom.addCaretListener(e -> refreshTable());
        filterCard.add(new JLabel("Recherche N° :"));
        filterCard.add(tfSearchRoom);

        JButton btnReset = new JButton("Réinitialiser");
        btnReset.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        btnReset.addActionListener(e -> {
            cbFilterStatut.setSelectedIndex(0);
            cbFilterType.setSelectedIndex(0);
            tfSearchRoom.setText("");
            refreshTable();
        });
        filterCard.add(btnReset);

        topSection.add(filterCard, BorderLayout.SOUTH);
        add(topSection, BorderLayout.NORTH);

        // Center Table Card
        RoundedPanel card = new RoundedPanel(16, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(8, 8, 8, 8));

        String[] columns = {"Numéro", "Type", "Étage", "Capacité", "Prix / Nuit (Ar)", "Statut", "Description"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        table = new JTable(tableModel);
        table.setRowHeight(38);
        table.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        table.setSelectionBackground(new Color(239, 246, 255));
        table.setSelectionForeground(new Color(28, 79, 216));
        table.setShowGrid(false);

        JTableHeader th = table.getTableHeader();
        th.setFont(new Font("Segoe UI", Font.BOLD, 11));
        th.setBackground(new Color(248, 250, 252));
        th.setForeground(new Color(100, 116, 139));
        th.setPreferredSize(new Dimension(0, 36));

        DefaultTableCellRenderer centerRenderer = new DefaultTableCellRenderer();
        centerRenderer.setHorizontalAlignment(SwingConstants.CENTER);
        table.getColumnModel().getColumn(0).setCellRenderer(centerRenderer);
        table.getColumnModel().getColumn(2).setCellRenderer(centerRenderer);
        table.getColumnModel().getColumn(3).setCellRenderer(centerRenderer);

        // Custom status badge renderer
        table.getColumnModel().getColumn(5).setCellRenderer((t, value, isSelected, hasFocus, row, column) -> {
            String val = value != null ? value.toString() : "";
            JLabel badge = new JLabel(val, SwingConstants.CENTER);
            badge.setOpaque(true);
            badge.setFont(new Font("Segoe UI", Font.BOLD, 11));
            badge.setBorder(new EmptyBorder(4, 8, 4, 8));

            if ("Disponible".equalsIgnoreCase(val)) {
                badge.setBackground(new Color(220, 252, 231)); // Emerald soft
                badge.setForeground(new Color(22, 101, 52));
            } else if ("Occupée".equalsIgnoreCase(val)) {
                badge.setBackground(new Color(219, 234, 254)); // Blue soft
                badge.setForeground(new Color(30, 64, 175));
            } else if ("En nettoyage".equalsIgnoreCase(val)) {
                badge.setBackground(new Color(254, 243, 199)); // Amber soft
                badge.setForeground(new Color(146, 64, 14));
            } else if ("Réservée".equalsIgnoreCase(val)) {
                badge.setBackground(new Color(243, 232, 255)); // Purple soft
                badge.setForeground(new Color(107, 33, 168));
            } else {
                badge.setBackground(new Color(241, 245, 249));
                badge.setForeground(new Color(71, 85, 105));
            }
            return badge;
        });

        JScrollPane scrollPane = new JScrollPane(table);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());
        scrollPane.getViewport().setBackground(Color.WHITE);
        card.add(scrollPane, BorderLayout.CENTER);

        // Bottom status switcher bar
        JPanel bottomBar = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 8));
        bottomBar.setOpaque(false);

        RoundedButton btnSetDispo = new RoundedButton("✓ Passer en Disponible", new Color(16, 185, 129), Color.WHITE);
        btnSetDispo.addActionListener(e -> updateSelectedRoomStatus("Disponible"));

        RoundedButton btnSetMaintenance = new RoundedButton("Mettre hors service", new Color(254, 226, 226), new Color(185, 28, 28));
        btnSetMaintenance.addActionListener(e -> updateSelectedRoomStatus("Hors service"));

        bottomBar.add(btnSetMaintenance);
        bottomBar.add(btnSetDispo);
        card.add(bottomBar, BorderLayout.SOUTH);

        add(card, BorderLayout.CENTER);

        refreshTable();
    }

    private void updateSelectedRoomStatus(String newStatut) {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Sélectionnez une chambre dans le tableau.", "Sélection requise", JOptionPane.INFORMATION_MESSAGE);
            return;
        }

        String num = (String) tableModel.getValueAt(row, 0);
        for (Chambre c : hotelService.getChambres()) {
            if (c.getNumero().equalsIgnoreCase(num)) {
                c.setStatut(newStatut);
                break;
            }
        }
        refreshTable();
        JOptionPane.showMessageDialog(this, "Chambre " + num + " passée au statut : " + newStatut, "Statut Modifié", JOptionPane.INFORMATION_MESSAGE);
    }

    public void refreshTable() {
        tableModel.setRowCount(0);
        List<Chambre> rooms = hotelService.getChambres();

        // 1. Filtre Statut
        String filterStatut = cbFilterStatut != null ? (String) cbFilterStatut.getSelectedItem() : "Tous les statuts";
        if (filterStatut != null && !filterStatut.startsWith("Tous")) {
            rooms = rooms.stream().filter(r -> filterStatut.equalsIgnoreCase(r.getStatut())).collect(Collectors.toList());
        }

        // 2. Filtre Type
        String filterType = cbFilterType != null ? (String) cbFilterType.getSelectedItem() : "Tous les types";
        if (filterType != null && !filterType.startsWith("Tous")) {
            rooms = rooms.stream().filter(r -> filterType.equalsIgnoreCase(r.getType())).collect(Collectors.toList());
        }

        // 3. Filtre N° de chambre
        String searchNum = tfSearchRoom != null ? tfSearchRoom.getText().trim().toLowerCase() : "";
        if (!searchNum.isEmpty()) {
            rooms = rooms.stream().filter(r -> r.getNumero().toLowerCase().contains(searchNum)).collect(Collectors.toList());
        }

        for (Chambre c : rooms) {
            tableModel.addRow(new Object[]{
                    c.getNumero(),
                    c.getType(),
                    "Étage " + c.getEtage(),
                    c.getCapacite() + " pers.",
                    HotelService.formatAriary(c.getPrixNuit()),
                    c.getStatut(),
                    c.getDescription()
            });
        }
    }

    private void showAddChambreDialog() {
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Ajouter une Chambre", true);
        dialog.setSize(440, 420);
        dialog.setLocationRelativeTo(this);

        JPanel panel = new JPanel(new GridLayout(6, 2, 10, 12));
        panel.setBorder(new EmptyBorder(20, 20, 20, 20));
        panel.setBackground(Color.WHITE);

        JTextField tfNum = new JTextField();
        JComboBox<String> cbType = new JComboBox<>(new String[]{"Simple", "Double", "Twin", "Suite", "Familiale"});
        JSpinner spEtage = new JSpinner(new SpinnerNumberModel(1, 1, 10, 1));
        JSpinner spCapacite = new JSpinner(new SpinnerNumberModel(2, 1, 10, 1));
        JTextField tfPrix = new JTextField("120000");
        JTextField tfDesc = new JTextField();

        panel.add(new JLabel("Numéro Chambre :"));
        panel.add(tfNum);
        panel.add(new JLabel("Catégorie :"));
        panel.add(cbType);
        panel.add(new JLabel("Étage :"));
        panel.add(spEtage);
        panel.add(new JLabel("Capacité personnes :"));
        panel.add(spCapacite);
        panel.add(new JLabel("Tarif / Nuit (Ariary) :"));
        panel.add(tfPrix);
        panel.add(new JLabel("Description :"));
        panel.add(tfDesc);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        btnPanel.setBackground(Color.WHITE);
        JButton btnCancel = new JButton("Annuler");
        btnCancel.addActionListener(e -> dialog.dispose());

        RoundedButton btnSave = RoundedButton.createRoyalBlueButton("Enregistrer");
        btnSave.addActionListener(e -> {
            try {
                String num = tfNum.getText().trim();
                if (num.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog, "Veuillez saisir un numéro de chambre.");
                    return;
                }
                double px = Double.parseDouble(tfPrix.getText().trim());
                String id = "CH-" + num;
                Chambre ch = new Chambre(id, num, (String) cbType.getSelectedItem(),
                        (Integer) spEtage.getValue(), (Integer) spCapacite.getValue(), px, "Disponible", tfDesc.getText().trim());

                hotelService.ajouterChambre(ch);
                refreshTable();
                dialog.dispose();
                JOptionPane.showMessageDialog(this, "Chambre " + num + " ajoutée avec succès !");
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(dialog, "Erreur dans les données saisies.");
            }
        });

        btnPanel.add(btnCancel);
        btnPanel.add(btnSave);

        dialog.getContentPane().setLayout(new BorderLayout());
        dialog.getContentPane().add(panel, BorderLayout.CENTER);
        dialog.getContentPane().add(btnPanel, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }
}
