import { Session } from '@prisma/client';

import { RequestUser } from './auth.types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: RequestUser;
      session: Session;
    }
  }
}
