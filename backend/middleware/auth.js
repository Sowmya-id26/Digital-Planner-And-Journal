
import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
);

export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.userId = null;
      return next();
    }

    const token = authHeader.split(' ')[1];

    const { payload } = await jwtVerify(token, JWKS);

    // Supabase user id
    req.userId = payload.sub;

    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({
      message: 'Unauthorized: Invalid token'
    });
  }
}