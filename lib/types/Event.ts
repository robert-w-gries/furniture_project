export type EventStatus = "Past Event" | "In Progress" | "Upcoming Event";

export default interface Event {
  id: string;
  name?: string;
  datetime?: string;
  meetingLocation?: string;
  streetAddress?: string;
  status?: EventStatus;
  volunteers?: string[];
}
