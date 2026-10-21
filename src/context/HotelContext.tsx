import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Room,
  Client,
  Reservation,
  Payment,
  Invoice,
  RoomStatus,
  PaymentMethod,
  ReservationStatus,
} from '../types/hotel';
import {
  INITIAL_USERS,
  INITIAL_ROOMS,
  INITIAL_CLIENTS,
  INITIAL_RESERVATIONS,
  INITIAL_PAYMENTS,
  INITIAL_INVOICES,
} from '../data/initialData';
import { calculateNights } from '../utils/formatters';

interface HotelContextType {
  currentUser: User | null;
  users: User[];
  rooms: Room[];
  clients: Client[];
  reservations: Reservation[];
  payments: Payment[];
  invoices: Invoice[];
  
  // Auth
  login: (username: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  switchUser: (username: string) => void;
  
  // Rooms
  addRoom: (room: Omit<Room, 'id_chambre'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => { success: boolean; message?: string };
  setRoomStatus: (id: string, status: RoomStatus) => void;
  markRoomCleaned: (roomId: string) => void;

  // Clients
  addClient: (client: Omit<Client, 'id_client' | 'date_enregistrement'>) => Client;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => { success: boolean; message?: string };

  // Reservations
  isRoomAvailable: (roomId: string, checkIn: string, checkOut: string, excludeResId?: string) => boolean;
  createReservation: (data: {
    id_client: string;
    id_chambre: string;
    date_arrivee: string;
    date_depart: string;
    nombre_personnes: number;
    remarques?: string;
    acompte?: number;
    mode_paiement_acompte?: PaymentMethod;
  }) => { success: boolean; message?: string; reservation?: Reservation };
  updateReservation: (id: string, data: Partial<Reservation>) => void;
  cancelReservation: (id: string) => void;

  // Check-In & Check-Out
  processCheckIn: (reservationId: string) => { success: boolean; message?: string };
  processCheckOut: (
    reservationId: string,
    paymentAmount?: number,
    paymentMethod?: PaymentMethod
  ) => { success: boolean; invoice?: Invoice; message?: string };

  // Payments & Invoices
  addPayment: (data: {
    id_reservation: string;
    montant: number;
    mode_paiement: PaymentMethod;
    reference?: string;
  }) => Payment;
  deletePayment: (id: string) => void;
  getPaymentsForReservation: (reservationId: string) => Payment[];
  getTotalPaidForReservation: (reservationId: string) => number;
  getRemainingBalanceForReservation: (reservationId: string) => number;
  getInvoiceForReservation: (reservationId: string) => Invoice | undefined;

  // Users Management (Admin)
  addUser: (user: Omit<User, 'id_utilisateur'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => { success: boolean; message?: string };

  // System
  resetToDefaultData: () => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'hotel_curr_user',
  USERS: 'hotel_users_data',
  ROOMS: 'hotel_rooms_data',
  CLIENTS: 'hotel_clients_data',
  RESERVATIONS: 'hotel_reservations_data',
  PAYMENTS: 'hotel_payments_data',
  INVOICES: 'hotel_invoices_data',
};

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS[0];
      }
    }
    // Default logged in as admin for smooth previewing
    return INITIAL_USERS[0];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ROOMS;
      }
    }
    return INITIAL_ROOMS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CLIENTS;
      }
    }
    return INITIAL_CLIENTS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_RESERVATIONS;
      }
    }
    return INITIAL_RESERVATIONS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PAYMENTS;
      }
    }
    return INITIAL_PAYMENTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_INVOICES;
      }
    }
    return INITIAL_INVOICES;
  });

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  // Auth Methods
  const login = (username: string, password?: string) => {
    const user = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (!user) {
      return { success: false, message: 'Nom d’utilisateur introuvable.' };
    }
    if (password && user.password && user.password !== password) {
      return { success: false, message: 'Mot de passe incorrect.' };
    }
    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (username: string) => {
    const user = users.find((u) => u.username === username);
    if (user) {
      setCurrentUser(user);
    }
  };

  // Room Methods
  const addRoom = (roomData: Omit<Room, 'id_chambre'>) => {
    const newRoom: Room = {
      ...roomData,
      id_chambre: `rm_${Date.now()}`,
    };
    setRooms((prev) => [newRoom, ...prev]);
  };

  const updateRoom = (id: string, roomData: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((r) => (r.id_chambre === id ? { ...r, ...roomData } : r))
    );
  };

  const deleteRoom = (id: string) => {
    // Check if room has active reservations
    const hasActiveRes = reservations.some(
      (r) =>
        r.id_chambre === id &&
        (r.statut === 'En cours' || r.statut === 'Confirmée')
    );
    if (hasActiveRes) {
      return {
        success: false,
        message: 'Impossible de supprimer une chambre ayant des réservations actives.',
      };
    }
    setRooms((prev) => prev.filter((r) => r.id_chambre !== id));
    return { success: true };
  };

  const setRoomStatus = (id: string, status: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.id_chambre === id ? { ...r, statut: status } : r))
    );
  };

  const markRoomCleaned = (roomId: string) => {
    setRoomStatus(roomId, 'Disponible');
  };

  // Client Methods
  const addClient = (clientData: Omit<Client, 'id_client' | 'date_enregistrement'>): Client => {
    const today = new Date().toISOString().split('T')[0];
    const newClient: Client = {
      ...clientData,
      id_client: `cli_${Date.now()}`,
      date_enregistrement: today,
    };
    setClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id_client === id ? { ...c, ...clientData } : c))
    );
  };

  const deleteClient = (id: string) => {
    const hasActive = reservations.some(
      (r) =>
        r.id_client === id &&
        (r.statut === 'En cours' || r.statut === 'Confirmée')
    );
    if (hasActive) {
      return {
        success: false,
        message: 'Impossible de supprimer un client avec un séjour en cours ou réservé.',
      };
    }
    setClients((prev) => prev.filter((c) => c.id_client !== id));
    return { success: true };
  };

  // Availability check
  const isRoomAvailable = (
    roomId: string,
    checkIn: string,
    checkOut: string,
    excludeResId?: string
  ): boolean => {
    const startA = new Date(checkIn).getTime();
    const endA = new Date(checkOut).getTime();

    // Check against all overlapping active reservations
    const conflicts = reservations.filter((res) => {
      if (res.id_chambre !== roomId) return false;
      if (excludeResId && res.id_reservation === excludeResId) return false;
      if (res.statut === 'Annulée' || res.statut === 'Terminée') return false;

      const startB = new Date(res.date_arrivee).getTime();
      const endB = new Date(res.date_depart).getTime();

      // Overlap formula: (startA < endB) && (endA > startB)
      return startA < endB && endA > startB;
    });

    return conflicts.length === 0;
  };

  // Reservation Methods
  const createReservation = (data: {
    id_client: string;
    id_chambre: string;
    date_arrivee: string;
    date_depart: string;
    nombre_personnes: number;
    remarques?: string;
    acompte?: number;
    mode_paiement_acompte?: PaymentMethod;
  }) => {
    const room = rooms.find((r) => r.id_chambre === data.id_chambre);
    if (!room) {
      return { success: false, message: 'Chambre introuvable.' };
    }

    if (room.statut === 'Hors service') {
      return { success: false, message: 'Cette chambre est actuellement hors service.' };
    }

    if (!isRoomAvailable(data.id_chambre, data.date_arrivee, data.date_depart)) {
      return {
        success: false,
        message: 'Cette chambre est déjà occupée ou réservée sur cette période sélectionnée.',
      };
    }

    const nuits = calculateNights(data.date_arrivee, data.date_depart);
    const prix_total = nuits * room.prix_nuit;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const newId = `res_${Date.now()}`;
    const code = `RES-2026-${String(reservations.length + 1).padStart(3, '0')}`;

    const newRes: Reservation = {
      id_reservation: newId,
      numero_reservation: code,
      id_client: data.id_client,
      id_chambre: data.id_chambre,
      date_reservation: today,
      date_arrivee: data.date_arrivee,
      date_depart: data.date_depart,
      nombre_personnes: data.nombre_personnes,
      nombre_nuits: nuits,
      prix_total,
      statut: 'Confirmée',
      remarques: data.remarques,
    };

    setReservations((prev) => [newRes, ...prev]);

    // If starting today and room is free, mark as Réservée
    if (data.date_arrivee === today && room.statut === 'Disponible') {
      setRoomStatus(data.id_chambre, 'Réservée');
    }

    // Process down payment if specified
    if (data.acompte && data.acompte > 0 && data.mode_paiement_acompte) {
      const payCode = `PAY-2026-${String(payments.length + 1).padStart(3, '0')}`;
      const newPay: Payment = {
        id_paiement: `pay_${Date.now()}`,
        numero_paiement: payCode,
        id_reservation: newId,
        date_paiement: `${today} ${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}`,
        montant: data.acompte,
        mode_paiement: data.mode_paiement_acompte,
        statut: data.acompte >= prix_total ? 'Payé' : 'Partiellement payé',
        reference: `ACOMPTE-${payCode}`,
      };
      setPayments((prev) => [newPay, ...prev]);
    }

    return { success: true, reservation: newRes };
  };

  const updateReservation = (id: string, data: Partial<Reservation>) => {
    setReservations((prev) =>
      prev.map((r) => (r.id_reservation === id ? { ...r, ...data } : r))
    );
  };

  const cancelReservation = (id: string) => {
    const res = reservations.find((r) => r.id_reservation === id);
    if (!res) return;

    setReservations((prev) =>
      prev.map((r) => (r.id_reservation === id ? { ...r, statut: 'Annulée' } : r))
    );

    // If room was currently reserved or occupied by this reservation, revert room status
    const room = rooms.find((r) => r.id_chambre === res.id_chambre);
    if (room && (room.statut === 'Réservée' || room.statut === 'Occupée')) {
      // Check if there are other active reservations right now
      const otherActive = reservations.some(
        (other) =>
          other.id_reservation !== id &&
          other.id_chambre === res.id_chambre &&
          other.statut === 'En cours'
      );
      if (!otherActive) {
        setRoomStatus(res.id_chambre, 'Disponible');
      }
    }
  };

  // Check-In Logic
  const processCheckIn = (reservationId: string) => {
    const res = reservations.find((r) => r.id_reservation === reservationId);
    if (!res) {
      return { success: false, message: 'Réservation introuvable.' };
    }
    if (res.statut === 'En cours') {
      return { success: false, message: 'Le check-in a déjà été effectué pour ce séjour.' };
    }
    if (res.statut === 'Terminée' || res.statut === 'Annulée') {
      return { success: false, message: `Cette réservation est déjà ${res.statut.toLowerCase()}.` };
    }

    const room = rooms.find((r) => r.id_chambre === res.id_chambre);
    if (!room) {
      return { success: false, message: 'Chambre introuvable.' };
    }

    // Check if room is already occupied by someone else
    if (room.statut === 'Occupée') {
      const activeRes = reservations.find(
        (other) =>
          other.id_chambre === room.id_chambre &&
          other.id_reservation !== reservationId &&
          other.statut === 'En cours'
      );
      if (activeRes) {
        return {
          success: false,
          message: `La chambre ${room.numero} est déjà occupée par une autre réservation (${activeRes.numero_reservation}). Veuillez effectuer le check-out au préalable.`,
        };
      }
    }

    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 1. Update reservation status to 'En cours' and set effective check-in time
    setReservations((prev) =>
      prev.map((r) =>
        r.id_reservation === reservationId
          ? { ...r, statut: 'En cours', date_checkin_effectif: timestamp }
          : r
      )
    );

    // 2. Change room status to 'Occupée'
    setRoomStatus(res.id_chambre, 'Occupée');

    return { success: true };
  };

  // Check-Out Logic
  const processCheckOut = (
    reservationId: string,
    paymentAmount?: number,
    paymentMethod?: PaymentMethod
  ) => {
    const res = reservations.find((r) => r.id_reservation === reservationId);
    if (!res) {
      return { success: false, message: 'Réservation introuvable.' };
    }
    if (res.statut !== 'En cours') {
      return {
        success: false,
        message: 'Seule une réservation actuellement "En cours" peut faire l’objet d’un check-out.',
      };
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timestamp = `${today} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    // Calculate nights & total
    const existingPayments = payments.filter((p) => p.id_reservation === reservationId);
    const totalPaidBefore = existingPayments.reduce((acc, p) => acc + p.montant, 0);

    let additionalPaid = 0;
    let chosenPaymentMethod: PaymentMethod = paymentMethod || 'Espèces';

    if (paymentAmount && paymentAmount > 0) {
      additionalPaid = paymentAmount;
      const payCode = `PAY-2026-${String(payments.length + 1).padStart(3, '0')}`;
      const newPay: Payment = {
        id_paiement: `pay_${Date.now()}`,
        numero_paiement: payCode,
        id_reservation: reservationId,
        date_paiement: timestamp,
        montant: paymentAmount,
        mode_paiement: chosenPaymentMethod,
        statut: totalPaidBefore + paymentAmount >= res.prix_total ? 'Payé' : 'Partiellement payé',
        reference: `CHECKOUT-${payCode}`,
      };
      setPayments((prev) => [newPay, ...prev]);
    } else if (existingPayments.length > 0) {
      chosenPaymentMethod = existingPayments[0].mode_paiement;
    }

    const totalPaidFinal = totalPaidBefore + additionalPaid;
    const remaining = Math.max(0, res.prix_total - totalPaidFinal);

    // 1. Mark reservation as 'Terminée' and save effective check-out time
    setReservations((prev) =>
      prev.map((r) =>
        r.id_reservation === reservationId
          ? { ...r, statut: 'Terminée', date_checkout_effectif: timestamp }
          : r
      )
    );

    // 2. Change room status to 'En nettoyage' (À nettoyer - section 9 & 15 du cahier des charges)
    setRoomStatus(res.id_chambre, 'En nettoyage');

    // 3. Generate official invoice
    const invoiceCode = `FAC-2026-${String(invoices.length + 1).padStart(3, '0')}`;
    const newInvoice: Invoice = {
      id_facture: `fac_${Date.now()}`,
      numero_facture: invoiceCode,
      id_reservation: reservationId,
      date_facture: today,
      montant_total: res.prix_total,
      montant_paye: totalPaidFinal,
      reste_a_payer: remaining,
      mode_paiement: chosenPaymentMethod,
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    return { success: true, invoice: newInvoice };
  };

  // Payments Helper
  const getPaymentsForReservation = (reservationId: string) => {
    return payments.filter((p) => p.id_reservation === reservationId);
  };

  const getTotalPaidForReservation = (reservationId: string) => {
    return payments
      .filter((p) => p.id_reservation === reservationId)
      .reduce((sum, p) => sum + p.montant, 0);
  };

  const getRemainingBalanceForReservation = (reservationId: string) => {
    const res = reservations.find((r) => r.id_reservation === reservationId);
    if (!res) return 0;
    const paid = getTotalPaidForReservation(reservationId);
    return Math.max(0, res.prix_total - paid);
  };

  const getInvoiceForReservation = (reservationId: string) => {
    return invoices.find((inv) => inv.id_reservation === reservationId);
  };

  const addPayment = (data: {
    id_reservation: string;
    montant: number;
    mode_paiement: PaymentMethod;
    reference?: string;
  }) => {
    const res = reservations.find((r) => r.id_reservation === data.id_reservation);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timestamp = `${today} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const code = `PAY-2026-${String(payments.length + 1).padStart(3, '0')}`;

    const totalBefore = getTotalPaidForReservation(data.id_reservation);
    const totalAfter = totalBefore + data.montant;
    const totalPrice = res ? res.prix_total : data.montant;

    const newPayment: Payment = {
      id_paiement: `pay_${Date.now()}`,
      numero_paiement: code,
      id_reservation: data.id_reservation,
      date_paiement: timestamp,
      montant: data.montant,
      mode_paiement: data.mode_paiement,
      statut: totalAfter >= totalPrice ? 'Payé' : 'Partiellement payé',
      reference: data.reference || `REF-${code}`,
    };

    setPayments((prev) => [newPayment, ...prev]);
    return newPayment;
  };

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id_paiement !== id));
  };

  // User Management
  const addUser = (userData: Omit<User, 'id_utilisateur'>) => {
    const newUser: User = {
      ...userData,
      id_utilisateur: `usr_${Date.now()}`,
      date_creation: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id_utilisateur === id ? { ...u, ...userData } : u))
    );
    if (currentUser?.id_utilisateur === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...userData } : null));
    }
  };

  const deleteUser = (id: string) => {
    if (currentUser?.id_utilisateur === id) {
      return { success: false, message: 'Vous ne pouvez pas supprimer le compte actuellement connecté.' };
    }
    if (users.length <= 1) {
      return { success: false, message: 'Il doit rester au moins un utilisateur.' };
    }
    setUsers((prev) => prev.filter((u) => u.id_utilisateur !== id));
    return { success: true };
  };

  const resetToDefaultData = () => {
    setUsers(INITIAL_USERS);
    setRooms(INITIAL_ROOMS);
    setClients(INITIAL_CLIENTS);
    setReservations(INITIAL_RESERVATIONS);
    setPayments(INITIAL_PAYMENTS);
    setInvoices(INITIAL_INVOICES);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.clear();
  };

  return (
    <HotelContext.Provider
      value={{
        currentUser,
        users,
        rooms,
        clients,
        reservations,
        payments,
        invoices,
        login,
        logout,
        switchUser,
        addRoom,
        updateRoom,
        deleteRoom,
        setRoomStatus,
        markRoomCleaned,
        addClient,
        updateClient,
        deleteClient,
        isRoomAvailable,
        createReservation,
        updateReservation,
        cancelReservation,
        processCheckIn,
        processCheckOut,
        addPayment,
        deletePayment,
        getPaymentsForReservation,
        getTotalPaidForReservation,
        getRemainingBalanceForReservation,
        getInvoiceForReservation,
        addUser,
        updateUser,
        deleteUser,
        resetToDefaultData,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
