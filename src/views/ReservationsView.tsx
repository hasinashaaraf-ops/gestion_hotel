import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  CalendarCheck2,
  Calendar,
  KeyRound,
  X,
  AlertTriangle,
  CheckCircle2,
  Ban,
  Clock,
  User,
  BedDouble,
  DollarSign,
} from 'lucide-react';
import { Reservation, ReservationStatus, PaymentMethod } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import {
  formatAriary,
  formatDateFr,
  calculateNights,
  getStatusBadgeClasses,
} from '../utils/formatters';

const STATUS_LIST: ReservationStatus[] = [
  'Confirmée',
  'En cours',
  'En attente',
  'Terminée',
  'Annulée',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'Espèces',
  'Carte bancaire',
  'MVola',
  'Orange Money',
  'Airtel Money',
];

interface ReservationsViewProps {
  onOpenCheckInForRes: (resId: string) => void;
  onOpenCheckOutForRes: (resId: string) => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  onOpenCheckInForRes,
  onOpenCheckOutForRes,
}) => {
  const {
    reservations,
    clients,
    rooms,
    payments,
    isRoomAvailable,
    createReservation,
    cancelReservation,
  } = useHotel();

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // New Reservation Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [arrivalDate, setArrivalDate] = useState('2026-10-21');
  const [departureDate, setDepartureDate] = useState('2026-10-24');
  const [numGuests, setNumGuests] = useState(2);
  const [remarques, setRemarques] = useState('');
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [depositMethod, setDepositMethod] = useState<PaymentMethod>('MVola');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected room calculation
  const chosenRoom = useMemo(() => {
    return rooms.find((r) => r.id_chambre === selectedRoomId);
  }, [rooms, selectedRoomId]);

  // Real-time automatic availability verification (Section 7 CDC)
  const isAvailable = useMemo(() => {
    if (!selectedRoomId || !arrivalDate || !departureDate) return true;
    return isRoomAvailable(selectedRoomId, arrivalDate, departureDate);
  }, [selectedRoomId, arrivalDate, departureDate, isRoomAvailable]);

  // Live computed nights and total
  const computedNights = useMemo(() => {
    return calculateNights(arrivalDate, departureDate);
  }, [arrivalDate, departureDate]);

  const computedTotal = useMemo(() => {
    if (!chosenRoom) return 0;
    return computedNights * chosenRoom.prix_nuit;
  }, [computedNights, chosenRoom]);

  // Filtered reservations list
  const filteredReservations = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reservations.filter((res) => {
      const client = clients.find((c) => c.id_client === res.id_client);
      const room = rooms.find((r) => r.id_chambre === res.id_chambre);
      const clientName = client ? `${client.nom} ${client.prenom}`.toLowerCase() : '';
      const roomNum = room ? room.numero.toLowerCase() : '';

      const matchSearch =
        !q ||
        res.numero_reservation.toLowerCase().includes(q) ||
        clientName.includes(q) ||
        roomNum.includes(q) ||
        res.date_arrivee.includes(q);

      const matchStatus = selectedStatus === 'ALL' || res.statut === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [reservations, clients, rooms, search, selectedStatus]);

  const handleOpenNewModal = () => {
    if (clients.length > 0) setSelectedClientId(clients[0].id_client);
    if (rooms.length > 0) setSelectedRoomId(rooms[0].id_chambre);
    setArrivalDate('2026-10-22');
    setDepartureDate('2026-10-25');
    setNumGuests(2);
    setRemarques('');
    setDepositAmount(0);
    setErrorMsg(null);
    setIsNewModalOpen(true);
  };

  const handleSaveReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedClientId) {
      setErrorMsg('Veuillez sélectionner un client.');
      return;
    }
    if (!selectedRoomId) {
      setErrorMsg('Veuillez sélectionner une chambre.');
      return;
    }
    if (new Date(arrivalDate) >= new Date(departureDate)) {
      setErrorMsg('La date de départ doit être strictement postérieure à la date d’arrivée.');
      return;
    }
    if (!isAvailable) {
      setErrorMsg('Cette chambre n’est pas disponible aux dates sélectionnées (conflit de réservation).');
      return;
    }

    const res = createReservation({
      id_client: selectedClientId,
      id_chambre: selectedRoomId,
      date_arrivee: arrivalDate,
      date_depart: departureDate,
      nombre_personnes: numGuests,
      remarques: remarques.trim() || undefined,
      acompte: depositAmount > 0 ? depositAmount : undefined,
      mode_paiement_acompte: depositAmount > 0 ? depositMethod : undefined,
    });

    if (res.success) {
      setIsNewModalOpen(false);
    } else {
      setErrorMsg(res.message || 'Erreur lors de la réservation.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par N° réservation, client ou chambre..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        {/* Status Filter and New Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedStatus === 'ALL'
                  ? 'bg-white font-bold text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toutes ({reservations.length})
            </button>
            {STATUS_LIST.map((status) => {
              const count = reservations.filter((r) => r.statut === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    selectedStatus === status
                      ? 'bg-white font-bold text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>

          <button
            onClick={handleOpenNewModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1c4fd8] hover:bg-[#1842be] text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle réservation</span>
          </button>
        </div>
      </div>

      {/* Reservations List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3">N° Réservation</th>
              <th className="p-3">Client</th>
              <th className="p-3">Chambre</th>
              <th className="p-3">Période du séjour</th>
              <th className="p-3">Nuits</th>
              <th className="p-3">Montant Total</th>
              <th className="p-3">Paiement</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400">
                  Aucune réservation trouvée pour cette sélection.
                </td>
              </tr>
            ) : (
              filteredReservations.map((res) => {
                const client = clients.find((c) => c.id_client === res.id_client);
                const room = rooms.find((r) => r.id_chambre === res.id_chambre);
                const resPayments = payments.filter((p) => p.id_reservation === res.id_reservation);
                const paid = resPayments.reduce((s, p) => s + p.montant, 0);
                const badge = getStatusBadgeClasses(res.statut);

                return (
                  <tr key={res.id_reservation} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {res.numero_reservation}
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-slate-900">
                        {client ? `${client.nom.toUpperCase()} ${client.prenom}` : 'Client Inconnu'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {client?.telephone}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">
                        Chambre {room?.numero}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {room?.type} · Étage {room?.etage}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-slate-800">
                        Du {formatDateFr(res.date_arrivee)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Au {formatDateFr(res.date_depart)}
                      </div>
                    </td>

                    <td className="p-3 font-medium text-slate-700">
                      {res.nombre_nuits} nuits
                    </td>

                    <td className="p-3 font-mono font-bold text-slate-900">
                      {formatAriary(res.prix_total)}
                    </td>

                    <td className="p-3 font-mono">
                      <div className="text-emerald-700 font-semibold">
                        {formatAriary(paid)}
                      </div>
                      {res.prix_total > paid && (
                        <div className="text-[10px] text-rose-600">
                          Reste: {formatAriary(res.prix_total - paid)}
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bg}`}>
                        {res.statut}
                      </span>
                    </td>

                    <td className="p-3 text-right space-x-1 shrink-0">
                      {/* Check-in CTA if Confirmed or En attente */}
                      {(res.statut === 'Confirmée' || res.statut === 'En attente') && (
                        <button
                          onClick={() => onOpenCheckInForRes(res.id_reservation)}
                          title="Effectuer le check-in du client"
                          className="px-2.5 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-medium rounded shadow-xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <KeyRound className="w-3 h-3 text-slate-300" />
                          <span>Check-in</span>
                        </button>
                      )}

                      {/* Check-out CTA if currently En cours */}
                      {res.statut === 'En cours' && (
                        <button
                          onClick={() => onOpenCheckOutForRes(res.id_reservation)}
                          title="Effectuer le check-out et facturer"
                          className="px-2.5 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-bold rounded shadow-xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Check-out</span>
                        </button>
                      )}

                      {/* Cancel reservation button if active */}
                      {res.statut !== 'Terminée' && res.statut !== 'Annulée' && (
                        <button
                          onClick={() => {
                            if (confirm(`Confirmez-vous l’annulation de la réservation ${res.numero_reservation} ?`)) {
                              cancelReservation(res.id_reservation);
                            }
                          }}
                          title="Annuler la réservation"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nouvelle Réservation */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-slate-300" />
                <span>Créer une nouvelle réservation</span>
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReservation} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Client Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client bénéficiaire
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 font-medium"
                >
                  {clients.map((c) => (
                    <option key={c.id_client} value={c.id_client}>
                      {c.nom.toUpperCase()} {c.prenom} — {c.telephone} ({c.piece_identite})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates & Guests */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date d'arrivée
                  </label>
                  <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date de départ
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Personnes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={numGuests}
                    onChange={(e) => setNumGuests(Number(e.target.value))}
                    required
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              {/* Room Selector with real-time automatic availability verification */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chambre souhaitée
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 font-medium"
                >
                  {rooms.map((r) => {
                    const roomAvail = isRoomAvailable(r.id_chambre, arrivalDate, departureDate);
                    return (
                      <option key={r.id_chambre} value={r.id_chambre}>
                        Chambre {r.numero} — {r.type} (Étage {r.etage}) — {formatAriary(r.prix_nuit)}/nuit {roomAvail ? '🟢 Libre' : '🔴 Conflit dates'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Live Availability Status Indicator */}
              <div
                className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                  isAvailable
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-rose-50/80 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isAvailable ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-700" />
                  )}
                  <span>
                    {isAvailable
                      ? 'Chambre disponible sur cette période'
                      : 'Attention : La chambre est déjà réservée/occupée pour ces dates.'}
                  </span>
                </div>

                <div className="font-mono font-bold text-sm text-slate-900">
                  {computedNights} nuits · {formatAriary(computedTotal)}
                </div>
              </div>

              {/* Optional Deposit (Acompte) */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Acompte initial (Optionnel)
                  </label>
                  <span className="text-[10px] text-slate-400">Paiement anticipé</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      step="10000"
                      min="0"
                      max={computedTotal}
                      value={depositAmount || ''}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      placeholder="Montant en Ar (ex: 100 000)"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 font-mono"
                    />
                  </div>

                  <div>
                    <select
                      value={depositMethod}
                      onChange={(e) => setDepositMethod(e.target.value as PaymentMethod)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Remarques */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Remarques & demandes particulières
                </label>
                <textarea
                  rows={2}
                  value={remarques}
                  onChange={(e) => setRemarques(e.target.value)}
                  placeholder="Arrivée tardive, lit bébé, vue jardin..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!isAvailable}
                  className={`px-5 py-2 text-xs font-bold rounded-full cursor-pointer transition-all shadow-md ${
                    isAvailable
                      ? 'bg-[#1c4fd8] hover:bg-[#1842be] text-white shadow-blue-600/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Confirmer la réservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
