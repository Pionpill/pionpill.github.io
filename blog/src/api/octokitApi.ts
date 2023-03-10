import { Octokit } from "@octokit/rest";
import { token } from "../tokens/token";

const octokitApi = new Octokit({
  auth: token.github_api,
});

export default octokitApi;