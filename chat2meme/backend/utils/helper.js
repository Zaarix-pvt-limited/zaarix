/**
 * Add days to current date
 * @param {number} days - Number of days to add
 * @returns {Date}
 */
const addDaysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Add minutes to current date
 * @param {number} minutes - Number of minutes to add
 * @returns {Date}
 */
const addMinutesFromNow = (minutes) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

/**
 * Add hours to current date
 * @param {number} hours - Number of hours to add
 * @returns {Date}
 */
const addHoursFromNow = (hours) => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
};

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string}
 */
const formatDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

/**
 * Check if date is expired
 * @param {Date} expiryDate - Expiry date to check
 * @returns {boolean}
 */
const isExpired = (expiryDate) => {
  return new Date(expiryDate) < new Date();
};

module.exports = {
  addDaysFromNow,
  addMinutesFromNow,
  addHoursFromNow,
  formatDate,
  isExpired
};