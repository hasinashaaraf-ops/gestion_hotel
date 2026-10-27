package com.hoteldereve.ui;

import com.hoteldereve.model.Chambre;
import com.hoteldereve.model.Reservation;
import com.hoteldereve.service.HotelService;
import com.hoteldereve.ui.components.RoundedPanel;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReportsPanel extends JPanel {
    private final HotelService hotelService = HotelService.getInstance();

    public ReportsPanel() {
        setLayout(new BorderLayout(0, 16));
        setOpaque(false);
        setBorder(new EmptyBorder(16, 20, 20, 20));

        initUI();
    }

    private void initUI() {
        // Top Title
        JPanel topBar = new JPanel(new GridLayout(2, 1, 0, 2));
        topBar.setOpaque(false);
        JLabel title = new JLabel("Rapports d'Activité & Statistiques Financières");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(new Color(15, 23, 42));

        JLabel sub = new JLabel("Analyse des revenus en Ariary (MGA), taux d'occupation et performance par catégorie");
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        sub.setForeground(new Color(100, 116, 139));
        topBar.add(title);
        topBar.add(sub);
        add(topBar, BorderLayout.NORTH);

        // Center: Cards Grid
        JPanel center = new JPanel(new BorderLayout(0, 16));
        center.setOpaque(false);

        List<Chambre> rooms = hotelService.getChambres();
        List<Reservation> resList = hotelService.getReservations();

        long totalRooms = rooms.size();
        long occupiedCount = rooms.stream().filter(r -> "Occupée".equals(r.getStatut())).count();
        double occRate = totalRooms > 0 ? (occupiedCount * 100.0) / totalRooms : 0;

        double caTotal = resList.stream().mapToDouble(Reservation::getPrixTotal).sum();
        long terminees = resList.stream().filter(r -> "Terminée".equals(r.getStatut())).count();

        // 3 Summary Cards
        JPanel statsRow = new JPanel(new GridLayout(1, 3, 16, 0));
        statsRow.setOpaque(false);
        statsRow.setPreferredSize(new Dimension(0, 100));

        statsRow.add(createStatCard("CHIFFRE D'AFFAIRES GLOBAL", HotelService.formatAriary(caTotal), "Cumul sur l'ensemble des réservations", new Color(28, 79, 216)));
        statsRow.add(createStatCard("TAUX D'OCCUPATION ACTUEL", String.format("%.1f%%", occRate), occupiedCount + " chambres occupées sur " + totalRooms, new Color(16, 185, 129)));
        statsRow.add(createStatCard("SÉJOURS CLÔTURÉS", terminees + " réservations", "Check-out effectués avec succès", new Color(139, 92, 246)));

        center.add(statsRow, BorderLayout.NORTH);

        // Category Breakdown Table
        RoundedPanel breakdownCard = new RoundedPanel(16, Color.WHITE, new Color(226, 232, 240));
        breakdownCard.setLayout(new BorderLayout(0, 12));
        breakdownCard.setBorder(new EmptyBorder(16, 18, 16, 18));

        JLabel lblBreakdown = new JLabel("Performance par Catégorie de Chambre");
        lblBreakdown.setFont(new Font("Segoe UI", Font.BOLD, 14));
        lblBreakdown.setForeground(new Color(15, 23, 42));
        breakdownCard.add(lblBreakdown, BorderLayout.NORTH);

        String[] cols = {"Type de Chambre", "Nombre de Chambres", "Tarif Moyen / Nuit", "Occupation", "CA Généré Estimé"};
        DefaultTableModel model = new DefaultTableModel(cols, 0);

        Map<String, Integer> countByType = new HashMap<>();
        Map<String, Double> priceByType = new HashMap<>();
        for (Chambre c : rooms) {
            countByType.put(c.getType(), countByType.getOrDefault(c.getType(), 0) + 1);
            priceByType.put(c.getType(), c.getPrixNuit());
        }

        for (String type : countByType.keySet()) {
            int count = countByType.get(type);
            double price = priceByType.get(type);
            long occ = rooms.stream().filter(r -> type.equals(r.getType()) && "Occupée".equals(r.getStatut())).count();
            double occPercent = count > 0 ? (occ * 100.0) / count : 0;
            double caEstime = occ * price * 3; // estimation 3 nuits

            model.addRow(new Object[]{
                    type,
                    count + " chambre(s)",
                    HotelService.formatAriary(price),
                    String.format("%.0f%% (%d/%d)", occPercent, occ, count),
                    HotelService.formatAriary(caEstime)
            });
        }

        JTable table = new JTable(model);
        table.setRowHeight(36);
        table.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        table.setShowGrid(false);

        DefaultTableCellRenderer centerRenderer = new DefaultTableCellRenderer();
        centerRenderer.setHorizontalAlignment(SwingConstants.CENTER);
        table.getColumnModel().getColumn(1).setCellRenderer(centerRenderer);
        table.getColumnModel().getColumn(2).setCellRenderer(centerRenderer);
        table.getColumnModel().getColumn(3).setCellRenderer(centerRenderer);

        breakdownCard.add(new JScrollPane(table), BorderLayout.CENTER);
        center.add(breakdownCard, BorderLayout.CENTER);

        add(center, BorderLayout.CENTER);
    }

    private JPanel createStatCard(String title, String val, String sub, Color accent) {
        RoundedPanel card = new RoundedPanel(16, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(14, 16, 14, 16));

        JLabel t = new JLabel(title);
        t.setFont(new Font("Segoe UI", Font.BOLD, 10));
        t.setForeground(new Color(100, 116, 139));

        JLabel v = new JLabel(val);
        v.setFont(new Font("Segoe UI", Font.BOLD, 20));
        v.setForeground(accent);

        JLabel s = new JLabel(sub);
        s.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        s.setForeground(new Color(100, 116, 139));

        JPanel p = new JPanel(new GridLayout(3, 1, 0, 2));
        p.setOpaque(false);
        p.add(t);
        p.add(v);
        p.add(s);

        card.add(p, BorderLayout.CENTER);
        return card;
    }
}
