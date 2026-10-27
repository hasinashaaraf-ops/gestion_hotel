package com.hoteldereve;

import com.hoteldereve.model.*;
import com.hoteldereve.service.HotelService;
import com.hoteldereve.ui.*;
import com.hoteldereve.ui.components.RoundedButton;
import com.hoteldereve.ui.components.RoundedPanel;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.plaf.basic.BasicScrollBarUI;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.FocusAdapter;
import java.awt.event.FocusEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;
import java.util.List;

public class MainApp extends JFrame {
    private final CardLayout cardLayout = new CardLayout();
    private final JPanel contentPanel = new JPanel(cardLayout);

    private DashboardPanel dashboardPanel;
    private ChambresPanel chambresPanel;
    private ClientsPanel clientsPanel;
    private ReservationsPanel reservationsPanel;
    private CheckInOutPanel checkInOutPanel;
    private PaiementsPanel paiementsPanel;
    private FacturesPanel facturesPanel;
    private HousekeepingPanel housekeepingPanel;
    private ReportsPanel reportsPanel;
    private UsersPanel usersPanel;

    private String activeTab = "DASHBOARD";
    private JPanel navContainer;
    private JLabel lblSidebarUser;
    private JLabel lblSidebarRole;
    private JLabel lblHeaderUserName;

    public MainApp() {
        setTitle("Hôtel de Rêve - Logiciel de Gestion Hôtelière Professionnel (Desktop)");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1360, 860);
        setMinimumSize(new Dimension(1024, 700));
        setLocationRelativeTo(null);

