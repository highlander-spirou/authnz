import { URLPattern } from "urlpattern-polyfill";

const indicators = {
  "/user/profile": "Profile",
  "/user/api-tokens": "API Tokens",
  "/teams/create": "Create Team",
  "/teams/*": "Team Settings",
  "/user/*": "User",
  "/user": "User",
  "/teams": "User",
  "/": "Dashboard",
};

export function findPageIndicator(url) {
  for (const i of Object.keys(indicators)) {
    const pattern = new URLPattern({ pathname: i });
    const testURL = "http://localhost" + url;
    if (pattern.test(testURL)) {
      return indicators[i];
    }
  }
  return null;
}
