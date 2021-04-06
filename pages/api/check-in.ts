import { NextApiRequest, NextApiResponse } from "next";
import Magic from "../../lib/auth/magic";
import { getUserFromSession } from "../../lib/auth/session";

export default async function checkIn(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const user = await getUserFromSession(req);
    const metadata = await Magic.users.getMetadataByIssuer(user.id);
    console.log(metadata);
    console.log(req.body?.selectedEvents);

    res.status(200).send({ done: true });
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
}