        initLayout();
        initShortcuts();
    }

    private void initShortcuts() {
        // Raccourci global Ctrl + K pour ouvrir la recherche rapide
        getRootPane().registerKeyboardAction(
                e -> showGlobalSearchDialog(""),
                KeyStroke.getKeyStroke(java.awt.event.KeyEvent.VK_K, Toolkit.getDefaultToolkit().getMenuShortcutKeyMaskEx()),
                JComponent.WHEN_IN_FOCUSED_WINDOW
        );
    }

    private void initLayout() {
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
        clientsPanel = new ClientsPanel();
        reservationsPanel = new ReservationsPanel();
        checkInOutPanel = new CheckInOutPanel();
        paiementsPanel = new PaiementsPanel();
        facturesPanel = new FacturesPanel();
        housekeepingPanel = new HousekeepingPanel();
        reportsPanel = new ReportsPanel();
        usersPanel = new UsersPanel();

        contentPanel.setOpaque(false);
        contentPanel.add(dashboardPanel, "DASHBOARD");
        contentPanel.add(chambresPanel, "CHAMBRES");
        contentPanel.add(clientsPanel, "CLIENTS");
        contentPanel.add(reservationsPanel, "RESERVATIONS");
        contentPanel.add(checkInOutPanel, "CHECKINOUT");
        contentPanel.add(paiementsPanel, "PAIEMENTS");
        contentPanel.add(facturesPanel, "FACTURES");
        contentPanel.add(housekeepingPanel, "HOUSEKEEPING");
        contentPanel.add(reportsPanel, "REPORTS");
        contentPanel.add(usersPanel, "USERS");

        mainContainer.add(contentPanel, BorderLayout.CENTER);
        root.add(mainContainer, BorderLayout.CENTER);

        setContentPane(root);
    }

    private JPanel createSidebar() {
        JPanel sidebar = new JPanel(new BorderLayout());
        sidebar.setPreferredSize(new Dimension(240, 0));
        sidebar.setBackground(new Color(10, 10, 12)); // Jet black #0a0a0c

        // Brand / Logo Top
        JPanel brand = new JPanel(new FlowLayout(FlowLayout.LEFT, 16, 18));
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

        JLabel subtitle = new JLabel("GESTION HÔTELIÈRE");
        subtitle.setFont(new Font("Segoe UI", Font.BOLD, 9));
        subtitle.setForeground(new Color(113, 113, 122));

        titleBox.add(title);
        titleBox.add(subtitle);

        brand.add(logoBadge);
        brand.add(titleBox);
        sidebar.add(brand, BorderLayout.NORTH);

        // Navigation Items inside ScrollPane
        navContainer = new JPanel();
        navContainer.setLayout(new BoxLayout(navContainer, BoxLayout.Y_AXIS));
        navContainer.setOpaque(false);
        navContainer.setBorder(new EmptyBorder(8, 12, 12, 12));

        renderNavItems();

        JScrollPane navScroll = new JScrollPane(navContainer);
        navScroll.setBorder(null);
        navScroll.setOpaque(false);
        navScroll.getViewport().setOpaque(false);
        navScroll.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
        navScroll.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);

        // Scrollbar moderne stylisée sombre
        JScrollBar vsb = navScroll.getVerticalScrollBar();
        vsb.setUnitIncrement(18);
        vsb.setPreferredSize(new Dimension(7, 0));
        vsb.setBackground(new Color(10, 10, 12));
        vsb.setUI(new BasicScrollBarUI() {
            @Override
            protected void configureScrollBarColors() {
                this.thumbColor = new Color(75, 85, 99); // zinc-600 visible
                this.trackColor = new Color(24, 24, 27);
            }
            @Override
            protected JButton createDecreaseButton(int orientation) {
                JButton b = new JButton();
                b.setPreferredSize(new Dimension(0, 0));
                return b;
            }
            @Override
            protected JButton createIncreaseButton(int orientation) {
                JButton b = new JButton();
                b.setPreferredSize(new Dimension(0, 0));
                return b;
            }
        });

        sidebar.add(navScroll, BorderLayout.CENTER);

        // Bottom User Capsule (Mode de connexion / Session)
        JPanel bottomUser = new JPanel(new BorderLayout());
        bottomUser.setOpaque(false);
        bottomUser.setBorder(new EmptyBorder(10, 14, 14, 14));

        RoundedPanel userPill = new RoundedPanel(20, new Color(24, 24, 27), new Color(45, 45, 50));
        userPill.setLayout(new BorderLayout(8, 0));
        userPill.setBorder(new EmptyBorder(8, 12, 8, 12));
        userPill.setCursor(new Cursor(Cursor.HAND_CURSOR));
        userPill.setToolTipText("Cliquez pour changer d'utilisateur ou vous déconnecter");

        Utilisateur u = HotelService.getInstance().getCurrentUser();
        String uNom = u != null ? u.getNom() : "Admin";
        String uRole = u != null ? u.getRole() : "ADMIN";

        lblSidebarUser = new JLabel("● " + uNom);
        lblSidebarUser.setFont(new Font("Segoe UI", Font.BOLD, 11));
        lblSidebarUser.setForeground(new Color(244, 244, 245));

        lblSidebarRole = new JLabel(uRole);
        lblSidebarRole.setFont(new Font("Segoe UI", Font.PLAIN, 10));
        lblSidebarRole.setForeground(new Color(59, 130, 246));

        userPill.add(lblSidebarUser, BorderLayout.WEST);
        userPill.add(lblSidebarRole, BorderLayout.EAST);

        userPill.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                showLoginDialog();
            }
            @Override
            public void mouseEntered(MouseEvent e) {
                userPill.setBackgroundColor(new Color(39, 39, 42));
            }
            @Override
            public void mouseExited(MouseEvent e) {
                userPill.setBackgroundColor(new Color(24, 24, 27));
            }
        });

        bottomUser.add(userPill, BorderLayout.CENTER);
        sidebar.add(bottomUser, BorderLayout.SOUTH);

        return sidebar;
    }

    private void renderNavItems() {
        navContainer.removeAll();

        JLabel menuLbl = new JLabel("  GESTION OPÉRATIONNELLE");
        menuLbl.setFont(new Font("Segoe UI", Font.BOLD, 9));
        menuLbl.setForeground(new Color(113, 113, 122));
        menuLbl.setBorder(new EmptyBorder(0, 0, 6, 0));
        navContainer.add(menuLbl);

        navContainer.add(createNavItem("DASHBOARD", "▤  Dashboard", "DASHBOARD"));
        navContainer.add(Box.createVerticalStrut(4));
        navContainer.add(createNavItem("CHAMBRES", "🛏  Chambres", "CHAMBRES"));
        navContainer.add(Box.createVerticalStrut(4));
        navContainer.add(createNavItem("CLIENTS", "👥  Clients", "CLIENTS"));
        navContainer.add(Box.createVerticalStrut(4));
        navContainer.add(createNavItem("RESERVATIONS", "📅  Réservations", "RESERVATIONS"));
        navContainer.add(Box.createVerticalStrut(4));
        navContainer.add(createNavItem("CHECKINOUT", "🔑  Check-in / Out", "CHECKINOUT"));
        navContainer.add(Box.createVerticalStrut(4));
        navContainer.add(createNavItem("PAIEMENTS", "💳  Paiements", "PAIEMENTS"));
        navContainer.add(Box.createVerticalStrut(4));
        navContainer.add(createNavItem("FACTURES", "🧾  Factures", "FACTURES"));
        navContainer.add(Box.createVerticalStrut(4));
        navContainer.add(createNavItem("HOUSEKEEPING", "✨  Service d'Étages", "HOUSEKEEPING"));

        navContainer.add(Box.createVerticalStrut(12));
        JLabel admLbl = new JLabel("  ADMINISTRATION");
        admLbl.setFont(new Font("Segoe UI", Font.BOLD, 9));
        admLbl.setForeground(new Color(113, 113, 122));
        admLbl.setBorder(new EmptyBorder(0, 0, 6, 0));
        navContainer.add(admLbl);

        navContainer.add(createNavItem("REPORTS", "📊  Rapports & Stats", "REPORTS"));
        navContainer.add(Box.createVerticalStrut(4));
        navContainer.add(createNavItem("USERS", "⚙  Personnel & Accès", "USERS"));

        navContainer.revalidate();
        navContainer.repaint();
    }

    private JPanel createNavItem(String tabKey, String labelText, String cardName) {
        boolean isActive = activeTab.equals(tabKey);
        RoundedPanel item = new RoundedPanel(
                14,
                isActive ? new Color(28, 79, 216) : new Color(10, 10, 12),
                isActive ? new Color(28, 79, 216) : new Color(10, 10, 12)
        );
        item.setMaximumSize(new Dimension(Integer.MAX_VALUE, 36));
        item.setPreferredSize(new Dimension(216, 36));
        item.setLayout(new BorderLayout());
        item.setBorder(new EmptyBorder(0, 14, 0, 14));
        item.setCursor(new Cursor(Cursor.HAND_CURSOR));

        JLabel lbl = new JLabel(labelText);
        lbl.setFont(new Font("Segoe UI", isActive ? Font.BOLD : Font.PLAIN, 12));
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

    public void switchTab(String tabKey, String cardName) {
        this.activeTab = tabKey;
        cardLayout.show(contentPanel, cardName);

        if ("CHAMBRES".equals(tabKey) && chambresPanel != null) chambresPanel.refreshTable();
        if ("CLIENTS".equals(tabKey) && clientsPanel != null) clientsPanel.refreshTable();
        if ("RESERVATIONS".equals(tabKey) && reservationsPanel != null) reservationsPanel.refreshTable();
        if ("CHECKINOUT".equals(tabKey) && checkInOutPanel != null) checkInOutPanel.refreshData();
        if ("PAIEMENTS".equals(tabKey) && paiementsPanel != null) paiementsPanel.refreshTable();
        if ("FACTURES".equals(tabKey) && facturesPanel != null) facturesPanel.refreshTable();
        if ("HOUSEKEEPING".equals(tabKey) && housekeepingPanel != null) housekeepingPanel.refreshTable();
        if ("USERS".equals(tabKey) && usersPanel != null) usersPanel.refreshTable();

        renderNavItems();
    }

    private JPanel createHeader() {
        JPanel header = new JPanel(new BorderLayout(16, 0));
        header.setPreferredSize(new Dimension(0, 64));
        header.setBackground(new Color(28, 79, 216)); // Royal blue #1c4fd8
        header.setBorder(new EmptyBorder(12, 24, 12, 24));

        // Left: Quick Search Capsule (Cliquable avec modal de recherche dynamique)
        RoundedPanel searchPill = new RoundedPanel(20, new Color(255, 255, 255, 45), new Color(255, 255, 255, 75));
        searchPill.setPreferredSize(new Dimension(340, 38));
        searchPill.setLayout(new BorderLayout(8, 0));
        searchPill.setBorder(new EmptyBorder(0, 14, 0, 14));
        searchPill.setCursor(new Cursor(Cursor.TEXT_CURSOR));

        JLabel iconSearch = new JLabel("🔍");
        iconSearch.setForeground(Color.WHITE);
        searchPill.add(iconSearch, BorderLayout.WEST);

        final String placeholder = "Rechercher (Ctrl+K)...";
        JTextField tfSearch = new JTextField(placeholder);
        tfSearch.setOpaque(false);
        tfSearch.setBorder(null);
        tfSearch.setForeground(new Color(230, 240, 255));
        tfSearch.setCaretColor(Color.WHITE);
        tfSearch.setFont(new Font("Segoe UI", Font.PLAIN, 12));

        tfSearch.addFocusListener(new FocusAdapter() {
            @Override
            public void focusGained(FocusEvent e) {
                if (tfSearch.getText().equals(placeholder)) {
                    tfSearch.setText("");
                }
            }
            @Override
            public void focusLost(FocusEvent e) {
                if (tfSearch.getText().trim().isEmpty()) {
                    tfSearch.setText(placeholder);
                }
            }
        });

        tfSearch.addActionListener(e -> {
            String q = tfSearch.getText().trim();
            if (q.equals(placeholder)) q = "";
            showGlobalSearchDialog(q);
        });

        searchPill.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                String q = tfSearch.getText().trim();
                if (q.equals(placeholder)) q = "";
                showGlobalSearchDialog(q);
            }
        });

        JLabel hintK = new JLabel("Ctrl+K");
        hintK.setFont(new Font("Segoe UI", Font.BOLD, 10));
        hintK.setForeground(new Color(200, 220, 255));
        hintK.setCursor(new Cursor(Cursor.HAND_CURSOR));
        hintK.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                showGlobalSearchDialog("");
            }
        });

        searchPill.add(tfSearch, BorderLayout.CENTER);
        searchPill.add(hintK, BorderLayout.EAST);
        header.add(searchPill, BorderLayout.WEST);

        // Right: Fast Access Buttons + Profile Pill (Mode Connexion)
        JPanel right = new JPanel(new FlowLayout(FlowLayout.RIGHT, 12, 0));
        right.setOpaque(false);

        RoundedButton btnQuickRes = new RoundedButton("+ Réservation", Color.WHITE, new Color(28, 79, 216));
        btnQuickRes.setPreferredSize(new Dimension(130, 38));
        btnQuickRes.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btnQuickRes.addActionListener(e -> switchTab("RESERVATIONS", "RESERVATIONS"));

        RoundedButton btnQuickCheck = new RoundedButton("🔑 Check-in", new Color(255, 255, 255, 50), Color.WHITE);
        btnQuickCheck.setPreferredSize(new Dimension(110, 38));
        btnQuickCheck.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btnQuickCheck.addActionListener(e -> switchTab("CHECKINOUT", "CHECKINOUT"));

        // Profile Pill cliquable pour ouvrir le Mode de Connexion
        RoundedPanel profilePill = new RoundedPanel(20, Color.WHITE, Color.WHITE);
        profilePill.setPreferredSize(new Dimension(170, 38));
        profilePill.setLayout(new BorderLayout());
        profilePill.setBorder(new EmptyBorder(0, 14, 0, 14));
        profilePill.setCursor(new Cursor(Cursor.HAND_CURSOR));
        profilePill.setToolTipText("Cliquez pour changer d'utilisateur ou ouvrir la session");

        Utilisateur curUser = HotelService.getInstance().getCurrentUser();
        String name = curUser != null ? (curUser.getPrenom() + " " + curUser.getNom()).toUpperCase() : "JEAN RAKOTO";
        lblHeaderUserName = new JLabel(name + "  ▾");
        lblHeaderUserName.setFont(new Font("Segoe UI", Font.BOLD, 11));
        lblHeaderUserName.setForeground(new Color(15, 23, 42));
        profilePill.add(lblHeaderUserName, BorderLayout.CENTER);

        profilePill.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                showLoginDialog();
            }
        });

        right.add(btnQuickRes);
        right.add(btnQuickCheck);
        right.add(profilePill);

        header.add(right, BorderLayout.EAST);
        return header;
    }

    // =========================================================================
    // 1. RECHERCHE GLOBALE INTERACTIVE (Chambres, Clients, Réservations)
    // =========================================================================
    public void showGlobalSearchDialog(String initialQuery) {
        JDialog dialog = new JDialog(this, "Recherche Universelle - Hôtel de Rêve", true);
        dialog.setSize(680, 520);
        dialog.setLocationRelativeTo(this);

        JPanel content = new JPanel(new BorderLayout(0, 14));
        content.setBackground(Color.WHITE);
        content.setBorder(new EmptyBorder(16, 20, 16, 20));

        // Barre de saisie en haut
        JPanel topSearch = new JPanel(new BorderLayout(10, 0));
        topSearch.setOpaque(false);

        JTextField input = new JTextField(initialQuery);
        input.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        input.setPreferredSize(new Dimension(0, 40));
        input.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(28, 79, 216), 2, true),
                new EmptyBorder(0, 12, 0, 12)
        ));

        JLabel icon = new JLabel("🔍");
        icon.setFont(new Font("Segoe UI", Font.PLAIN, 18));
        topSearch.add(icon, BorderLayout.WEST);
        topSearch.add(input, BorderLayout.CENTER);

        content.add(topSearch, BorderLayout.NORTH);

        // Tableau des résultats
        String[] cols = {"Type", "Élément trouvé", "Détail / Montant", "Statut"};
        DefaultTableModel model = new DefaultTableModel(cols, 0) {
            @Override
            public boolean isCellEditable(int r, int c) { return false; }
        };

        JTable table = new JTable(model);
        table.setRowHeight(36);
        table.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        table.setSelectionBackground(new Color(239, 246, 255));
        table.setSelectionForeground(new Color(28, 79, 216));
        table.setShowGrid(false);

        DefaultTableCellRenderer centerRenderer = new DefaultTableCellRenderer();
        centerRenderer.setHorizontalAlignment(SwingConstants.CENTER);
        table.getColumnModel().getColumn(0).setCellRenderer(centerRenderer);
        table.getColumnModel().getColumn(3).setCellRenderer(centerRenderer);

        JScrollPane scroll = new JScrollPane(table);
        scroll.getViewport().setBackground(Color.WHITE);
        content.add(scroll, BorderLayout.CENTER);

        // Fonction de filtrage en temps réel
        Runnable searchTask = () -> {
            model.setRowCount(0);
            String q = input.getText().trim().toLowerCase();
            HotelService hs = HotelService.getInstance();

            // 1. Chambres
            for (Chambre c : hs.getChambres()) {
                if (q.isEmpty() || c.getNumero().toLowerCase().contains(q) ||
                        c.getType().toLowerCase().contains(q) ||
                        c.getStatut().toLowerCase().contains(q)) {
                    model.addRow(new Object[]{
                            "🛏 Chambre",
                            "Chambre N° " + c.getNumero() + " (" + c.getType() + ")",
                            HotelService.formatAriary(c.getPrixNuit()) + " / nuit",
                            c.getStatut()
                    });
                }
            }

            // 2. Clients
            for (Client cl : hs.getClients()) {
                if (q.isEmpty() || cl.getNom().toLowerCase().contains(q) ||
                        cl.getPrenom().toLowerCase().contains(q) ||
                        cl.getTelephone().toLowerCase().contains(q)) {
                    model.addRow(new Object[]{
                            "👥 Client",
                            cl.getNom().toUpperCase() + " " + cl.getPrenom(),
                            cl.getTelephone() + " · " + cl.getEmail(),
                            "Client régulier"
                    });
                }
            }

            // 3. Réservations
            for (Reservation r : hs.getReservations()) {
                if (q.isEmpty() || r.getNumeroReservation().toLowerCase().contains(q) ||
                        r.getIdClient().toLowerCase().contains(q) ||
                        r.getIdChambre().toLowerCase().contains(q)) {
                    model.addRow(new Object[]{
                            "📅 Réservation",
                            r.getNumeroReservation() + " (" + r.getIdChambre() + ")",
                            r.getDateArrivee() + " au " + r.getDateDepart() + " · " + HotelService.formatAriary(r.getPrixTotal()),
                            r.getStatut()
                    });
                }
            }
        };

        input.addCaretListener(e -> searchTask.run());
        searchTask.run(); // Recherche initiale

        // Action d'accès en double-clic ou bouton
        Runnable navigateAction = () -> {
            int row = table.getSelectedRow();
            if (row >= 0) {
                String type = (String) model.getValueAt(row, 0);
                if (type.contains("Chambre")) switchTab("CHAMBRES", "CHAMBRES");
                else if (type.contains("Client")) switchTab("CLIENTS", "CLIENTS");
                else if (type.contains("Réservation")) switchTab("RESERVATIONS", "RESERVATIONS");
                dialog.dispose();
            }
        };

        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) navigateAction.run();
            }
        });

        // Boutons bas
        JPanel bottom = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        bottom.setOpaque(false);
        JButton btnClose = new JButton("Fermer");
        btnClose.addActionListener(e -> dialog.dispose());

        RoundedButton btnGo = RoundedButton.createRoyalBlueButton("Ouvrir l'élément sélectionné →");
        btnGo.addActionListener(e -> navigateAction.run());

        bottom.add(btnClose);
        bottom.add(btnGo);
        content.add(bottom, BorderLayout.SOUTH);

        dialog.setContentPane(content);
        dialog.setVisible(true);
    }

    // =========================================================================
    // 2. MODE DE CONNEXION & GESTION DES SESSIONS
    // =========================================================================
    public void showLoginDialog() {
        JDialog dialog = new JDialog(this, "Espace de Connexion & Session Collaborateur", true);
        dialog.setSize(480, 420);
        dialog.setLocationRelativeTo(this);

        JPanel panel = new JPanel(new BorderLayout(0, 16));
        panel.setBackground(Color.WHITE);
        panel.setBorder(new EmptyBorder(20, 24, 20, 24));

        // En-tête
        JPanel top = new JPanel(new GridLayout(2, 1, 0, 4));
        top.setOpaque(false);
        JLabel title = new JLabel("Connexion au Logiciel Hôtel de Rêve");
        title.setFont(new Font("Segoe UI", Font.BOLD, 16));
        title.setForeground(new Color(15, 23, 42));

        Utilisateur cur = HotelService.getInstance().getCurrentUser();
        String curName = cur != null ? (cur.getPrenom() + " " + cur.getNom() + " (" + cur.getRole() + ")") : "Non connecté";
        JLabel sub = new JLabel("Session active actuelle : " + curName);
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        sub.setForeground(new Color(22, 101, 52));
        top.add(title);
        top.add(sub);
        panel.add(top, BorderLayout.NORTH);

        // Centre : Options de bascule rapide + Formulaire
        JPanel center = new JPanel(new GridLayout(6, 1, 0, 8));
        center.setOpaque(false);

        JLabel lblQuick = new JLabel("BASCULE RAPIDE EN 1 CLIC :");
        lblQuick.setFont(new Font("Segoe UI", Font.BOLD, 10));
        lblQuick.setForeground(new Color(100, 116, 139));
        center.add(lblQuick);

        // Boutons 1-clic pour switcher de rôle
        JPanel quickBtns = new JPanel(new GridLayout(1, 2, 10, 0));
        quickBtns.setOpaque(false);

        JButton btnAdmin = new JButton("👑 Jean Rakoto (Admin)");
        btnAdmin.setBackground(new Color(238, 242, 255));
        btnAdmin.setForeground(new Color(28, 79, 216));
        btnAdmin.setFocusPainted(false);
        btnAdmin.addActionListener(e -> {
            applyUser(new Utilisateur("USR-1", "Rakoto", "Jean", "admin", "admin123", "ADMIN"));
            dialog.dispose();
        });

        JButton btnRecep = new JButton("🛎 Marie Rasoa (Réception)");
        btnRecep.setBackground(new Color(240, 253, 244));
        btnRecep.setForeground(new Color(22, 101, 52));
        btnRecep.setFocusPainted(false);
        btnRecep.addActionListener(e -> {
            applyUser(new Utilisateur("USR-2", "Rasoa", "Marie", "reception", "1234", "RECEPTIONIST"));
            dialog.dispose();
        });

        quickBtns.add(btnAdmin);
        quickBtns.add(btnRecep);
        center.add(quickBtns);

        center.add(Box.createVerticalStrut(6));

        // Formulaire d'identifiants
        JLabel lblManual = new JLabel("OU SAISIE MANUELLE :");
        lblManual.setFont(new Font("Segoe UI", Font.BOLD, 10));
        lblManual.setForeground(new Color(100, 116, 139));
        center.add(lblManual);

        JPanel form = new JPanel(new GridLayout(2, 2, 10, 8));
        form.setOpaque(false);
        JTextField tfLogin = new JTextField("admin");
        JPasswordField tfPass = new JPasswordField("admin123");
        form.add(new JLabel("Identifiant :"));
        form.add(tfLogin);
        form.add(new JLabel("Mot de passe :"));
        form.add(tfPass);
        center.add(form);

        panel.add(center, BorderLayout.CENTER);

        // Boutons d'action
        JPanel bottom = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        bottom.setOpaque(false);

        JButton btnLogout = new JButton("Déconnexion");
        btnLogout.setForeground(new Color(220, 38, 38));
        btnLogout.addActionListener(e -> {
            applyUser(new Utilisateur("GUEST", "Invité", "Session", "guest", "", "LECTURE"));
            dialog.dispose();
            JOptionPane.showMessageDialog(this, "Session déconnectée. Mode invité actif.", "Déconnexion", JOptionPane.INFORMATION_MESSAGE);
        });

        RoundedButton btnConnect = RoundedButton.createRoyalBlueButton("Se connecter");
        btnConnect.addActionListener(e -> {
            String login = tfLogin.getText().trim();
            String pwd = new String(tfPass.getPassword());

            Utilisateur matched = null;
            for (Utilisateur uItem : HotelService.getInstance().getUtilisateurs()) {
                if (uItem.getUsername().equalsIgnoreCase(login) && uItem.getPassword().equals(pwd)) {
                    matched = uItem;
                    break;
                }
            }

            if (matched != null) {
                applyUser(matched);
                dialog.dispose();
            } else {
                // Si l'utilisateur par défaut n'est pas dans la liste
                if ("admin".equalsIgnoreCase(login)) {
                    applyUser(new Utilisateur("USR-1", "Rakoto", "Jean", "admin", "admin123", "ADMIN"));
                    dialog.dispose();
                } else if ("reception".equalsIgnoreCase(login)) {
                    applyUser(new Utilisateur("USR-2", "Rasoa", "Marie", "reception", "1234", "RECEPTIONIST"));
                    dialog.dispose();
                } else {
                    JOptionPane.showMessageDialog(dialog, "Identifiants invalides (essayez admin / admin123 ou reception / 1234)", "Erreur Connexion", JOptionPane.ERROR_MESSAGE);
                }
            }
        });

        bottom.add(btnLogout);
        bottom.add(btnConnect);
        panel.add(bottom, BorderLayout.SOUTH);

        dialog.setContentPane(panel);
        dialog.setVisible(true);
    }

    private void applyUser(Utilisateur u) {
        HotelService.getInstance().setCurrentUser(u);
        String fullName = (u.getPrenom() + " " + u.getNom()).toUpperCase();

        if (lblHeaderUserName != null) {
            lblHeaderUserName.setText(fullName + "  ▾");
        }
        if (lblSidebarUser != null) {
            lblSidebarUser.setText("● " + u.getNom());
        }
        if (lblSidebarRole != null) {
            lblSidebarRole.setText(u.getRole());
        }

        JOptionPane.showMessageDialog(this, "Connecté avec succès en tant que :\n" + fullName + " (" + u.getRole() + ")", "Session Active", JOptionPane.INFORMATION_MESSAGE);
    }

    public static void main(String[] args) {
        System.out.println("[INFO] Demarrage de l'application Desktop Hotel de Reve...");

        // Look & Feel : FlatLaf moderne si present, sinon Look & Feel natif du systeme
        try {
            Class<?> flatLaf = Class.forName("com.formdev.flatlaf.FlatLightLaf");
            flatLaf.getMethod("setup").invoke(null);
            System.out.println("[INFO] Theme FlatLaf applique.");
        } catch (Throwable t) {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
                System.out.println("[INFO] Theme systeme natif applique.");
            } catch (Exception ignored) {}
        }

        SwingUtilities.invokeLater(() -> {
            try {
                System.out.println("[INFO] Creation de la fenetre principale...");
                MainApp app = new MainApp();
                app.setVisible(true);
                System.out.println("[SUCCES] La fenetre Hotel de Reve est ouverte sur votre ecran !");
            } catch (Throwable t) {
                System.err.println("[ERREUR GRAVE] Echec de creation de l'interface graphique :");
                t.printStackTrace();
                JOptionPane.showMessageDialog(null,
                        "Erreur lors de l'ouverture de l'application :\n" + t.getMessage(),
                        "Erreur Demarrage", JOptionPane.ERROR_MESSAGE);
            }
        });
    }
}
