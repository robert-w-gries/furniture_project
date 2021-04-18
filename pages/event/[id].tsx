import React from "react";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import { ParsedUrlQuery } from "querystring";
import styled from "styled-components";
import Card from "../../components/Card";
import Layout from "../../components/Layout";
import Event from "../../lib/types/Event";
import AirtableApi from "../../lib/airtable";

const EventInfo = styled.div`
  display: flex;
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
`;

const InfoSection = styled.div`
  margin-bottom: 14px;
`;

const EventDetailsCard = styled(Card)`
  margin: 0;
  margin-right: 12px;
  padding: 4rem 8rem;
`;

type LabeledElementProps = {
  children?: React.ReactNode;
  label: string;
};

const LabeledElement = ({ children, label }: LabeledElementProps) => (
  <InfoSection>
    <Label>{label}</Label>
    <div>{children}</div>
  </InfoSection>
);

type EventPageProps = {
  event: Event;
};

export default function EventPage({ event }: EventPageProps): JSX.Element {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return (
      <Layout>
        <h1>Loading...</h1>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <h1>Could not find event</h1>
        <p>This event has either expired or been removed.</p>
      </Layout>
    );
  }

  const date = new Date(event.datetime);
  return (
    <Layout>
      <EventInfo>
        <EventDetailsCard>
          <h2>{event.name}</h2>
          <LabeledElement label="Date">
            {date.toLocaleDateString()}
          </LabeledElement>
          <LabeledElement label="Time">
            {date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </LabeledElement>
          <LabeledElement label="Volunteers">
            {event.volunteers.map((volunteer) => (
              <div key={volunteer}>{volunteer}</div>
            ))}
          </LabeledElement>
        </EventDetailsCard>
        <Image
          src="/meetup_location.png"
          alt="Coordinates: 36.0199722,-78.9075955"
          width={720}
          height={600}
        />
      </EventInfo>
    </Layout>
  );
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<Params>): Promise<
  GetStaticPropsResult<EventPageProps>
> {
  let event: Event = null;
  try {
    const eventRecord = await AirtableApi.readTable("Events").find(params.id);
    event = {
      id: eventRecord.id,
      name: eventRecord.get("Name"),
      datetime: eventRecord.get("Datetime"),
      volunteers: eventRecord.get("Name (from Volunteers)") || [],
    };
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      event,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  return {
    paths: [],
    fallback: true,
  };
}
