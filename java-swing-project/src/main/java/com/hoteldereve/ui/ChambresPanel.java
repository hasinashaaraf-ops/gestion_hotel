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

public class ChambresPanel extends JPanel {
    private final HotelService hotelService = HotelService.getInstance();
    private JTable table;
    private DefaultTableModel tableModel;

    public ChambresPanel() {
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
        JLabel title = new JLabel("Gestion des Chambres");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(new Color(15, 23, 42));

        JLabel sub = new JLabel("Consultez, modifiez les tarifs en Ariary et mettez à jour les statuts");
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        sub.setForeground(new Color(100, 116, 139));
        left.add(title);
        left.add(sub);

        RoundedButton btnAdd = RoundedButton.createRoyalBlueButton("+ Ajouter une chambre");
        btnAdd.addActionListener(e -> showAddChambreDialog());

        topBar.add(left, BorderLayout.WEST);
        topBar.add(btnAdd, BorderLayout.EAST);
        add(topBar, BorderLayout.NORTH);

        // Center Table Card
        RoundedPanel card = new RoundedPanel(16, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(8, 8, 8, 8));

        String[] columns = {"Numéro", "Type", "Étage", "Capacité", "Prix / Nuit (Ar)", "Statut", "Description", "Action"};
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
        table.setIntercellSpacing(new Dimension(0, 0));

        JTableHeader th = table.getTableHeader();
        th.setFont(new Font("Segoe UI", Font.BOLD, 11));
        th.setBackground(new Color(248, 250, 252));
        th.setForeground(new Color(100, 116, 139));
        th.setPreferredSize(new Dimension(0, 36));

        // Center alignment for some columns
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

        refreshTable();

        JScrollPane scrollPane = new JScrollPane(table);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());
        scrollPane.getViewport().setBackground(Color.WHITE);
        card.add(scrollPane, BorderLayout.CENTER);

        // Bottom status switcher bar
        JPanel bottomBar = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 8));
        bottomBar.setOpaque(false);

        RoundedButton btnSetNettoye = new RoundedButton("✓ Marquer comme nettoyée", new Color(16, 185, 129), new Color(5, 150, 105));
        btnSetNettoye.addActionListener(e -> {
            int row = table.getSelectedRow();
            if (row >= 0) {
                String num = (String) tableModel.getValueAt(row, 0);
                for (Chambre c : hotelService.getChambres()) {
                    if (c.getNumero().equals(num)) {
                        c.setStatut("Disponible");
                        break;
                    }
                }
                refreshTable();
            } else {
                JOptionPane.showMessageDialog(this, "Veuillez sélectionner une chambre dans le tableau.", "Sélection requise", JOptionPane.INFORMATION_MESSAGE);
            }
        });

        bottomBar.add(btnSetNettoye);
        card.add(bottomBar, BorderLayout.SOUTH);

        add(card, BorderLayout.CENTER);
    }

    public void refreshTable() {
        tableModel.setRowCount(0);
        List<Chambre> rooms = hotelService.getChambres();
        for (Chambre c : rooms) {
            tableModel.addRow(new Object[]{
                    c.getNumero(),
                    c.getType(),
                    "Étage " + c.getEtage(),
                    c.getCapacite() + " pers.",
                    HotelService.formatAriary(c.getPrixNuit()),
                    c.getStatut(),
                    c.getDescription(),
                    "Modifier"
            });
        }
    }

    private void showAddChambreDialog() {
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Ajouter une Chambre", true);
        dialog.setSize(420, 460);
        dialog.setLocationRelativeTo(this);
        dialog.setLayout(new BorderLayout());

        JPanel form = new JPanel(new GridLayout(6, 2, 10, 12));
        form.setBorder(new EmptyBorder(20, 20, 20, 20));

        JTextField tfNumero = new JTextField();
        JComboBox<String> cbType = new JComboBox<>(new String[]{"Simple", "Double", "Twin", "Suite", "Familiale"});
        JTextField tfEtage = new JTextField("1");
        JTextField tfCapacite = new JTextField("2");
        JTextField tfPrix = new JTextField("120000");
        JTextField tfDesc = new JTextField("Chambre grand confort");

        form.add(new JLabel("Numéro :"));
        form.add(tfNumero);
        form.add(new JLabel("Type de chambre :"));
        form.add(cbType);
        form.add(new JLabel("Étage :"));
        form.add(tfEtage);
        form.add(new JLabel("Capacité (pers.) :"));
        form.add(tfCapacite);
        form.add(new JLabel("Prix par nuit (Ar) :"));
        form.add(tfPrix);
        form.add(new JLabel("Description :"));
        form.add(tfDesc);

        dialog.add(form, BorderLayout.CENTER);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 12, 12));
        JButton btnCancel = new JButton("Annuler");
        btnCancel.addActionListener(e -> dialog.dispose());

        RoundedButton btnSave = RoundedButton.createRoyalBlueButton("Enregistrer");
        btnSave.addActionListener(e -> {
            try {
                String num = tfNumero.getText().trim();
                if (num.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog, "Le numéro est obligatoire.");
                    return;
                }
                int etage = Integer.parseInt(tfEtage.getText().trim());
                int cap = Integer.parseInt(tfCapacite.getText().trim());
                double prix = Double.parseDouble(tfPrix.getText().trim());

                Chambre newChambre = new Chambre(
                        "CH-" + num,
                        num,
                        (String) cbType.getSelectedItem(),
                        etage,
                        cap,
                        prix,
                        "Disponible",
                        tfDesc.getText().trim()
                );
                hotelService.ajouterChambre(newChambre);
                refreshTable();
                dialog.dispose();
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(dialog, "Erreur dans les valeurs saisies : " + ex.getMessage());
            }
        });

        btnPanel.add(btnCancel);
        btnPanel.add(btnSave);
        dialog.add(btnPanel, BorderLayout.SOUTH);

        dialog.setVisible(true);
    }
}
