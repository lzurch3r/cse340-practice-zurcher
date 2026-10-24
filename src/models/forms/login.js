import bcrypt from 'bcrypt';
import db from '../db.js';

/**
 * Find a user by email address for login verification.
 * 
 * @param {string} email - Email address to search for
 * @returns {Promise<Object|null>} User object with password hash or null if not found
 */
const findUserByEmail = async (email) => {
    // COMPLETE: Write SELECT query for id, name, email, password, created_at
    // COMPLETE: Use LOWER() on both sides for case-insensitive email comparison
    // COMPLETE: Use $1 placeholder for email parameter
    // COMPLETE: Add LIMIT 1 to ensure only one result
    // COMPLETE: Execute query and return first row or null
    const query = `
        SELECT id, name, email, password, created_at
        FROM users
        WHERE LOWER(email) = LOWER($1)
        LIMIT 1
    `;
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
};

/**
 * Verify a plain text password against a stored bcrypt hash.
 * 
 * @param {string} plainPassword - The password to verify
 * @param {string} hashedPassword - The stored password hash
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
    // CHECK FOR COMPLETION: Use bcrypt.compare() to verify the password
    // COMPLETE: Return the result (true/false)
    const verified = await bcrypt.compare(plainPassword, hashedPassword);
    const message = verified ? 'Password Verified' : "Password Not Verified";
    console.log(message);
    return verified;
};

export { findUserByEmail, verifyPassword };