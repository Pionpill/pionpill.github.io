import { Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Trans } from "react-i18next";
import { FaCoffee, FaProjectDiagram, FaSmile } from "react-icons/fa";
import { useDispatch } from "react-redux";
import FlexBox from "../../components/FlexBox";
import Wrapper from "../../components/Wrapper";
import { useMiddleMaxMedia } from "../../hooks/useMedia";
import useThemeChoice from "../../hooks/useThemeChoice";
import { togglePay } from "../../stores/viewSlice";
import { articleTheme, projectTheme } from "../../styles/theme";

const Banner: React.FC = () => {
  const isMiddleMedia = useMiddleMaxMedia();
  const dispatch = useDispatch();

  return (
    <Wrapper bgcolor={useThemeChoice(projectTheme[50], grey[900])}>
      <FlexBox
        sx={{ flexDirection: "column", width: "100%" }}
        gap={1}
        style={{
          background: !isMiddleMedia
            ? "url(https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog/imgs/project.svg) no-repeat 100%"
            : "",
          backgroundSize: "15%",
        }}
      >
        <Typography variant="h4" fontWeight="fontWeightBold">
          <FaProjectDiagram />
          &nbsp;
          <Trans i18nKey="project.title" />
        </Typography>
        <Typography sx={{ width: isMiddleMedia ? "auto" : "700px" }}>
          <FaSmile color={articleTheme[900]} />
          &nbsp;
          <Trans i18nKey="project.abstract" />
        </Typography>
        <FlexBox gap={2}>
          <Button variant="contained" onClick={() => dispatch(togglePay())}>
            <FaCoffee size={24} /> &nbsp; <Trans i18nKey="article.sponsor" />
          </Button>
        </FlexBox>
      </FlexBox>
    </Wrapper>
  );
};

export default Banner;
