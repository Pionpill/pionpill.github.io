export const queryDailyAndTotalContributionCount = (date: string): string => {
  return `
    query {
      user(login: "pionpill") {
        contributionsCollection(from: "${date}") {
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
};
