import React, { useEffect, useState } from "react";
import { GetStaticPropsResult } from "next";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import AirtableApi from "../lib/airtable";
import useUser from "../lib/hooks/useUser";
import Event from "../lib/types/Event";
import Volunteer from "../lib/types/Volunteer";
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
  padding: 12px 20px;
  & > div[id="row"] {
    display: flex;
    align-items: center;
    gap: 10px;

    & > div[id="name"] {
      flex: 1;
    }
    & > div[id="datetime"] {
      flex: 1;
    }
  }
`;

type CheckInProps = {
  events: Event[];
};

const CheckIn = ({ events }: CheckInProps): JSX.Element => {
  const [user, isLoading] = useUser({ redirectTo: "/login" });
  const [volunteerId, setVolunteerId] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      return;
    }
    fetch(`/api/volunteerId?email=${user.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data?.volunteerId) {
          console.log(data.volunteerId);
          setVolunteerId(data.volunteerId);
        }
      })
      .catch(() => {
        setErrorMsg("Could not retreive volunteer id");
      });
  }, [user]);

  const handleSubmit = async (eventId: string, isCheckedIn: boolean) => {
    if (errorMsg) {
      setErrorMsg("");
    }

    try {
      const res = await fetch("/api/checkIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          volunteerId,
          action: isCheckedIn ? "unregister" : "register",
        }),
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

  if (isLoading || !user) {
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
          const isCheckedIn = Boolean(
            event.volunteers.find((v) => v === volunteerId)
          );
          return (
            <CheckInCard key={event.id}>
              <div id="row">
                <div id="name">{event.name}</div>
                <div id="datetime">{date.toLocaleDateString()}</div>
                <div id="datetime">{time}</div>
                <div>
                  <Button
                    color="grey"
                    onEnter={() => handleSubmit(event.id, isCheckedIn)}
                    onClick={() => handleSubmit(event.id, isCheckedIn)}
                  >
                    {isCheckedIn ? "Unregister" : "Register"}
                  </Button>
                </div>
              </div>
              {errorMsg && <div>{`Error: ${errorMsg}`}</div>}
            </CheckInCard>
          );
        })}
      </EventList>
    </Layout>
  );
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<CheckInProps>
> {
  let events: Event[] = [];
  let volunteers: Volunteer[] = [];
  try {
    const eventRecords = await AirtableApi.readTable("Events")
      .select({
        fields: ["Name", "Datetime", "Volunteers"],
        view: "Upcoming Events",
        sort: [{ field: "Datetime" }],
        maxRecords: 4,
      })
      .all();

    events = eventRecords.map((record) => ({
      id: record.id,
      name: record.get("Name"),
      datetime: record.get("Datetime"),
      volunteers: record.get("Volunteers") || [],
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

export default CheckIn;
