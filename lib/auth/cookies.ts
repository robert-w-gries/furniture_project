import { serialize, parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

const TOKEN_NAME = 'token';

export const MAX_AGE = 60 * 60 * 8; // 8 hours

export function setTokenCookie(res: NextApiResponse, token: string): void {
  const cookie: string = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function removeTokenCookie(res: NextApiResponse): void {
  const cookieString: string = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookieString);
}

export function parseCookies(req: NextApiRequest): Record<string, string> {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookieString: string = req.headers?.cookie;
  return parse(cookieString || '');
}

export function getTokenCookie(req: NextApiRequest): string {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
}
