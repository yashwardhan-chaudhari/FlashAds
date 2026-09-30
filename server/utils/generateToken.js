import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token for an authenticated user
 * @param {string} id - User ID
 * @param {string} role - User Role (client, advertiser, admin)
 * @returns {string} Signed JWT token
 */
export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'flashads_jwt_secret_dev_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

export default generateToken;
