/**
 * FlashAds Client-Side Duration Pricing Engine
 * Matches server pricing algorithm for instant real-time quotes in date pickers.
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

  // 5. Check if bumping to an extra full week is cheaper than leftover days
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

export const getDaysBetweenDates = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
};

/**
 * FlashAds Digital Board / LED DOOH Spot Pricing Engine (Phase 21)
 * Calculates multi-slot digital campaign price based on spot length, loop frequency, and broadcast window.
 * 
 * Example:
 * Advertisement duration: 10 seconds
 * Display: Every 60 seconds
 * Time: 10 AM – 10 PM (12 hours)
 * Campaign: 30 days
 */
export const calculateDigitalCampaignPrice = ({
  spotDurationSeconds = 10,
  loopIntervalSeconds = 60,
  dailyOperatingHours = 12,
  operatingTimeWindow = '10 AM – 10 PM',
  campaignDays = 30,
  basePricePerDay = 3000,
}) => {
  const durationSec = Number(spotDurationSeconds) || 10;
  const loopSec = Number(loopIntervalSeconds) || 60;
  const hours = Number(dailyOperatingHours) || 12;
  const days = Number(campaignDays) || 1;

  // 1. Loops per hour and per day
  const spotsPerHour = Math.floor(3600 / loopSec); // e.g. 60 spots / hour
  const spotsPerDay = spotsPerHour * hours; // e.g. 720 spots / day
  const totalSpots = spotsPerDay * days; // e.g. 21,600 spots for 30 days

  // 2. Base cost per spot derived from board daily digital rate
  const spotRateFactor = durationSec / 10;
  const baseDailyCost = basePricePerDay * spotRateFactor;
  const standardCost = baseDailyCost * days;

  // 3. Multi-day volume discount:
  let discountPercent = 0;
  if (days >= 30) discountPercent = 0.35;
  else if (days >= 15) discountPercent = 0.20;
  else if (days >= 7) discountPercent = 0.10;

  const totalAmount = Math.round(standardCost * (1 - discountPercent));
  const savings = standardCost - totalAmount;
  const effectivePricePerSpot = (totalAmount / totalSpots).toFixed(2);

  const breakdown = `${spotsPerDay} spots/day (${durationSec}s spot every ${loopSec}s from ${operatingTimeWindow}) × ${days} days = ${totalSpots.toLocaleString('en-IN')} total plays`;

  return {
    isDigital: true,
    spotDurationSeconds: durationSec,
    loopIntervalSeconds: loopSec,
    operatingTimeWindow,
    dailyOperatingHours: hours,
    spotsPerDay,
    campaignDays: days,
    totalSpots,
    totalAmount,
    effectivePricePerSpot: Number(effectivePricePerSpot),
    savings,
    discountPercent: Math.round(discountPercent * 100),
    breakdown,
  };
};

