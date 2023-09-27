import { Grid, Paper, Skeleton, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { BiCodeAlt } from "react-icons/bi";
import { FcFile, FcUpload } from "react-icons/fc";
import { githubReposApi } from "../../api/github/githubApi";
import FlexBox from "../../components/FlexBox";
import Wrapper from "../../components/Wrapper";

export type ProjectItemProps = {
  icon: ReactNode;
  project: string;
};

const ProjectItem: React.FC<ProjectItemProps> = ({ icon, project }) => {
  const { t } = useTranslation();
  const [name, setName] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState<string | null>(null);
  const [createTime, setCreateTime] = React.useState<string | null>(null);
  const [updateTime, setUpdateTime] = React.useState<string | null>(null);
  const [language, setLanguage] = React.useState<string | null>(null);
  const [projectLink, setProjectLink] = React.useState<string | null>(null);

  React.useEffect(() => {
    const reposPromise = githubReposApi(project);
    reposPromise
      .then((response) => response.json())
      .then((data) => {
        setDescription(data.description);
        setName(data.name);
        setCreateTime(data.created_at.slice(0, 7));
        setUpdateTime(data.updated_at.slice(0, 10));
        setLanguage(data.language);
        setProjectLink(data.html_url);
      });
  });

  return (
    <Grid item sm={12} md={6} lg={4}>
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
          <FlexBox flexDirection="column">
            {name ? (
              <Typography variant="h6" fontWeight="fontWeightBold">
                {name}
              </Typography>
            ) : (
              <Skeleton />
            )}
            {description ? (
              <Typography>{description}</Typography>
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
        </FlexBox>
      </Paper>
    </Grid>
  );
};

type Props = {
  titleI18nKey: string;
  abstractI18nKey: string;
  projectItems: ProjectItemProps[];
};

const ProjectCategory: React.FC<Props> = ({
  titleI18nKey,
  abstractI18nKey,
  projectItems,
}) => {
  return (
    <Wrapper
      bgcolor="background.paper"
      sx={{
        gap: 2,
        flexDirection: "column",
        width: "100%",
        alignItems: "flex-start",
      }}
    >
      <FlexBox flexDirection="column" gap={1}>
        <Typography variant="h5" fontWeight="fontWeightBold">
          <Trans i18nKey={titleI18nKey} />
        </Typography>
        <Typography>
          <Trans i18nKey={abstractI18nKey} />
        </Typography>
      </FlexBox>
      <Grid container>
        {projectItems.map((item) => (
          <ProjectItem
            icon={item.icon}
            project={item.project}
            key={item.project}
          />
        ))}
      </Grid>
    </Wrapper>
  );
};

export default ProjectCategory;
