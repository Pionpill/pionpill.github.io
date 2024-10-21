import { Grid, Typography } from "@mui/material";
import React from "react";
import { Trans } from "react-i18next";
import FlexBox from "../../components/FlexBox";
import Wrapper from "../../components/Wrapper";
import ProjectItem, { ProjectItemProps } from "./ProjectItem";

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
      <Grid container spacing={4}>
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
