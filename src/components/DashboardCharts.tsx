import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { formatAriary } from '../utils/formatters';

interface DashboardChartsProps {
  onSelectDate?: (dateStr: string) => void;
  selectedDateStr?: string;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  onSelectDate,
  selectedDateStr = '2026-10-20',
}) => {
  const { rooms, reservations, payments } = useHotel();
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Wednesday 7 by default (matches screenshot Wed 7)
  const [currentMonthName, setCurrentMonthName] = useState('Octobre 2026');

  // Month labels for Wave Chart
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

  // Data points matching the smooth wavy curve from the screenshot
  // Screenshot wave has distinct peaks and valleys: Jan low, Mar bump, Apr dip, Jun big peak, Aug-Sep decline
  const wavePoints = [
    { x: 30, y: 150 },
    { x: 80, y: 145 },
    { x: 130, y: 130 },
    { x: 180, y: 140 },
    { x: 230, y: 135 },
    { x: 280, y: 80 }, // Big peak like in screenshot (+48.56%)
    { x: 330, y: 100 },
    { x: 380, y: 138 },
    { x: 430, y: 142 },
  ];

  // SVG smooth bezier curve path generator
  const generateSmoothAreaPath = () => {
    // Generate SVG path with cubic bezier curves
    let d = `M ${wavePoints[0].x} ${wavePoints[0].y}`;
    for (let i = 0; i < wavePoints.length - 1; i++) {
      const p0 = wavePoints[i];
      const p1 = wavePoints[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    const linePath = d;
    const areaPath = `${linePath} L ${wavePoints[wavePoints.length - 1].x} 175 L ${wavePoints[0].x} 175 Z`;
    return { linePath, areaPath };
  };

  const { linePath, areaPath } = generateSmoothAreaPath();

  // Calendar strip days matching screenshot layout: Mon 5, Tues 6, Wed 7, Thu 8, Fri 9, Sat 10, Sun 11
  const calendarDays = [
    { day: 'Lun', date: 5, dateFull: '2026-10-05' },
    { day: 'Mar', date: 6, dateFull: '2026-10-06' },
    { day: 'Mer', date: 7, dateFull: '2026-10-07' },
    { day: 'Jeu', date: 8, dateFull: '2026-10-08' },
    { day: 'Ven', date: 9, dateFull: '2026-10-09' },
    { day: 'Sam', date: 10, dateFull: '2026-10-10' },
    { day: 'Dim', date: 11, dateFull: '2026-10-11' },
  ];

  // Donut chart calculations: 3 distinct segments like the screenshot
  // Blue: 55%, Black: 30%, Light gray: 15%
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89
  const suiteShare = 0.52;
  const deluxeShare = 0.30;
  const standardShare = 0.18;

  const suiteOffset = 0;
  const deluxeOffset = -(suiteShare * circumference);
  const standardOffset = -((suiteShare + deluxeShare) * circumference);

  // Traffic Source items matching screenshot style
  const trafficSources = [
    { name: 'Réservations Directes / Web', percentage: 45, color: 'bg-[#1c4fd8]' },
    { name: 'Agences & Partenaires (OTA)', percentage: 25, color: 'bg-[#0a0a0c]' },
    { name: 'Comptoir & Passants Directs', percentage: 40, color: 'bg-zinc-400' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN (approx 65% width = 8 cols on lg) */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-6">
        {/* Wave / Area Chart Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Évolution des Réservations & Revenus
              </h3>
              <p className="text-xs text-slate-400">
                Performance globale sur la période annuelle
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#1c4fd8] border border-blue-200">
                +48.56% Croissance
              </span>
            </div>
          </div>

          {/* SVG Area & Curve */}
          <div className="relative w-full h-56 pt-2 select-none">
            <svg viewBox="0 0 460 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1c4fd8" stopOpacity="0.85" />
                  <stop offset="45%" stopColor="#2563eb" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Y-axis grid lines matching screenshot (100, 80, 60, 40, 20) */}
              {[
                { y: 30, label: '100' },
                { y: 65, label: '80' },
                { y: 100, label: '60' },
                { y: 135, label: '40' },
                { y: 170, label: '20' },
              ].map((grid, idx) => (
                <g key={idx}>
                  <text
                    x="5"
                    y={grid.y + 4}
                    fontSize="9"
                    fill="#94a3b8"
                    fontFamily="monospace"
                  >
                    {grid.label}
                  </text>
                  <line
                    x1="28"
                    y1={grid.y}
                    x2="455"
                    y2={grid.y}
                    stroke="#e2e8f0"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                </g>
              ))}

              {/* Gradient Area Fill */}
              <path d={areaPath} fill="url(#blueGradient)" />

              {/* Vibrant Curve Stroke */}
              <path
                d={linePath}
                fill="none"
                stroke="#1c4fd8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Peak Tooltip Pill Indicator at x:280, y:80 */}
              <g transform="translate(260, 60)">
                <rect
                  x="0"
                  y="0"
                  width="48"
                  height="16"
                  rx="8"
                  fill="#ffffff"
                  stroke="#1c4fd8"
                  strokeWidth="1"
                  filter="drop-shadow(0 2px 4px rgba(28, 79, 216, 0.15))"
                />
                <text
                  x="24"
                  y="11.5"
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="bold"
                  fill="#1c4fd8"
                >
                  +48.56%
                </text>
                <circle cx="24" cy="20" r="3" fill="#1c4fd8" />
              </g>

              {/* X-axis labels */}
              {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept'].map(
                (m, i) => (
                  <text
                    key={i}
                    x={wavePoints[i].x}
                    y="190"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#94a3b8"
                    fontWeight="500"
                  >
                    {m}
                  </text>
                )
              )}
            </svg>
          </div>
        </div>

        {/* Horizontal Calendar Strip (exact replica of the screenshot) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          {/* Header with Month and Arrows */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              {currentMonthName}
            </h4>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentMonthName('Septembre 2026')}
                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonthName('Novembre 2026')}
                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Row */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center">
            {calendarDays.map((item, index) => {
              const isSelected = selectedDayIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedDayIndex(index);
                    if (onSelectDate) onSelectDate(item.dateFull);
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1c4fd8] text-white font-bold shadow-md shadow-blue-600/30 ring-2 ring-blue-500/20 scale-105'
                      : 'text-slate-600 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <span
                    className={`text-[11px] mb-0.5 ${
                      isSelected ? 'text-blue-100 font-medium' : 'text-slate-400 font-normal'
                    }`}
                  >
                    {item.day}
                  </span>
                  <span className="text-base font-extrabold leading-tight">
                    {item.date}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN (approx 35% width = 5 cols on lg, 4 on xl) */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-6">
        {/* Top Product Sale / Room Categories Donut Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Top Ventes Catégories
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Répartition des revenus par catégorie
            </p>
          </div>

          {/* Donut graphic */}
          <div className="relative w-40 h-40 mx-auto my-3 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Segment 1: Royal Blue (52%) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#1c4fd8"
                strokeWidth="14"
                strokeDasharray={`${suiteShare * circumference} ${circumference}`}
                strokeDashoffset={suiteOffset}
              />
              {/* Segment 2: Deep Pitch Black (30%) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#0a0a0c"
                strokeWidth="14"
                strokeDasharray={`${deluxeShare * circumference} ${circumference}`}
                strokeDashoffset={deluxeOffset}
              />
              {/* Segment 3: Light Gray/Silver (18%) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth="14"
                strokeDasharray={`${standardShare * circumference} ${circumference}`}
                strokeDashoffset={standardOffset}
              />
            </svg>

            {/* Inner Center Badge matching screenshot (Total Sale 95K) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-slate-400 font-medium">Total Vente</span>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                95K
              </span>
            </div>
          </div>

          {/* Legend matching screenshot square markers */}
          <div className="space-y-2.5 pt-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#1c4fd8] rounded-xs shrink-0" />
                <span className="text-slate-600 font-medium">Suite Présidentielle</span>
              </div>
              <span className="font-mono font-bold text-slate-900">52%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#0a0a0c] rounded-xs shrink-0" />
                <span className="text-slate-600 font-medium">Chambres Deluxe</span>
              </div>
              <span className="font-mono font-bold text-slate-900">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-slate-300 rounded-xs shrink-0" />
                <span className="text-slate-600 font-medium">Standard & Twin</span>
              </div>
              <span className="font-mono font-bold text-slate-900">18%</span>
            </div>
          </div>
        </div>

        {/* Traffic Source Widget matching screenshot */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
            Canaux de Réservation
          </h3>
          <p className="text-xs text-slate-400 mb-5">
            Origine et flux des clients de l'hôtel
          </p>

          <div className="space-y-4">
            {trafficSources.map((source, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium text-[11px] truncate">
                    {source.name}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {source.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${source.color} transition-all duration-500`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
