import React, { useState, useMemo } from 'react';
import {
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { formatAriary, formatDateFr, getStatusBadgeClasses } from '../utils/formatters';

type ReportType = 'reservations' | 'financial' | 'occupancy';

export const ReportsView: React.FC = () => {
  const { reservations, clients, rooms, payments } = useHotel();

  const [activeReport, setActiveReport] = useState<ReportType>('reservations');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filtered reservations for the report
  const reportReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchStatus = statusFilter === 'ALL' || r.statut === statusFilter;
      const matchDates =
        (!startDate || r.date_arrivee >= startDate) &&
        (!endDate || r.date_arrivee <= endDate);
      return matchStatus && matchDates;
    });
  }, [reservations, startDate, endDate, statusFilter]);

  // Financial calculations
  const totalTurnover = useMemo(() => {
    return reservations
      .filter((r) => r.statut !== 'Annulée')
      .reduce((acc, r) => acc + r.prix_total, 0);
  }, [reservations]);

  const totalCollected = useMemo(() => {
    return payments.reduce((acc, p) => acc + p.montant, 0);
  }, [payments]);

  const totalUnpaid = Math.max(0, totalTurnover - totalCollected);

  // Occupancy calculations
  const totalRooms = rooms.length || 30;
  const occupiedCount = rooms.filter((r) => r.statut === 'Occupée').length;
  const availableCount = rooms.filter((r) => r.statut === 'Disponible').length;
  const reservedCount = rooms.filter((r) => r.statut === 'Réservée').length;
  const cleaningCount = rooms.filter((r) => r.statut === 'En nettoyage').length;
  const outOfServiceCount = rooms.filter((r) => r.statut === 'Hors service').length;
  const occupancyRate = Math.round((occupiedCount / totalRooms) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Report Type Selector Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full text-xs">
          <button
            onClick={() => setActiveReport('reservations')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              activeReport === 'reservations'
                ? 'bg-[#1c4fd8] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rapport des Réservations
          </button>
          <button
            onClick={() => setActiveReport('financial')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              activeReport === 'financial'
                ? 'bg-[#1c4fd8] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rapport Financier
          </button>
          <button
            onClick={() => setActiveReport('occupancy')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              activeReport === 'occupancy'
                ? 'bg-[#1c4fd8] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rapport d'Occupation
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2 bg-[#0a0a0c] hover:bg-zinc-800 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md"
        >
          <Printer className="w-4 h-4 text-blue-300" />
          <span>Imprimer le rapport officiel</span>
        </button>
      </div>

      {/* Printable Report Container */}
      <div
        id="printable-content"
        className="bg-white rounded-xl border border-slate-200 shadow-xs p-8 space-y-6"
      >
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div>
            <div className="text-xl font-extrabold text-slate-900 tracking-tight">
              HÔTEL DE RÊVE
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Système de Gestion Hôtelière · Antananarivo, Madagascar
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-bold text-slate-900 uppercase">
              {activeReport === 'reservations' && 'Rapport d’Activité des Réservations'}
              {activeReport === 'financial' && 'Rapport Financier & Comptabilité'}
              {activeReport === 'occupancy' && 'Rapport Mensuel d’Occupation'}
            </div>
            <div className="text-slate-500 font-mono text-[11px] mt-0.5">
              Édité le 20/10/2026 à 14:00
            </div>
          </div>
        </div>

        {/* 1. RAPPORT DES RÉSERVATIONS */}
        {activeReport === 'reservations' && (
          <div className="space-y-4">
            {/* Filter controls (no-print) */}
            <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs no-print">
              <span className="font-semibold text-slate-700">Période :</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
              />
              <span>au</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
              />

              <span className="text-slate-300">|</span>

              <span className="font-semibold text-slate-700">Statut :</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="Confirmée">Confirmée</option>
                <option value="En cours">En cours</option>
                <option value="Terminée">Terminée</option>
                <option value="En attente">En attente</option>
                <option value="Annulée">Annulée</option>
              </select>
            </div>

            {/* Table */}
            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5">N° Résa</th>
                    <th className="p-2.5">Client</th>
                    <th className="p-2.5">Chambre</th>
                    <th className="p-2.5">Arrivée</th>
                    <th className="p-2.5">Départ</th>
                    <th className="p-2.5">Nuits</th>
                    <th className="p-2.5">Total</th>
                    <th className="p-2.5">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportReservations.map((r) => {
                    const client = clients.find((c) => c.id_client === r.id_client);
                    const room = rooms.find((rm) => rm.id_chambre === r.id_chambre);
                    const badge = getStatusBadgeClasses(r.statut);
                    return (
                      <tr key={r.id_reservation}>
                        <td className="p-2.5 font-mono font-bold">{r.numero_reservation}</td>
                        <td className="p-2.5 font-medium">{client?.nom} {client?.prenom}</td>
                        <td className="p-2.5">Ch. {room?.numero} ({room?.type})</td>
                        <td className="p-2.5">{formatDateFr(r.date_arrivee)}</td>
                        <td className="p-2.5">{formatDateFr(r.date_depart)}</td>
                        <td className="p-2.5">{r.nombre_nuits} nuits</td>
                        <td className="p-2.5 font-mono font-bold">{formatAriary(r.prix_total)}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.bg}`}>
                            {r.statut}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. RAPPORT FINANCIER */}
        {activeReport === 'financial' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-xs font-semibold text-slate-500 uppercase">
                  Chiffre d’affaires global engagé
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {formatAriary(totalTurnover)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Réservations validées & terminées
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="text-xs font-semibold text-emerald-800 uppercase">
                  Total Encaissements perçus
                </div>
                <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
                  {formatAriary(totalCollected)}
                </div>
                <div className="text-[11px] text-emerald-800/80 mt-0.5">
                  Fonds reçus en caisse et comptes bancaires
                </div>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="text-xs font-semibold text-rose-800 uppercase">
                  Impayés & Reste à recouvrer
                </div>
                <div className="text-xl font-bold font-mono text-rose-700 mt-1">
                  {formatAriary(totalUnpaid)}
                </div>
                <div className="text-[11px] text-rose-800/80 mt-0.5">
                  Créances sur séjours en cours
                </div>
              </div>
            </div>

            {/* Methods breakdown */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Répartition des encaissements par mode de règlement
              </h4>
              <div className="space-y-2 text-xs">
                {['Espèces', 'Carte bancaire', 'MVola', 'Orange Money', 'Airtel Money'].map(
                  (mode) => {
                    const modePayments = payments.filter((p) => p.mode_paiement === mode);
                    const modeTotal = modePayments.reduce((acc, p) => acc + p.montant, 0);
                    const pct = totalCollected > 0 ? Math.round((modeTotal / totalCollected) * 100) : 0;
                    return (
                      <div key={mode} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <span className="font-semibold text-slate-800">{mode} ({modePayments.length} transactions)</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-500">{pct}%</span>
                          <span className="font-mono font-bold text-slate-900">{formatAriary(modeTotal)}</span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. RAPPORT D'OCCUPATION */}
        {activeReport === 'occupancy' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <div className="text-xs font-semibold text-slate-500 uppercase">
                  Capacité Totale
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {totalRooms}
                </div>
                <div className="text-[11px] text-slate-400">Chambres en inventaire</div>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center">
                <div className="text-xs font-semibold text-rose-800 uppercase">
                  Chambres Occupées
                </div>
                <div className="text-2xl font-bold font-mono text-rose-700 mt-1">
                  {occupiedCount}
                </div>
                <div className="text-[11px] text-rose-800/80">Clients en séjour</div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <div className="text-xs font-semibold text-emerald-800 uppercase">
                  Chambres Disponibles
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
                  {availableCount}
                </div>
                <div className="text-[11px] text-emerald-800/80">Prêtes immédiatement</div>
              </div>

              <div className="p-4 bg-slate-900 text-white border border-slate-800 rounded-xl text-center">
                <div className="text-xs font-semibold text-slate-300 uppercase">
                  Taux d’Occupation
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {occupancyRate}%
                </div>
                <div className="text-[11px] text-slate-400">Ratio actuel en temps réel</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase">
                Détail de l’état des 30 chambres
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-center">
                  <div className="font-bold text-emerald-800 text-sm">{availableCount}</div>
                  <div className="text-[10px] text-emerald-700">🟢 Disponibles</div>
                </div>
                <div className="p-2.5 bg-rose-50 rounded border border-rose-200 text-center">
                  <div className="font-bold text-rose-800 text-sm">{occupiedCount}</div>
                  <div className="text-[10px] text-rose-700">🔴 Occupées</div>
                </div>
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-center">
                  <div className="font-bold text-amber-800 text-sm">{reservedCount}</div>
                  <div className="text-[10px] text-amber-700">🟠 Réservées</div>
                </div>
                <div className="p-2.5 bg-sky-50 rounded border border-sky-200 text-center">
                  <div className="font-bold text-sky-800 text-sm">{cleaningCount}</div>
                  <div className="text-[10px] text-sky-700">🔵 En nettoyage</div>
                </div>
                <div className="p-2.5 bg-slate-100 rounded border border-slate-300 text-center">
                  <div className="font-bold text-slate-800 text-sm">{outOfServiceCount}</div>
                  <div className="text-[10px] text-slate-600">⚫ Hors service</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Footer / Signature */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
          <div>
            <div>Hôtel de Rêve — Direction de l'Exploitation</div>
            <div className="text-[10px]">Document interne certifié conforme</div>
          </div>
          <div className="text-right">
            <div className="h-10 border-b border-slate-300 w-40 mb-1" />
            <div className="text-[10px]">Signature / Visa Direction</div>
          </div>
        </div>
      </div>
    </div>
  );
};
