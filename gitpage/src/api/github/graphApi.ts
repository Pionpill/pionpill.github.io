import { token } from "../../shared/token";
import { formatDateToGraphQL } from "../../utils/date";

const authHeader = new Headers();
authHeader.append(
  "Authorization",
  `Bearer ghp_${"oatjtY6iYyg"}${token.github_api}`
);

const githubGraphQLApi = (query: string): Promise<Response> => {
  return fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: authHeader,
  });
};

/** 获取 github 从 date 到现在 commit 记录 */
export const githubGQLContributionApi = (date?: Date) => {
  if (!date) {
    const now = new Date();
    date = new Date(now.setFullYear(now.getFullYear() - 1));
  }
  const query = `
    query {
      user(login: "pionpill") {
        contributionsCollection(from: "${formatDateToGraphQL(date)}") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;
  return githubGraphQLApi(query);
};

/** 获取某个仓库从 date 到现在的commit信息 */
export const githubGQLReposLastDateCommitApi = (repos: string, date?: Date) => {
  if (!date) {
    const now = new Date();
    date = new Date(now.setFullYear(now.getFullYear() - 1));
  }
  const query = `
    {
      repository(owner: "pionpill", name: "${repos}") {
        defaultBranchRef {
          target {
            ... on Commit {
              history(since: "${formatDateToGraphQL(date)}") {
                edges {
                  node {
                    committedDate
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  return githubGraphQLApi(query);
};

/** 获取某个仓库使用的语言信息 */
export const githubGQLReposLanguageApi = (repos: string, count?: number) => {
  const query = `
    {
      repository(owner: "pionpill", name: "${repos}") {
        languages(first: ${count || 10}) {
          edges {
            node {
              name
            }
            size
          }
        }
      }
    }
  `;
  return githubGraphQLApi(query);
};
