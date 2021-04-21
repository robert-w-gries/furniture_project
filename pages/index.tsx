import React from "react";
import Link from "next/link";
import Card from "../components/Card";
import Layout from "../components/Layout";
import Event from "../lib/types/Event";
import AirtableApi from "../lib/airtable";
import { GetStaticPropsResult } from "next";

const VOLUNTEER_SIGN_UP_LINK = "https://airtable.com/shrdNGOki2dxxU6zy";

const openNewTab = (event: React.MouseEvent, link: string) => {
  event.preventDefault();
  window.open(link, "_blank", "noopener");
};

const EventCard = ({ event }: { event: Event }) => {
  const date = new Date(event.datetime);
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return (
    <Card>
      <h3>{`${date.toLocaleDateString()} at ${time}`}</h3>
      <p>{event.name}</p>
      <p>{`${event.volunteers.length} volunteer${
        event.volunteers.length !== 1 ? "s" : ""
      }`}</p>
    </Card>
  );
};

const Section = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className="flex flex-col my-8 justify-center">
    <h2 className="text-2xl text-center select-none mb-4">{title}</h2>
    {children}
  </div>
);

type HomePageProps = {
  events: Event[];
};

export default function Home({ events }: HomePageProps): JSX.Element {
  return (
    <Layout>
      <Section title="Interested in joining the Furniture Project?">
        <a
          className="self-center w-full text-lg"
          href={VOLUNTEER_SIGN_UP_LINK}
          onClick={(e) => openNewTab(e, VOLUNTEER_SIGN_UP_LINK)}
        >
          <Card>Sign Up Now</Card>
        </a>
      </Section>

      <Section title="Upcoming Events">
        <div className="flex flex-col gap-2 md:flex-row">
          {events.map((event) => (
            <Link
              key={event.id}
              href="/event/[id]"
              as={`/event/${event.id}`}
              passHref
            >
              <a href="placeholder">
                <EventCard event={event} />
              </a>
            </Link>
          ))}
        </div>
      </Section>
    </Layout>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<HomePageProps>
> {
  let events: Event[] = [];
  try {
    const eventRecords = await AirtableApi.readTable("Events")
      .select({
        fields: ["Name", "Datetime", "Name (from Volunteers)"],
        view: "Upcoming Events",
        sort: [{ field: "Datetime" }],
        maxRecords: 4,
      })
      .all();

    events = eventRecords.map((record) => ({
      id: record.id,
      name: record.get("Name"),
      datetime: record.get("Datetime"),
      volunteers: record.get("Name (from Volunteers)") || [],
    }));
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      events,
    },
    revalidate: 1,
  };
}
