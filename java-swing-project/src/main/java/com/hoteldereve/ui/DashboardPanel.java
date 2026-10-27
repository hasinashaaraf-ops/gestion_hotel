package com.hoteldereve.ui;

import com.hoteldereve.model.Chambre;
import com.hoteldereve.model.Reservation;
import com.hoteldereve.service.HotelService;
import com.hoteldereve.ui.components.DonutChartPanel;
import com.hoteldereve.ui.components.RoundedPanel;
import com.hoteldereve.ui.components.WaveChartPanel;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.List;

public class DashboardPanel extends JPanel {
    private final HotelService hotelService = HotelService.getInstance();

    public DashboardPanel() {
        setLayout(new BorderLayout(0, 16));
        setOpaque(false);
        setBorder(new EmptyBorder(16, 20, 20, 20));

        initUI();
    }

    private void initUI() {
        // Top KPI Cards container (3 cards like in screenshot)
        JPanel kpiContainer = new JPanel(new GridLayout(1, 3, 16, 0));
        kpiContainer.setOpaque(false);

        List<Chambre> rooms = hotelService.getChambres();
        long occupiedCount = rooms.stream().filter(r -> "Occupée".equals(r.getStatut())).count();
        long cleaningCount = rooms.stream().filter(r -> "En nettoyage".equals(r.getStatut())).count();
        long totalRooms = rooms.size();
        int occPercent = totalRooms > 0 ? (int) Math.round((occupiedCount * 100.0) / totalRooms) : 0;

        List<Reservation> reservations = hotelService.getReservations();
        long activeRes = reservations.stream().filter(r -> "En cours".equals(r.getStatut())).count();

        double totalRevenue = reservations.stream()
                .filter(r -> !"Annulée".equals(r.getStatut()))
                .mapToDouble(Reservation::getPrixTotal)
                .sum();

        // Card 1: Occupation (White card)
        kpiContainer.add(createKpiCard(
                "Taux d'Occupation",
                occPercent + "%",
                occupiedCount + " chambres occupées / " + totalRooms,
                new Color(241, 245, 249),
                new Color(30, 41, 59)
        ));

        // Card 2: Séjours en cours (White card)
        kpiContainer.add(createKpiCard(
                "Séjours Actifs",
                String.valueOf(activeRes),
                cleaningCount + " chambres en nettoyage",
                new Color(238, 242, 255),
                new Color(79, 70, 229)
        ));

        // Card 3: Featured Royal Blue Card (like the blue card in screenshot)
        kpiContainer.add(createFeaturedBlueCard(
                "Chiffre d'Affaires",
                HotelService.formatAriary(totalRevenue),
                "+14.8% vs mois précédent"
        ));

        add(kpiContainer, BorderLayout.NORTH);

        // Center: Charts (Left: Wave Chart + Calendar Strip, Right: Donut Chart)
        JPanel chartsSplit = new JPanel(new GridBagLayout());
        chartsSplit.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.fill = GridBagConstraints.BOTH;
        gbc.weighty = 1.0;

        // Left Panel (Wave Chart + Calendar)
        gbc.gridx = 0;
        gbc.weightx = 0.65;
        gbc.insets = new Insets(0, 0, 0, 16);
        chartsSplit.add(createLeftWaveCard(), gbc);

        // Right Panel (Donut Chart)
        gbc.gridx = 1;
        gbc.weightx = 0.35;
        gbc.insets = new Insets(0, 0, 0, 0);
        chartsSplit.add(createRightDonutCard(), gbc);

        add(chartsSplit, BorderLayout.CENTER);
    }

    private JPanel createKpiCard(String title, String mainValue, String subValue, Color badgeBg, Color badgeFg) {
        RoundedPanel card = new RoundedPanel(18, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(16, 18, 16, 18));

        JPanel top = new JPanel(new BorderLayout());
        top.setOpaque(false);

        JLabel lblTitle = new JLabel(title.toUpperCase());
        lblTitle.setFont(new Font("Segoe UI", Font.BOLD, 10));
        lblTitle.setForeground(new Color(100, 116, 139));
        top.add(lblTitle, BorderLayout.WEST);

        JLabel lblVal = new JLabel(mainValue);
        lblVal.setFont(new Font("Segoe UI", Font.BOLD, 26));
        lblVal.setForeground(new Color(15, 23, 42));
        lblVal.setBorder(new EmptyBorder(8, 0, 4, 0));

        JLabel lblSub = new JLabel(subValue);
        lblSub.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        lblSub.setForeground(new Color(100, 116, 139));

        JPanel body = new JPanel();
        body.setLayout(new BoxLayout(body, BoxLayout.Y_AXIS));
        body.setOpaque(false);
        body.add(lblVal);
        body.add(lblSub);

        card.add(top, BorderLayout.NORTH);
        card.add(body, BorderLayout.CENTER);
        return card;
    }

