import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Card from "../components/Card";
import Layout from "../components/Layout";
import EventData from "../lib/types/Event";
import getTable from "../lib/utils/getTable";
import { GetStaticPropsResult } from "next";

const VOLUNTEER_SIGN_UP_LINK = "https://airtable.com/shrCXvV11fqdUZSYz";

const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const BaseLink = styled.a`
  &:hover,
  &:focus,
  &:active {
    color: #0070f3;
    border-color: #0070f3;
    cursor: pointer;
  }
`;

const LinkButton = styled(BaseLink)`
  font-size: 1.25rem;
  border: 1px solid black;
  padding: 14px 24px;
  border-radius: 5px;
  text-align: center;
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
        <Grid>
          {events.map((event) => (
            <Link
              key={event.id}
              href="/event/[id]"
              as={`/event/${event.id}`}
              passHref
            >
              <BaseLink>
                <Card title={new Date(event.datetime).toLocaleDateString()}>
                  <p>{event.name}</p>
                  <p>{`${event.volunteers.length} ${
                    event.volunteers.length === 1 ? "volunteer" : "volunteers"
                  }`}</p>
                </Card>
              </BaseLink>
            </Link>
          ))}
        </Grid>
      </Section>
    </Layout>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<HomePageProps>
> {
  let events: EventData[] = [];
  try {
    const eventRecords = await getTable("Events")
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
