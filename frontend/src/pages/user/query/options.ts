import queryClient from "@/query-client";
import {
  fetchUserInfo,
  changeUserInfo,
  changeUserEmail,
  changeUserPwd,
} from "./fetcher";
import userKeys from "./queryKeyFactory";

if (!import.meta.env.VITE_REACT_ROUTER_STALE_TIME) {
  throw new Error("No environment variable: REACT_ROUTER_STALE_TIME");
}

export const getUserOption = () => ({
  queryKey: userKeys.all,
  queryFn: () => fetchUserInfo(),
  staleTime: +import.meta.env.VITE_REACT_ROUTER_STALE_TIME,
});

export const updateUserOption = () => ({
  mutationFn: (payload) => changeUserInfo(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userKeys.all });
    return true;
  },
});

export const updateEmailOption = () => ({
  mutationFn: (payload) => changeUserEmail(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userKeys.all });
    return true;
  },
});

export const updatePasswordOption = () => ({
  mutationFn: (payload) => changeUserPwd(payload),
});
