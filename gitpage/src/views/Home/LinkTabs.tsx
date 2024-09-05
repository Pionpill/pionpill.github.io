import { Container, Tab, Tabs } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiFillProfile } from "react-icons/ai";
import { GiRiver, GiSkills } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router";
import FlexBox from "../../components/FlexBox";
import { homeTheme } from "../../styles/theme";

const LinkTabs: React.FC = () => {
  const locationName = useLocation().pathname;
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [value, setValue] = useState(() =>
    locationName.includes("technology")
      ? 2
      : locationName.includes("experience")
      ? 1
      : 0
  );

  const handleChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }, []);

  const tagConfig = useMemo(
    () => [
      {
        icon: <AiFillProfile />,
        i18Key: "home.profile",
        route: "/home/profile",
      },
      {
        icon: <GiRiver />,
        i18Key: "home.experience",
        route: "/home/experience",
      },
      {
        icon: <GiSkills />,
        i18Key: "home.technology",
        route: "/home/technology",
      },
    ],
    []
  );

  return (
    <FlexBox
      sx={{
        bgcolor: homeTheme[700],
      }}
    >
      <Container>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          sx={{ minHeight: 40 }}
        >
          {tagConfig.map((tag) => (
            <Tab
              icon={tag.icon}
              iconPosition="start"
              label={t(tag.i18Key)}
              onClick={() => navigate(tag.route)}
              sx={{ minHeight: 40, p: 0 }}
            />
          ))}
        </Tabs>
      </Container>
    </FlexBox>
  );
};

export default LinkTabs;
