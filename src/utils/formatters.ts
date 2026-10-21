export function formatAriary(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 Ar';
  // Format with space as thousand separator e.g. "2 500 000 Ar"
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} Ar`;
}

export function formatDateFr(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  try {
    // If it has both date and time e.g. "2026-10-10 14:15"
    if (dateStr.includes(' ')) {
      const [d, t] = dateStr.split(' ');
      const [year, month, day] = d.split('-');
      return `${day}/${month}/${year} ${t}`;
    }
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function calculateNights(arrivalDate: string, departureDate: string): number {
  if (!arrivalDate || !departureDate) return 1;
  const start = new Date(arrivalDate);
  const end = new Date(departureDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

export function getStatusBadgeClasses(status: string): { bg: string; text: string; dot: string; label: string } {
  switch (status) {
    case 'Disponible':
      return {
        bg: 'bg-emerald-50/80 text-emerald-900 border-emerald-200/70',
        text: 'text-emerald-800',
        dot: 'bg-emerald-600',
        label: 'Disponible',
      };
    case 'Occupée':
      return {
        bg: 'bg-rose-50/80 text-rose-900 border-rose-200/70',
        text: 'text-rose-800',
        dot: 'bg-rose-600',
        label: 'Occupée',
      };
    case 'Réservée':
      return {
        bg: 'bg-amber-50/80 text-amber-900 border-amber-200/70',
        text: 'text-amber-800',
        dot: 'bg-amber-600',
        label: 'Réservée',
      };
    case 'En nettoyage':
      return {
        bg: 'bg-slate-100 text-slate-800 border-slate-300',
        text: 'text-slate-800',
        dot: 'bg-slate-500',
        label: 'En nettoyage',
      };
    case 'Hors service':
      return {
        bg: 'bg-slate-100 text-slate-600 border-slate-200',
        text: 'text-slate-500',
        dot: 'bg-slate-400',
        label: 'Hors service',
      };
    case 'Confirmée':
      return {
        bg: 'bg-emerald-50/80 text-emerald-900 border-emerald-200/70',
        text: 'text-emerald-800',
        dot: 'bg-emerald-600',
        label: 'Confirmée',
      };
    case 'En cours':
      return {
        bg: 'bg-slate-900 text-white border-slate-900',
        text: 'text-slate-900',
        dot: 'bg-white',
        label: 'En cours',
      };
    case 'En attente':
      return {
        bg: 'bg-amber-50/80 text-amber-900 border-amber-200/70',
        text: 'text-amber-800',
        dot: 'bg-amber-600',
        label: 'En attente',
      };
    case 'Terminée':
      return {
        bg: 'bg-slate-100 text-slate-600 border-slate-200',
        text: 'text-slate-500',
        dot: 'bg-slate-400',
        label: 'Terminée',
      };
    case 'Annulée':
      return {
        bg: 'bg-slate-100 text-slate-500 border-slate-200',
        text: 'text-slate-500',
        dot: 'bg-slate-400',
        label: 'Annulée',
      };
    case 'Payé':
      return {
        bg: 'bg-emerald-50/80 text-emerald-900 border-emerald-200/70',
        text: 'text-emerald-800',
        dot: 'bg-emerald-600',
        label: 'Payé',
      };
    case 'Partiellement payé':
      return {
        bg: 'bg-slate-100 text-slate-800 border-slate-300',
        text: 'text-slate-700',
        dot: 'bg-slate-500',
        label: 'Partiellement payé',
      };
    case 'Non payé':
      return {
        bg: 'bg-rose-50/80 text-rose-900 border-rose-200/70',
        text: 'text-rose-800',
        dot: 'bg-rose-600',
        label: 'Non payé',
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        text: 'text-slate-600',
        dot: 'bg-slate-400',
        label: status,
      };
  }
}
