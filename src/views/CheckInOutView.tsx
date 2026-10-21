import React, { useState } from 'react';
import {
  KeyRound,
  DoorClosed,
  CheckCircle2,
  Clock,
  CreditCard,
  Receipt,
  User,
  BedDouble,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Reservation, PaymentMethod, Invoice } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import {
  formatAriary,
  formatDateFr,
  calculateNights,
  getStatusBadgeClasses,
} from '../utils/formatters';

const PAYMENT_METHODS: PaymentMethod[] = [
  'Espèces',
  'Carte bancaire',
  'MVola',
  'Orange Money',
  'Airtel Money',
];

interface CheckInOutViewProps {
  onShowInvoice: (invoice: Invoice) => void;
  preselectedResId?: string;
}

export const CheckInOutView: React.FC<CheckInOutViewProps> = ({
  onShowInvoice,
  preselectedResId,
}) => {
  const {
    reservations,
    clients,
    rooms,
    payments,
    processCheckIn,
    processCheckOut,
    getTotalPaidForReservation,
    getRemainingBalanceForReservation,
  } = useHotel();

  const [activeSubTab, setActiveSubTab] = useState<'checkin' | 'checkout'>(() => {
    if (preselectedResId) {
      const res = reservations.find((r) => r.id_reservation === preselectedResId);
      if (res && res.statut === 'En cours') return 'checkout';
    }
    return 'checkin';
  });

  const [selectedResId, setSelectedResId] = useState<string>(preselectedResId || '');

  // Check-out form state
  const [checkoutPaymentAmount, setCheckoutPaymentAmount] = useState<number>(0);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<PaymentMethod>('Espèces');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Available lists
  const checkinEligible = reservations.filter(
    (r) => r.statut === 'Confirmée' || r.statut === 'En attente'
  );

  const checkoutEligible = reservations.filter((r) => r.statut === 'En cours');

  const selectedRes = reservations.find((r) => r.id_reservation === selectedResId);
  const selectedClient = selectedRes
    ? clients.find((c) => c.id_client === selectedRes.id_client)
    : null;
  const selectedRoom = selectedRes
    ? rooms.find((r) => r.id_chambre === selectedRes.id_chambre)
    : null;

  const totalPaid = selectedRes ? getTotalPaidForReservation(selectedRes.id_reservation) : 0;
  const remaining = selectedRes ? getRemainingBalanceForReservation(selectedRes.id_reservation) : 0;

  // Handle Check-in Action (Section 8 CDC)
  const handleConfirmCheckIn = () => {
    if (!selectedRes) return;
    setFeedback(null);
    const result = processCheckIn(selectedRes.id_reservation);
    if (result.success) {
      setFeedback({
        type: 'success',
        message: `Arrivée confirmée avec succès pour ${selectedClient?.prenom} ${selectedClient?.nom}. La chambre ${selectedRoom?.numero} est maintenant marquée comme "Occupée".`,
      });
      setSelectedResId('');
    } else {
      setFeedback({ type: 'error', message: result.message || 'Erreur lors du check-in.' });
    }
  };

  // Handle Check-out Action (Section 9 & 15 CDC)
  const handleConfirmCheckOut = () => {
    if (!selectedRes) return;
    setFeedback(null);

    const result = processCheckOut(
      selectedRes.id_reservation,
      checkoutPaymentAmount > 0 ? checkoutPaymentAmount : undefined,
      checkoutPaymentMethod
    );

    if (result.success && result.invoice) {
      setFeedback({
        type: 'success',
        message: `Départ enregistré. La chambre ${selectedRoom?.numero} a été passée à l’état "En nettoyage". La facture officielle a été générée.`,
      });
      onShowInvoice(result.invoice);
      setSelectedResId('');
      setCheckoutPaymentAmount(0);
    } else {
      setFeedback({ type: 'error', message: result.message || 'Erreur lors du check-out.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
        <button
          onClick={() => {
            setActiveSubTab('checkin');
            setSelectedResId('');
            setFeedback(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'checkin'
              ? 'bg-[#1c4fd8] text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Arrivées (Check-in)</span>
          <span className="font-mono text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
            {checkinEligible.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('checkout');
            setSelectedResId('');
            setFeedback(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'checkout'
              ? 'bg-[#0a0a0c] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <DoorClosed className="w-4 h-4" />
          <span>Départs & Factures (Check-out)</span>
          <span className="font-mono text-[11px] bg-white/20 px-1.5 py-0.2 rounded-full">
            {checkoutEligible.length}
          </span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Main Grid: Selection List on Left, Active Workflow Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Eligible Reservations List */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {activeSubTab === 'checkin'
                  ? 'Réservations attendues'
                  : 'Séjours en cours'}
              </h3>
              <p className="text-xs text-slate-500">
                Sélectionnez un client pour lancer la procédure
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {activeSubTab === 'checkin' ? checkinEligible.length : checkoutEligible.length} dossier(s)
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {(activeSubTab === 'checkin' ? checkinEligible : checkoutEligible).length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                {activeSubTab === 'checkin'
                  ? 'Aucune arrivée en attente.'
                  : 'Aucun séjour en cours.'}
              </div>
            ) : (
              (activeSubTab === 'checkin' ? checkinEligible : checkoutEligible).map((res) => {
                const client = clients.find((c) => c.id_client === res.id_client);
                const room = rooms.find((r) => r.id_chambre === res.id_chambre);
                const isSelected = selectedResId === res.id_reservation;

                return (
                  <div
                    key={res.id_reservation}
                    onClick={() => {
                      setSelectedResId(res.id_reservation);
                      const rem = getRemainingBalanceForReservation(res.id_reservation);
                      setCheckoutPaymentAmount(rem);
                    }}
                    className={`p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-800 bg-slate-100 ring-1 ring-slate-800'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">
                        {client ? `${client.nom.toUpperCase()} ${client.prenom}` : 'Client'}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 font-semibold">
                        {res.numero_reservation}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span>
                        Chambre {room?.numero} ({room?.type})
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {formatAriary(res.prix_total)}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1">
                      {activeSubTab === 'checkin'
                        ? `Arrivée prévue le ${formatDateFr(res.date_arrivee)} (${res.nombre_nuits} nuits)`
                        : `Départ prévu le ${formatDateFr(res.date_depart)}`}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Step-by-Step Workflow Card */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          {!selectedRes ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <KeyRound className="w-12 h-12 stroke-1 text-slate-300 mb-2" />
              <div className="text-sm font-semibold text-slate-600">
                Sélectionnez une réservation dans la colonne de gauche
              </div>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Le système chargera automatiquement les données du client, le statut de la chambre et calculera les montants.
              </p>
            </div>
          ) : activeSubTab === 'checkin' ? (
            /* CHECK-IN WORKFLOW (Section 8 CDC) */
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    Étape 1 sur 1 : Confirmation d'arrivée
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Enregistrement Check-in : {selectedRes.numero_reservation}
                  </h3>
                </div>
                <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-semibold">
                  Chambre {selectedRoom?.numero}
                </span>
              </div>

              {/* Client & Room Review */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[10px] uppercase">
                    <User className="w-3.5 h-3.5" />
                    <span>Informations Client</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedClient?.prenom} {selectedClient?.nom}
                  </div>
                  <div className="text-slate-600">{selectedClient?.telephone}</div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {selectedClient?.piece_identite}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[10px] uppercase">
                    <BedDouble className="w-3.5 h-3.5" />
                    <span>Détails Chambre</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    Chambre {selectedRoom?.numero} — {selectedRoom?.type}
                  </div>
                  <div className="text-slate-600">
                    Étage {selectedRoom?.etage} · {selectedRoom?.capacite} personnes
                  </div>
                  <div className="text-[11px] font-mono text-slate-900 font-bold">
                    {formatAriary(selectedRoom?.prix_nuit)} / nuit
                  </div>
                </div>
              </div>

              {/* Dates & Payment Status */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Dates du séjour :</span>
                  <span className="font-semibold text-slate-900">
                    Du {formatDateFr(selectedRes.date_arrivee)} au {formatDateFr(selectedRes.date_depart)} ({selectedRes.nombre_nuits} nuits)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Prix total du séjour :</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatAriary(selectedRes.prix_total)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-600 font-medium">Acomptes déjà versés :</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {formatAriary(totalPaid)}
                  </span>
                </div>
                {remaining > 0 && (
                  <div className="flex items-center justify-between text-rose-700">
                    <span>Reste à régler au check-out :</span>
                    <span className="font-mono font-bold">{formatAriary(remaining)}</span>
                  </div>
                )}
              </div>

              {/* Automatic System Changes Summary */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 text-slate-600">
                <div className="font-semibold text-slate-800">
                  Opérations automatiques lors de la validation :
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chambre {selectedRoom?.numero} passée immédiatement à l'état <strong>Occupée</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Horodatage de la date et heure réelle d'arrivée dans la base</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Statut de réservation basculé à <strong>En cours</strong></span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleConfirmCheckIn}
                  className="w-full py-3 px-4 bg-[#1c4fd8] hover:bg-[#1842be] text-white font-bold text-xs rounded-full shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>CONFIRMER L'ARRIVÉE DU CLIENT (CHECK-IN)</span>
                </button>
              </div>
            </div>
          ) : (
            /* CHECK-OUT WORKFLOW (Section 9 & 15 & 16 CDC) */
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-rose-600 font-bold">
                    Départ du client & Clôture du dossier
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Enregistrement Check-out : {selectedRes.numero_reservation}
                  </h3>
                </div>
                <span className="font-mono text-xs bg-slate-900 text-white px-2.5 py-1 rounded font-semibold">
                  Chambre {selectedRoom?.numero}
                </span>
              </div>

              {/* Client & Stay Financial Breakdown */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Client :</span>
                  <span className="font-bold text-slate-900">
                    {selectedClient?.prenom} {selectedClient?.nom}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Durée réelle du séjour :</span>
                  <span className="font-medium text-slate-800">
                    {selectedRes.nombre_nuits} nuits (du {formatDateFr(selectedRes.date_arrivee)} au {formatDateFr(selectedRes.date_depart)})
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Prix / nuit :</span>
                  <span className="font-mono text-slate-800">
                    {formatAriary(selectedRoom?.prix_nuit)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                  <span>MONTANT TOTAL :</span>
                  <span className="font-mono text-slate-900">
                    {formatAriary(selectedRes.prix_total)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-emerald-700 font-semibold">
                  <span>Paiements déjà effectués :</span>
                  <span className="font-mono">{formatAriary(totalPaid)}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-bold">
                  <span className="text-rose-700">SOLDE RESTANT À PAYER :</span>
                  <span className="font-mono text-rose-700 text-base">
                    {formatAriary(remaining)}
                  </span>
                </div>
              </div>

              {/* Payment Settlement Input */}
              {remaining > 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>Encaisser le solde restant au départ :</span>
                    <button
                      type="button"
                      onClick={() => setCheckoutPaymentAmount(remaining)}
                      className="text-[11px] text-slate-700 underline font-medium cursor-pointer"
                    >
                      Régler la totalité ({formatAriary(remaining)})
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Montant perçu (Ar)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={remaining}
                        value={checkoutPaymentAmount || ''}
                        onChange={(e) => setCheckoutPaymentAmount(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Mode de paiement
                      </label>
                      <select
                        value={checkoutPaymentMethod}
                        onChange={(e) =>
                          setCheckoutPaymentMethod(e.target.value as PaymentMethod)
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
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
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ce séjour a été entièrement réglé. Aucun solde restant.</span>
                </div>
              )}

              {/* CDC Section 15 Housekeeping Transition notice */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center gap-2 text-slate-700">
                <Sparkles className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  Lors de la validation, la chambre {selectedRoom?.numero} passera automatiquement à l’état <strong>« En nettoyage »</strong> jusqu'à validation par le personnel d'étages.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={handleConfirmCheckOut}
                  className="w-full py-3 px-4 bg-[#0a0a0c] hover:bg-zinc-800 text-white font-bold text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-blue-400" />
                  <span>VALIDER LE DÉPART ET GÉNÉRER LA FACTURE</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
