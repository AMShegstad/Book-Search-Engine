//import type { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include the user property
// declare global {
//   namespace Express {
//     interface Request {
//       user: {
//         _id: unknown;
//         username: string;
//       };
//     }
//   }
// }
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

// interface JwtPayload {
//   _id: unknown;
//   username: string;
//   email: string;
// }

export const authenticateToken = (req, _, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
      req.user = {
        _id: (user)._id,
        username: (user).username,
      };
      }

      req.user = user;
      return next();
    });
  } else {
    throw new Error('Unauthorized: No token provided');
  }
};

export const signToken = (username, email, _id) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
