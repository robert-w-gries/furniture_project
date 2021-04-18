import { NextApiRequest, NextApiResponse } from "next";
import AirtableApi from "../../lib/airtable";
import Magic from "../../lib/auth/magic";
import { getUserFromSession } from "../../lib/auth/session";

export default async function checkIn(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { eventId, action, volunteerId } = req.body || {};
    if (!eventId || !action || !volunteerId) {
      throw new Error("Request must have eventId and action provided.");
    }

    // get user session for later authentication
    const user = await getUserFromSession(req);

    const eventRecord = await AirtableApi.readTable("Events").find(eventId);
    const prevVolunteers = eventRecord.get("Volunteers") || [];

    let newVolunteers;
    if (action === "unregister") {
      newVolunteers = prevVolunteers.filter((id) => id !== volunteerId);
    } else if (action === "register") {
      newVolunteers = [...prevVolunteers, volunteerId];
    } else {
      throw new Error("Invalid action");
    }

    const writableEvents = await AirtableApi.writeTable("Events", user.id);
    await writableEvents.update([
      {
        id: eventId,
        fields: {
          Volunteers: newVolunteers,
        },
      },
    ]);

    res.status(200).send({ done: true });
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
}