    private JPanel createFeaturedBlueCard(String title, String mainValue, String trend) {
        // Gradient Royal Blue Card matching the screenshot's primary highlight card
        RoundedPanel card = new RoundedPanel(18, new Color(28, 79, 216), new Color(28, 79, 216)) {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                GradientPaint gp = new GradientPaint(0, 0, new Color(28, 79, 216), getWidth(), getHeight(), new Color(37, 99, 235));
                g2.setPaint(gp);
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 18, 18);
                g2.dispose();
            }
        };
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(16, 18, 16, 18));

        JLabel lblTitle = new JLabel(title.toUpperCase());
        lblTitle.setFont(new Font("Segoe UI", Font.BOLD, 10));
        lblTitle.setForeground(new Color(191, 219, 254));

        JLabel lblVal = new JLabel(mainValue);
        lblVal.setFont(new Font("Segoe UI", Font.BOLD, 22));
        lblVal.setForeground(Color.WHITE);
        lblVal.setBorder(new EmptyBorder(8, 0, 4, 0));

        JLabel lblTrend = new JLabel("▲ " + trend);
        lblTrend.setFont(new Font("Segoe UI", Font.BOLD, 11));
        lblTrend.setForeground(new Color(187, 247, 208)); // Emerald soft

        JPanel body = new JPanel();
        body.setLayout(new BoxLayout(body, BoxLayout.Y_AXIS));
        body.setOpaque(false);
        body.add(lblVal);
        body.add(lblTrend);

        card.add(lblTitle, BorderLayout.NORTH);
        card.add(body, BorderLayout.CENTER);
        return card;
    }

    private JPanel createLeftWaveCard() {
        RoundedPanel card = new RoundedPanel(18, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout(0, 10));
        card.setBorder(new EmptyBorder(18, 18, 18, 18));

        // Header
        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);

        JLabel title = new JLabel("Évolution des Réservations & Taux Mensuel");
        title.setFont(new Font("Segoe UI", Font.BOLD, 14));
        title.setForeground(new Color(15, 23, 42));

        JLabel subtitle = new JLabel("Année 2026 · Analyse des tendances");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        subtitle.setForeground(new Color(100, 116, 139));

        JPanel titleBox = new JPanel(new GridLayout(2, 1));
        titleBox.setOpaque(false);
        titleBox.add(title);
        titleBox.add(subtitle);
        header.add(titleBox, BorderLayout.WEST);

        card.add(header, BorderLayout.NORTH);
        card.add(new WaveChartPanel(), BorderLayout.CENTER);

        // Bottom horizontal calendar / date picker strip
        JPanel calendarStrip = createCalendarStrip();
        card.add(calendarStrip, BorderLayout.SOUTH);

        return card;
    }

    private JPanel createCalendarStrip() {
        JPanel strip = new JPanel(new FlowLayout(FlowLayout.CENTER, 8, 4));
        strip.setOpaque(false);
        strip.setBorder(new EmptyBorder(8, 0, 0, 0));

        String[] days = {"Lun 16", "Mar 17", "Mer 18", "Jeu 19", "Ven 20", "Sam 21", "Dim 22"};
        for (int i = 0; i < days.length; i++) {
            boolean isSelected = (i == 2); // Mer 18
            RoundedPanel dayPill = new RoundedPanel(
                    14,
                    isSelected ? new Color(28, 79, 216) : new Color(241, 245, 249),
                    isSelected ? new Color(28, 79, 216) : new Color(226, 232, 240)
            );
            dayPill.setPreferredSize(new Dimension(65, 30));
            dayPill.setLayout(new GridBagLayout());

            JLabel lbl = new JLabel(days[i]);
            lbl.setFont(new Font("Segoe UI", Font.BOLD, 10));
            lbl.setForeground(isSelected ? Color.WHITE : new Color(71, 85, 105));
            dayPill.add(lbl);

            strip.add(dayPill);
        }

        return strip;
    }

    private JPanel createRightDonutCard() {
        RoundedPanel card = new RoundedPanel(18, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout(0, 10));
        card.setBorder(new EmptyBorder(18, 18, 18, 18));

        JLabel title = new JLabel("Origine des Réservations");
        title.setFont(new Font("Segoe UI", Font.BOLD, 14));
        title.setForeground(new Color(15, 23, 42));
        card.add(title, BorderLayout.NORTH);

        card.add(new DonutChartPanel(), BorderLayout.CENTER);

        // Legend
        JPanel legend = new JPanel(new GridLayout(3, 1, 0, 6));
        legend.setOpaque(false);
        legend.add(createLegendItem("Réservations Directes", "45%", new Color(28, 79, 216)));
        legend.add(createLegendItem("En Ligne / Agences", "35%", new Color(30, 41, 59)));
        legend.add(createLegendItem("Téléphone / Comptoir", "20%", new Color(147, 197, 253)));

        card.add(legend, BorderLayout.SOUTH);
        return card;
    }

    private JPanel createLegendItem(String label, String percent, Color dotColor) {
        JPanel item = new JPanel(new BorderLayout());
        item.setOpaque(false);

        JPanel left = new JPanel(new FlowLayout(FlowLayout.LEFT, 6, 0));
        left.setOpaque(false);

        JLabel dot = new JLabel("●");
        dot.setForeground(dotColor);
        dot.setFont(new Font("Segoe UI", Font.PLAIN, 14));

        JLabel text = new JLabel(label);
        text.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        text.setForeground(new Color(71, 85, 105));

        left.add(dot);
        left.add(text);

        JLabel pct = new JLabel(percent);
        pct.setFont(new Font("Segoe UI", Font.BOLD, 11));
        pct.setForeground(new Color(15, 23, 42));

        item.add(left, BorderLayout.WEST);
        item.add(pct, BorderLayout.EAST);
        return item;
    }
}
