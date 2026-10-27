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
import java.util.stream.Collectors;

public class ReservationsPanel extends JPanel {
    private final HotelService hotelService = HotelService.getInstance();
    private JTable table;
    private DefaultTableModel tableModel;

    // Filtres interactifs
    private JComboBox<String> cbFilterStatut;
    private JTextField tfSearchRes;

    public ReservationsPanel() {
        setLayout(new BorderLayout(0, 14));
        setOpaque(false);
        setBorder(new EmptyBorder(16, 20, 20, 20));

        initUI();
    }

    private void initUI() {
        // Top Section: Title & Actions & Filter Bar
        JPanel topSection = new JPanel(new BorderLayout(0, 12));
        topSection.setOpaque(false);

        JPanel headerBar = new JPanel(new BorderLayout());
        headerBar.setOpaque(false);

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

        headerBar.add(left, BorderLayout.WEST);
        headerBar.add(btnAdd, BorderLayout.EAST);
        topSection.add(headerBar, BorderLayout.NORTH);

        // Filter Bar (Barre de filtres)
        RoundedPanel filterCard = new RoundedPanel(14, Color.WHITE, new Color(226, 232, 240));
        filterCard.setLayout(new FlowLayout(FlowLayout.LEFT, 12, 8));

        JLabel lblFilter = new JLabel("Filtres :");
        lblFilter.setFont(new Font("Segoe UI", Font.BOLD, 12));
        lblFilter.setForeground(new Color(71, 85, 105));
        filterCard.add(lblFilter);

        // 1. Filtre par Statut de Réservation
        cbFilterStatut = new JComboBox<>(new String[]{
                "Tous les statuts", "Confirmée", "En cours", "Terminée", "En attente", "Annulée"
        });
        cbFilterStatut.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        cbFilterStatut.addActionListener(e -> refreshTable());
        filterCard.add(new JLabel("Statut :"));
        filterCard.add(cbFilterStatut);

        // 2. Recherche textuelle par N° ou nom de client
        tfSearchRes = new JTextField(14);
        tfSearchRes.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        tfSearchRes.putClientProperty("JTextField.placeholderText", "Réf ou Nom client...");
        tfSearchRes.addCaretListener(e -> refreshTable());
        filterCard.add(new JLabel("Recherche :"));
        filterCard.add(tfSearchRes);

        JButton btnReset = new JButton("Réinitialiser");
        btnReset.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        btnReset.addActionListener(e -> {
            cbFilterStatut.setSelectedIndex(0);
            tfSearchRes.setText("");
            refreshTable();
        });
        filterCard.add(btnReset);

        topSection.add(filterCard, BorderLayout.SOUTH);
        add(topSection, BorderLayout.NORTH);

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
                badge.setBackground(new Color(220, 252, 231)); // Emerald
                badge.setForeground(new Color(22, 101, 52));
            } else if ("Terminée".equalsIgnoreCase(val)) {
                badge.setBackground(new Color(241, 245, 249)); // Slate
                badge.setForeground(new Color(71, 85, 105));
            } else {
                badge.setBackground(new Color(254, 243, 199)); // Amber
                badge.setForeground(new Color(146, 64, 14));
            }
            return badge;
        });

        JScrollPane scrollPane = new JScrollPane(table);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());
        scrollPane.getViewport().setBackground(Color.WHITE);
        card.add(scrollPane, BorderLayout.CENTER);

        add(card, BorderLayout.CENTER);

        refreshTable();
    }

    public void refreshTable() {
        tableModel.setRowCount(0);
        List<Reservation> list = hotelService.getReservations();

        // 1. Filtre par statut
        String filterStatut = cbFilterStatut != null ? (String) cbFilterStatut.getSelectedItem() : "Tous les statuts";
        if (filterStatut != null && !filterStatut.startsWith("Tous")) {
            list = list.stream().filter(r -> filterStatut.equalsIgnoreCase(r.getStatut())).collect(Collectors.toList());
        }

        // 2. Filtre textuel
        String q = tfSearchRes != null ? tfSearchRes.getText().trim().toLowerCase() : "";
        if (!q.isEmpty()) {
            list = list.stream().filter(r -> {
                Client c = hotelService.findClientById(r.getIdClient());
                String cName = c != null ? c.getNomComplet().toLowerCase() : "";
                return r.getNumeroReservation().toLowerCase().contains(q) ||
                        r.getIdChambre().toLowerCase().contains(q) ||
                        cName.contains(q);
            }).collect(Collectors.toList());
        }

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
        form.setBackground(Color.WHITE);

        JComboBox<Client> cbClients = new JComboBox<>();
        for (Client c : hotelService.getClients()) cbClients.addItem(c);

        JComboBox<Chambre> cbChambres = new JComboBox<>();
        for (Chambre ch : hotelService.getChambres()) {
            if ("Disponible".equalsIgnoreCase(ch.getStatut())) {
                cbChambres.addItem(ch);
            }
        }
        if (cbChambres.getItemCount() == 0) {
            for (Chambre ch : hotelService.getChambres()) cbChambres.addItem(ch);
        }

        JTextField tfArr = new JTextField("2026-04-01");
        JTextField tfDep = new JTextField("2026-04-05");
        JSpinner spNuits = new JSpinner(new SpinnerNumberModel(4, 1, 60, 1));
        JSpinner spPers = new JSpinner(new SpinnerNumberModel(2, 1, 6, 1));
        JLabel lblTotalEstime = new JLabel("480 000 Ar");
        lblTotalEstime.setFont(new Font("Segoe UI", Font.BOLD, 14));
        lblTotalEstime.setForeground(new Color(28, 79, 216));

        // Calcul dynamique automatique
        Runnable updateTotal = () -> {
            Chambre sel = (Chambre) cbChambres.getSelectedItem();
            int n = (Integer) spNuits.getValue();
            if (sel != null) {
                lblTotalEstime.setText(HotelService.formatAriary(sel.getPrixNuit() * n));
            }
        };
        cbChambres.addActionListener(e -> updateTotal.run());
        spNuits.addChangeListener(e -> updateTotal.run());

        form.add(new JLabel("Sélectionner Client :"));
        form.add(cbClients);
        form.add(new JLabel("Chambre Disponible :"));
        form.add(cbChambres);
        form.add(new JLabel("Date Arrivée (AAAA-MM-JJ) :"));
        form.add(tfArr);
        form.add(new JLabel("Date Départ (AAAA-MM-JJ) :"));
        form.add(tfDep);
        form.add(new JLabel("Nombre de nuits :"));
        form.add(spNuits);
        form.add(new JLabel("Nombre d'occupants :"));
        form.add(spPers);
        form.add(new JLabel("Montant Total Estimé :"));
        form.add(lblTotalEstime);

        JPanel pBtn = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        pBtn.setBackground(Color.WHITE);
        JButton btnCancel = new JButton("Annuler");
        btnCancel.addActionListener(e -> dialog.dispose());

        RoundedButton btnSave = RoundedButton.createRoyalBlueButton("Confirmer la Réservation");
        btnSave.addActionListener(e -> {
            Client cl = (Client) cbClients.getSelectedItem();
            Chambre ch = (Chambre) cbChambres.getSelectedItem();
            if (cl == null || ch == null) {
                JOptionPane.showMessageDialog(dialog, "Veuillez sélectionner un client et une chambre.");
                return;
            }

            int n = (Integer) spNuits.getValue();
            double tot = ch.getPrixNuit() * n;
            String resId = "RES-" + String.format("%03d", hotelService.getReservations().size() + 1);
            String resNum = "REV-2026-" + String.format("%03d", hotelService.getReservations().size() + 1);

            Reservation res = new Reservation(
                    resId, resNum, cl.getId(), ch.getId(),
                    "2026-03-27", tfArr.getText().trim(), tfDep.getText().trim(),
                    (Integer) spPers.getValue(), n, tot, "Confirmée", "Réservation standard"
            );

            hotelService.ajouterReservation(res);
            refreshTable();
            dialog.dispose();
            JOptionPane.showMessageDialog(this, "Réservation " + resNum + " enregistrée avec succès !", "Succès", JOptionPane.INFORMATION_MESSAGE);
        });

        pBtn.add(btnCancel);
        pBtn.add(btnSave);

        dialog.add(form, BorderLayout.CENTER);
        dialog.add(pBtn, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }
}
