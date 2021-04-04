import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromSession } from "../../lib/auth/session";

export default async function user(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const user = await getUserFromSession(req);
  res.status(200).json({ user });
}
