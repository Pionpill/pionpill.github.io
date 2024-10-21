import { Typography } from "@mui/material";
import { interpolatePurples } from "d3-scale-chromatic";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { githubGQLContributionApi } from "../../../api/github/graphApi";
import { wakatimeLastYearContributionApi } from "../../../api/wakatimeApi";
import CalendarChart from "../../../components/d3/CalendarChart";
import FlexBox from "../../../components/FlexBox";
import Wrapper from "../../../components/Wrapper";
import { useSmallMedia } from "../../../hooks/useMedia";
import useThemeChoice from "../../../hooks/useThemeChoice";
import { homeTheme } from "../../../styles/theme";

type DataStateProps = {
  data: string;
  annotationI8nKey: string;
  unit?: "day" | "week";
};

const DataState: React.FC<DataStateProps> = ({
  data,
  annotationI8nKey,
  unit = "day",
}) => {
  return (
    <FlexBox sx={{ color: "text.primary", flexDirection: "column" }}>
      <FlexBox sx={{ alignItems: "flex-end" }}>
        <Typography variant="h5" fontWeight="fontWeightBold">
          {data}
        </Typography>
        &nbsp;
        <Typography variant="caption" sx={{ opacity: 0.5 }}>
          /
          <Trans
            i18nKey={
              unit === "day" ? "home-profile.workingDay" : "home-profile.week"
            }
          />
        </Typography>
      </FlexBox>
      <Typography color="text.secondary">
        <Trans i18nKey={annotationI8nKey} />
      </Typography>
    </FlexBox>
  );
};

const State: React.FC = () => {
  const isSmallMedia = useSmallMedia();
  const { t } = useTranslation();
  const darkMode = useThemeChoice(false, true);

  const [wakaTimeData, setWakaTimeData] = React.useState<
    Array<{ date: Date; value: number }>
  >(null!);
  const [githubData, setGithubData] = React.useState<
    Array<{ date: Date; value: number }>
  >(null!);
  const [annualCodingMinutes, setAnnualCodingMinutes] =
    React.useState<number>(0);
  const [annualContribution, setAnnualContribution] = React.useState<number>(0);

  const initGithubContributions = () => {
    githubGQLContributionApi()
      .then((response) => response.json())
      .then((data: any) => {
        const contributionCalendar =
          data.data.user.contributionsCollection.contributionCalendar;
        setAnnualContribution(contributionCalendar.totalContributions);
        let realData: Array<{ date: Date; value: number }> = [];
        for (const week of contributionCalendar.weeks) {
          for (const day of week.contributionDays) {
            realData.push({
              date: new Date(day.date),
              value: day.contributionCount,
            });
          }
        }
        setGithubData(realData);
      });
  };
  const initWakaTimeCodingTime = () => {
    wakatimeLastYearContributionApi()
      .then((response) => {
        if (!response.ok) return;
        return response.json();
      })
      .then((data) => {
        let totalMinutes = 0;
        const result = data.days.map(
          (item: { date: string; total: number }) => {
            totalMinutes += item.total / 60;
            return {
              date: new Date(item.date),
              value: Math.round(item.total / 360) / 10,
            };
          }
        );
        setAnnualCodingMinutes(totalMinutes);
        setWakaTimeData(result);
      });
  };

  React.useEffect(() => {
    initGithubContributions();
    initWakaTimeCodingTime();
  }, []);

  return (
    <Wrapper
      bgcolor="background.default"
      sx={{ justifyContent: "space-between", width: "100%" }}
    >
      <FlexBox
        sx={{
          flexWrap: "wrap",
          width: "100%",
          justifyContent: "space-between",
          alignContent: "center",
        }}
        gap={3}
      >
        <Typography
          variant="h5"
          fontStyle="italic"
          fontWeight="fontWeightBold"
          color={homeTheme[700]}
        >
          —— <Trans i18nKey="home-profile.stateTitle" />
        </Typography>
        <FlexBox gap={3}>
          <DataState
            data={`${((annualContribution / 250) * 7).toPrecision(2)}`}
            annotationI8nKey="home-profile.githubFrequency"
            unit="week"
          />
          <DataState
            data={`${(annualCodingMinutes / (250 * 60)).toPrecision(2)} h`}
            annotationI8nKey="home-profile.codingFrequency"
          />
        </FlexBox>
      </FlexBox>
      <FlexBox
        sx={{
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
        gap={2}
      >
        <CalendarChart
          data={wakaTimeData}
          darkMode={darkMode}
          vertical={isSmallMedia}
          title={t("home-profile.codingFrequency")!}
          hoverTextFn={(item) =>
            `${item.date.toLocaleDateString()}: ${item.value}h`
          }
        />
        <CalendarChart
          data={githubData}
          darkMode={darkMode}
          vertical={isSmallMedia}
          title={t("home-profile.githubFrequency")!}
          maxValue={10}
          hoverTextFn={(item) =>
            `${item.date.toLocaleDateString()}: ${item.value}次`
          }
          colorMapFn={() => interpolatePurples}
        />
      </FlexBox>
    </Wrapper>
  );
};

export default State;
