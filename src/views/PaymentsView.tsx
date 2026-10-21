import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  DollarSign,
  Smartphone,
  Banknote,
  Receipt,
  X,
  AlertCircle,
  Printer,
  Calendar,
} from 'lucide-react';
import { Payment, PaymentMethod, PaymentStatus } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import { formatAriary, formatDateFr, getStatusBadgeClasses } from '../utils/formatters';

const PAYMENT_METHODS: PaymentMethod[] = [
  'Espèces',
  'Carte bancaire',
  'MVola',
  'Orange Money',
  'Airtel Money',
];

export const PaymentsView: React.FC = () => {
  const {
    payments,
    reservations,
    clients,
    rooms,
    addPayment,
    deletePayment,
    getTotalPaidForReservation,
    getRemainingBalanceForReservation,
  } = useHotel();

  const [search, setSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');

  // New Payment Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetResId, setTargetResId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(100000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MVola');
  const [reference, setReference] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Receipt Modal
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  // Filtered payments list
  const filteredPayments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((pay) => {
      const res = reservations.find((r) => r.id_reservation === pay.id_reservation);
      const client = res ? clients.find((c) => c.id_client === res.id_client) : null;
      const clientName = client ? `${client.nom} ${client.prenom}`.toLowerCase() : '';

      const matchSearch =
        !q ||
        pay.numero_paiement.toLowerCase().includes(q) ||
        (pay.reference && pay.reference.toLowerCase().includes(q)) ||
        clientName.includes(q) ||
        (res && res.numero_reservation.toLowerCase().includes(q));

      const matchMethod = selectedMethod === 'ALL' || pay.mode_paiement === selectedMethod;
      return matchSearch && matchMethod;
    });
  }, [payments, reservations, clients, search, selectedMethod]);

  // Aggregate stats
  const totalReceived = useMemo(() => {
    return payments.reduce((acc, p) => acc + p.montant, 0);
  }, [payments]);

  const methodBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    PAYMENT_METHODS.forEach((m) => (counts[m] = 0));
    payments.forEach((p) => {
      counts[p.mode_paiement] = (counts[p.mode_paiement] || 0) + p.montant;
    });
    return counts;
  }, [payments]);

  // Selected reservation in modal
  const selectedModalRes = reservations.find((r) => r.id_reservation === targetResId);
  const remainingForModal = selectedModalRes
    ? getRemainingBalanceForReservation(selectedModalRes.id_reservation)
    : 0;

  const handleOpenAddModal = () => {
    const firstActive = reservations.find(
      (r) => r.statut === 'En cours' || r.statut === 'Confirmée'
    );
    if (firstActive) {
      setTargetResId(firstActive.id_reservation);
      setPaymentAmount(getRemainingBalanceForReservation(firstActive.id_reservation) || 100000);
    } else if (reservations.length > 0) {
      setTargetResId(reservations[0].id_reservation);
    }
    setPaymentMethod('MVola');
    setReference('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetResId) {
      setErrorMsg('Veuillez sélectionner une réservation.');
      return;
    }
    if (paymentAmount <= 0) {
      setErrorMsg('Le montant doit être supérieur à zéro.');
      return;
    }

    const created = addPayment({
      id_reservation: targetResId,
      montant: paymentAmount,
      mode_paiement: paymentMethod,
      reference: reference.trim() || undefined,
    });

    setIsModalOpen(false);
    setReceiptPayment(created);
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 col-span-2 sm:col-span-1 lg:col-span-2">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Total Encaissé
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {formatAriary(totalReceived)}
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5">
            {payments.length} transactions enregistrées
          </div>
        </div>

        {PAYMENT_METHODS.slice(0, 4).map((m) => (
          <div key={m} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-400 font-semibold uppercase truncate">
              {m}
            </div>
            <div className="text-sm font-bold font-mono text-slate-900 mt-1 truncate">
              {formatAriary(methodBreakdown[m] || 0)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {payments.filter((p) => p.mode_paiement === m).length} règlt(s)
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par N° reçu, client, référence..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Method Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedMethod('ALL')}
              className={`px-2 py-1 rounded-md transition-colors ${
                selectedMethod === 'ALL'
                  ? 'bg-white font-bold text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous
            </button>
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMethod(m)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  selectedMethod === m
                    ? 'bg-white font-bold text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1c4fd8] hover:bg-[#1842be] text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Enregistrer un paiement</span>
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3">N° Paiement</th>
              <th className="p-3">Date & Heure</th>
              <th className="p-3">Réservation</th>
              <th className="p-3">Client</th>
              <th className="p-3">Mode de paiement</th>
              <th className="p-3">Montant</th>
              <th className="p-3">Référence</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400">
                  Aucun paiement trouvé.
                </td>
              </tr>
            ) : (
              filteredPayments.map((pay) => {
                const res = reservations.find((r) => r.id_reservation === pay.id_reservation);
                const client = res ? clients.find((c) => c.id_client === res.id_client) : null;
                const room = res ? rooms.find((r) => r.id_chambre === res.id_chambre) : null;
                const badge = getStatusBadgeClasses(pay.statut);

                return (
                  <tr key={pay.id_paiement} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {pay.numero_paiement}
                    </td>

                    <td className="p-3 text-slate-500 font-mono">
                      {formatDateFr(pay.date_paiement)}
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-slate-800">
                        {res?.numero_reservation}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Chambre {room?.numero}
                      </div>
                    </td>

                    <td className="p-3 font-medium text-slate-900">
                      {client ? `${client.nom.toUpperCase()} ${client.prenom}` : 'Inconnu'}
                    </td>

                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {pay.mode_paiement}
                      </span>
                    </td>

                    <td className="p-3 font-mono font-bold text-emerald-700 text-sm">
                      {formatAriary(pay.montant)}
                    </td>

                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      {pay.reference || '-'}
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bg}`}>
                        {pay.statut}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => setReceiptPayment(pay)}
                        title="Imprimer le reçu de paiement"
                        className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>Reçu</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Enregistrer un Paiement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-300" />
                <span>Enregistrer un encaissement</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Reservation selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Réservation concernée
                </label>
                <select
                  value={targetResId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setTargetResId(id);
                    const rem = getRemainingBalanceForReservation(id);
                    setPaymentAmount(rem > 0 ? rem : 100000);
                  }}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 font-medium"
                >
                  {reservations.map((res) => {
                    const client = clients.find((c) => c.id_client === res.id_client);
                    const room = rooms.find((r) => r.id_chambre === res.id_chambre);
                    const rem = getRemainingBalanceForReservation(res.id_reservation);
                    return (
                      <option key={res.id_reservation} value={res.id_reservation}>
                        {res.numero_reservation} — {client?.nom} {client?.prenom} (Ch. {room?.numero}) — Reste: {formatAriary(rem)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Balance reminder */}
              {selectedModalRes && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total réservation :</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatAriary(selectedModalRes.prix_total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Déjà versé :</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {formatAriary(getTotalPaidForReservation(selectedModalRes.id_reservation))}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 text-rose-700 font-bold">
                    <span>Reste à payer :</span>
                    <span className="font-mono">{formatAriary(remainingForModal)}</span>
                  </div>
                </div>
              )}

              {/* Amount & Mode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Montant encaissé (Ar)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    min="1000"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    required
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mode de paiement
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reference */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Référence / N° de transaction
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="ex: MVOLA-98234, CB-4412, RECU-001..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1c4fd8] hover:bg-[#1842be] rounded-full cursor-pointer shadow-md shadow-blue-600/20 transition-all"
                >
                  Valider l'encaissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Receipt Modal */}
      {receiptPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
              <h4 className="text-xs font-bold">Reçu de Paiement {receiptPayment.numero_paiement}</h4>
              <button
                onClick={() => setReceiptPayment(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-slate-50 text-xs font-mono space-y-3">
              <div className="text-center font-bold text-sm text-slate-900 pb-2 border-b border-dashed border-slate-300">
                HÔTEL DE RÊVE
                <div className="text-[10px] text-slate-400 font-normal">Reçu d'encaissement</div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reçu N° :</span>
                  <span className="font-bold">{receiptPayment.numero_paiement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date :</span>
                  <span>{formatDateFr(receiptPayment.date_paiement)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode :</span>
                  <span className="font-semibold">{receiptPayment.mode_paiement}</span>
                </div>
                {receiptPayment.reference && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Réf :</span>
                    <span>{receiptPayment.reference}</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-white rounded border border-slate-200 text-center my-2">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Montant Reçu</div>
                <div className="text-lg font-bold text-emerald-700">
                  {formatAriary(receiptPayment.montant)}
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-dashed border-slate-300">
                Merci de votre confiance.
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-200 flex justify-end gap-2 no-print">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>
              <button
                onClick={() => setReceiptPayment(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
