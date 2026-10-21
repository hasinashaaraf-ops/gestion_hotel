import React, { useState, useMemo } from 'react';
import { Search, X, Users, BedDouble, CalendarCheck2, ArrowRight } from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { ActiveTab } from './Sidebar';
import { formatAriary, formatDateFr, getStatusBadgeClasses } from '../utils/formatters';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab, detailId?: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { clients, rooms, reservations } = useHotel();
  const [query, setQuery] = useState('');

  const trimmed = query.trim().toLowerCase();

  const filteredClients = useMemo(() => {
    if (!trimmed) return [];
    return clients.filter(
      (c) =>
        c.nom.toLowerCase().includes(trimmed) ||
        c.prenom.toLowerCase().includes(trimmed) ||
        c.telephone.toLowerCase().includes(trimmed) ||
        c.piece_identite.toLowerCase().includes(trimmed)
    ).slice(0, 4);
  }, [clients, trimmed]);

  const filteredRooms = useMemo(() => {
    if (!trimmed) return [];
    return rooms.filter(
      (r) =>
        r.numero.toLowerCase().includes(trimmed) ||
        r.type.toLowerCase().includes(trimmed) ||
        r.statut.toLowerCase().includes(trimmed)
    ).slice(0, 4);
  }, [rooms, trimmed]);

  const filteredReservations = useMemo(() => {
    if (!trimmed) return [];
    return reservations.filter((res) => {
      const client = clients.find((c) => c.id_client === res.id_client);
      const room = rooms.find((r) => r.id_chambre === res.id_chambre);
      const clientStr = client ? `${client.nom} ${client.prenom}`.toLowerCase() : '';
      const roomStr = room ? room.numero.toLowerCase() : '';
      return (
        res.numero_reservation.toLowerCase().includes(trimmed) ||
        res.statut.toLowerCase().includes(trimmed) ||
        res.date_arrivee.includes(trimmed) ||
        clientStr.includes(trimmed) ||
        roomStr.includes(trimmed)
      );
    }).slice(0, 4);
  }, [reservations, clients, rooms, trimmed]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un client (nom, tél, CIN), une chambre (N°, type), une réservation..."
            autoFocus
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded bg-slate-100"
          >
            Échap
          </button>
        </div>

        {/* Results view */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!trimmed && (
            <div className="text-center py-8 text-xs text-slate-500">
              Tapez au moins une lettre pour rechercher parmi les 30 chambres, clients et réservations.
            </div>
          )}

          {trimmed && (
            <>
              {/* Clients Results */}
              {filteredClients.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5" />
                    <span>Clients</span>
                  </div>
                  <div className="space-y-1">
                    {filteredClients.map((c) => (
                      <div
                        key={c.id_client}
                        onClick={() => {
                          onNavigate('clients', c.id_client);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-[#1c4fd8]">
                            {c.nom} {c.prenom}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {c.telephone} · {c.piece_identite}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1c4fd8]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rooms Results */}
              {filteredRooms.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    <BedDouble className="w-3.5 h-3.5" />
                    <span>Chambres</span>
                  </div>
                  <div className="space-y-1">
                    {filteredRooms.map((r) => {
                      const badge = getStatusBadgeClasses(r.statut);
                      return (
                        <div
                          key={r.id_chambre}
                          onClick={() => {
                            onNavigate('rooms', r.id_chambre);
                            onClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              Chambre {r.numero}
                            </span>
                            <span className="text-slate-500">· {r.type} (Étage {r.etage})</span>
                            <span className="font-mono text-slate-700">· {formatAriary(r.prix_nuit)}/nuit</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${badge.bg}`}>
                            {r.statut}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reservations Results */}
              {filteredReservations.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    <CalendarCheck2 className="w-3.5 h-3.5" />
                    <span>Réservations</span>
                  </div>
                  <div className="space-y-1">
                    {filteredReservations.map((res) => {
                      const client = clients.find((c) => c.id_client === res.id_client);
                      const room = rooms.find((r) => r.id_chambre === res.id_chambre);
                      const badge = getStatusBadgeClasses(res.statut);
                      return (
                        <div
                          key={res.id_reservation}
                          onClick={() => {
                            onNavigate('reservations', res.id_reservation);
                            onClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[#1c4fd8]">
                              {res.numero_reservation} · {client ? `${client.prenom} ${client.nom}` : 'Client'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Chambre {room?.numero} · Du {formatDateFr(res.date_arrivee)} au {formatDateFr(res.date_depart)} ({res.nombre_nuits} nuits)
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${badge.bg}`}>
                              {res.statut}
                            </span>
                            <div className="font-mono font-semibold text-slate-900 mt-1">
                              {formatAriary(res.prix_total)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredClients.length === 0 &&
                filteredRooms.length === 0 &&
                filteredReservations.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-500">
                    Aucun résultat trouvé pour « {query} ».
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
