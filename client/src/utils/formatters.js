// Format number to INR currency string (e.g. ₹25,000)
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format standard Date to readable string (e.g. 10 Oct 2026)
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

// Format duration days to readable text
export const formatDuration = (days) => {
  if (!days || days <= 0) return '0 days';
  if (days === 1) return '1 day';
  if (days % 30 === 0) {
    const months = days / 30;
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }
  if (days % 7 === 0) {
    const weeks = days / 7;
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  }
  return `${days} days`;
};
