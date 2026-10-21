package com.hoteldereve;

import com.formdev.flatlaf.FlatLightLaf;
import com.hoteldereve.service.HotelService;
import com.hoteldereve.ui.*;
import com.hoteldereve.ui.components.RoundedPanel;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

public class MainApp extends JFrame {
    private final CardLayout cardLayout = new CardLayout();
    private final JPanel contentPanel = new JPanel(cardLayout);

    private DashboardPanel dashboardPanel;
    private ChambresPanel chambresPanel;
    private ReservationsPanel reservationsPanel;
    private CheckInOutPanel checkInOutPanel;

    private String activeTab = "DASHBOARD";
    private JPanel navContainer;

    public MainApp() {
        setTitle("Hôtel de Rêve - Logiciel de Gestion Hôtelière");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1280, 820);
        setMinimumSize(new Dimension(1024, 700));
        setLocationRelativeTo(null);

        initLayout();
    }

    private void initLayout() {
        // Root container
        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(new Color(244, 245, 250)); // SaaS crisp light gray

        // Left Sidebar (#0A0A0C deep black)
        JPanel sidebar = createSidebar();
        root.add(sidebar, BorderLayout.WEST);

        // Right Main Container
        JPanel mainContainer = new JPanel(new BorderLayout());
        mainContainer.setOpaque(false);

        // Top Header (#1C4FD8 royal blue)
        JPanel header = createHeader();
        mainContainer.add(header, BorderLayout.NORTH);

        // Center Views (CardLayout)
        dashboardPanel = new DashboardPanel();
        chambresPanel = new ChambresPanel();
        reservationsPanel = new ReservationsPanel();
        checkInOutPanel = new CheckInOutPanel();

        contentPanel.setOpaque(false);
        contentPanel.add(dashboardPanel, "DASHBOARD");
        contentPanel.add(chambresPanel, "CHAMBRES");
        contentPanel.add(reservationsPanel, "RESERVATIONS");
        contentPanel.add(checkInOutPanel, "CHECKINOUT");

        mainContainer.add(contentPanel, BorderLayout.CENTER);
        root.add(mainContainer, BorderLayout.CENTER);

        setContentPane(root);
    }

    private JPanel createSidebar() {
        JPanel sidebar = new JPanel(new BorderLayout());
        sidebar.setPreferredSize(new Dimension(240, 0));
        sidebar.setBackground(new Color(10, 10, 12)); // Jet black #0a0a0c

        // Brand / Logo Top
        JPanel brand = new JPanel(new FlowLayout(FlowLayout.LEFT, 16, 20));
        brand.setOpaque(false);

        RoundedPanel logoBadge = new RoundedPanel(12, new Color(28, 79, 216));
        logoBadge.setPreferredSize(new Dimension(36, 36));
        logoBadge.setLayout(new GridBagLayout());
        JLabel logoIcon = new JLabel("🏨");
        logoIcon.setForeground(Color.WHITE);
        logoBadge.add(logoIcon);

        JPanel titleBox = new JPanel(new GridLayout(2, 1, 0, 1));
        titleBox.setOpaque(false);
        JLabel title = new JLabel("HÔTEL DE RÊVE");
        title.setFont(new Font("Segoe UI", Font.BOLD, 14));
        title.setForeground(Color.WHITE);

        JLabel subtitle = new JLabel("MANAGEMENT SUITE");
        subtitle.setFont(new Font("Segoe UI", Font.BOLD, 9));
        subtitle.setForeground(new Color(113, 113, 122));

        titleBox.add(title);
        titleBox.add(subtitle);

        brand.add(logoBadge);
        brand.add(titleBox);
        sidebar.add(brand, BorderLayout.NORTH);

        // Navigation Items
        navContainer = new JPanel();
        navContainer.setLayout(new BoxLayout(navContainer, BoxLayout.Y_AXIS));
        navContainer.setOpaque(false);
        navContainer.setBorder(new EmptyBorder(16, 12, 16, 12));

        JLabel menuLbl = new JLabel("  MENU PRINCIPAL");
        menuLbl.setFont(new Font("Segoe UI", Font.BOLD, 10));
        menuLbl.setForeground(new Color(113, 113, 122));
        menuLbl.setBorder(new EmptyBorder(0, 0, 10, 0));
        navContainer.add(menuLbl);

        navContainer.add(createNavItem("DASHBOARD", "▤  Dashboard", "DASHBOARD"));
        navContainer.add(Box.createVerticalStrut(6));
        navContainer.add(createNavItem("CHAMBRES", "🛏  Chambres", "CHAMBRES"));
        navContainer.add(Box.createVerticalStrut(6));
        navContainer.add(createNavItem("RESERVATIONS", "📅  Réservations", "RESERVATIONS"));
        navContainer.add(Box.createVerticalStrut(6));
        navContainer.add(createNavItem("CHECKINOUT", "🔑  Check-in / Check-out", "CHECKINOUT"));

        sidebar.add(navContainer, BorderLayout.CENTER);

        // User Logout Capsule at the bottom
        JPanel bottomUser = new JPanel(new BorderLayout());
        bottomUser.setOpaque(false);
        bottomUser.setBorder(new EmptyBorder(16, 16, 20, 16));

        RoundedPanel userPill = new RoundedPanel(24, new Color(24, 24, 27), new Color(39, 39, 42));
        userPill.setLayout(new BorderLayout());
        userPill.setBorder(new EmptyBorder(10, 14, 10, 14));

        JLabel lblUser = new JLabel("● Admin (Jean R.)");
        lblUser.setFont(new Font("Segoe UI", Font.BOLD, 11));
        lblUser.setForeground(new Color(244, 244, 245));

        JLabel lblRole = new JLabel("Déconnexion");
        lblRole.setFont(new Font("Segoe UI", Font.PLAIN, 10));
        lblRole.setForeground(new Color(28, 79, 216));

        userPill.add(lblUser, BorderLayout.WEST);
        userPill.add(lblRole, BorderLayout.EAST);
        bottomUser.add(userPill, BorderLayout.CENTER);

        sidebar.add(bottomUser, BorderLayout.SOUTH);
        return sidebar;
    }

    private JPanel createNavItem(String tabKey, String labelText, String cardName) {
        boolean isActive = activeTab.equals(tabKey);
        RoundedPanel item = new RoundedPanel(
                20,
                isActive ? new Color(28, 79, 216) : new Color(10, 10, 12),
                isActive ? new Color(28, 79, 216) : new Color(10, 10, 12)
        );
        item.setMaximumSize(new Dimension(Integer.MAX_VALUE, 40));
        item.setPreferredSize(new Dimension(216, 40));
        item.setLayout(new BorderLayout());
        item.setBorder(new EmptyBorder(0, 16, 0, 16));
        item.setCursor(new Cursor(Cursor.HAND_CURSOR));

        JLabel lbl = new JLabel(labelText);
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 12));
        lbl.setForeground(isActive ? Color.WHITE : new Color(161, 161, 170));
        item.add(lbl, BorderLayout.CENTER);

        item.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                switchTab(tabKey, cardName);
            }

            @Override
            public void mouseEntered(MouseEvent e) {
                if (!activeTab.equals(tabKey)) {
                    item.setBackgroundColor(new Color(24, 24, 27));
                    lbl.setForeground(Color.WHITE);
                }
            }

            @Override
            public void mouseExited(MouseEvent e) {
                if (!activeTab.equals(tabKey)) {
                    item.setBackgroundColor(new Color(10, 10, 12));
                    lbl.setForeground(new Color(161, 161, 170));
                }
            }
        });

        return item;
    }

    private void switchTab(String tabKey, String cardName) {
        this.activeTab = tabKey;
        cardLayout.show(contentPanel, cardName);

        if ("CHAMBRES".equals(tabKey)) chambresPanel.refreshTable();
        if ("RESERVATIONS".equals(tabKey)) reservationsPanel.refreshTable();
        if ("CHECKINOUT".equals(tabKey)) checkInOutPanel.refreshData();

        // Re-render sidebar nav buttons
        navContainer.removeAll();
        JLabel menuLbl = new JLabel("  MENU PRINCIPAL");
        menuLbl.setFont(new Font("Segoe UI", Font.BOLD, 10));
        menuLbl.setForeground(new Color(113, 113, 122));
        menuLbl.setBorder(new EmptyBorder(0, 0, 10, 0));
        navContainer.add(menuLbl);

        navContainer.add(createNavItem("DASHBOARD", "▤  Dashboard", "DASHBOARD"));
        navContainer.add(Box.createVerticalStrut(6));
        navContainer.add(createNavItem("CHAMBRES", "🛏  Chambres", "CHAMBRES"));
        navContainer.add(Box.createVerticalStrut(6));
        navContainer.add(createNavItem("RESERVATIONS", "📅  Réservations", "RESERVATIONS"));
        navContainer.add(Box.createVerticalStrut(6));
        navContainer.add(createNavItem("CHECKINOUT", "🔑  Check-in / Check-out", "CHECKINOUT"));

        navContainer.revalidate();
        navContainer.repaint();
    }

    private JPanel createHeader() {
        // Top Royal Blue Header (#1C4FD8) matching the design screenshot
        JPanel header = new JPanel(new BorderLayout());
        header.setPreferredSize(new Dimension(0, 64));
        header.setBackground(new Color(28, 79, 216)); // Royal blue #1c4fd8
        header.setBorder(new EmptyBorder(12, 24, 12, 24));

        // Left: Search Pill
        RoundedPanel searchPill = new RoundedPanel(20, new Color(255, 255, 255, 45), new Color(255, 255, 255, 75));
        searchPill.setPreferredSize(new Dimension(280, 36));
        searchPill.setLayout(new BorderLayout());
        searchPill.setBorder(new EmptyBorder(0, 14, 0, 14));

        JTextField tfSearch = new JTextField("Rechercher client, chambre, réservation...");
        tfSearch.setOpaque(false);
        tfSearch.setBorder(null);
        tfSearch.setForeground(Color.WHITE);
        tfSearch.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        searchPill.add(tfSearch, BorderLayout.CENTER);

        header.add(searchPill, BorderLayout.WEST);

        // Right: Profile Pill & Quick Actions
        JPanel right = new JPanel(new FlowLayout(FlowLayout.RIGHT, 12, 0));
        right.setOpaque(false);

        RoundedPanel profilePill = new RoundedPanel(20, Color.WHITE, Color.WHITE);
        profilePill.setPreferredSize(new Dimension(170, 38));
        profilePill.setLayout(new BorderLayout());
        profilePill.setBorder(new EmptyBorder(0, 14, 0, 14));

        JLabel lblName = new JLabel("JEAN RAKOTO  ▾");
        lblName.setFont(new Font("Segoe UI", Font.BOLD, 11));
        lblName.setForeground(new Color(15, 23, 42));
        profilePill.add(lblName, BorderLayout.CENTER);

        right.add(profilePill);
        header.add(right, BorderLayout.EAST);

        return header;
    }

    public static void main(String[] args) {
        // Apply FlatLaf modern Look & Feel
        try {
            FlatLightLaf.setup();
        } catch (Exception e) {
            // Fallback to system Look & Feel
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {}
        }

        SwingUtilities.invokeLater(() -> {
            MainApp app = new MainApp();
            app.setVisible(true);
        });
    }
}
