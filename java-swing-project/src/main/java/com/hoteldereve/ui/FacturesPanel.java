package com.hoteldereve.ui;

import com.hoteldereve.model.Facture;
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

public class FacturesPanel extends JPanel {
    private final HotelService hotelService = HotelService.getInstance();
    private JTable table;
    private DefaultTableModel tableModel;

    public FacturesPanel() {
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
        JLabel title = new JLabel("Facturation & Pièces Comptables");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(new Color(15, 23, 42));

        JLabel sub = new JLabel("Émission des factures, TVA, remises et justificatifs clients");
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        sub.setForeground(new Color(100, 116, 139));
        left.add(title);
        left.add(sub);

        JPanel rightActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        rightActions.setOpaque(false);

        RoundedButton btnView = RoundedButton.createRoyalBlueButton("📄 Aperçu / Imprimer Facture");
        btnView.addActionListener(e -> showInvoicePreview());

        rightActions.add(btnView);

        topBar.add(left, BorderLayout.WEST);
        topBar.add(rightActions, BorderLayout.EAST);
        add(topBar, BorderLayout.NORTH);

        // Center Table Card
        RoundedPanel card = new RoundedPanel(16, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(8, 8, 8, 8));

        String[] columns = {"N° Facture", "Réservation", "Date Émission", "Montant Total", "Payé", "Reste à Payer", "Statut"};
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

        table.getColumnModel().getColumn(6).setCellRenderer((t, value, isSelected, hasFocus, row, column) -> {
            String val = value != null ? value.toString() : "Soldée";
            JLabel badge = new JLabel(val, SwingConstants.CENTER);
            badge.setOpaque(true);
            badge.setFont(new Font("Segoe UI", Font.BOLD, 11));
            badge.setBorder(new EmptyBorder(4, 8, 4, 8));

            if ("Soldée".equalsIgnoreCase(val)) {
                badge.setBackground(new Color(220, 252, 231));
                badge.setForeground(new Color(22, 101, 52));
            } else {
                badge.setBackground(new Color(254, 243, 199));
                badge.setForeground(new Color(146, 64, 14));
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
        List<Facture> list = hotelService.getFactures();

        for (Facture f : list) {
            String statut = f.getResteAPayer() <= 0 ? "Soldée" : "Partiel (" + HotelService.formatAriary(f.getResteAPayer()) + ")";
            tableModel.addRow(new Object[]{
                    f.getNumeroFacture(),
                    f.getIdReservation(),
                    f.getDateFacture(),
                    HotelService.formatAriary(f.getMontantTotal()),
                    HotelService.formatAriary(f.getMontantPaye()),
                    HotelService.formatAriary(f.getResteAPayer()),
                    statut
            });
        }
    }

    private void showInvoicePreview() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Sélectionnez une facture dans le tableau pour l'afficher.", "Sélection requise", JOptionPane.INFORMATION_MESSAGE);
            return;
        }

        String num = (String) tableModel.getValueAt(row, 0);
        String resId = (String) tableModel.getValueAt(row, 1);
        String date = (String) tableModel.getValueAt(row, 2);
        String total = (String) tableModel.getValueAt(row, 3);
        String paye = (String) tableModel.getValueAt(row, 4);
        String reste = (String) tableModel.getValueAt(row, 5);

        Reservation res = hotelService.findReservationById(resId);
        String clientInfo = res != null ? res.getIdClient() : "Client Comptoir";

        StringBuilder sb = new StringBuilder();
        sb.append("=================================================================\n");
        sb.append("                 HÔTEL DE RÊVE - FACTURE OFFICIELLE              \n");
        sb.append("               Route de la Plage, Nosy Be - Madagascar           \n");
        sb.append("               NIF : 4001234567 | STAT : 55101 11 2024 0 00123   \n");
        sb.append("=================================================================\n\n");
        sb.append("FACTURE N° : ").append(num).append("\n");
        sb.append("DATE       : ").append(date).append("\n");
        sb.append("CLIENT     : ").append(clientInfo).append("\n");
        sb.append("RÉF SÉJOUR : ").append(resId).append("\n");
        sb.append("-----------------------------------------------------------------\n");
        sb.append(String.format("%-30s %10s %20s\n", "DÉSIGNATION", "QTÉ", "TOTAL"));
        sb.append("-----------------------------------------------------------------\n");
        sb.append(String.format("%-30s %10s %20s\n", "Hébergement Hôtel", "Séjour", total));
        sb.append(String.format("%-30s %10s %20s\n", "TVA (20% Incluse)", "Inclus", "Inclus"));
        sb.append("-----------------------------------------------------------------\n");
        sb.append(String.format("%-40s %20s\n", "TOTAL À PAYER TTC :", total));
        sb.append(String.format("%-40s %20s\n", "ACOMPTE / DÉJÀ RÉGLÉ :", paye));
        sb.append(String.format("%-40s %20s\n", "SOLDE RESTANT :", reste));
        sb.append("=================================================================\n");
        sb.append("      Arrêtée la présente facture à la somme mentionnée ci-dessus. \n");
        sb.append("                 La Direction vous remercie !                     \n");
        sb.append("=================================================================\n");

        JTextArea ta = new JTextArea(sb.toString());
        ta.setFont(new Font("Monospaced", Font.PLAIN, 12));
        ta.setEditable(false);
        ta.setBorder(new EmptyBorder(10, 10, 10, 10));

        JDialog dlg = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Facture " + num, true);
        dlg.setSize(560, 480);
        dlg.setLocationRelativeTo(this);
        dlg.setLayout(new BorderLayout());
        dlg.add(new JScrollPane(ta), BorderLayout.CENTER);

        JPanel pBtn = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton btnPrint = new JButton("Imprimer (Envoi imprimante)");
        btnPrint.addActionListener(e -> {
            try {
                ta.print();
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(dlg, "Erreur d'impression : " + ex.getMessage());
            }
        });
        JButton btnClose = new JButton("Fermer");
        btnClose.addActionListener(e -> dlg.dispose());
        pBtn.add(btnPrint);
        pBtn.add(btnClose);
        dlg.add(pBtn, BorderLayout.SOUTH);

        dlg.setVisible(true);
    }
}
