// src/types/express.d.ts
import { User } from '../users/user.entity'; // Import your User entity

declare module 'express' {
  interface Request {
    user?: User; // Add the user property to the Request interface
  }
}
