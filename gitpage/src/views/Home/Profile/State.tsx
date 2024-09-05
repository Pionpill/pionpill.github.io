import { Skeleton, Typography } from "@mui/material";
import { blueGrey, grey, teal } from "@mui/material/colors";
import { HeatmapChart } from "echarts/charts";
import {
  CalendarComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { ECBasicOption } from "echarts/types/dist/shared";
import $ from "jquery";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { githubGraphQLApi } from "../../../api/github/githubApi";
import { queryDailyAndTotalContributionCount } from "../../../api/github/graphQL/pionpill";
import EChart from "../../../components/EChart";
import FlexBox from "../../../components/FlexBox";
import Wrapper from "../../../components/Wrapper";
import { useSmallMedia } from "../../../hooks/useMedia";
import useThemeChoice from "../../../hooks/useThemeChoice";
import { homeTheme } from "../../../styles/theme";
import { formatDateToGraphQL } from "../../../utils/date";

type DataStateProps = {
  data: string;
  annotationI8nKey: string;
  unit?: 'day' | 'week';
};

const DataState: React.FC<DataStateProps> = ({
  data,
  annotationI8nKey,
  unit = 'day',
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
              unit === "day"
                ? "home-profile.workingDay"
                : "home-profile.week"
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

const CalendarHeatmapChart: React.FC<{
  isSmallMedia: boolean;
  options: ECBasicOption;
}> = ({ isSmallMedia, options }) => {
  return (
    <FlexBox
      sx={{
        maxWidth: isSmallMedia ? "170px" : "1000px",
        minWidth: isSmallMedia ? "170px" : "1000px",
        height: isSmallMedia ? "820px" : "250px",
      }}
    >
      <EChart
        options={options}
        components={[
          TitleComponent,
          TooltipComponent,
          CanvasRenderer,
          HeatmapChart,
          VisualMapComponent,
          CalendarComponent,
        ]}
      />
    </FlexBox>
  );
};

const State: React.FC = () => {
  const isSmallMedia = useSmallMedia();
  const textColor = useThemeChoice(grey[800], grey[100]);
  const bgColor = useThemeChoice(grey[600], grey[900]);
  const { t } = useTranslation();
  const wakaTimeItemColorArray: Array<string> = useThemeChoice(
    [grey[50], blueGrey[300], blueGrey[500], blueGrey[700], blueGrey[900]],
    [
      grey[900],
      blueGrey[800],
      blueGrey[600],
      blueGrey[400],
      blueGrey[200],
      blueGrey[50],
    ]
  );
  const githubItemColorArray: Array<string> = useThemeChoice(
    [grey[50], teal[300], teal[500], teal[700], teal[900]],
    [grey[900], teal[800], teal[600], teal[400], teal[200], teal[50]]
  );

  const [wakaTimeOptions, setWakaTimeOptions] = React.useState<any>(null);
  const [githubOptions, setGithubOptions] = React.useState<any>(null);
  const [annualCodingMinutes, setAnnualCodingMinutes] =
    React.useState<number>(0);
  const [annualContribution, setAnnualContribution] = React.useState<number>(0);

  const setTitle = (text: string): Object => {
    return {
      top: 30,
      left: "center",
      text: text,
      textStyle: {
        color: textColor,
      },
    };
  };
  const setVisualMap = (
    max: number,
    colorArray: Array<string>,
    textColor: string
  ) => {
    return {
      min: 0,
      max: max,
      type: "continuous",
      orient: "horizontal",
      calculable: true,
      realtime: true,
      right: isSmallMedia ? "center" : "0%",
      bottom: "0",
      inRange: {
        symbol: "circle",
        color: colorArray,
      },
      outOfRange: {
        symbol: "circle",
        color: "#000",
      },
      textStyle: {
        color: textColor,
      },
    };
  };
  const setCalendar = (startDate: string, endDate: string) => {
    return {
      top: isSmallMedia ? 120 : 85,
      left: isSmallMedia ? "center" : "auto",
      right: isSmallMedia ? "auto" : "0",
      orient: isSmallMedia ? "vertical" : "horizontal",
      width: isSmallMedia ? 110 : 900,
      cellSize: isSmallMedia ? 12 : 14,
      range: [startDate, endDate],
      splitLine: {
        lineStyle: {
          color: textColor,
        },
      },
      itemStyle: {
        borderWidth: 1,
        borderCap: "round",
        borderColor: bgColor,
      },
      dayLabel: {
        color: textColor,
      },
      monthLabel: {
        color: textColor,
      },
    };
  };
  const setSeries = (data: Object): Object => {
    return {
      type: "heatmap",
      coordinateSystem: "calendar",
      data: data,
    };
  };

  const initGithubContributions = () => {
    const now = new Date();
    const startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    const query = queryDailyAndTotalContributionCount(
      formatDateToGraphQL(startDate)
    );
    githubGraphQLApi(query)
      .then((response) => response.json())
      .then((data: any) => {
        const contributionCalendar =
          data.data.user.contributionsCollection.contributionCalendar;
        setAnnualContribution(contributionCalendar.totalContributions);
        let realData: Array<Array<string>> = [];
        for (const week of contributionCalendar.weeks) {
          for (const day of week.contributionDays) {
            realData.push([day.date, day.contributionCount]);
          }
        }
        const startDate = realData[0][0];
        const endDate = realData[realData.length - 1][0];
        const realGithubTableOptions = {
          title: setTitle(t("home-profile.githubFrequency")),
          tooltip: {
            formatter: (params: any) => {
              return `${params.value[0]} ${params.value[1]} 次`;
            },
          },
          visualMap: setVisualMap(8, githubItemColorArray, textColor),
          calendar: setCalendar(startDate, endDate),
          series: setSeries(realData),
        };
        setGithubOptions(realGithubTableOptions);
      });
  };
  const initWakaTimeCodingTime = () => {
    $.ajax({
      type: "GET",
      url: "https://wakatime.com/share/@pionpill/ccb466e3-bddf-4c35-a775-0a57fc221313.json",
      dataType: "jsonp",
      success: (response: any) => {
        let totalMinutes: number = 0;
        let realData: Array<Array<string>> = response.days.map((item: any) => {
          totalMinutes += item.total / 60;
          return [item.date, (item.total / 3600).toPrecision(3)];
        });
        setAnnualCodingMinutes(totalMinutes);
        const startDate = realData[0][0];
        const endDate = realData[realData.length - 1][0];
        const realWakatimeTableOptions = {
          title: setTitle(t("home-profile.codingFrequency")),
          tooltip: {
            formatter: (params: any) => {
              return `${params.value[0]} <br/> ${parseInt(
                params.value[1]
              )} h ${parseInt(
                String(
                  (Number(params.value[1]) - parseInt(params.value[1])) * 60
                )
              )} min`;
            },
          },
          visualMap: setVisualMap(12, wakaTimeItemColorArray, textColor),
          calendar: setCalendar(startDate, endDate),
          series: setSeries(realData),
        };
        setWakaTimeOptions(realWakatimeTableOptions);
      },
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
        {wakaTimeOptions ? (
          <CalendarHeatmapChart
            options={wakaTimeOptions}
            isSmallMedia={isSmallMedia}
          />
        ) : (
          <Skeleton variant="rectangular" width="100%" height="200px" />
        )}
        {githubOptions ? (
          <CalendarHeatmapChart
            options={githubOptions}
            isSmallMedia={isSmallMedia}
          />
        ) : (
          <Skeleton variant="rectangular" width="100%" height="200px" />
        )}
      </FlexBox>
    </Wrapper>
  );
};

export default State;
