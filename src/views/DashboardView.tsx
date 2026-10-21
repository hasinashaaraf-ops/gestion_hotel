import React from 'react';
import {
  Hotel,
  CalendarCheck2,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BedDouble,
  CheckCircle2,
  Clock,
  LogOut as LogOutIcon,
  DoorOpen,
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { formatAriary, formatDateFr } from '../utils/formatters';
import { DashboardCharts } from '../components/DashboardCharts';
import { ActiveTab } from '../components/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab, detailId?: string) => void;
  onOpenCheckInForRes: (resId: string) => void;
  onOpenCheckOutForRes: (resId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenCheckInForRes,
  onOpenCheckOutForRes,
}) => {
  const { rooms, reservations, payments, clients } = useHotel();

  // Hotel statistics
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.statut === 'Disponible').length;
  const occupiedRooms = rooms.filter((r) => r.statut === 'Occupée').length;
  const cleaningRooms = rooms.filter((r) => r.statut === 'En nettoyage').length;
  const totalReservations = reservations.length;
  const totalRevenue = payments.reduce((acc, p) => acc + p.montant, 0);

  const pendingCheckins = reservations.filter(
    (r) => r.statut === 'Confirmée' || r.statut === 'En attente'
  );
  const activeStays = reservations.filter((r) => r.statut === 'En cours');

  return (
    <div className="space-y-6 pb-10">
      {/* 3 Metric Cards identical to the top row in the screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Customer / Chambres Disponibles */}
        <div
          onClick={() => onNavigate('rooms')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center shrink-0 text-slate-700 group-hover:border-[#1c4fd8] group-hover:text-[#1c4fd8] transition-colors">
            <BedDouble className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-slate-400 font-medium tracking-tight">
              Chambres Disponibles
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono mt-0.5">
              {availableRooms} <span className="text-sm font-normal text-slate-400">/ {totalRooms}</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <span>↑ 4.5%</span>
              <span className="text-slate-400 font-normal">depuis le mois passé</span>
            </div>
          </div>
        </div>

        {/* Card 2: Orders / Réservations */}
        <div
          onClick={() => onNavigate('reservations')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center shrink-0 text-slate-700 group-hover:border-[#1c4fd8] group-hover:text-[#1c4fd8] transition-colors">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-slate-400 font-medium tracking-tight">
              Réservations Actives
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono mt-0.5">
              {totalReservations}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <span>↑ 2.1%</span>
              <span className="text-slate-400 font-normal">taux de confirmation</span>
            </div>
          </div>
        </div>

        {/* Card 3: Featured Vibrant Royal Blue Card (exact match to Earning $6,159 card in screenshot) */}
        <div
          onClick={() => onNavigate('payments')}
          className="bg-[#1c4fd8] text-white rounded-2xl p-5 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all cursor-pointer flex items-center gap-4 relative overflow-hidden group"
        >
          {/* Subtle background decoration */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full pointer-events-none group-hover:scale-110 transition-transform" />

          <div className="w-12 h-12 rounded-full border border-white/40 bg-white/10 flex items-center justify-center shrink-0 text-white">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-blue-100 font-medium tracking-tight">
              Recettes Encaissées
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-mono truncate mt-0.5">
              {formatAriary(totalRevenue)}
            </div>
            <div className="text-[11px] text-white/90 font-medium flex items-center gap-1 mt-1">
              <span className="font-bold">↑ 8.5%</span>
              <span className="text-blue-100/80">ce mois-ci</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Calendar Row (matches screenshot area chart + calendar on left, donut + progress on right) */}
      <DashboardCharts />

      {/* Operations Row: Quick Actions, Check-ins and Check-outs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Arrivées prévues (Check-in) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1c4fd8]" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Arrivées Prévues (Check-in)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {pendingCheckins.length} réservations en attente d'enregistrement
              </p>
            </div>
            <button
              onClick={() => onNavigate('checkinout')}
              className="text-xs font-bold text-[#1c4fd8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingCheckins.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                Toutes les arrivées ont été validées.
              </div>
            ) : (
              pendingCheckins.slice(0, 3).map((res) => {
                const client = clients.find((c) => c.id_client === res.id_client);
                const room = rooms.find((r) => r.id_chambre === res.id_chambre);
                return (
                  <div
                    key={res.id_reservation}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {client?.prenom} {client?.nom}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Chambre {room?.numero} ({room?.type}) · Arrivée {formatDateFr(res.date_arrivee)}
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenCheckInForRes(res.id_reservation)}
                      className="px-3.5 py-1.5 bg-[#1c4fd8] hover:bg-[#1842be] text-white font-bold text-xs rounded-full shadow-xs transition-colors shrink-0 cursor-pointer"
                    >
                      Check-in
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Départs & Facturation (Check-out) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0a0a0c]" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Séjours en Cours (Check-out & Solde)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeStays.length} clients actuellement logés à l'hôtel
              </p>
            </div>
            <button
              onClick={() => onNavigate('checkinout')}
              className="text-xs font-bold text-[#1c4fd8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Gérer départs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeStays.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                Aucun séjour en cours à libérer.
              </div>
            ) : (
              activeStays.slice(0, 3).map((res) => {
                const client = clients.find((c) => c.id_client === res.id_client);
                const room = rooms.find((r) => r.id_chambre === res.id_chambre);
                return (
                  <div
                    key={res.id_reservation}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {client?.prenom} {client?.nom}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Chambre {room?.numero} · Départ prévu {formatDateFr(res.date_depart)} ({res.nombre_nuits} nuits)
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenCheckOutForRes(res.id_reservation)}
                      className="px-3.5 py-1.5 bg-[#0a0a0c] hover:bg-zinc-800 text-white font-bold text-xs rounded-full shadow-xs transition-colors shrink-0 cursor-pointer"
                    >
                      Check-out
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Housekeeping / Room state status pill bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1c4fd8] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Service d'Étages : {cleaningRooms} Chambre{cleaningRooms > 1 ? 's' : ''} en cours de nettoyage
            </div>
            <div className="text-[11px] text-slate-500">
              Nettoyage immédiat après départ pour remise en location
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('housekeeping')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition-colors cursor-pointer"
        >
          Ouvrir Service d'Étages →
        </button>
      </div>
    </div>
  );
};
