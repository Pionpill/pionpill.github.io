import { Avatar, Container, IconButton, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { Trans, useTranslation } from "react-i18next";
import { AiTwotoneMail } from "react-icons/ai";
import { BsFillStarFill, BsGithub, BsTwitter } from "react-icons/bs";
import { FaWeixin } from "react-icons/fa";
import { GiCoffeeCup } from "react-icons/gi";
import { useDispatch } from "react-redux";
import FlexBox from "../components/FlexBox";
import {
  footerHeight,
  github_avatar,
  github_link,
  gitpage_project_link,
  twitter_link,
} from "../shared/config";
import { toggleEmail, togglePay, toggleWeixin } from "../stores/viewSlice";
import { containerP, icon24x } from "../styles/macro";

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <FlexBox
      sx={{
        bgcolor: "background.paper",
        minHeight: footerHeight,
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.5)",
        ...containerP,
      }}
    >
      <Container
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          p: 0,
          pt: 1,
          pb: 1,
        }}
      >
        <FlexBox gap={1} sx={{ flexDirection: "column" }}>
          <FlexBox gap={1}>
            <Avatar alt="pionpill" src={github_avatar} sx={icon24x} />
            <Typography
              sx={{ fontWeight: "fontWeightBold", color: "text.primary" }}
            >
              Pionpill / gitpage
            </Typography>
          </FlexBox>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            <Trans i18nKey="root.elucidation" />
          </Typography>
        </FlexBox>
        <FlexBox gap={1} sx={{ alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">
            <Trans i18nKey="root.link" />:
          </Typography>
          <IconButton
            color="secondary"
            component="a"
            href={gitpage_project_link}
            title={t("root.starMe") as string}
          >
            <BsFillStarFill size={16} />
          </IconButton>
          <IconButton component="a" href={github_link} sx={{ p: 0.5 }}>
            <BsGithub size={16} />
          </IconButton>
          <IconButton component="a" href={twitter_link} sx={{ p: 0.5 }}>
            <BsTwitter size={16} />
          </IconButton>
          <IconButton
            component="a"
            onClick={() => dispatch(toggleWeixin())}
            sx={{ p: 0.5 }}
          >
            <FaWeixin size={16} />
          </IconButton>
          <IconButton
            component="a"
            onClick={() => dispatch(toggleEmail())}
            sx={{ p: 0.5 }}
          >
            <AiTwotoneMail size={16} />
          </IconButton>
          <IconButton onClick={() => dispatch(togglePay())} sx={{ p: 0.5 }}>
            <GiCoffeeCup size={16} color={red[800]} />
          </IconButton>
        </FlexBox>
      </Container>
    </FlexBox>
  );
};

export default Footer;
