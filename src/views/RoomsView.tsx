import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Users,
  Layers,
  Sparkles,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Room, RoomStatus, RoomType } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import { formatAriary, getStatusBadgeClasses } from '../utils/formatters';

const ROOM_TYPES: RoomType[] = ['Simple', 'Double', 'Twin', 'Suite', 'Familiale'];
const ROOM_STATUSES: RoomStatus[] = [
  'Disponible',
  'Occupée',
  'Réservée',
  'En nettoyage',
  'Hors service',
];

export const RoomsView: React.FC = () => {
  const { rooms, currentUser, addRoom, updateRoom, deleteRoom, setRoomStatus } = useHotel();

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [statusModalRoom, setStatusModalRoom] = useState<Room | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    numero: '',
    type: 'Double' as RoomType,
    etage: 1,
    capacite: 2,
    prix_nuit: 120000,
    statut: 'Disponible' as RoomStatus,
    description: '',
    amenities: 'Wifi haut débit, Climatisation',
  });

  const isAdmin = currentUser?.role === 'ADMIN';

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchSearch =
        r.numero.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      const matchType = selectedType === 'ALL' || r.type === selectedType;
      const matchStatus = selectedStatus === 'ALL' || r.statut === selectedStatus;
      const matchFloor = selectedFloor === 'ALL' || r.etage.toString() === selectedFloor;
      return matchSearch && matchType && matchStatus && matchFloor;
    });
  }, [rooms, search, selectedType, selectedStatus, selectedFloor]);

  const handleOpenAdd = () => {
    setFormData({
      numero: '',
      type: 'Double',
      etage: 1,
      capacite: 2,
      prix_nuit: 120000,
      statut: 'Disponible',
      description: '',
      amenities: 'Wifi haut débit, Climatisation',
    });
    setErrorMsg(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      numero: room.numero,
      type: room.type,
      etage: room.etage,
      capacite: room.capacite,
      prix_nuit: room.prix_nuit,
      statut: room.statut,
      description: room.description,
      amenities: room.amenities.join(', '),
    });
    setErrorMsg(null);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.numero.trim()) {
      setErrorMsg('Veuillez saisir un numéro de chambre.');
      return;
    }
    const exists = rooms.some((r) => r.numero === formData.numero.trim());
    if (exists) {
      setErrorMsg(`La chambre numéro ${formData.numero} existe déjà.`);
      return;
    }

    addRoom({
      numero: formData.numero.trim(),
      type: formData.type,
      etage: Number(formData.etage),
      capacite: Number(formData.capacite),
      prix_nuit: Number(formData.prix_nuit),
      statut: formData.statut,
      description: formData.description.trim(),
      amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    updateRoom(editingRoom.id_chambre, {
      numero: formData.numero.trim(),
      type: formData.type,
      etage: Number(formData.etage),
      capacite: Number(formData.capacite),
      prix_nuit: Number(formData.prix_nuit),
      statut: formData.statut,
      description: formData.description.trim(),
      amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setEditingRoom(null);
  };

  const handleDelete = (room: Room) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la chambre ${room.numero} ?`)) {
      const res = deleteRoom(room.id_chambre);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Action and Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par numéro ou mot-clé..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white font-bold text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white font-bold text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tableau
              </button>
            </div>

            {isAdmin && (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1c4fd8] hover:bg-[#1842be] text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une chambre</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Segmented Controls (Section 5 : Filtrer par type, Filtrer par état) */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-semibold shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtres :</span>
          </div>

          {/* Filter Status */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedStatus === 'ALL'
                  ? 'bg-[#1c4fd8] text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tous états ({rooms.length})
            </button>
            {ROOM_STATUSES.map((status) => {
              const count = rooms.filter((r) => r.statut === status).length;
              const isSelected = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1c4fd8] text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{status}</span>
                  <span className="font-mono text-[10px] opacity-80">({count})</span>
                </button>
              );
            })}
          </div>

          <span className="text-slate-300">|</span>

          {/* Filter Type */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedType === 'ALL'
                  ? 'bg-[#0a0a0c] text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tous types
            </button>
            {ROOM_TYPES.map((type) => {
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0a0a0c] text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          <span className="text-slate-300">|</span>

          {/* Floor filter */}
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200 text-slate-700 text-xs focus:outline-none"
          >
            <option value="ALL">Tous les étages</option>
            <option value="1">Étage 1</option>
            <option value="2">Étage 2</option>
            <option value="3">Étage 3</option>
            <option value="4">Étage 4</option>
          </select>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const badge = getStatusBadgeClasses(room.statut);
            return (
              <div
                key={room.id_chambre}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold font-mono text-slate-900">
                        N° {room.numero}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        Étage {room.etage}
                      </span>
                    </div>

                    <button
                      onClick={() => setStatusModalRoom(room)}
                      title="Changer l’état de la chambre"
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors cursor-pointer ${badge.bg}`}
                    >
                      {room.statut}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                    <span className="font-semibold text-slate-900">{room.type}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Users className="w-3.5 h-3.5" />
                      <span>{room.capacite} pers.</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {room.description || 'Chambre grand confort avec salle d’eau privative.'}
                  </p>

                  {/* Amenities tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{room.amenities.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">Prix / nuit</div>
                    <div className="text-sm font-bold font-mono text-slate-900">
                      {formatAriary(room.prix_nuit)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {room.statut === 'En nettoyage' && (
                      <button
                        onClick={() => setRoomStatus(room.id_chambre, 'Disponible')}
                        title="Marquer comme nettoyée et prête"
                        className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(room)}
                          title="Modifier"
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(room)}
                          title="Supprimer"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3">Numéro</th>
                <th className="p-3">Type</th>
                <th className="p-3">Étage</th>
                <th className="p-3">Capacité</th>
                <th className="p-3">Prix / nuit</th>
                <th className="p-3">État actuel</th>
                <th className="p-3">Équipements</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRooms.map((room) => {
                const badge = getStatusBadgeClasses(room.statut);
                return (
                  <tr key={room.id_chambre} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold font-mono text-slate-900">
                      Chambre {room.numero}
                    </td>
                    <td className="p-3 font-medium text-slate-800">{room.type}</td>
                    <td className="p-3 text-slate-500">Étage {room.etage}</td>
                    <td className="p-3 text-slate-600">{room.capacite} personnes</td>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {formatAriary(room.prix_nuit)}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setStatusModalRoom(room)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border cursor-pointer ${badge.bg}`}
                      >
                        {room.statut}
                      </button>
                    </td>
                    <td className="p-3 text-slate-500 max-w-xs truncate">
                      {room.amenities.join(', ')}
                    </td>
                    <td className="p-3 text-right space-x-1">
                      {room.statut === 'En nettoyage' && (
                        <button
                          onClick={() => setRoomStatus(room.id_chambre, 'Disponible')}
                          className="px-2 py-1 text-[11px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded font-medium cursor-pointer"
                        >
                          Nettoyée
                        </button>
                      )}
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(room)}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(room)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Add / Edit Room */}
      {(isAddModalOpen || editingRoom) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingRoom ? `Modifier la Chambre ${editingRoom.numero}` : 'Ajouter une nouvelle chambre'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingRoom(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingRoom ? handleSaveEdit : handleSaveAdd} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Numéro de chambre
                  </label>
                  <input
                    type="text"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    placeholder="ex: 209"
                    required
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Type de chambre
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomType })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {ROOM_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Étage
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.etage}
                    onChange={(e) => setFormData({ ...formData, etage: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Capacité (pers.)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={formData.capacite}
                    onChange={(e) => setFormData({ ...formData, capacite: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prix nuit (Ar)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={formData.prix_nuit}
                    onChange={(e) => setFormData({ ...formData, prix_nuit: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  État initial
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value as RoomStatus })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {ROOM_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Vue extérieure, équipement de confort..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commodités (séparées par une virgule)
                </label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="Wifi, Climatisation, Balcon, Mini-bar..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingRoom(null);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1c4fd8] hover:bg-[#1842be] rounded-full cursor-pointer transition-all shadow-md shadow-blue-600/20"
                >
                  {editingRoom ? 'Enregistrer les modifications' : 'Créer la chambre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Status Modal */}
      {statusModalRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">
                Changer l'état : Chambre {statusModalRoom.numero}
              </h4>
              <button
                onClick={() => setStatusModalRoom(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2">
              {ROOM_STATUSES.map((status) => {
                const isCurrent = statusModalRoom.statut === status;
                const badge = getStatusBadgeClasses(status);
                return (
                  <button
                    key={status}
                    onClick={() => {
                      setRoomStatus(statusModalRoom.id_chambre, status);
                      setStatusModalRoom(null);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all ${
                      isCurrent
                        ? `${badge.bg} ring-2 ring-slate-900 font-bold`
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${badge.dot}`} />
                      <span>{status}</span>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-slate-900" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
