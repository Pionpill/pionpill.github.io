import { Button, Link, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Trans } from "react-i18next";
import { FaBook, FaCoffee, FaGithub, FaSmile } from "react-icons/fa";
import { useDispatch } from "react-redux";
import FlexBox from "../../components/FlexBox";
import Wrapper from "../../components/Wrapper";
import { useMiddleMaxMedia } from "../../hooks/useMedia";
import useThemeChoice from "../../hooks/useThemeChoice";
import { article_project_link } from "../../shared/config";
import { togglePay } from "../../stores/viewSlice";
import { articleTheme } from "../../styles/theme";

const Banner: React.FC = () => {
  const isMiddleMedia = useMiddleMaxMedia();
  const dispatch = useDispatch();

  return (
    <Wrapper bgcolor={useThemeChoice(articleTheme[50], grey[900])}>
      <FlexBox
        sx={{ flexDirection: "column", width: "100%" }}
        gap={1}
        style={{
          background: !isMiddleMedia
            ? "url(https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog/imgs/blog.svg) no-repeat 100%"
            : "",
          backgroundSize: "30%",
        }}
      >
        <Typography variant="h4" fontWeight="fontWeightBold">
          <FaBook />
          &nbsp;
          <Trans i18nKey="article.title" />
        </Typography>
        <Typography sx={{ width: isMiddleMedia ? "auto" : "700px" }}>
          <FaSmile color={articleTheme[900]} />
          &nbsp;
          <Trans i18nKey="article.abstract-1" />
        </Typography>
        <FlexBox gap={2}>
          <Button variant="contained" onClick={() => dispatch(togglePay())}>
            <FaCoffee size={24} /> &nbsp; <Trans i18nKey="article.sponsor" />
          </Button>
          <Link
            href={article_project_link}
            underline="none"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FaGithub size={24} /> &nbsp; <Trans i18nKey="article.follow" />
          </Link>
        </FlexBox>
        <Typography
          color="text.secondary"
          sx={{ width: isMiddleMedia ? "auto" : "700px" }}
        >
          <Trans i18nKey="article.abstract-2" />
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ width: isMiddleMedia ? "auto" : "700px" }}
        >
          <Trans i18nKey="article.abstract-3" />
        </Typography>
      </FlexBox>
    </Wrapper>
  );
};

export default Banner;
