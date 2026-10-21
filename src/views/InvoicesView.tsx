import React, { useState } from 'react';
import { Receipt, Search, Eye, Printer, Download } from 'lucide-react';
import { Invoice } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import { formatAriary, formatDateFr } from '../utils/formatters';

interface InvoicesViewProps {
  onShowInvoice: (invoice: Invoice) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({ onShowInvoice }) => {
  const { invoices, reservations, clients, rooms } = useHotel();
  const [search, setSearch] = useState('');

  const filteredInvoices = invoices.filter((inv) => {
    const res = reservations.find((r) => r.id_reservation === inv.id_reservation);
    const client = res ? clients.find((c) => c.id_client === res.id_client) : null;
    const clientName = client ? `${client.nom} ${client.prenom}`.toLowerCase() : '';
    const q = search.trim().toLowerCase();

    return (
      !q ||
      inv.numero_facture.toLowerCase().includes(q) ||
      clientName.includes(q) ||
      inv.date_facture.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par N° facture, client..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total : {invoices.length} facture(s) émise(s)
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3">N° Facture</th>
              <th className="p-3">Date</th>
              <th className="p-3">Client</th>
              <th className="p-3">Chambre</th>
              <th className="p-3">Montant Total</th>
              <th className="p-3">Payé</th>
              <th className="p-3">Reste</th>
              <th className="p-3">Mode de règlement</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400">
                  Aucune facture enregistrée pour l’instant.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => {
                const res = reservations.find((r) => r.id_reservation === inv.id_reservation);
                const client = res ? clients.find((c) => c.id_client === res.id_client) : null;
                const room = res ? rooms.find((r) => r.id_chambre === res.id_chambre) : null;

                return (
                  <tr key={inv.id_facture} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {inv.numero_facture}
                    </td>

                    <td className="p-3 font-mono text-slate-500">
                      {formatDateFr(inv.date_facture)}
                    </td>

                    <td className="p-3 font-medium text-slate-900">
                      {client ? `${client.nom.toUpperCase()} ${client.prenom}` : 'Client'}
                    </td>

                    <td className="p-3">
                      Chambre {room?.numero} ({room?.type})
                    </td>

                    <td className="p-3 font-mono font-bold text-slate-900">
                      {formatAriary(inv.montant_total)}
                    </td>

                    <td className="p-3 font-mono font-semibold text-emerald-700">
                      {formatAriary(inv.montant_paye)}
                    </td>

                    <td className="p-3 font-mono font-semibold">
                      <span className={inv.reste_a_payer > 0 ? 'text-rose-600' : 'text-slate-400'}>
                        {formatAriary(inv.reste_a_payer)}
                      </span>
                    </td>

                    <td className="p-3 font-medium text-slate-700">
                      {inv.mode_paiement || 'Espèces'}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => onShowInvoice(inv)}
                        className="px-3 py-1.5 text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-300" />
                        <span>Visualiser & Imprimer</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
