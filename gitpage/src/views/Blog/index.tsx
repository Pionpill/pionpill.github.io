import { Alert, Drawer, Snackbar, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { BiListOl } from "react-icons/bi";
import { FaGithub, FaLink, FaListAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import FlexBox from "../../components/FlexBox";
import { useLargeMinMedia, useXLargeMinMedia } from "../../hooks/useMedia";
import { RootState } from "../../stores";
import { toggleAsideOpen, toggleTocOpen } from "../../stores/blogSlice";
import { copyCurrentUrl } from "../../utils/window";
import Aside from "./Aside";
import Content from "./Content";

const Blog: React.FC = () => {
  const asideOpen = useSelector((state: RootState) => state.blog.asideOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isLargeMinMedia = useLargeMinMedia();
  const isXLargeMinMedia = useXLargeMinMedia();
  const locationPath = decodeURIComponent(useLocation().pathname);
  const [successCopyAlertOpen, setSuccessCopyAlertOpen] =
    React.useState<boolean>(false);

  if (locationPath === "/blog") {
    navigate("/blog/readme");
  }

  return (
    <FlexBox
      bgcolor="background.paper"
      color="text.primary"
      justifyContent="space-between"
      flexDirection={useLargeMinMedia() ? "row" : "column"}
    >
      {isLargeMinMedia ? (
        <Aside side={false} />
      ) : (
        <Drawer anchor="left" open={asideOpen} onClose={() => dispatch(toggleAsideOpen())}>
          <Aside side={true} />
        </Drawer>
      )}
      <Content />
      {
        !isXLargeMinMedia && <SpeedDial ariaLabel="More Action" sx={{ position: "fixed", bottom: 16, right: 16 }} icon={<SpeedDialIcon />}>
          {
            !isLargeMinMedia &&
            <SpeedDialAction key="aside" icon={<FaListAlt />} tooltipTitle={t("blog.showAside")} onClick={() => dispatch(toggleAsideOpen())} />
          }
          <SpeedDialAction key="toc" icon={<BiListOl />} tooltipTitle={t("blog.showTOC")} onClick={() => dispatch(toggleTocOpen())} />
          <SpeedDialAction key="github" icon={<FaGithub />} tooltipTitle={t("common.editOnGithub")} onClick={() => {
            window.open(
              `https://github.com/Pionpill/pionpill.github.io/blob/main${locationPath}.md`
            )
          }} />
          <SpeedDialAction key="link" icon={<FaLink />} tooltipTitle={t("common.copyUrl")} onClick={() => {
            copyCurrentUrl();
            setSuccessCopyAlertOpen(true);
          }} />
        </SpeedDial>
      }
      <Snackbar
        autoHideDuration={3000}
        onClose={() => setSuccessCopyAlertOpen(false)}
        open={successCopyAlertOpen}
      >
        <Alert severity="success">
          <Trans i18nKey="common.success" />
          :&nbsp;
          <Trans i18nKey="root.copyLinkSuccessMessage" />
        </Alert>
      </Snackbar>
    </FlexBox>
  );
};

export default Blog;
