import React from 'react';
import { X, Printer, Download, CheckCircle, Hotel } from 'lucide-react';
import { Invoice } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import { formatAriary, formatDateFr } from '../utils/formatters';

interface InvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose }) => {
  const { reservations, clients, rooms } = useHotel();

  if (!invoice) return null;

  const res = reservations.find((r) => r.id_reservation === invoice.id_reservation);
  const client = res ? clients.find((c) => c.id_client === res.id_client) : null;
  const room = res ? rooms.find((r) => r.id_chambre === res.id_chambre) : null;

  const clientName = client ? `${client.prenom} ${client.nom}` : 'Client Inconnu';
  const roomNumber = room ? room.numero : '-';
  const roomType = room ? room.type : '-';
  const arrivalDate = res ? formatDateFr(res.date_arrivee) : '-';
  const departureDate = res ? formatDateFr(res.date_depart) : '-';
  const nights = res ? res.nombre_nuits : 1;
  const pricePerNight = room ? room.prix_nuit : Math.round(invoice.montant_total / nights);

  // Exact text representation according to Cahier des Charges section 16
  const invoiceText = `========================================
              HÔTEL DE RÊVE
========================================
Facture N° : ${invoice.numero_facture}
Date       : ${formatDateFr(invoice.date_facture)}

Client     : ${clientName}
Chambre    : ${roomNumber}
Type       : ${roomType}

Arrivée    : ${arrivalDate}
Départ     : ${departureDate}
Nombre de nuits : ${nights}

Prix/nuit  : ${formatAriary(pricePerNight)}
----------------------------------------
TOTAL      : ${formatAriary(invoice.montant_total)}

Payé       : ${formatAriary(invoice.montant_paye)}
Reste      : ${formatAriary(invoice.reste_a_payer)}

Mode de paiement : ${invoice.mode_paiement || 'Espèces'}
========================================
           Merci et à bientôt !
========================================`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `facture_${invoice.numero_facture}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Modal Topbar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold tracking-tight">
              Facture {invoice.numero_facture}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Printable Receipt (Matches CDC Section 16) */}
        <div className="p-6 bg-slate-50 flex justify-center">
          <div
            id="printable-content"
            className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 w-full max-w-sm font-mono text-xs leading-relaxed text-slate-900"
          >
            <div className="text-center font-bold text-slate-900 text-sm tracking-wider flex items-center justify-center gap-1.5 pb-1">
              <Hotel className="w-4 h-4 text-slate-800 inline" />
              <span>HÔTEL DE RÊVE</span>
            </div>
            <div className="text-center text-[10px] text-slate-500 pb-2 border-b border-dashed border-slate-300">
              Antananarivo · Tél: +261 20 22 123 45
            </div>

            <div className="py-2 border-b border-dashed border-slate-300 text-[11px] space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Facture N° :</span>
                <span className="font-bold">{invoice.numero_facture}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date :</span>
                <span>{formatDateFr(invoice.date_facture)}</span>
              </div>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 space-y-1">
              <div>
                <span className="text-slate-500">Client : </span>
                <span className="font-bold">{clientName}</span>
              </div>
              <div>
                <span className="text-slate-500">Chambre : </span>
                <span className="font-bold">{roomNumber}</span>
              </div>
              <div>
                <span className="text-slate-500">Type : </span>
                <span>{roomType}</span>
              </div>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Arrivée :</span>
                <span>{arrivalDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Départ :</span>
                <span>{departureDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nombre de nuits :</span>
                <span className="font-bold">{nights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prix / nuit :</span>
                <span>{formatAriary(pricePerNight)}</span>
              </div>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5 text-sm">
              <div className="flex justify-between font-bold text-slate-900 text-base">
                <span>TOTAL :</span>
                <span className="text-slate-900">{formatAriary(invoice.montant_total)}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                <span>Payé :</span>
                <span>{formatAriary(invoice.montant_paye)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Reste à payer :</span>
                <span className={invoice.reste_a_payer > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                  {formatAriary(invoice.reste_a_payer)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Mode de règlement :</span>
                <span className="font-medium text-slate-700">{invoice.mode_paiement}</span>
              </div>
            </div>

            <div className="text-center font-bold text-slate-700 pt-4 pb-1 text-xs tracking-wider">
              Merci et à bientôt !
            </div>
            <div className="text-center text-[10px] text-slate-400">
              Conservé pour justificatif comptable
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 no-print">
          <button
            onClick={handleDownloadText}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Fichier texte (.txt)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer la facture</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
