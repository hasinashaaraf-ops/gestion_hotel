package com.hoteldereve.ui;

import com.hoteldereve.model.Client;
import com.hoteldereve.model.Reservation;
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

public class ClientsPanel extends JPanel {
    private final HotelService hotelService = HotelService.getInstance();
    private JTable table;
    private DefaultTableModel tableModel;
    private JTextField tfSearch;

    public ClientsPanel() {
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
        JLabel title = new JLabel("Annuaire des Clients");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(new Color(15, 23, 42));

        JLabel sub = new JLabel("Fiches clients, coordonnées, pièces d'identité et historique de séjour");
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        sub.setForeground(new Color(100, 116, 139));
        left.add(title);
        left.add(sub);

        JPanel rightActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        rightActions.setOpaque(false);

        tfSearch = new JTextField(16);
        tfSearch.setPreferredSize(new Dimension(180, 36));
        tfSearch.putClientProperty("JTextField.placeholderText", "Rechercher un client...");
        tfSearch.addCaretListener(e -> refreshTable());

        RoundedButton btnAdd = RoundedButton.createRoyalBlueButton("+ Nouveau client");
        btnAdd.addActionListener(e -> showAddClientDialog());

        RoundedButton btnHistory = new RoundedButton("Historique réservations", new Color(241, 245, 249), new Color(15, 23, 42));
        btnHistory.setPreferredSize(new Dimension(160, 36));
        btnHistory.addActionListener(e -> showClientHistory());

        rightActions.add(tfSearch);
        rightActions.add(btnAdd);
        rightActions.add(btnHistory);

        topBar.add(left, BorderLayout.WEST);
        topBar.add(rightActions, BorderLayout.EAST);
        add(topBar, BorderLayout.NORTH);

        // Center Table Card
        RoundedPanel card = new RoundedPanel(16, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(8, 8, 8, 8));

        String[] columns = {"ID", "Nom & Prénom", "Sexe", "Téléphone", "Email", "CIN / Passeport", "Nationalité"};
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

        DefaultTableCellRenderer center = new DefaultTableCellRenderer();
        center.setHorizontalAlignment(SwingConstants.CENTER);
        table.getColumnModel().getColumn(0).setCellRenderer(center);
        table.getColumnModel().getColumn(2).setCellRenderer(center);
        table.getColumnModel().getColumn(5).setCellRenderer(center);
        table.getColumnModel().getColumn(6).setCellRenderer(center);

        JScrollPane scroll = new JScrollPane(table);
        scroll.setBorder(BorderFactory.createEmptyBorder());
        scroll.getViewport().setBackground(Color.WHITE);
        card.add(scroll, BorderLayout.CENTER);

        add(card, BorderLayout.CENTER);

        refreshTable();
    }

    public void refreshTable() {
        tableModel.setRowCount(0);
        String query = tfSearch != null ? tfSearch.getText().trim().toLowerCase() : "";

        List<Client> list = hotelService.getClients();
        if (!query.isEmpty()) {
            list = list.stream().filter(c ->
                    c.getNom().toLowerCase().contains(query) ||
                    c.getPrenom().toLowerCase().contains(query) ||
                    c.getTelephone().toLowerCase().contains(query) ||
                    c.getNumeroPieceIdentite().toLowerCase().contains(query)
            ).collect(Collectors.toList());
        }

        for (Client c : list) {
            tableModel.addRow(new Object[]{
                    c.getId(),
                    c.getNom().toUpperCase() + " " + c.getPrenom(),
                    c.getSexe(),
                    c.getTelephone(),
                    c.getEmail(),
                    c.getNumeroPieceIdentite(),
                    c.getNationalite()
            });
        }
    }

