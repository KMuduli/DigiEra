// DigitalEra - Slug Utility
const slugifyLib = require('slugify');

/**
 * Generates a URL-safe slug from a string.
 * @param {string} text
 * @returns {string}
 */
const generateSlug = (text) => {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

module.exports = { generateSlug };
