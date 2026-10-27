import React, { useState } from 'react';
import {
  UserCog,
  Plus,
  Shield,
  UserCheck,
  Edit2,
  Trash2,
  Lock,
  Mail,
  Phone,
  X,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { User, UserRole } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import { formatDateFr } from '../utils/formatters';

export const UsersView: React.FC = () => {
  const { users, currentUser, addUser, updateUser, deleteUser } = useHotel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    username: '',
    password: '',
    role: 'RECEPTIONIST' as UserRole,
    email: '',
    telephone: '',
  });

  const handleOpenAdd = () => {
    setFormData({
      nom: '',
      prenom: '',
      username: '',
      password: '',
      role: 'RECEPTIONIST',
      email: '',
      telephone: '+261 ',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      username: user.username,
      password: user.password || '',
      role: user.role,
      email: user.email || '',
      telephone: user.telephone || '',
    });
    setErrorMsg(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setErrorMsg('Le nom d’utilisateur est obligatoire.');
      return;
    }
    if (!editingUser && !formData.password.trim()) {
      setErrorMsg('Le mot de passe est obligatoire pour un nouvel utilisateur.');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id_utilisateur, {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        username: formData.username.trim(),
        password: formData.password ? formData.password.trim() : editingUser.password,
        role: formData.role,
        email: formData.email.trim() || undefined,
        telephone: formData.telephone.trim() || undefined,
      });
      setEditingUser(null);
    } else {
      const exists = users.some(
        (u) => u.username.toLowerCase() === formData.username.trim().toLowerCase()
      );
      if (exists) {
        setErrorMsg('Ce nom d’utilisateur est déjà utilisé.');
        return;
      }

      addUser({
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        username: formData.username.trim(),
        password: formData.password.trim(),
        role: formData.role,
        email: formData.email.trim() || undefined,
        telephone: formData.telephone.trim() || undefined,
      });
      setIsModalOpen(false);
    }
  };

  const handleDelete = (user: User) => {
    if (confirm(`Confirmez-vous la suppression du compte ${user.username} (${user.prenom} ${user.nom}) ?`)) {
      const res = deleteUser(user.id_utilisateur);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Comptes du Personnel & Droits d'Accès
          </h2>
          <p className="text-xs text-slate-500">
            Gestion des identifiants et des rôles : Administrateur (Accès complet) & Réceptionniste
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1c4fd8] hover:bg-[#1842be] text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel utilisateur</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3">Utilisateur</th>
              <th className="p-3">Identifiant</th>
              <th className="p-3">Rôle & Droits</th>
              <th className="p-3">Email</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3">Date création</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const isAdmin = user.role === 'ADMIN';
              const isCurrent = currentUser?.id_utilisateur === user.id_utilisateur;

              return (
                <tr key={user.id_utilisateur} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isAdmin
                            ? 'bg-slate-900 text-white border border-slate-700'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        {user.prenom[0]}
                        {user.nom[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {user.prenom} {user.nom} {isCurrent && '(Vous)'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ID: {user.id_utilisateur}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 font-mono font-bold text-slate-800">
                    @{user.username}
                  </td>

                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                        isAdmin
                          ? 'bg-slate-100 text-slate-800 border-slate-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isAdmin ? (
                        <>
                          <Shield className="w-3 h-3 text-slate-700" />
                          <span>👑 Administrateur</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3 h-3 text-slate-600" />
                          <span>👤 Réceptionniste</span>
                        </>
                      )}
                    </span>
                  </td>

                  <td className="p-3 font-mono text-slate-600">
                    {user.email || '-'}
                  </td>

                  <td className="p-3 font-mono text-slate-600">
                    {user.telephone || '-'}
                  </td>

                  <td className="p-3 font-mono text-slate-500">
                    {formatDateFr(user.date_creation)}
                  </td>

                  <td className="p-3 text-right space-x-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(user)}
                      title="Modifier"
                      className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!isCurrent && (
                      <button
                        onClick={() => handleDelete(user)}
                        title="Supprimer"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Add / Edit User */}
      {(isModalOpen || editingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <UserCog className="w-4 h-4 text-slate-300" />
                <span>
                  {editingUser
                    ? `Modifier l'utilisateur : @${editingUser.username}`
                    : 'Créer un nouvel utilisateur'}
                </span>
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingUser(null);
                }}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
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
                    required
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Identifiant (username)
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="ex: hery2026"
                    required
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rôle
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="RECEPTIONIST">👤 Réceptionniste</option>
                    <option value="ADMIN">👑 Administrateur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mot de passe {editingUser && '(Laisser vide pour ne pas modifier)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? '••••••••' : 'Mot de passe sécurisé'}
                  required={!editingUser}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1c4fd8] hover:bg-[#1842be] rounded-full cursor-pointer shadow-md shadow-blue-600/20 transition-all"
                >
                  {editingUser ? 'Mettre à jour' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
