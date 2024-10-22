import teamKeys from "./queryKeyFactories"
import * as Fetcher from "./fetcher"

export const createTeamOption = {
  key: teamKeys.createTeam,
  fn: Fetcher.createTeamRequest,
}
