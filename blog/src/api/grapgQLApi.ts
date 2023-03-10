import { token } from "../tokens/token";

const graphQLHeader = new Headers()
graphQLHeader.append('Authorization', `Bearer ghp_${"RFW9FsBzIHl2l"}${token.github_api}`)
export const graphQLUrl = "https://api.github.com/graphql";

const queryGraphQL = (query: string): Promise<Response> => {
  return fetch(graphQLUrl, {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: graphQLHeader,
  });
}

export default queryGraphQL;