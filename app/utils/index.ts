export function createPageUrl(page: string): string {
  return `/${page}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'paid':
      return 'text-green-600';
    case 'overdue':
      return 'text-red-600';
    case 'pending':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
}

export function calculateRemainingAmount(amount: number, payments: number[]): number {
  const totalPaid = payments.reduce((sum, payment) => sum + payment, 0);
  return Math.max(0, amount - totalPaid);
}
