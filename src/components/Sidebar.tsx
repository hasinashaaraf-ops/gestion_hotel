import React from 'react';
import {
  LayoutDashboard,
  BedDouble,
  Users,
  CalendarCheck2,
  KeyRound,
  CreditCard,
  Receipt,
  Sparkles,
  BarChart3,
  UserCog,
  LogOut,
  ShieldAlert,
  Hotel,
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';

export type ActiveTab =
  | 'dashboard'
  | 'rooms'
  | 'clients'
  | 'reservations'
  | 'checkinout'
  | 'payments'
  | 'invoices'
  | 'housekeeping'
  | 'reports'
  | 'users';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenLogin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLogin,
}) => {
  const { currentUser, logout, switchUser, rooms, reservations } = useHotel();

  // Calculate quick badges
  const cleaningCount = rooms.filter((r) => r.statut === 'En nettoyage').length;
  const activeResCount = reservations.filter((r) => r.statut === 'En cours').length;

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms' as ActiveTab, label: 'Chambres', icon: BedDouble },
    { id: 'clients' as ActiveTab, label: 'Clients', icon: Users },
    {
      id: 'reservations' as ActiveTab,
      label: 'Réservations',
      icon: CalendarCheck2,
      badge: activeResCount > 0 ? activeResCount : undefined,
    },
    { id: 'checkinout' as ActiveTab, label: 'Check-in / Check-out', icon: KeyRound },
    { id: 'payments' as ActiveTab, label: 'Paiements', icon: CreditCard },
    { id: 'invoices' as ActiveTab, label: 'Factures', icon: Receipt },
    {
      id: 'housekeeping' as ActiveTab,
      label: 'Nettoyage & Étages',
      icon: Sparkles,
      badge: cleaningCount > 0 ? cleaningCount : undefined,
      badgeColor: 'bg-sky-500 text-white',
    },
    { id: 'reports' as ActiveTab, label: 'Rapports & Stats', icon: BarChart3 },
    {
      id: 'users' as ActiveTab,
      label: 'Utilisateurs',
      icon: UserCog,
      adminOnly: true,
    },
  ];

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <aside className="w-64 bg-[#0a0a0c] text-white flex flex-col shrink-0 border-r border-zinc-900 select-none">
      {/* Brand Zone (like LOGO in the screenshot) */}
      <div className="p-6 border-b border-zinc-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1c4fd8] to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <Hotel className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-white tracking-wide text-base leading-tight font-sans">
              HÔTEL DE RÊVE
            </div>
            <div className="text-[10px] text-zinc-400 font-semibold tracking-widest mt-0.5">
              MANAGEMENT SUITE
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-4 pb-2 text-[10px] font-bold text-zinc-400 tracking-wider">
          MENU PRINCIPAL
        </div>
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) {
            return null;
          }

          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1c4fd8] text-white font-bold shadow-md shadow-blue-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/70 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-zinc-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white text-[#1c4fd8]'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Section & Logout Pill matching the screenshot */}
      <div className="p-4 border-t border-zinc-900/80 bg-[#070709] space-y-3">
        {currentUser ? (
          <>
            <div className="flex items-center justify-between px-2">
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {currentUser.prenom} {currentUser.nom}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 truncate mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{isAdmin ? 'Administrateur' : 'Réceptionniste'}</span>
                </div>
              </div>
            </div>

            {/* Role Switcher Pill */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-900/90 border border-zinc-800 rounded-full text-[11px]">
              <button
                onClick={() => switchUser('admin')}
                className={`py-1 px-2 rounded-full text-center truncate transition-all cursor-pointer ${
                  isAdmin
                    ? 'bg-[#1c4fd8] text-white font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => switchUser('reception')}
                className={`py-1 px-2 rounded-full text-center truncate transition-all cursor-pointer ${
                  !isAdmin
                    ? 'bg-[#1c4fd8] text-white font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Réception
              </button>
            </div>

            {/* Logout pill button identical to the screenshot */}
            <button
              onClick={logout}
              className="w-full py-2.5 px-4 bg-[#1c4fd8] hover:bg-[#1845c4] text-white rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>DÉCONNEXION</span>
            </button>
          </>
        ) : (
          <button
            onClick={onOpenLogin}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1c4fd8] hover:bg-[#1845c4] text-white text-xs font-bold rounded-full shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SE CONNECTER</span>
          </button>
        )}
      </div>
    </aside>
  );
};
