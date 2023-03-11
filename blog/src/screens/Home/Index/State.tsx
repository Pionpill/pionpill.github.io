import { darken } from "polished";
import React, { ReactNode } from "react";
import { SiGithub, SiWakatime } from "react-icons/si";
import styled from "styled-components";
import queryGraphQL from "../../../api/grapgQLApi";
import A from "../../../components/A";
import EChart from "../../../components/EChart";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import P from "../../../components/P";
import useThemeChoice from "../../../hooks/useThemeChoice";
import { queryDailyAndTotalContributionCount } from "../../../scripts/graphQLScript";
import { common } from "../../../styles/themes";
import { formatDate } from "../../../utils/dataUtils";
import { isPhone } from "../../../utils/responsiveUtils";

const StateCardFlex = styled(Flex)<{ bgColor: string }>`
  max-width: 300px;
  width: 300px;
  align-items: flex-start;
  gap: 24px;
  border-radius: 36px;
  background-color: ${({ bgColor }) => bgColor};
  padding: 24px;
  flex-direction: column;
  &:hover {
    transition: all 0.3s;
    background-color: ${({ bgColor }) => darken(0.1, bgColor)};
  }
`;

type StateCardProps = {
  bgColor: string;
  icon: ReactNode;
  title: string;
  linkText: string;
  linkHref: string;
  children: ReactNode;
};

const StateCard: React.FC<StateCardProps> = ({
  bgColor,
  icon,
  title,
  linkText,
  linkHref,
  children,
}) => {
  return (
    <StateCardFlex bgColor={bgColor}>
      <Flex gap="md">
        {icon}
        <Flex column gap="xxs" align="flex-start" justify="space-between">
          <P isTitle color="white">
            {title}
          </P>
          <A href={linkHref} color="blue">
            {linkText}
          </A>
        </Flex>
      </Flex>
      <Flex fullWidth align="flex-start" column style={{ gap: 0 }}>
        {children}
      </Flex>
    </StateCardFlex>
  );
};

const State: React.FC = () => {
  const [wakaTimeOptions, setWakaTimeOptions] = React.useState<any>({});
  const [githubOptions, setGithubOptions] = React.useState<any>({});
  const [annualCodingMinutes, setAnnualCodingMinutes] =
    React.useState<number>(0);
  const [annualContribution, setAnnualContribution] = React.useState<number>(0);
  const wakaTimeItemColorArray: Array<string> = useThemeChoice(
    ["#ebedf0", "#b4c7d9", "#8baac5", "#527da4", "#36526c"],
    ["#252526", "#36526c", "#6b798e", "#8baac5", "#9aa7b1", "#ebedf0"]
  );
  const githubItemColorArray: Array<string> = useThemeChoice(
    ["#ebedf0", "#b2dfdb", "#4db6ac", "#009688", "#004d40"],
    ["#252526", "#004d40", "#00796b", "#009688", "#4db6ac", "#ebedf0"]
  );
  const textColor: string = useThemeChoice("#3a3a3a", "#fafafa");
  const bgColor: string = useThemeChoice("#bbb", "#252526");

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
      right: isPhone() ? "center" : "0%",
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
      top: isPhone() ? 120 : 85,
      left: isPhone() ? "center" : "auto",
      right: isPhone() ? "auto" : "0",
      orient: isPhone() ? "vertical" : "horizontal",
      width: isPhone() ? 110 : 900,
      cellSize: isPhone() ? 12 : 14,
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
  const resolveWakaTimeData = (response: any) => {
    let totalMinutes: number = 0;
    let realData: Array<Array<string>> = response.days.map((item: any) => {
      totalMinutes += item.total / 60;
      return [item.date, (item.total / 3600).toPrecision(3)];
    });
    setAnnualCodingMinutes(totalMinutes);
    const startDate = realData[0][0];
    const endDate = realData[realData.length - 1][0];
    const realWakatimeTableOptions = {
      title: setTitle("代码时长 (缺数据)"),
      tooltip: {
        formatter: (params: any) => {
          return `${params.value[0]} <br/> ${parseInt(
            params.value[1]
          )} h ${parseInt(
            String((Number(params.value[1]) - parseInt(params.value[1])) * 60)
          )} min`;
        },
      },
      visualMap: setVisualMap(12, wakaTimeItemColorArray, textColor),
      calendar: setCalendar(startDate, endDate),
      series: setSeries(realData),
    };
    setWakaTimeOptions(realWakatimeTableOptions);
  };

  const initWakaTime = () => {
    $.ajax({
      type: "GET",
      url: "https://wakatime.com/share/@pionpill/ccb466e3-bddf-4c35-a775-0a57fc221313.json",
      dataType: "jsonp",
      success: resolveWakaTimeData,
    });
  };

  const resolveGithubData = (data: any) => {
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
      title: setTitle("Github 提交次数"),
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
  };

  const initGithub = () => {
    const now = new Date();
    const startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    const query = queryDailyAndTotalContributionCount(formatDate(startDate));
    queryGraphQL(query)
      .then((response) => response.json())
      .then(resolveGithubData);
  };

  React.useEffect(() => {
    initWakaTime();
    initGithub();
  }, []);

  return (
    <Flex fullWidth bgSecond>
      <Flex bleed gap="xl" limitWidth column fullWidth>
        <Flex column>
          <H2>最近状态</H2>
          {isPhone() && <P shallow="md">部分数据图可能挤压变形，请横屏刷新</P>}
        </Flex>
        <Flex wrap align="space-between" style={{ width: "100%", gap: "0" }}>
          <Flex
            style={{
              maxWidth: isPhone() ? "170px" : "1000px",
              minWidth: isPhone() ? "170px" : "1000px",
              height: isPhone() ? "820px" : "250px",
            }}
          >
            <EChart options={wakaTimeOptions} />
          </Flex>
          <Flex
            style={{
              maxWidth: isPhone() ? "170px" : "1000px",
              minWidth: isPhone() ? "170px" : "1000px",
              height: isPhone() ? "820px" : "250px",
            }}
          >
            <EChart options={githubOptions} />
          </Flex>
        </Flex>
        <Flex gap="xxl" wrap fullWidth>
          <StateCard
            bgColor="#106898"
            icon={<SiWakatime color={common.text_white} size="48" />}
            title="WakaTime"
            linkText="@pionpill"
            linkHref="https://wakatime.com/@pionpill"
          >
            <P color="white" shallow="sm">
              工作日平均Coding时间
            </P>
            <P size="xl" weight="xl" color="white">{`${Math.floor(
              annualCodingMinutes / 170 / 60
            )} h ${
              Math.floor(annualCodingMinutes / 170) -
              Math.floor(annualCodingMinutes / 170 / 60) * 60
            } min`}</P>

            <P size="md" color="white">
              {`年总计 Coding 时间 ${Math.floor(annualCodingMinutes / 60)} h`}
            </P>
          </StateCard>
          <StateCard
            bgColor="#3b7960"
            icon={<SiGithub color={common.text_white} size="48" />}
            title="Github"
            linkText="@Pionpill"
            linkHref="https://github.com/Pionpill"
          >
            <P color="white" shallow="sm">
              每周平均提交次数
            </P>
            <P size="xl" weight="xl" color="white">{`${(
              (annualContribution / 365) *
              7
            ).toPrecision(2)} `}</P>
            <P
              size="md"
              color="white"
            >{`年总计提交次数 ${annualContribution} 次`}</P>
          </StateCard>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default State;
