package com.hoteldereve.ui;

import com.hoteldereve.model.Paiement;
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
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class PaiementsPanel extends JPanel {
    private final HotelService hotelService = HotelService.getInstance();
    private JTable table;
    private DefaultTableModel tableModel;
    private JLabel lblTotalEncaisse;

    public PaiementsPanel() {
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
        JLabel title = new JLabel("Journal des Paiements & Règlements");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(new Color(15, 23, 42));

        lblTotalEncaisse = new JLabel("Total encaissé : 0 Ar");
        lblTotalEncaisse.setFont(new Font("Segoe UI", Font.BOLD, 12));
        lblTotalEncaisse.setForeground(new Color(22, 101, 52));
        left.add(title);
        left.add(lblTotalEncaisse);

        JPanel rightActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        rightActions.setOpaque(false);

        RoundedButton btnAdd = RoundedButton.createRoyalBlueButton("+ Enregistrer un paiement");
        btnAdd.addActionListener(e -> showAddPaiementDialog());

        RoundedButton btnReceipt = new RoundedButton("Imprimer un reçu", new Color(241, 245, 249), new Color(15, 23, 42));
        btnReceipt.setPreferredSize(new Dimension(140, 36));
        btnReceipt.addActionListener(e -> printReceipt());

        rightActions.add(btnReceipt);
        rightActions.add(btnAdd);

        topBar.add(left, BorderLayout.WEST);
        topBar.add(rightActions, BorderLayout.EAST);
        add(topBar, BorderLayout.NORTH);

        // Center Table Card
        RoundedPanel card = new RoundedPanel(16, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(8, 8, 8, 8));

        String[] columns = {"N° Paiement", "Réf Réservation", "Date", "Montant (Ar)", "Mode de Règlement", "Statut"};
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

        DefaultTableCellRenderer center = new DefaultTableCellRenderer();
        center.setHorizontalAlignment(SwingConstants.CENTER);
        table.getColumnModel().getColumn(0).setCellRenderer(center);
        table.getColumnModel().getColumn(1).setCellRenderer(center);
        table.getColumnModel().getColumn(2).setCellRenderer(center);
        table.getColumnModel().getColumn(4).setCellRenderer(center);

        table.getColumnModel().getColumn(3).setCellRenderer((t, value, isSelected, hasFocus, row, column) -> {
            JLabel lbl = new JLabel(value != null ? value.toString() : "", SwingConstants.RIGHT);
            lbl.setFont(new Font("Segoe UI", Font.BOLD, 12));
            lbl.setForeground(new Color(15, 23, 42));
            lbl.setBorder(new EmptyBorder(0, 0, 0, 16));
            return lbl;
        });

        table.getColumnModel().getColumn(5).setCellRenderer((t, value, isSelected, hasFocus, row, column) -> {
            JLabel badge = new JLabel("✔ Validé", SwingConstants.CENTER);
            badge.setOpaque(true);
            badge.setBackground(new Color(220, 252, 231));
            badge.setForeground(new Color(22, 101, 52));
            badge.setFont(new Font("Segoe UI", Font.BOLD, 11));
            badge.setBorder(new EmptyBorder(4, 8, 4, 8));
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
        List<Paiement> list = hotelService.getPaiements();
        double total = 0;

        for (Paiement p : list) {
            total += p.getMontant();
            tableModel.addRow(new Object[]{
                    p.getNumeroPaiement(),
                    p.getIdReservation(),
                    p.getDatePaiement(),
                    HotelService.formatAriary(p.getMontant()),
                    p.getModePaiement(),
                    p.getStatut()
            });
        }

        lblTotalEncaisse.setText("Total encaissé : " + HotelService.formatAriary(total));
    }

    private void showAddPaiementDialog() {
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Enregistrer un paiement", true);
        dialog.setSize(440, 360);
        dialog.setLocationRelativeTo(this);

        JPanel panel = new JPanel(new GridLayout(5, 2, 10, 12));
        panel.setBorder(new EmptyBorder(20, 20, 20, 20));
        panel.setBackground(Color.WHITE);

        List<Reservation> resList = hotelService.getReservations();
        JComboBox<String> cbRes = new JComboBox<>();
        for (Reservation r : resList) {
            cbRes.addItem(r.getNumeroReservation() + " (" + HotelService.formatAriary(r.getPrixTotal()) + ")");
        }

        JTextField tfMontant = new JTextField("100000");
        JComboBox<String> cbMode = new JComboBox<>(new String[]{
                "Espèces", "Carte Bancaire", "MVola (Telma)", "Orange Money", "Airtel Money", "Virement Bancaire"
        });

        panel.add(new JLabel("Réservation :"));
        panel.add(cbRes);
        panel.add(new JLabel("Montant (Ariary) :"));
        panel.add(tfMontant);
        panel.add(new JLabel("Mode de règlement :"));
        panel.add(cbMode);
        panel.add(new JLabel("Date :"));
        panel.add(new JLabel(new SimpleDateFormat("yyyy-MM-dd").format(new Date())));

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        btnPanel.setBackground(Color.WHITE);
        JButton btnCancel = new JButton("Annuler");
        btnCancel.addActionListener(e -> dialog.dispose());

        RoundedButton btnSave = RoundedButton.createRoyalBlueButton("Confirmer l'encaissement");
        btnSave.addActionListener(e -> {
            try {
                double montant = Double.parseDouble(tfMontant.getText().trim());
                String selected = (String) cbRes.getSelectedItem();
                String resNum = selected != null ? selected.split(" ")[0] : "RES-001";
                String dateStr = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

                String payId = "PAY-" + (hotelService.getPaiements().size() + 1);
                Paiement paiement = new Paiement(
                        payId,
                        "PAIEMENT-" + String.format("%03d", hotelService.getPaiements().size() + 1),
                        resNum,
                        dateStr,
                        montant,
                        (String) cbMode.getSelectedItem(),
                        "Validé"
                );

                hotelService.enregistrerPaiement(paiement);
                refreshTable();
                dialog.dispose();
                JOptionPane.showMessageDialog(this, "Paiement de " + HotelService.formatAriary(montant) + " enregistré avec succès !", "Règlement Validé", JOptionPane.INFORMATION_MESSAGE);
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(dialog, "Veuillez saisir un montant numérique valide.", "Montant Invalide", JOptionPane.ERROR_MESSAGE);
            }
        });

        btnPanel.add(btnCancel);
        btnPanel.add(btnSave);

        dialog.getContentPane().setLayout(new BorderLayout());
        dialog.getContentPane().add(panel, BorderLayout.CENTER);
        dialog.getContentPane().add(btnPanel, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private void printReceipt() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Sélectionnez un paiement dans le tableau pour imprimer le reçu.", "Sélection requise", JOptionPane.INFORMATION_MESSAGE);
            return;
        }

        String num = (String) tableModel.getValueAt(row, 0);
        String res = (String) tableModel.getValueAt(row, 1);
        String date = (String) tableModel.getValueAt(row, 2);
        String montant = (String) tableModel.getValueAt(row, 3);
        String mode = (String) tableModel.getValueAt(row, 4);

        String msg = "========================================\n" +
                     "        HÔTEL DE RÊVE - REÇU DE CAISSE   \n" +
                     "========================================\n" +
                     "N° Quittance : " + num + "\n" +
                     "Date : " + date + "\n" +
                     "Réservation associée : " + res + "\n" +
                     "Mode de règlement : " + mode + "\n" +
                     "Montant encaissé : " + montant + "\n" +
                     "Statut : ACQUITTÉ (ENCAISSÉ)\n" +
                     "========================================\n" +
                     "Merci de votre confiance et bon séjour !";

        JTextArea ta = new JTextArea(msg);
        ta.setFont(new Font("Monospaced", Font.PLAIN, 12));
        ta.setEditable(false);
        JOptionPane.showMessageDialog(this, new JScrollPane(ta), "Reçu Officiel de Caisse", JOptionPane.INFORMATION_MESSAGE);
    }
}
