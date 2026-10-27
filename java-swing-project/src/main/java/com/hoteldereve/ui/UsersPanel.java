package com.hoteldereve.ui;

import com.hoteldereve.model.Utilisateur;
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

public class UsersPanel extends JPanel {
    private final HotelService hotelService = HotelService.getInstance();
    private JTable table;
    private DefaultTableModel tableModel;

    public UsersPanel() {
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
        JLabel title = new JLabel("Gestion des Comptes & Personnel");
        title.setFont(new Font("Segoe UI", Font.BOLD, 18));
        title.setForeground(new Color(15, 23, 42));

        JLabel sub = new JLabel("Contrôle des accès, rôles Administrateur et Réceptionniste");
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        sub.setForeground(new Color(100, 116, 139));
        left.add(title);
        left.add(sub);

        RoundedButton btnAdd = RoundedButton.createRoyalBlueButton("+ Ajouter un collaborateur");
        btnAdd.addActionListener(e -> showAddUserDialog());

        topBar.add(left, BorderLayout.WEST);
        topBar.add(btnAdd, BorderLayout.EAST);
        add(topBar, BorderLayout.NORTH);

        // Center Table Card
        RoundedPanel card = new RoundedPanel(16, Color.WHITE, new Color(226, 232, 240));
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(8, 8, 8, 8));

        String[] columns = {"ID", "Nom & Prénom", "Nom d'utilisateur", "Rôle Attribué", "Statut Compte"};
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
        table.getColumnModel().getColumn(2).setCellRenderer(center);

        table.getColumnModel().getColumn(3).setCellRenderer((t, value, isSelected, hasFocus, row, column) -> {
            String val = value != null ? value.toString() : "";
            JLabel badge = new JLabel(val, SwingConstants.CENTER);
            badge.setOpaque(true);
            badge.setFont(new Font("Segoe UI", Font.BOLD, 11));
            badge.setBorder(new EmptyBorder(4, 8, 4, 8));

            if ("ADMIN".equalsIgnoreCase(val)) {
                badge.setBackground(new Color(238, 242, 255));
                badge.setForeground(new Color(79, 70, 229));
            } else {
                badge.setBackground(new Color(240, 253, 244));
                badge.setForeground(new Color(22, 101, 52));
            }
            return badge;
        });

        table.getColumnModel().getColumn(4).setCellRenderer((t, value, isSelected, hasFocus, row, column) -> {
            JLabel badge = new JLabel("● Actif", SwingConstants.CENTER);
            badge.setForeground(new Color(22, 101, 52));
            badge.setFont(new Font("Segoe UI", Font.BOLD, 11));
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
        List<Utilisateur> list = hotelService.getUtilisateurs();

        for (Utilisateur u : list) {
            tableModel.addRow(new Object[]{
                    u.getId(),
                    u.getNom().toUpperCase() + " " + u.getPrenom(),
                    u.getUsername(),
                    u.getRole(),
                    "Actif"
            });
        }
    }

    private void showAddUserDialog() {
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Créer un compte collaborateur", true);
        dialog.setSize(420, 360);
        dialog.setLocationRelativeTo(this);

        JPanel panel = new JPanel(new GridLayout(5, 2, 10, 12));
        panel.setBorder(new EmptyBorder(20, 20, 20, 20));
        panel.setBackground(Color.WHITE);

        JTextField tfNom = new JTextField();
        JTextField tfPrenom = new JTextField();
        JTextField tfLogin = new JTextField();
        JPasswordField tfPass = new JPasswordField();
        JComboBox<String> cbRole = new JComboBox<>(new String[]{"RECEPTIONIST", "ADMIN"});

        panel.add(new JLabel("Nom :"));
        panel.add(tfNom);
        panel.add(new JLabel("Prénom :"));
        panel.add(tfPrenom);
        panel.add(new JLabel("Identifiant / Login :"));
        panel.add(tfLogin);
        panel.add(new JLabel("Mot de passe :"));
        panel.add(tfPass);
        panel.add(new JLabel("Rôle :"));
        panel.add(cbRole);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        btnPanel.setBackground(Color.WHITE);
        JButton btnCancel = new JButton("Annuler");
        btnCancel.addActionListener(e -> dialog.dispose());

        RoundedButton btnSave = RoundedButton.createRoyalBlueButton("Créer l'utilisateur");
        btnSave.addActionListener(e -> {
            if (tfNom.getText().trim().isEmpty() || tfLogin.getText().trim().isEmpty()) {
                JOptionPane.showMessageDialog(dialog, "Veuillez renseigner au moins le nom et le login.", "Champs requis", JOptionPane.WARNING_MESSAGE);
                return;
            }

            String newId = "USR-" + (hotelService.getUtilisateurs().size() + 1);
            Utilisateur newUser = new Utilisateur(
                    newId,
                    tfNom.getText().trim(),
                    tfPrenom.getText().trim(),
                    tfLogin.getText().trim(),
                    new String(tfPass.getPassword()),
                    (String) cbRole.getSelectedItem()
            );

            hotelService.ajouterUtilisateur(newUser);
            refreshTable();
            dialog.dispose();
            JOptionPane.showMessageDialog(this, "Compte utilisateur créé avec succès !", "Utilisateur Enregistré", JOptionPane.INFORMATION_MESSAGE);
        });

        btnPanel.add(btnCancel);
        btnPanel.add(btnSave);

        dialog.getContentPane().setLayout(new BorderLayout());
        dialog.getContentPane().add(panel, BorderLayout.CENTER);
        dialog.getContentPane().add(btnPanel, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }
}
