import Joi from 'joi';

/**
 * Joi schema definition for validating incoming product data.
 * Each product has the following properties:
 *
 * - `categoryID`: A number that must be between 1 and 5 (inclusive). This represents the category of the product.
 * - `price`: A positive number representing the price of the product. Negative or zero values are not allowed.
 * - `title`: A string with a minimum length of 3 characters and a maximum length of 100 characters, representing the name of the product.
 *
 * @example
 * // Example of valid product data:
 * const validProduct = {
 *   categoryID: 2,     // number
 *   price: 99.99,      // positive number
 *   title: "Example Product"  // string (3 to 100 characters)
 * };
 *
 * @example
 * // Example of invalid product data:
 * const invalidProduct = {
 *   categoryID: 0,     // Invalid: must be between 1 and 5
 *   price: -5,         // Invalid: must be a positive number
 *   title: "No"        // Invalid: title must be at least 3 characters long
 * };
 *
 * @typedef {Object} Product
 * @property {number} categoryID - The category ID for the product (must be between 1 and 5).
 * @property {number} price - The price of the product (must be a positive number).
 * @property {string} title - The title of the product (must be between 3 and 100 characters).
 */
export const productSchema = Joi.object({
    categoryID: Joi.number().min(1).max(5).required(),
    price: Joi.number().positive().required(),
    title: Joi.string().min(3).max(100).required(),
});
