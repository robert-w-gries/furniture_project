import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import { User } from "../types/User";

type ResponseData = {
  user?: User | null;
};

const fetchUser = async (url: string): Promise<ResponseData> => {
  return fetch(url)
    .then((response) => response.json())
    .then((data: ResponseData) => data || { user: null });
};

interface UserHookProps {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export default function useUser({
  redirectTo,
  redirectIfFound,
}: UserHookProps): User {
  const router = useRouter();
  const { data, error } = useSWR("/api/user", fetchUser);
  const user = data?.user || null;
  const finished = Boolean(data);
  const hasUser = Boolean(user);
  const shouldRedirect =
    Boolean(redirectTo) && Boolean(redirectIfFound) === hasUser;

  useEffect(() => {
    if (finished && shouldRedirect) {
      router.push(redirectTo);
    }
  }, [redirectTo, shouldRedirect, finished, router]);

  return error ? null : user;
}
