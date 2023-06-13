import { token } from "../../shared/token";

// const octokit = new Octokit({
//   auth: `${github_tokenPrefix}MnU9EyqQTz5ePvsBeCy0Z8NQb`,
// });

const graphQLHeader = new Headers();
graphQLHeader.append(
  "Authorization",
  `Bearer ghp_${"oatjtY6iYyg"}${token.github_api}`
);

export const githubGraphQLApi = (query: string): Promise<Response> => {
  return fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: graphQLHeader,
  });
};

export const githubReposApi = (
  repos: string,
  user: string = "pionpill"
): Promise<Response> => {
  return fetch(`https://api.github.com/repos/${user}/${repos}`, {
    method: "GET",
    headers: graphQLHeader,
  });
};

export const githubReposLangApi = (
  repos: string,
  user: string = "pionpill"
): Promise<Response> => {
  return fetch(`https://api.github.com/repos/${user}/${repos}/languages`, {
    method: "GET",
    headers: graphQLHeader,
  });
};
