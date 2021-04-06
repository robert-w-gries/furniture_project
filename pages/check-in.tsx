import React, { useState } from "react";
import { GetStaticPropsResult } from "next";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import AirtableApi from "../lib/airtable";
import useUser from "../lib/hooks/useUser";
import EventData from "../lib/types/Event";
import styled from "styled-components";
import Card from "../components/Card";
import Button from "../components/Button";

const EventList = styled.div`
  display: flex;
  flex-flow: column;
  gap: 20px;
  width: 100%;
  max-width: 600px;
`;

const CheckInCard = styled(Card)`
  display: flex;
  padding: 12px 20px;
  gap: 10px;

  & > *[id="name"] {
    flex: 1;
  }
`;

const SubmitSection = styled.div`
  margin-top: 20px;
`;

type CheckInProps = {
  events: EventData[];
};

const CheckIn = ({ events }: CheckInProps): JSX.Element => {
  const [user, isLoading] = useUser({ redirectTo: "/login" });
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const router = useRouter();

  const handleChange = (selectedId: string, exists: boolean) => {
    if (exists) {
      setSelectedEvents((prev) => prev.filter((id) => id !== selectedId));
    } else {
      setSelectedEvents((prev) => [...prev, selectedId]);
    }
  };

  const handleSubmit = async () => {
    if (errorMsg) {
      setErrorMsg("");
    }

    try {
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedEvents }),
      });
      if (res.status === 200) {
        router.reload();
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <h1>Loading...</h1>
      </Layout>
    );
  }
  return (
    <Layout>
      <EventList>
        {events.map((event) => {
          const date = new Date(event.datetime);
          const time = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const checked = selectedEvents.indexOf(event.id) >= 0;
          return (
            <CheckInCard key={event.id}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleChange(event.id, checked)}
              />
              <div id="name">{event.name}</div>
              <div>{date.toLocaleDateString()}</div>
              <div>{time}</div>
            </CheckInCard>
          );
        })}
      </EventList>
      <SubmitSection>
        <Button onClick={handleSubmit}>Submit</Button>
        {errorMsg && <p>{errorMsg}</p>}
      </SubmitSection>
    </Layout>
  );
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<CheckInProps>
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
};

export default CheckIn;
