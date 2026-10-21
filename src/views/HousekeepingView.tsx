import React from 'react';
import { Sparkles, CheckCircle2, BedDouble, AlertCircle, Layers } from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { formatAriary } from '../utils/formatters';

export const HousekeepingView: React.FC = () => {
  const { rooms, markRoomCleaned, setRoomStatus } = useHotel();

  const cleaningRooms = rooms.filter((r) => r.statut === 'En nettoyage');
  const availableRooms = rooms.filter((r) => r.statut === 'Disponible');
  const occupiedRooms = rooms.filter((r) => r.statut === 'Occupée');

  return (
    <div className="space-y-6">
      {/* Banner CDC Section 15 */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-slate-400" />
            <span>Service d'Étages & Gouvernante</span>
          </div>
          <h2 className="text-xl font-bold mt-1 tracking-tight text-white">
            Gestion du Nettoyage des Chambres
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Suivi en direct des chambres libérées après check-out. Une fois l'entretien ménager terminé, un clic suffit pour remettre la chambre en état Disponible pour les nouveaux arrivants.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="text-center px-3 border-r border-slate-800">
            <div className="text-lg font-bold font-mono text-white">
              {cleaningRooms.length}
            </div>
            <div className="text-[10px] text-slate-400">À nettoyer</div>
          </div>
          <div className="text-center px-3">
            <div className="text-lg font-bold font-mono text-emerald-400">
              {availableRooms.length}
            </div>
            <div className="text-[10px] text-slate-400">Prêtes / Libres</div>
          </div>
        </div>
      </div>

      {/* Priority Section: Rooms to Clean */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span>Chambres à nettoyer en priorité ({cleaningRooms.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Chambres libérées lors des récents check-outs nécessitant le ménage
            </p>
          </div>
        </div>

        {cleaningRooms.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-700">
              Toutes les chambres sont propres et prêtes !
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Aucune chambre n'est actuellement en attente d'entretien ménager.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cleaningRooms.map((room) => (
              <div
                key={room.id_chambre}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg font-bold font-mono text-slate-900">
                      Chambre {room.numero}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-800 border border-slate-300">
                      En nettoyage
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 font-medium">
                    {room.type} · Étage {room.etage} · {room.capacite} personnes
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {room.description}
                  </p>
                </div>

                <button
                  onClick={() => markRoomCleaned(room.id_chambre)}
                  className="w-full py-2.5 px-4 bg-[#1c4fd8] hover:bg-[#1842be] text-white font-bold text-xs rounded-full shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>MARQUER COMME NETTOYÉE ET PRÊTE</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overview by floor */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Vue d'ensemble par étage (30 Chambres)
        </h3>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((floor) => {
            const floorRooms = rooms.filter((r) => r.etage === floor);
            return (
              <div key={floor} className="border border-slate-100 rounded-lg p-3 bg-slate-50/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    Étage {floor} ({floorRooms.length} chambres)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                  {floorRooms.map((r) => {
                    const isCleaning = r.statut === 'En nettoyage';
                    const isAvailable = r.statut === 'Disponible';
                    const isOccupied = r.statut === 'Occupée';

                    return (
                      <div
                        key={r.id_chambre}
                        onClick={() => {
                          if (isCleaning) {
                            markRoomCleaned(r.id_chambre);
                          } else if (isAvailable) {
                            setRoomStatus(r.id_chambre, 'En nettoyage');
                          }
                        }}
                        title={`Chambre ${r.numero} (${r.statut}) - Cliquer pour basculer nettoyage`}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          isCleaning
                            ? 'bg-slate-200 border-slate-400 text-slate-900 font-bold ring-1 ring-slate-400'
                            : isAvailable
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : isOccupied
                            ? 'bg-slate-100 border-slate-300 text-slate-800'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="font-mono text-xs font-bold">{r.numero}</div>
                        <div className="text-[10px] truncate">{r.statut}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
