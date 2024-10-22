if (!import.meta.env.VITE_REACT_ROUTER_STALE_TIME) {
  throw new Error("No environment variable: REACT_ROUTER_STALE_TIME")
}

if (!import.meta.env.VITE_MFA_TOKEN_STALE_TIME) {
  throw new Error("No environment variable: MFA_TOKEN_STALE_TIME")
}

if (!import.meta.env.VITE_SERVER_URL) {
  throw new Error("No environment variable: SERVER_URL")
}

export default {
  REACT_ROUTER_STALE_TIME: +import.meta.env.VITE_REACT_ROUTER_STALE_TIME,
  MFA_TOKEN_STALE_TIME: +import.meta.env.VITE_MFA_TOKEN_STALE_TIME,
  SERVER_URL: import.meta.env.VITE_SERVER_URL,
}