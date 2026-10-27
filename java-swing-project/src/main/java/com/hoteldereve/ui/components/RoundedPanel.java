package com.hoteldereve.ui.components;

import javax.swing.*;
import java.awt.*;

public class RoundedPanel extends JPanel {
    private int cornerRadius = 16;
    private Color backgroundColor = Color.WHITE;
    private Color borderColor = new Color(226, 232, 240);
    private boolean drawBorder = true;

    public RoundedPanel() {
        setOpaque(false);
    }

    public RoundedPanel(int radius, Color bg) {
        this.cornerRadius = radius;
        this.backgroundColor = bg;
        this.drawBorder = false;
        setOpaque(false);
    }

    public RoundedPanel(int radius, Color bg, Color border) {
        this.cornerRadius = radius;
        this.backgroundColor = bg;
        this.borderColor = border;
        this.drawBorder = true;
        setOpaque(false);
    }

    public void setBackgroundColor(Color c) {
        this.backgroundColor = c;
        repaint();
    }

    public void setCornerRadius(int r) {
        this.cornerRadius = r;
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int w = getWidth();
        int h = getHeight();

        // Fill background
        g2.setColor(backgroundColor);
        g2.fillRoundRect(0, 0, w, h, cornerRadius, cornerRadius);

        // Optional border
        if (drawBorder && borderColor != null) {
            g2.setColor(borderColor);
            g2.setStroke(new BasicStroke(1f));
            g2.drawRoundRect(0, 0, w - 1, h - 1, cornerRadius, cornerRadius);
        }

        g2.dispose();
    }
}