    private void showAddClientDialog() {
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Enregistrer un nouveau client", true);
        dialog.setSize(460, 440);
        dialog.setLocationRelativeTo(this);

        JPanel panel = new JPanel(new GridLayout(7, 2, 10, 12));
        panel.setBorder(new EmptyBorder(20, 20, 20, 20));
        panel.setBackground(Color.WHITE);

        JTextField tfNom = new JTextField();
        JTextField tfPrenom = new JTextField();
        JComboBox<String> cbSexe = new JComboBox<>(new String[]{"M", "F"});
        JTextField tfTel = new JTextField("+261 ");
        JTextField tfEmail = new JTextField();
        JTextField tfCin = new JTextField();
        JTextField tfNat = new JTextField("Malagasy");

        panel.add(new JLabel("Nom :"));
        panel.add(tfNom);
        panel.add(new JLabel("Prénom :"));
        panel.add(tfPrenom);
        panel.add(new JLabel("Sexe :"));
        panel.add(cbSexe);
        panel.add(new JLabel("Téléphone :"));
        panel.add(tfTel);
        panel.add(new JLabel("Email :"));
        panel.add(tfEmail);
        panel.add(new JLabel("CIN / Passeport :"));
        panel.add(tfCin);
        panel.add(new JLabel("Nationalité :"));
        panel.add(tfNat);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        btnPanel.setBackground(Color.WHITE);
        JButton btnCancel = new JButton("Annuler");
        btnCancel.addActionListener(e -> dialog.dispose());

        RoundedButton btnSave = RoundedButton.createRoyalBlueButton("Enregistrer");
        btnSave.addActionListener(e -> {
            if (tfNom.getText().trim().isEmpty() || tfPrenom.getText().trim().isEmpty()) {
                JOptionPane.showMessageDialog(dialog, "Veuillez remplir le nom et prénom.", "Champ requis", JOptionPane.WARNING_MESSAGE);
                return;
            }

            String newId = "CLI-" + (hotelService.getClients().size() + 1);
            Client client = new Client(
                    newId,
                    tfNom.getText().trim(),
                    tfPrenom.getText().trim(),
                    (String) cbSexe.getSelectedItem(),
                    tfTel.getText().trim(),
                    tfEmail.getText().trim(),
                    tfCin.getText().trim(),
                    tfNat.getText().trim()
            );

            hotelService.ajouterClient(client);
            refreshTable();
            dialog.dispose();
            JOptionPane.showMessageDialog(this, "Client enregistré avec succès !", "Succès", JOptionPane.INFORMATION_MESSAGE);
        });

        btnPanel.add(btnCancel);
        btnPanel.add(btnSave);

        dialog.getContentPane().setLayout(new BorderLayout());
        dialog.getContentPane().add(panel, BorderLayout.CENTER);
        dialog.getContentPane().add(btnPanel, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private void showClientHistory() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Veuillez sélectionner un client dans le tableau.", "Sélection requise", JOptionPane.INFORMATION_MESSAGE);
            return;
        }

        String clientId = (String) tableModel.getValueAt(row, 0);
        String clientName = (String) tableModel.getValueAt(row, 1);

        List<Reservation> clientReservations = hotelService.getReservations().stream()
                .filter(r -> clientId.equalsIgnoreCase(r.getIdClient()))
                .collect(Collectors.toList());

        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Historique : " + clientName, true);
        dialog.setSize(600, 350);
        dialog.setLocationRelativeTo(this);

        String[] cols = {"N° Réservation", "Chambre", "Arrivée", "Départ", "Prix Total", "Statut"};
        DefaultTableModel model = new DefaultTableModel(cols, 0);
        for (Reservation r : clientReservations) {
            model.addRow(new Object[]{
                    r.getNumeroReservation(),
                    r.getIdChambre(),
                    r.getDateArrivee(),
                    r.getDateDepart(),
                    HotelService.formatAriary(r.getPrixTotal()),
                    r.getStatut()
            });
        }

        JTable historyTable = new JTable(model);
        historyTable.setRowHeight(32);
        dialog.add(new JScrollPane(historyTable), BorderLayout.CENTER);
        dialog.setVisible(true);
    }
}
