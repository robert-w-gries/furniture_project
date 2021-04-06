import { NextApiRequest, NextApiResponse } from "next";
import AirtableApi from "../../lib/airtable";

export default async function checkIn(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const email = req.query?.email as string;
    if (!email || Array.isArray(email)) {
      const error = new Error("Must provide email in request body");
      throw error;
    }

    const volunteerRecords = await AirtableApi.readTable("Volunteers")
      .select({
        fields: ["Name", "Email"],
        view: "All Volunteers",
      })
      .all();

    const volunteers = {};
    volunteerRecords.forEach((record) => {
      const recordEmail = record.get("Email");
      if (recordEmail) {
        volunteers[recordEmail] = record.id;
      }
    });

    const volunteerId = volunteers[email];
    if (!volunteerId) {
      throw new Error("Could not find volunteer associated with email");
    }
    res.status(200).send({ volunteerId });
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
}
