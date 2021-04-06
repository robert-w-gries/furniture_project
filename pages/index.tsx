import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Card from "../components/Card";
import Layout from "../components/Layout";
import EventData from "../lib/types/Event";
import AirtableApi from "../lib/airtable";
import { GetStaticPropsResult } from "next";

const VOLUNTEER_SIGN_UP_LINK = "https://airtable.com/shrdNGOki2dxxU6zy";

const EventList = styled.div`
  display: flex;
  flex-flow: wrap;
  gap: 15px;

  @media (max-width: 600px) {
    flex-flow: column;
    & > * {
      margin-right: 0;
      margin-bottom: 20px;
    }
  }
`;

const LinkWrapper = styled.a`
  &:hover,
  &:focus,
  &:active {
    color: #0070f3;
    border-color: #0070f3;
    cursor: pointer;
  }
`;

const LinkButton = styled(LinkWrapper)`
  font-size: 1.25rem;
  border: 1px solid black;
  padding: 14px 24px;
  border-radius: 5px;
  text-align: center;
`;

const EventCardStyled = styled(Card)`
  width: 200px;
  padding: 20px 32px;
  border-radius: 10px;
`;

const Section = styled.div`
  display: flex;
  flex-flow: column;
  margin-bottom: 2rem;
`;

const openNewTab = (event: React.MouseEvent, link: string) => {
  event.preventDefault();
  window.open(link, "_blank", "noopener");
};

const EventCard = ({ event }: { event: EventData }) => {
  const date = new Date(event.datetime);
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <EventCardStyled>
      <h3>{`${date.toLocaleDateString()} at ${time}`}</h3>
      <p>{event.name}</p>
      <p>{`${event.volunteers.length} volunteer${
        event.volunteers.length !== 1 ? "s" : ""
      }`}</p>
    </EventCardStyled>
  );
};

type HomePageProps = {
  events: EventData[];
};

export default function Home({ events }: HomePageProps): JSX.Element {
  return (
    <Layout>
      <Section>
        <h2>Interested in joining the Furniture Project?</h2>
        <LinkButton
          href={VOLUNTEER_SIGN_UP_LINK}
          onClick={(e) => openNewTab(e, VOLUNTEER_SIGN_UP_LINK)}
        >
          Sign Up Now
        </LinkButton>
      </Section>

      <Section>
        <h2>Upcoming Events</h2>
        <EventList>
          {events.map((event) => (
            <Link
              key={event.id}
              href="/event/[id]"
              as={`/event/${event.id}`}
              passHref
            >
              <LinkWrapper>
                <EventCard event={event} />
              </LinkWrapper>
            </Link>
          ))}
        </EventList>
      </Section>
    </Layout>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<HomePageProps>
> {
  let events: EventData[] = [];
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
