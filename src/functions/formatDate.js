/**
 * Formats a date string into a more readable format.
 *
 * @param {string | Date} dateInput - The date string or Date object to format.
 * @param {string} [locale='en-US'] - The locale to use for formatting.
 * @param {Object} [options={ year: 'numeric', month: 'short', day: 'numeric' }] - Formatting options.
 * @returns {string} - The formatted date string.
 */
export default function formatDate(dateInput, locale = 'en-US', options = { year: 'numeric', month: 'short', day: 'numeric' }) {
    const date = new Date(dateInput);

    // Check if the date is invalid
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    return date.toLocaleDateString(locale, options);
}
