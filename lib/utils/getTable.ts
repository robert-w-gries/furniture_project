import Airtable from 'airtable';
import Table from 'airtable/lib/table';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

type TableCache = {
  [key: string]: Table,
};

const tableCache: TableCache = {};

export default function getTable(tableName: string): Table {
  if (tableCache[tableName]) {
    return tableCache[tableName];
  }
  tableCache[tableName] = base(tableName);
  return tableCache[tableName];
}
