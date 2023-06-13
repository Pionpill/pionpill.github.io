import { Container, Tab, Tabs } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { AiFillProfile } from "react-icons/ai";
import { GiRiver, GiSkills } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router";
import FlexBox from "../../components/FlexBox";
import { homeTheme } from "../../styles/theme";

const LinkTabs: React.FC = () => {
  const locationName = useLocation().pathname;
  const [, setValue] = React.useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <FlexBox
      sx={{
        bgcolor: homeTheme[700],
      }}
    >
      <Container>
        <Tabs
          value={
            locationName.includes("technology")
              ? 2
              : locationName.includes("experience")
              ? 1
              : 0
          }
          onChange={handleChange}
          variant="fullWidth"
          sx={{ minHeight: 40 }}
        >
          <Tab
            icon={<AiFillProfile />}
            iconPosition="start"
            label={t("home.profile")}
            onClick={() => navigate("/home/profile")}
            sx={{ minHeight: 40, p: 0 }}
          />
          <Tab
            icon={<GiRiver />}
            iconPosition="start"
            label={t("home.experience")}
            onClick={() => navigate("/home/experience")}
            sx={{ minHeight: 40, p: 0 }}
          />
          <Tab
            icon={<GiSkills />}
            iconPosition="start"
            label={t("home.technology")}
            onClick={() => navigate("/home/technology")}
            sx={{ minHeight: 40, p: 0 }}
          />
        </Tabs>
      </Container>
    </FlexBox>
  );
};

export default LinkTabs;
