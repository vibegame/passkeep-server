import { User } from '@prisma/client';

export type RequestUser = User;

export interface JwtPayload {
  userId: string;
  sessionId: string;
}
