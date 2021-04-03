import { NextApiRequest, NextApiResponse } from 'next';
import Magic from '../../lib/auth/magic';
import { createSession } from '../../lib/auth/session';

export default async function login(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const didToken = req.headers.authorization.substr(7);
    const metadata = await Magic.users.getMetadataByToken(didToken);
    await createSession(res, { email: metadata.email, id: metadata.issuer });

    res.status(200).send({ done: true });
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
}