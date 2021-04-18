export default interface Volunteer {
  id: string;
  name?: string;
  email?: string;
  phone_number?: string;
  hasTruck?: boolean;
  status?: string;
  isInactive?: boolean;
  eventIds?: string[];
  waiver?: Blob;
  needsWaiver?: boolean;
  isAdmin?: boolean;
}
