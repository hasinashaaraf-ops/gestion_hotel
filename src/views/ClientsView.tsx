import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  History,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  X,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Client } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import { formatAriary, formatDateFr, getStatusBadgeClasses } from '../utils/formatters';

export const ClientsView: React.FC = () => {
  const { clients, reservations, rooms, payments, addClient, updateClient, deleteClient } =
    useHotel();

  const [search, setSearch] = useState('');
  const [selectedGender, setSelectedGender] = useState<'ALL' | 'M' | 'F'>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [historyClient, setHistoryClient] = useState<Client | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    sexe: 'M' as 'M' | 'F',
    telephone: '',
    email: '',
    adresse: '',
    piece_identite: '',
  });

  // Filtered clients (recherche par nom, prénom, téléphone, pièce d'identité)
  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      const matchSearch =
        !q ||
        c.nom.toLowerCase().includes(q) ||
        c.prenom.toLowerCase().includes(q) ||
        c.telephone.toLowerCase().includes(q) ||
        c.piece_identite.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      const matchGender = selectedGender === 'ALL' || c.sexe === selectedGender;
      return matchSearch && matchGender;
    });
  }, [clients, search, selectedGender]);

  const handleOpenAdd = () => {
    setFormData({
      nom: '',
      prenom: '',
      sexe: 'M',
      telephone: '+261 ',
      email: '',
      adresse: '',
      piece_identite: 'CIN ',
    });
    setErrorMsg(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      nom: client.nom,
      prenom: client.prenom,
      sexe: client.sexe,
      telephone: client.telephone,
      email: client.email,
      adresse: client.adresse,
      piece_identite: client.piece_identite,
    });
    setErrorMsg(null);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom.trim() || !formData.prenom.trim()) {
      setErrorMsg('Le nom et le prénom sont obligatoires.');
      return;
    }
    if (!formData.telephone.trim()) {
      setErrorMsg('Le numéro de téléphone est obligatoire.');
      return;
    }

    addClient({
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      sexe: formData.sexe,
      telephone: formData.telephone.trim(),
      email: formData.email.trim(),
      adresse: formData.adresse.trim(),
      piece_identite: formData.piece_identite.trim(),
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    updateClient(editingClient.id_client, {
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim(),
      sexe: formData.sexe,
      telephone: formData.telephone.trim(),
      email: formData.email.trim(),
      adresse: formData.adresse.trim(),
      piece_identite: formData.piece_identite.trim(),
    });

    setEditingClient(null);
  };

  const handleDelete = (client: Client) => {
    if (confirm(`Confirmez-vous la suppression du client ${client.prenom} ${client.nom} ?`)) {
      const res = deleteClient(client.id_client);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  // Stay history calculation for modal
  const clientReservations = useMemo(() => {
    if (!historyClient) return [];
    return reservations.filter((r) => r.id_client === historyClient.id_client);
  }, [reservations, historyClient]);

  const totalSpentByClient = useMemo(() => {
    if (!historyClient) return 0;
    return clientReservations.reduce((acc, res) => {
      const resPayments = payments.filter((p) => p.id_reservation === res.id_reservation);
      return acc + resPayments.reduce((pSum, p) => pSum + p.montant, 0);
    }, 0);
  }, [clientReservations, payments, historyClient]);

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input (nom, prénom, téléphone, pièce d'identité) */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, prénom, tél, CIN ou passeport..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        {/* Filter & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedGender('ALL')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedGender === 'ALL'
                  ? 'bg-white font-bold text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous ({clients.length})
            </button>
            <button
              onClick={() => setSelectedGender('M')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedGender === 'M'
                  ? 'bg-white font-bold text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hommes
            </button>
            <button
              onClick={() => setSelectedGender('F')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedGender === 'F'
                  ? 'bg-white font-bold text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Femmes
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1c4fd8] hover:bg-[#1842be] text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau client</span>
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3">Client</th>
              <th className="p-3">Sexe</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Pièce d'Identité</th>
              <th className="p-3">Adresse</th>
              <th className="p-3">Enregistré le</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  Aucun client trouvé avec ces critères de recherche.
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => {
                const clientResCount = reservations.filter(
                  (r) => r.id_client === client.id_client
                ).length;

                return (
                  <tr
                    key={client.id_client}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs shrink-0">
                          {client.prenom[0]}
                          {client.nom[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {client.nom.toUpperCase()} {client.prenom}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            ID: {client.id_client}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-slate-600">
                      <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-100">
                        {client.sexe === 'M' ? 'Homme' : 'Femme'}
                      </span>
                    </td>

                    <td className="p-3 font-mono font-medium text-slate-800">
                      {client.telephone}
                    </td>

                    <td className="p-3 text-slate-600 font-mono">
                      {client.email || '-'}
                    </td>

                    <td className="p-3 font-mono text-slate-900 font-semibold">
                      {client.piece_identite || '-'}
                    </td>

                    <td className="p-3 text-slate-500 max-w-xs truncate">
                      {client.adresse || '-'}
                    </td>

                    <td className="p-3 text-slate-500 font-mono">
                      {formatDateFr(client.date_enregistrement)}
                    </td>

                    <td className="p-3 text-right space-x-1 shrink-0">
                      {/* View History button */}
                      <button
                        onClick={() => setHistoryClient(client)}
                        title="Consulter l'historique des séjours"
                        className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        <History className="w-3 h-3 text-slate-600" />
                        <span>Historique ({clientResCount})</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(client)}
                        title="Modifier le client"
                        className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(client)}
                        title="Supprimer le client"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add / Edit Client */}
      {(isAddModalOpen || editingClient) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingClient
                  ? `Modifier le client : ${editingClient.prenom} ${editingClient.nom}`
                  : 'Enregistrer un nouveau client'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingClient(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={editingClient ? handleSaveEdit : handleSaveAdd}
              className="p-6 space-y-4"
            >
              {errorMsg && (
                <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="ex: RAKOTO"
                    required
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    placeholder="ex: Jean"
                    required
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sexe
                  </label>
                  <select
                    value={formData.sexe}
                    onChange={(e) =>
                      setFormData({ ...formData, sexe: e.target.value as 'M' | 'F' })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="M">Masculin (M)</option>
                    <option value="F">Féminin (F)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={formData.telephone}
                    onChange={(e) =>
                      setFormData({ ...formData, telephone: e.target.value })
                    }
                    placeholder="+261 34 00 000 00"
                    required
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean.rakoto@gmail.com"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  N° Pièce d'Identité (CIN ou Passeport)
                </label>
                <input
                  type="text"
                  value={formData.piece_identite}
                  onChange={(e) =>
                    setFormData({ ...formData, piece_identite: e.target.value })
                  }
                  placeholder="ex: CIN 101 234 567 890"
                  required
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adresse de résidence
                </label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  placeholder="Lot IVB 12 Antanimena, Antananarivo"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingClient(null);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1c4fd8] hover:bg-[#1842be] rounded-full cursor-pointer transition-all shadow-md shadow-blue-600/20"
                >
                  {editingClient ? 'Enregistrer' : 'Ajouter le client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Historique des séjours du client (Section 6 du CDC) */}
      {historyClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-300" />
                  <span>Historique des séjours & réservations</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Client : {historyClient.nom.toUpperCase()} {historyClient.prenom} ({historyClient.piece_identite})
                </p>
              </div>
              <button
                onClick={() => setHistoryClient(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summary statistics for this client */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  Nombre de réservations
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {clientReservations.length}
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  Nuits cumulées
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {clientReservations.reduce((sum, r) => sum + r.nombre_nuits, 0)} nuits
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  Dépenses totales
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {formatAriary(totalSpentByClient)}
                </div>
              </div>
            </div>

            {/* Reservations List */}
            <div className="p-6 max-h-96 overflow-y-auto space-y-3">
              {clientReservations.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Aucun séjour ou réservation enregistré pour ce client pour l'instant.
                </div>
              ) : (
                clientReservations.map((res) => {
                  const room = rooms.find((r) => r.id_chambre === res.id_chambre);
                  const badge = getStatusBadgeClasses(res.statut);
                  const resPayments = payments.filter((p) => p.id_reservation === res.id_reservation);
                  const totalPaid = resPayments.reduce((s, p) => s + p.montant, 0);

                  return (
                    <div
                      key={res.id_reservation}
                      className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-slate-900 text-sm">
                            {res.numero_reservation}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="font-semibold text-slate-700">
                            Chambre {room?.numero} ({room?.type})
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bg}`}>
                          {res.statut}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-md">
                        <div>
                          <span className="text-slate-400 block">Arrivée :</span>
                          <span className="font-medium">{formatDateFr(res.date_arrivee)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Départ :</span>
                          <span className="font-medium">{formatDateFr(res.date_depart)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Nuits :</span>
                          <span className="font-medium">{res.nombre_nuits} nuits</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Montant total :</span>
                          <span className="font-mono font-bold text-slate-900">
                            {formatAriary(res.prix_total)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-500">
                          Payé : <strong className="text-emerald-700 font-mono">{formatAriary(totalPaid)}</strong>
                          {res.prix_total > totalPaid && (
                            <span className="text-rose-600 font-mono ml-2">
                              (Reste: {formatAriary(res.prix_total - totalPaid)})
                            </span>
                          )}
                        </span>
                        {res.date_checkin_effectif && (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Check-in: {formatDateFr(res.date_checkin_effectif)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setHistoryClient(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
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
