import { Grid, Paper, Skeleton, Typography } from "@mui/material";
import React, { ReactNode, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { BiCodeAlt } from "react-icons/bi";
import { FcFile, FcUpload } from "react-icons/fc";
import {
  githubReposApi,
  githubReposCommitByWeekApi,
} from "../../../api/github/githubApi";
import {
  githubGQLReposLanguageApi,
  githubGQLReposLastDateCommitApi,
} from "../../../api/github/graphApi";
import FlexBox from "../../../components/FlexBox";
import ProgressLine from "../../../components/ProgressLine";
import SimpleLineChart from "../../../components/d3/SimpleLineChart";

export type ProjectItemProps = {
  icon: ReactNode;
  project: string;
};

const ProjectItem: React.FC<ProjectItemProps> = ({ icon, project }) => {
  const { t } = useTranslation();

  const [basicInfo, setBasicInfo] = useState({} as any);
  const [langData, setLangData] = useState<
    Array<{ name: string; percent: number }>
  >(null!);
  const [commitData, setCommitData] = useState<
    Array<{ name: string; value: number }>
  >(null!);
  const [commitSum, setCommitSum] = useState(0);

  const { name, description, created_at, updated_at, language, projectLink } =
    basicInfo;

  const createTime = created_at?.split("T")[0];
  const updateTime = updated_at?.split("T")[0];

  const transformLangInfo = (data: any) => {
    const langData = data.data.repository.languages.edges as Array<{
      node: { name: string };
      size: number;
    }>;
    const sumSize = langData.reduce((sum, item) => sum + item.size, 0);
    const newLangData = langData
      .map((item) => ({
        name: item.node.name,
        percent: Math.round((item.size / sumSize) * 1000) / 10,
      }))
      .sort((a, b) => b.percent - a.percent);
    setLangData(newLangData);
  };

  const transformCommitInfo = (
    data: Array<{ days: number[]; total: number; week: number }>
  ) => {
    let commitSum = 0;
    const dateArray = data.map((item) => {
      commitSum += item.total;
      return {
        name: item.week.toString(),
        value: item.days.reduce((acc, cur) => acc + cur, 0),
      };
    });
    setCommitData(dateArray);
    setCommitSum(commitSum);
  };

  React.useEffect(() => {
    const tasks = [
      githubReposApi(project),
      githubGQLReposLanguageApi(project),
      githubReposCommitByWeekApi(project),
    ];
    Promise.all(tasks)
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((data) => {
        setBasicInfo(data[0]);
        transformLangInfo(data[1]);
        transformCommitInfo(data[2]);
      });
  }, []);

  return (
    <Grid item sm={12} md={6}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "row",
          gap: 2,
          width: "100%",
          cursor: "pointer",
        }}
        onClick={() => {
          if (projectLink) window.open(projectLink, "_blank");
          else alert(t("common.asyncMessage"));
        }}
        elevation={2}
      >
        {icon}
        <FlexBox flexDirection="column" width="100%" gap={2}>
          <FlexBox flexDirection="column" gap={1}>
            {name ? (
              <Typography variant="h6" fontWeight="fontWeightBold">
                {name}
              </Typography>
            ) : (
              <Skeleton />
            )}
            {description ? (
              <Typography sx={{ opacity: 0.8 }}>{description}</Typography>
            ) : (
              <Skeleton />
            )}
          </FlexBox>
          <FlexBox width="100%" gap={2}>
            <FlexBox sx={{ alignItems: "center" }} gap={1}>
              <BiCodeAlt />
              {language ? (
                <Typography variant="body2" color="text.secondary">
                  {language}
                </Typography>
              ) : (
                <Skeleton />
              )}
            </FlexBox>
            <FlexBox sx={{ alignItems: "center" }} gap={1}>
              <FcFile />
              {createTime ? (
                <Typography variant="body2" color="text.secondary">
                  {createTime}
                </Typography>
              ) : (
                <Skeleton />
              )}
            </FlexBox>
            <FlexBox sx={{ alignItems: "center" }} gap={1}>
              <FcUpload />
              {updateTime ? (
                <Typography variant="body2" color="text.secondary">
                  {updateTime}
                </Typography>
              ) : (
                <Skeleton />
              )}
            </FlexBox>
          </FlexBox>
          <ProgressLine data={langData} />
          <FlexBox
            sx={{
              justifyContent: "flex-end",
              alignItems: "flex-end",
              gap: "16px",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              <Trans i18nKey="project.commitLastYear" />
              ：{commitSum}
            </Typography>
            <SimpleLineChart data={commitData} />
          </FlexBox>
        </FlexBox>
      </Paper>
    </Grid>
  );
};

export default ProjectItem;
