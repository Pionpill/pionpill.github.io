import { token } from "../../shared/token";

const authHeader = new Headers();
authHeader.append(
  "Authorization",
  `Bearer ghp_${"NyAFX9Uivyw"}${token.github_api}`
);

export const githubReposApi = (
  repos: string,
  user: string = "pionpill"
): Promise<Response> => {
  return fetch(`https://api.github.com/repos/${user}/${repos}`, {
    method: "GET",
    headers: authHeader,
  });
};

export const githubReposLangApi = (
  repos: string,
  user: string = "pionpill"
): Promise<Response> => {
  return fetch(`https://api.github.com/repos/${user}/${repos}/languages`, {
    method: "GET",
    headers: authHeader,
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
      headers: authHeader
    }
  );
};

export const githubReposCommitByWeekApi = (
  repos: string,
  user?: string
): Promise<Response> => {
  return fetch(
    `https://api.github.com/repos/${user || 'pionpill'}/${repos}/stats/commit_activity`,
    {
      method: "GET",
      headers: authHeader,
    }
  );
};

export const blogContentApi = (path: string) =>
  githubReposContentApi("pionpill.github.io", "Pionpill", path);

export const githubReposCommitApi = (
  repos: string,
  user: string,
  path?: string
): Promise<Response> => {
  return fetch(
    `https://api.github.com/repos/${user}/${repos}/commits?${path ? `path=${path}` : ''}`,
    {
      method: "GET",
      headers: authHeader,
    }
  );
};

export const blogCommitApi = (path: string) =>
  githubReposCommitApi("pionpill.github.io", "Pionpill", path);
