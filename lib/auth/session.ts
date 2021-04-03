import Iron from '@hapi/iron'
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../types/User';
import { MAX_AGE, setTokenCookie, getTokenCookie } from './cookies'

interface Session {
  createdAt: number;
  maxAge: number;
  user: User;
}

const TOKEN_SECRET = process.env.TOKEN_SECRET

export async function createSession(res: NextApiResponse, user: User): Promise<void> {
  const createdAt = Date.now();
  const obj: Session = { user, createdAt, maxAge: MAX_AGE };
  const token = await Iron.seal(obj, TOKEN_SECRET, Iron.defaults);

  setTokenCookie(res, token);
}

export async function getUserFromSession(req: NextApiRequest): Promise<User | null> {
  const token = getTokenCookie(req);

  if (!token) {
    return null;
  }

  const session: Session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
  const expiresAt = session.createdAt + session.maxAge * 1000;

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error('Session expired');
  }

  return session.user;
}
