package com.hoteldereve.ui;

import com.hoteldereve.model.Chambre;
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

public class ReservationsPanel extends JPanel {
    private final HotelService hotelService = HotelService.getInstance();
    private JTable table;
    private DefaultTableModel tableModel;

    public ReservationsPanel() {
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
        JLabel title = new JLabel("Réservations & Plannings");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(new Color(15, 23, 42));

        JLabel sub = new JLabel("Création de séjours, vérification des disponibilités et calcul automatique en Ariary");
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        sub.setForeground(new Color(100, 116, 139));
        left.add(title);
        left.add(sub);

        RoundedButton btnAdd = RoundedButton.createRoyalBlueButton("+ Nouvelle Réservation");
        btnAdd.addActionListener(e -> showNewReservationDialog());

        topBar.add(left, BorderLayout.WEST);
        topBar.add(btnAdd, BorderLayout.EAST);
        add(topBar, BorderLayout.NORTH);

        // Center Table Card
        RoundedPanel card = new RoundedPanel(16, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(8, 8, 8, 8));

        String[] columns = {"N° Réservation", "Client", "Chambre", "Arrivée", "Départ", "Nuits", "Total (Ar)", "Statut"};
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

        // Alignments
        DefaultTableCellRenderer center = new DefaultTableCellRenderer();
        center.setHorizontalAlignment(SwingConstants.CENTER);
        table.getColumnModel().getColumn(0).setCellRenderer(center);
        table.getColumnModel().getColumn(3).setCellRenderer(center);
        table.getColumnModel().getColumn(4).setCellRenderer(center);
        table.getColumnModel().getColumn(5).setCellRenderer(center);

        // Status badge
        table.getColumnModel().getColumn(7).setCellRenderer((t, value, isSelected, hasFocus, row, column) -> {
            String val = value != null ? value.toString() : "";
            JLabel badge = new JLabel(val, SwingConstants.CENTER);
            badge.setOpaque(true);
            badge.setFont(new Font("Segoe UI", Font.BOLD, 11));
            badge.setBorder(new EmptyBorder(4, 8, 4, 8));

            if ("En cours".equalsIgnoreCase(val)) {
                badge.setBackground(new Color(219, 234, 254)); // Royal blue soft
                badge.setForeground(new Color(28, 79, 216));
            } else if ("Confirmée".equalsIgnoreCase(val)) {
                badge.setBackground(new Color(220, 252, 231)); // Emerald soft
                badge.setForeground(new Color(22, 101, 52));
            } else if ("Terminée".equalsIgnoreCase(val)) {
                badge.setBackground(new Color(241, 245, 249));
                badge.setForeground(new Color(100, 116, 139));
            } else {
                badge.setBackground(new Color(254, 243, 199));
                badge.setForeground(new Color(146, 64, 14));
            }
            return badge;
        });

        refreshTable();

        JScrollPane scrollPane = new JScrollPane(table);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());
        scrollPane.getViewport().setBackground(Color.WHITE);
        card.add(scrollPane, BorderLayout.CENTER);

