import React, { useState, useEffect } from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { InvoiceModal } from './components/InvoiceModal';
import { Invoice } from './types/hotel';

// Views
import { DashboardView } from './views/DashboardView';
import { RoomsView } from './views/RoomsView';
import { ClientsView } from './views/ClientsView';
import { ReservationsView } from './views/ReservationsView';
import { CheckInOutView } from './views/CheckInOutView';
import { PaymentsView } from './views/PaymentsView';
import { InvoicesView } from './views/InvoicesView';
import { HousekeepingView } from './views/HousekeepingView';
import { ReportsView } from './views/ReportsView';
import { UsersView } from './views/UsersView';

function AppContent() {
  const { currentUser } = useHotel();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [preselectedResId, setPreselectedResId] = useState<string | undefined>(undefined);

  // Global keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab: ActiveTab, detailId?: string) => {
    setActiveTab(tab);
    if (tab === 'checkinout' && detailId) {
      setPreselectedResId(detailId);
    }
  };

  const handleOpenCheckIn = (resId: string) => {
    setPreselectedResId(resId);
    setActiveTab('checkinout');
  };

  const handleOpenCheckOut = (resId: string) => {
    setPreselectedResId(resId);
    setActiveTab('checkinout');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f5fa] font-sans">
      {/* Sidebar navigation conforming to section 20 of CDC */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setPreselectedResId(undefined);
          setActiveTab(tab);
        }}
        onOpenLogin={() => setIsAuthModalOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
        />

        {/* Viewport content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                onNavigate={handleNavigate}
                onOpenCheckInForRes={handleOpenCheckIn}
                onOpenCheckOutForRes={handleOpenCheckOut}
              />
            )}

            {activeTab === 'rooms' && <RoomsView />}

            {activeTab === 'clients' && <ClientsView />}

            {activeTab === 'reservations' && (
              <ReservationsView
                onOpenCheckInForRes={handleOpenCheckIn}
                onOpenCheckOutForRes={handleOpenCheckOut}
              />
            )}

            {activeTab === 'checkinout' && (
              <CheckInOutView
                preselectedResId={preselectedResId}
                onShowInvoice={(inv) => setSelectedInvoice(inv)}
              />
            )}

            {activeTab === 'payments' && <PaymentsView />}

            {activeTab === 'invoices' && (
              <InvoicesView onShowInvoice={(inv) => setSelectedInvoice(inv)} />
            )}

            {activeTab === 'housekeeping' && <HousekeepingView />}

            {activeTab === 'reports' && <ReportsView />}

            {activeTab === 'users' && <UsersView />}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <HotelProvider>
      <AppContent />
    </HotelProvider>
  );
}
