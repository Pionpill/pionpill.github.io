import { Button, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";
import { Trans } from "react-i18next";
import { BiErrorCircle } from "react-icons/bi";
import { useNavigate } from "react-router";
import FlexBox from "../components/FlexBox";
import Wrapper from "../components/Wrapper";

const Error: React.FC = () => {
  const [time, setTime] = React.useState<number>(10);
  const navigate = useNavigate();
  React.useEffect(() => {
    const cutdownTaskId = setInterval(() => {
      setTime(time - 1);
    }, 1000);
    if (time <= 0) navigate("/");
    return () => clearInterval(cutdownTaskId);
  }, []);

  return (
    <Wrapper fillHeight sx={{ height: "100%" }}>
      <FlexBox
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ width: "100%", height: "100%" }}
        gap={2}
      >
        <BiErrorCircle color={red[500]} size={52} />
        <Typography variant="h4" fontWeight="fontWeightBold">
          <Trans i18nKey="root.errorTitle" />
        </Typography>
        <Typography color="text.secondary" align="center">
          <Trans i18nKey="root.errorMessage" />
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate("/")}>
          <Trans i18nKey="root.errorJump" /> {time}
        </Button>
      </FlexBox>
    </Wrapper>
  );
};

export default Error;
