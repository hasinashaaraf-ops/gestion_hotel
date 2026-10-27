package com.hoteldereve.ui.components;

import javax.swing.*;
import java.awt.*;
import java.awt.geom.GeneralPath;

public class WaveChartPanel extends JPanel {
    private final int[] dataPoints = {15, 28, 42, 35, 65, 48, 78, 55, 90, 72, 85, 60};
    private final String[] months = {"Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"};

    public WaveChartPanel() {
        setOpaque(false);
        setPreferredSize(new Dimension(500, 240));
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int width = getWidth();
        int height = getHeight();
        int paddingBottom = 30;
        int paddingTop = 20;
        int paddingLeft = 30;
        int paddingRight = 30;

        int plotW = width - paddingLeft - paddingRight;
        int plotH = height - paddingTop - paddingBottom;

        // Draw light background grid
        g2.setColor(new Color(241, 245, 249));
        for (int i = 0; i <= 4; i++) {
            int y = paddingTop + (plotH * i) / 4;
            g2.drawLine(paddingLeft, y, width - paddingRight, y);
        }

        // Compute points
        int n = dataPoints.length;
        int[] xs = new int[n];
        int[] ys = new int[n];
        for (int i = 0; i < n; i++) {
            xs[i] = paddingLeft + (i * plotW) / (n - 1);
            ys[i] = paddingTop + plotH - (dataPoints[i] * plotH) / 100;
        }

        // Draw smooth wave path
        GeneralPath path = new GeneralPath();
        path.moveTo(xs[0], ys[0]);
        for (int i = 0; i < n - 1; i++) {
            int x1 = xs[i];
            int y1 = ys[i];
            int x2 = xs[i + 1];
            int y2 = ys[i + 1];
            int cx1 = x1 + (x2 - x1) / 2;
            int cy1 = y1;
            int cx2 = x1 + (x2 - x1) / 2;
            int cy2 = y2;
            path.curveTo(cx1, cy1, cx2, cy2, x2, y2);
        }

        // Fill under the curve with royal blue gradient
        GeneralPath fillPath = (GeneralPath) path.clone();
        fillPath.lineTo(xs[n - 1], paddingTop + plotH);
        fillPath.lineTo(xs[0], paddingTop + plotH);
        fillPath.closePath();

        GradientPaint gradient = new GradientPaint(
                0, paddingTop, new Color(28, 79, 216, 120),
                0, paddingTop + plotH, new Color(28, 79, 216, 5)
        );
        g2.setPaint(gradient);
        g2.fill(fillPath);

        // Stroke line
        g2.setColor(new Color(28, 79, 216));
        g2.setStroke(new BasicStroke(3f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        g2.draw(path);

        // Highlight active point (Month index 8: Sep)
        int highlightIdx = 8;
        int hx = xs[highlightIdx];
        int hy = ys[highlightIdx];

        // Highlight circle
        g2.setColor(Color.WHITE);
        g2.fillOval(hx - 6, hy - 6, 12, 12);
        g2.setColor(new Color(28, 79, 216));
        g2.setStroke(new BasicStroke(2.5f));
        g2.drawOval(hx - 6, hy - 6, 12, 12);

        // Tooltip badge
        String tipText = "85% Occ.";
        g2.setFont(new Font("Segoe UI", Font.BOLD, 10));
        FontMetrics fm = g2.getFontMetrics();
        int tipW = fm.stringWidth(tipText) + 12;
        int tipH = 20;
        g2.setColor(new Color(10, 10, 12));
        g2.fillRoundRect(hx - tipW / 2, hy - 28, tipW, tipH, 8, 8);
        g2.setColor(Color.WHITE);
        g2.drawString(tipText, hx - fm.stringWidth(tipText) / 2, hy - 14);

        // X labels
        g2.setFont(new Font("Segoe UI", Font.PLAIN, 10));
        g2.setColor(new Color(148, 163, 184));
        for (int i = 0; i < n; i += 2) {
            String m = months[i];
            int strW = fm.stringWidth(m);
            g2.drawString(m, xs[i] - strW / 2, height - 10);
        }

        g2.dispose();
    }
}
