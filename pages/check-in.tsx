import React, { useEffect, useState } from "react";
import { GetStaticPropsResult } from "next";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import AirtableApi from "../lib/airtable/api";
import useUser from "../lib/hooks/useUser";
import Event from "../lib/types/Event";
import Button from "../components/Button";
import { VOLUNTEER_SIGN_UP_LINK } from "../lib/airtable/utils";
import { openNewTab } from "../lib/utils";
import Card from "../components/Card";

type CheckInProps = {
  events: Event[];
};

const CheckIn = ({ events }: CheckInProps): JSX.Element => {
  const [user, isLoading] = useUser({ redirectTo: "/login" });
  const [volunteerId, setVolunteerId] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const [invalidUser, setInvalidUser] = useState(false);
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
          setVolunteerId(data.volunteerId);
        }
      })
      .catch(() => {
        setInvalidUser(true);
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

  if (invalidUser) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-semibold mb-2">Error</h1>
          <h2 className="text-2xl mb-10">{`Could not find email: ${user.email}`}</h2>
          <a
            className="text-2xl font-semibold"
            href={VOLUNTEER_SIGN_UP_LINK}
            onClick={(e) => openNewTab(e, VOLUNTEER_SIGN_UP_LINK)}
          >
            <Card>Click here to register</Card>
          </a>
        </div>
      </Layout>
    );
  }

  if (isLoading || !user || !volunteerId) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col justify-center items-center">
          <h1 className="text-2xl">Loading...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="w-3/4 p-8 shadow-xl border border-gray-200">
          <div className="flex flex-col items-center gap-8">
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
                <div key={event.id} className="w-full">
                  <div className="flex items-center gap-4 select-none">
                    <div className="flex-1">{event.name}</div>
                    <div className="flex-1">{date.toLocaleDateString()}</div>
                    <div className="flex-1">{time}</div>
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<CheckInProps>
> {
  let events: Event[] = [];
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
