package com.hoteldereve.ui.components;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

public class RoundedButton extends JButton {
    private Color normalColor;
    private Color hoverColor;
    private Color pressedColor;
    private int cornerRadius = 30; // Pill style by default

    public RoundedButton(String text, Color bg, Color hover) {
        super(text);
        this.normalColor = bg;
        this.hoverColor = hover;
        this.pressedColor = hover.darker();

        setContentAreaFilled(false);
        setFocusPainted(false);
        setBorderPainted(false);
        setForeground(Color.WHITE);
        setFont(new Font("Segoe UI", Font.BOLD, 12));
        setCursor(new Cursor(Cursor.HAND_CURSOR));

        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                repaint();
            }

            @Override
            public void mouseExited(MouseEvent e) {
                repaint();
            }
        });
    }

    public static RoundedButton createRoyalBlueButton(String text) {
        RoundedButton btn = new RoundedButton(text, new Color(28, 79, 216), new Color(24, 69, 196));
        btn.setPreferredSize(new Dimension(btn.getPreferredSize().width + 24, 36));
        return btn;
    }

    public static RoundedButton createDarkButton(String text) {
        RoundedButton btn = new RoundedButton(text, new Color(10, 10, 12), new Color(30, 30, 36));
        btn.setPreferredSize(new Dimension(btn.getPreferredSize().width + 24, 36));
        return btn;
    }

    public void setCornerRadius(int radius) {
        this.cornerRadius = radius;
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        ButtonModel model = getModel();
        Color bg = normalColor;
        if (model.isPressed()) {
            bg = pressedColor;
        } else if (model.isRollover()) {
            bg = hoverColor;
        }

        g2.setColor(bg);
        g2.fillRoundRect(0, 0, getWidth(), getHeight(), cornerRadius, cornerRadius);

        super.paintComponent(g);
        g2.dispose();
    }
}
