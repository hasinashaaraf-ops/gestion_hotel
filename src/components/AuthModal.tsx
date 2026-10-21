import React, { useState } from 'react';
import { Hotel, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useHotel } from '../context/HotelContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useHotel();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(username, password);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Identifiants incorrects');
    }
  };

  const handleQuickLogin = (userLogin: string, userPass: string) => {
    setUsername(userLogin);
    setPassword(userPass);
    const res = login(userLogin, userPass);
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header styling matching screenshot branding */}
        <div className="p-8 pb-6 bg-[#0a0a0c] text-white text-center relative">
          <div className="w-14 h-14 bg-[#1c4fd8] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-600/30 text-white">
            <Hotel className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            HÔTEL DE RÊVE
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Système d'Authentification & Contrôle d'Accès
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: admin ou reception"
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c4fd8] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c4fd8] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-[#1c4fd8] hover:bg-[#1845c4] text-white font-bold text-sm rounded-full shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>CONNEXION</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Logins for test convenience */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider">
              Accès rapide démonstration
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-900">👑 Administrateur</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">admin / admin123</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('reception', 'reception123')}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-900">👤 Réceptionniste</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">reception / reception123</div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
