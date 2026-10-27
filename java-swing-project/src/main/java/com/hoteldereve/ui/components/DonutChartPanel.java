package com.hoteldereve.ui.components;

import javax.swing.*;
import java.awt.*;

public class DonutChartPanel extends JPanel {
    private final int directPercent = 45;
    private final int webPercent = 35;
    private final int phonePercent = 20;

    public DonutChartPanel() {
        setOpaque(false);
        setPreferredSize(new Dimension(220, 200));
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int size = Math.min(getWidth(), getHeight()) - 40;
        int x = (getWidth() - size) / 2;
        int y = 15;

        int angleDirect = (int) Math.round(directPercent * 3.6);
        int angleWeb = (int) Math.round(webPercent * 3.6);
        int anglePhone = 360 - angleDirect - angleWeb;

        int currentAngle = 90;

        // Draw outer slices
        // 1. Direct (Royal Blue #1C4FD8)
        g2.setColor(new Color(28, 79, 216));
        g2.fillArc(x, y, size, size, currentAngle, -angleDirect);
        currentAngle -= angleDirect;

        // 2. Web / Agences (Deep Charcoal #1E293B)
        g2.setColor(new Color(30, 41, 59));
        g2.fillArc(x, y, size, size, currentAngle, -angleWeb);
        currentAngle -= angleWeb;

        // 3. Téléphone (Light Ice Blue #93C5FD)
        g2.setColor(new Color(147, 197, 253));
        g2.fillArc(x, y, size, size, currentAngle, -anglePhone);

        // Donut inner hole
        int holeSize = (int) (size * 0.62);
        int hx = x + (size - holeSize) / 2;
        int hy = y + (size - holeSize) / 2;
        g2.setColor(Color.WHITE);
        g2.fillOval(hx, hy, holeSize, holeSize);

        // Center text
        g2.setColor(new Color(15, 23, 42));
        g2.setFont(new Font("Segoe UI", Font.BOLD, 18));
        FontMetrics fm1 = g2.getFontMetrics();
        String totalText = "100%";
        g2.drawString(totalText, hx + (holeSize - fm1.stringWidth(totalText)) / 2, hy + holeSize / 2 + 2);

        g2.setFont(new Font("Segoe UI", Font.PLAIN, 10));
        g2.setColor(new Color(100, 116, 139));
        FontMetrics fm2 = g2.getFontMetrics();
        String subText = "Réservations";
        g2.drawString(subText, hx + (holeSize - fm2.stringWidth(subText)) / 2, hy + holeSize / 2 + 16);

        g2.dispose();
    }
}