        add(card, BorderLayout.CENTER);
    }

    public void refreshTable() {
        tableModel.setRowCount(0);
        List<Reservation> list = hotelService.getReservations();
        for (Reservation r : list) {
            Client c = hotelService.findClientById(r.getIdClient());
            Chambre ch = hotelService.findChambreById(r.getIdChambre());

            tableModel.addRow(new Object[]{
                    r.getNumeroReservation(),
                    c != null ? c.getNomComplet() : r.getIdClient(),
                    ch != null ? "Ch. " + ch.getNumero() + " (" + ch.getType() + ")" : r.getIdChambre(),
                    r.getDateArrivee(),
                    r.getDateDepart(),
                    r.getNombreNuits() + " n.",
                    HotelService.formatAriary(r.getPrixTotal()),
                    r.getStatut()
            });
        }
    }

    private void showNewReservationDialog() {
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Nouvelle Réservation", true);
        dialog.setSize(480, 500);
        dialog.setLocationRelativeTo(this);
        dialog.setLayout(new BorderLayout());

        JPanel form = new JPanel(new GridLayout(7, 2, 10, 12));
        form.setBorder(new EmptyBorder(20, 20, 20, 20));

        JComboBox<Client> cbClient = new JComboBox<>();
        for (Client c : hotelService.getClients()) {
            cbClient.addItem(c);
        }

        JComboBox<Chambre> cbChambre = new JComboBox<>();
        for (Chambre ch : hotelService.getChambres()) {
            cbChambre.addItem(ch);
        }

        JTextField tfDateArr = new JTextField("2026-03-25");
        JTextField tfDateDep = new JTextField("2026-03-28");
        JTextField tfNuits = new JTextField("3");
        JTextField tfPers = new JTextField("2");
        JLabel lblTotal = new JLabel("Calcul auto");
        lblTotal.setFont(new Font("Segoe UI", Font.BOLD, 13));
        lblTotal.setForeground(new Color(28, 79, 216));

        Runnable recalc = () -> {
            try {
                int nuits = Integer.parseInt(tfNuits.getText().trim());
                Chambre ch = (Chambre) cbChambre.getSelectedItem();
                if (ch != null) {
                    double tot = nuits * ch.getPrixNuit();
                    lblTotal.setText(HotelService.formatAriary(tot));
                }
            } catch (Exception ignored) {}
        };

        tfNuits.addKeyListener(new java.awt.event.KeyAdapter() {
            @Override
            public void keyReleased(java.awt.event.KeyEvent e) {
                recalc.run();
            }
        });
        cbChambre.addActionListener(e -> recalc.run());
        recalc.run();

        form.add(new JLabel("Client :"));
        form.add(cbClient);
        form.add(new JLabel("Chambre :"));
        form.add(cbChambre);
        form.add(new JLabel("Date Arrivée (AAAA-MM-JJ) :"));
        form.add(tfDateArr);
        form.add(new JLabel("Date Départ (AAAA-MM-JJ) :"));
        form.add(tfDateDep);
        form.add(new JLabel("Nombre de nuits :"));
        form.add(tfNuits);
        form.add(new JLabel("Nombre de personnes :"));
        form.add(tfPers);
        form.add(new JLabel("Montant Estimé :"));
        form.add(lblTotal);

        dialog.add(form, BorderLayout.CENTER);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 12, 12));
        JButton btnCancel = new JButton("Annuler");
        btnCancel.addActionListener(e -> dialog.dispose());

        RoundedButton btnSave = RoundedButton.createRoyalBlueButton("Confirmer la Réservation");
        btnSave.addActionListener(e -> {
            try {
                Client selClient = (Client) cbClient.getSelectedItem();
                Chambre selChambre = (Chambre) cbChambre.getSelectedItem();
                if (selClient == null || selChambre == null) {
                    JOptionPane.showMessageDialog(dialog, "Veuillez sélectionner un client et une chambre.");
                    return;
                }
                int nuits = Integer.parseInt(tfNuits.getText().trim());
                int pers = Integer.parseInt(tfPers.getText().trim());
                double total = nuits * selChambre.getPrixNuit();

                String resNum = "REV-2026-00" + (hotelService.getReservations().size() + 1);
                Reservation r = new Reservation(
                        "RES-" + System.currentTimeMillis(),
                        resNum,
                        selClient.getId(),
                        selChambre.getId(),
                        "2026-03-21",
                        tfDateArr.getText().trim(),
                        tfDateDep.getText().trim(),
                        pers,
                        nuits,
                        total,
                        "Confirmée",
                        "Réservation comptoir"
                );
                hotelService.ajouterReservation(r);
                refreshTable();
                dialog.dispose();
                JOptionPane.showMessageDialog(this, "Réservation " + resNum + " enregistrée avec succès !", "Succès", JOptionPane.INFORMATION_MESSAGE);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(dialog, "Erreur : " + ex.getMessage());
            }
        });

        btnPanel.add(btnCancel);
        btnPanel.add(btnSave);
        dialog.add(btnPanel, BorderLayout.SOUTH);

        dialog.setVisible(true);
    }
}
