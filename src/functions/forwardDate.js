import moment from 'moment';

/**
 * Gets a date that is a certain number of days forward from today, adjusted to be within the same month if necessary.
 *
 * @param {number} numDaysForward - Number of days to add to today's date.
 * @returns {string} - The formatted date string in 'YYYY-MM-DD'.
 */
function getForwardDate(numDaysForward) {
    const today = moment();
    const forwardDate = today.clone().add(numDaysForward, 'days');

    // If the date is beyond the next month, adjust to stay within the current month
    if (forwardDate.isAfter(today.endOf('month'))) {
        forwardDate.set('date', today.endOf('month').date());
    }

    return forwardDate.format('YYYY-MM-DD');
}

export default getForwardDate;
