import Airtable from "airtable";
import Table from "airtable/lib/table";
import Magic from "../auth/magic";

const readBase = new Airtable({
  apiKey: process.env.AIRTABLE_READ_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

const writeBase = new Airtable({
  apiKey: process.env.AIRTABLE_WRITE_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

const isAdmin = (didToken: string) => {
  // TODO: use didToken to get email and see if it's in Airtable
  return false;
};

const writeTable = async (
  tableName: string,
  issuer: string
): Promise<Table> => {
  // ensure actual user is associated with the call
  await Magic.users.getMetadataByIssuer(issuer);
  return writeBase(tableName);
};

const API = {
  isAdmin,
  writeTable,
  readTable: (tableName: string): Table => readBase(tableName),
};

export default API;
