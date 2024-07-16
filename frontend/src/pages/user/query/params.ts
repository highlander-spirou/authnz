import queryClient from "@/query-client";
import { fetchUserInfo, changeUserInfo } from "./fetcher";
import userKeys from "./queryKeyFactory";

if (!import.meta.env.VITE_REACT_ROUTER_STALE_TIME) {
  throw new Error("No environment variable: REACT_ROUTER_STALE_TIME");
}

export const getUserParams = () => ({
  queryKey: userKeys.all,
  queryFn: () => fetchUserInfo(),
  staleTime: +import.meta.env.VITE_REACT_ROUTER_STALE_TIME,
});

export const updateUserParams = () => ({
  mutationFn: (payload) => changeUserInfo(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userKeys.all });
    return true
  },
});
