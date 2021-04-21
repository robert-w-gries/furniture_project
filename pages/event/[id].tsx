import React, { ReactNode } from "react";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { useRouter } from "next/dist/client/router";
import { ParsedUrlQuery } from "querystring";
import Layout from "../../components/Layout";
import Event from "../../lib/types/Event";
import AirtableApi from "../../lib/airtable/api";

type LabeledElementProps = {
  children?: React.ReactNode;
  label: string;
};

const LabeledElement = ({ children, label }: LabeledElementProps) => (
  <div className="flex w-full my-4">
    <h2 className="flex-1 w-1/3 font-semibold text-lg">{label}</h2>
    <div className="flex-1">{children}</div>
  </div>
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
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="flex flex-col items-center w-3/4 p-8 rounded-md shadow-lg border border-gray-200">
          <h2 className="text-xl mb-4">{event.name}</h2>
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
        </div>
      </div>
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
