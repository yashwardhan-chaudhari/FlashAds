/**
 * FlashAds Duration Pricing Engine
 * Calculates the cheapest optimal combination of months, weeks, and days for a given date range.
 * 
 * Rules:
 * 1. 1 month = 30 days, 1 week = 7 days.
 * 2. m = floor(D / 30), w = floor((D - 30m) / 7), r = D - 30m - 7w
 * 3. Tier Capping: Leftover days cost is capped at 1 week's price.
 *    Weeks-plus-days cost is capped at 1 month's price.
 * 4. Overall combination is tested against next tier thresholds.
 * 
 * @param {number} durationDays - Duration in days
 * @param {number} pricePerDay - Daily rate (INR)
 * @param {number} pricePerWeek - Weekly rate (INR)
 * @param {number} pricePerMonth - Monthly rate (INR)
 * @returns {object} { durationDays, months, weeks, days, totalAmount, breakdown, savings }
 */
export const calculateDurationPrice = (
  durationDays,
  pricePerDay,
  pricePerWeek,
  pricePerMonth
) => {
  if (!durationDays || durationDays <= 0) {
    return {
      durationDays: 0,
      months: 0,
      weeks: 0,
      days: 0,
      totalAmount: 0,
      breakdown: '0 days',
      savings: 0,
    };
  }

  const d = Number(pricePerDay) || 0;
  const wRate = Number(pricePerWeek) || d * 7;
  const mRate = Number(pricePerMonth) || wRate * 4;

  const D = Math.floor(durationDays);

  // 1. Initial quotient breakdown
  let m = Math.floor(D / 30);
  const remainingAfterMonths = D - m * 30;
  let w = Math.floor(remainingAfterMonths / 7);
  let r = remainingAfterMonths - w * 7;

  // 2. Compute cost for remainder days (capped at 1 week rate)
  const uncappedDaysCost = r * d;
  const daysCost = Math.min(uncappedDaysCost, wRate);

  // 3. Compute cost for weeks + days (capped at 1 month rate)
  const uncappedRemainderCost = w * wRate + daysCost;
  const remainderCost = Math.min(uncappedRemainderCost, mRate);

  // 4. Base total with tier capping
  let totalAmount = m * mRate + remainderCost;

  // 5. Check if bumping to an extra full week or extra month is cheaper
  const extraWeekOption = (w + 1) * wRate;
  if (r > 0 && extraWeekOption < uncappedRemainderCost && extraWeekOption < mRate) {
    totalAmount = m * mRate + extraWeekOption;
  }

  // 6. Straight daily calculation without duration tiering (for savings calculation)
  const straightDailyCost = D * d;
  const savings = Math.max(0, straightDailyCost - totalAmount);

  // 7. Human-readable breakdown description
  const breakdownParts = [];
  if (m > 0) breakdownParts.push(`${m} ${m === 1 ? 'month' : 'months'} (₹${(m * mRate).toLocaleString('en-IN')})`);
  if (w > 0) breakdownParts.push(`${w} ${w === 1 ? 'week' : 'weeks'} (₹${(w * wRate).toLocaleString('en-IN')})`);
  if (r > 0) breakdownParts.push(`${r} ${r === 1 ? 'day' : 'days'} (₹${(daysCost).toLocaleString('en-IN')})`);

  const breakdown = breakdownParts.length > 0 ? breakdownParts.join(' + ') : `${D} days`;

  return {
    durationDays: D,
    months: m,
    weeks: w,
    days: r,
    totalAmount,
    breakdown,
    savings,
    dailyRate: d,
    weeklyRate: wRate,
    monthlyRate: mRate,
  };
};

/**
 * Compute days between start and end date (half-open [start, end))
 * @param {string|Date} startDate 
 * @param {string|Date} endDate 
 * @returns {number} duration in days
 */
export const getDaysBetweenDates = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
};
