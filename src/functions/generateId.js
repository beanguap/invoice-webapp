/**
 * Generates a unique ID consisting of 2 random uppercase letters followed by 4 random digits.
 *
 * @returns {string} - The generated ID in the format 'LLDDDD'.
 */
function generateID() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const getRandomLetter = () => letters.charAt(Math.floor(Math.random() * letters.length));
  const getRandomDigit = () => Math.floor(Math.random() * 10);

  // Generate 2 random uppercase letters
  const randomLetters = Array.from({ length: 2 }, getRandomLetter).join('');

  // Generate 4 random digits
  const randomDigits = Array.from({ length: 4 }, getRandomDigit).join('');

  return `${randomLetters}${randomDigits}`;
}

export default generateID;
