import { Alert, Button, Link, Snackbar, SxProps, Typography } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { Trans } from "react-i18next";
import { BsTextLeft } from "react-icons/bs";
import { FaGithub, FaLink } from "react-icons/fa";
import { useLocation } from "react-router";
import FlexBox from "../../../components/FlexBox";
import { headerHeight } from "../../../shared/config";
import { blogTheme } from "../../../styles/theme";
import { getBlogGithubPath } from "../../../utils/blog";
import { copyCurrentUrl, scrollToAnchor } from "../../../utils/window";

const TocButton: React.FC<PropsWithChildren<{ handleClick: Function }>> = ({
  handleClick,
  children,
}) => (
  <Button
    variant="text"
    size="small"
    sx={{
      mb: 2,
      pl: 1,
      gap: 1,
      marginBottom: 0,
      pt: 0,
      color: blogTheme[700],
      justifyContent: "flex-start",
      textTransform: "inherit",
    }}
    onClick={() => handleClick()}
  >
    {children}
  </Button>
);

const ContentTOC: React.FC<{ toc: Array<{ hierarchy: number; title: string }>, side?: boolean }> = ({ toc, side }) => {
  const locationPath = decodeURIComponent(useLocation().pathname);
  const [successCopyAlertOpen, setSuccessCopyAlertOpen] =
    React.useState<boolean>(false);

  const tocCommonSx: SxProps = {
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      width: "1px",
      height: "100%",
      transform: "translateX(1px)",
      backgroundColor: "line",
    },
  };
  const tocHoverSxFunc = (item: { hierarchy: number }): SxProps => {
    return {
      color: "text.primary",
      fontSize: "0.875em",
      fontWeight: item.hierarchy === 2 ? 600 : 400,
      pl: item.hierarchy === 2 ? 4 : 5,
      pb: item.hierarchy === 2 ? 1 : 0.5,
      textDecoration: "none",
      cursor: "pointer",
      opacity: 0.75,
      "&:hover": {
        color: blogTheme[700],
      },
    };
  };

  return (
    <>
      <FlexBox
        flexDirection="column"
        sx={{
          p: 4,
          gap: 2,
          top: headerHeight,
          height: side ? "100vh" : `calc(100vh - ${headerHeight})`,
          bgcolor: "content"
        }}
        width="300px"
        position="sticky"
      >
        <FlexBox flexDirection="column" sx={tocCommonSx}>
          <TocButton
            handleClick={() => {
              window.open( getBlogGithubPath(locationPath) );
            }}
          >
            <FaGithub /> <Trans i18nKey="common.editOnGithub" />
          </TocButton>
          <TocButton
            handleClick={() => {
              copyCurrentUrl();
              setSuccessCopyAlertOpen(true);
            }}
          >
            <FaLink /> <Trans i18nKey="common.copyUrl" />
          </TocButton>
        </FlexBox>
        <FlexBox flexDirection="column" sx={tocCommonSx}>
          <FlexBox sx={{ pl: 1, pb: 1, gap: 1, alignItems: "center" }}>
            <BsTextLeft />
            <Typography
              sx={{
                fontSize: "0.875em",
                fontWeight: 600,
              }}
            >
              <Trans i18nKey="blog.onThisPage" />
            </Typography>
          </FlexBox>
          {toc.map((item) => {
            return (
              <Link
                key={item.title}
                className="toc"
                sx={tocHoverSxFunc(item)}
                onClick={() => {
                  const anchor = item.title.replace(/[\s`]+/g, "");
                  window.history.pushState({}, "", `${locationPath}#${anchor}`);
                  scrollToAnchor(anchor);
                }}
              >
                {item.title.replace(/[`]+/g, "")}
              </Link>
            );
          })}
        </FlexBox>
      </FlexBox>
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
    </>
  )
}

export default ContentTOC;