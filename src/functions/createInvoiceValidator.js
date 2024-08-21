// Helper function to check if a string is non-empty after trimming
const isNonEmpty = (str) => !!str.trim();

// Basic validation functions
export const validateSenderStreetAddress = isNonEmpty;
export const validateSenderCity = isNonEmpty;
export const validateSenderCountry = isNonEmpty;
export const validateClientStreetAddress = isNonEmpty;
export const validateClientCity = isNonEmpty;
export const validateClientCountry = isNonEmpty;

// Regular expressions for validation
const POST_CODE_REGEX = /^\d{5}(-\d{4})?$/;
const NAME_REGEX = /^[a-zA-Z]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation functions
export const validateSenderPostCode = (postCode) => POST_CODE_REGEX.test(postCode);
export const validateClientPostCode = (postCode) => POST_CODE_REGEX.test(postCode);
export const validateClientName = (name) => NAME_REGEX.test(name);
export const validateClientEmail = (email) => EMAIL_REGEX.test(email);

// Item validation functions
export const validateItemName = isNonEmpty;
export const validateItemPrice = (price) => price > 0;
export const validateItemCount = (count) => count > 0;
