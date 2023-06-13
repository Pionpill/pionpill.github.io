import { Chip, Grid, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Trans, useTranslation } from "react-i18next";
import FlexBox from "../../../components/FlexBox";
import Wrapper from "../../../components/Wrapper";
import useThemeChoice from "../../../hooks/useThemeChoice";
import techColor from "../../../styles/tech";
import { homeTheme } from "../../../styles/theme";

type AbstractItemProps = {
  bgColor: string;
  chipI18nKey: string;
  contentI18nKey: string;
};

const AbstractItem: React.FC<AbstractItemProps> = ({
  bgColor,
  chipI18nKey,
  contentI18nKey,
}) => {
  const { t } = useTranslation();

  return (
    <Grid item sm={6} md={4}>
      <FlexBox
        gap={1}
        sx={{ alignItems: "center", width: "350px", maxWidth: "100%" }}
      >
        <Chip
          label={t(chipI18nKey)}
          sx={{ backgroundColor: bgColor, color: "white" }}
        />
        <Typography variant="caption">
          <Trans i18nKey={contentI18nKey} />
        </Typography>
      </FlexBox>
    </Grid>
  );
};

const Abstract: React.FC = () => {
  return (
    <Wrapper bgcolor={useThemeChoice(homeTheme[50], grey[900])}>
      <FlexBox sx={{ flexDirection: "column", alignItems: "center" }} gap={1}>
        <Typography variant="h4" fontWeight="fontWeightBold">
          <Trans i18nKey="home-technology.technologyStack" />
        </Typography>
        <Typography align="center" color="text.secondary">
          <Trans i18nKey="home-technology.technologyAbstract" />
        </Typography>
      </FlexBox>
      <Grid container spacing={2}>
        <AbstractItem
          bgColor={techColor.x}
          chipI18nKey="home-technology.x"
          contentI18nKey="home-technology.xAbstract"
        />
        <AbstractItem
          bgColor={techColor.xx}
          chipI18nKey="home-technology.xx"
          contentI18nKey="home-technology.xxAbstract"
        />
        <AbstractItem
          bgColor={techColor.xxx}
          chipI18nKey="home-technology.xxx"
          contentI18nKey="home-technology.xxxAbstract"
        />
        <AbstractItem
          bgColor={techColor.xxxx}
          chipI18nKey="home-technology.xxxx"
          contentI18nKey="home-technology.xxxxAbstract"
        />
        <AbstractItem
          bgColor={techColor.xxxxx}
          chipI18nKey="home-technology.xxxxx"
          contentI18nKey="home-technology.xxxxxAbstract"
        />
        <AbstractItem
          bgColor={techColor.xxxxxx}
          chipI18nKey="home-technology.xxxxxx"
          contentI18nKey="home-technology.xxxxxxAbstract"
        />
      </Grid>
    </Wrapper>
  );
};

export default Abstract;
