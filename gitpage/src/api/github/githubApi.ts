import { token } from "../../shared/token";

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

export const githubReposContentApi = (
  repos: string,
  user: string,
  path: string
): Promise<Response> => {
  return fetch(
    `https://api.github.com/repos/${user}/${repos}/contents/${path}`,
    {
      method: "GET",
      headers: graphQLHeader,
    }
  );
};

export const blogContentApi = (path: string) =>
  githubReposContentApi("pionpill.github.io", "Pionpill", path);

export const githubReposCommitApi = (
  repos: string,
  user: string,
  path: string
): Promise<Response> => {
  return fetch(
    `https://api.github.com/repos/${user}/${repos}/commits?path=${path}`,
    {
      method: "GET",
      headers: graphQLHeader,
    }
  );
};

export const blogCommitApi = (path: string) =>
  githubReposCommitApi("pionpill.github.io", "Pionpill", path);
