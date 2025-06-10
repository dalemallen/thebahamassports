// server/index.js

import 'dotenv/config';
import express from 'express';
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import cors from 'cors';

const app = express();

// Allow frontend access
app.use(cors({ origin: 'http://localhost:5173' })); // adjust for production

const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

function checkRole(role) {
  console.log('role: ', role);
  return (req, res, next) => {
    const roles = req.auth?.['https://thebahamassports.com/roles'] || [];
    if (roles.includes(role)) return next();
    return res.status(403).json({ message: 'Forbidden' });
  };

}

app.get('/api/coach/data', checkJwt, checkRole('guest'), (req, res) => {
  res.json({ message: 'Welcome Coach!' });
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
