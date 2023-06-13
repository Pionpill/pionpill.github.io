import {
  Alert,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import { blue, green, red } from "@mui/material/colors";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { AiFillCloseCircle, AiOutlineCopy } from "react-icons/ai";
import { FaQq, FaWeixin } from "react-icons/fa";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { RiMoneyCnyCircleFill } from "react-icons/ri";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import FlexBox from "../components/FlexBox";
import { useSmallMedia } from "../hooks/useMedia";
import useThemeChoice from "../hooks/useThemeChoice";
import {
  email,
  qq_avatar,
  qq_name,
  qq_qrCode,
  weixin_id,
  weixin_name,
  weixin_qrCode,
} from "../shared/config";
import { RootState } from "../stores";
import { toggleEmail, togglePay, toggleWeixin } from "../stores/viewSlice";
import { flexCenter, icon128x } from "../styles/macro";

const WeixinDialog: React.FC = () => {
  const dispatch = useDispatch();
  const isSmallMedia = useSmallMedia();
  const isWeixinOpen = useSelector(
    (state: RootState) => state.view.isWeixinOpen
  );
  const { t } = useTranslation();
  const weixinIdRef = React.useRef<HTMLElement>(null!);
  const [successCopyAlertOpen, setSuccessCopyAlertOpen] =
    React.useState<boolean>(false);
  const [failCopyAlertOpen, setFailCopyAlertOpen] =
    React.useState<boolean>(false);
  const copyContext = () => {
    if (weixinIdRef.current) {
      const clipboardObj = navigator.clipboard;
      const context = weixinIdRef.current.textContent;
      if (context) {
        setSuccessCopyAlertOpen(true);
        clipboardObj.writeText(context);
      }
    } else {
      setFailCopyAlertOpen(true);
    }
  };

  return (
    <>
      <Dialog
        open={isWeixinOpen}
        fullScreen={isSmallMedia}
        onClose={() => dispatch(toggleWeixin())}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "fontWeightBold",
          }}
        >
          <FlexBox gap={1} sx={{ alignItems: "center" }}>
            <FaWeixin size={32} color={green[600]} />
            <Trans i18nKey="root.weixin" />
          </FlexBox>
          <IconButton onClick={() => dispatch(toggleWeixin())}>
            <AiFillCloseCircle />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Avatar src={qq_avatar} sx={icon128x} />
          <FlexBox sx={{ gap: 1, ...flexCenter, flexDirection: "column" }}>
            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
              {weixin_name}
            </Typography>
            <FlexBox sx={flexCenter}>
              <Typography ref={weixinIdRef} variant="subtitle1">
                {weixin_id}
              </Typography>
              <IconButton
                onClick={copyContext}
                sx={{ p: 0.5 }}
                title={t("common.copy") as string}
              >
                <AiOutlineCopy size={18} />
              </IconButton>
            </FlexBox>
          </FlexBox>
          <QRCode
            value={weixin_qrCode}
            bgColor={useThemeChoice("#fff", "#000")}
            fgColor={useThemeChoice("#000", "#fff")}
          />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            <Trans i18nKey="root.addFriendTip" />
          </Typography>
        </DialogContent>
        {isSmallMedia && (
          <DialogActions>
            <Button onClick={() => dispatch(toggleWeixin())}>
              <Trans i18nKey="common.close" />
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <Snackbar
        autoHideDuration={3000}
        onClose={() => setSuccessCopyAlertOpen(false)}
        open={successCopyAlertOpen}
      >
        <Alert severity="success">
          <Trans i18nKey="common.success" />
          :&nbsp;
          <Trans i18nKey="root.copyWeixinIdSuccessMessage" />
        </Alert>
      </Snackbar>
      <Snackbar
        autoHideDuration={3000}
        onClose={() => setFailCopyAlertOpen(false)}
        open={failCopyAlertOpen}
      >
        <Alert severity="error">
          <Trans i18nKey="common.fail" />
          :&nbsp;
          <Trans i18nKey="root.copyWeixinIdFailMessage" />
        </Alert>
      </Snackbar>
    </>
  );
};

const EmailDialog: React.FC = () => {
  const dispatch = useDispatch();
  const isSmallMedia = useSmallMedia();
  const { t } = useTranslation();
  const isEmailOpen = useSelector((state: RootState) => state.view.isEmailOpen);
  const emailRef = React.useRef<HTMLElement>(null!);
  const [successCopyAlertOpen, setSuccessCopyAlertOpen] =
    React.useState<boolean>(false);
  const [failCopyAlertOpen, setFailCopyAlertOpen] =
    React.useState<boolean>(false);
  const copyContext = () => {
    if (emailRef.current) {
      const clipboardObj = navigator.clipboard;
      const context = emailRef.current.textContent;
      if (context) {
        setSuccessCopyAlertOpen(true);
        clipboardObj.writeText(context);
      }
    } else {
      setFailCopyAlertOpen(true);
    }
  };

  return (
    <>
      <Dialog
        open={isEmailOpen}
        fullScreen={isSmallMedia}
        onClose={() => dispatch(toggleEmail())}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "fontWeightBold",
          }}
        >
          <FlexBox gap={1} sx={{ alignItems: "center" }}>
            <FaQq size={28} color={blue[600]} />
            QQ
          </FlexBox>
          <IconButton onClick={() => dispatch(toggleEmail())}>
            <AiFillCloseCircle />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Avatar src={qq_avatar} sx={icon128x} />
          <FlexBox sx={{ gap: 1, ...flexCenter, flexDirection: "column" }}>
            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
              {qq_name}
            </Typography>
            <FlexBox sx={flexCenter}>
              <Typography ref={emailRef} variant="subtitle1">
                {email}
              </Typography>
              <IconButton
                onClick={copyContext}
                title={t("common.copy") as string}
                sx={{ p: 0.5 }}
              >
                <AiOutlineCopy size={18} />
              </IconButton>
              <IconButton
                component="a"
                href={`mailto:${email}`}
                title={t("root.email") as string}
                sx={{ p: 0.5 }}
              >
                <MdOutlineMarkEmailUnread size={18} />
              </IconButton>
            </FlexBox>
          </FlexBox>
          <QRCode
            value={qq_qrCode}
            bgColor={useThemeChoice("#fff", "#000")}
            fgColor={useThemeChoice("#000", "#fff")}
          />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            <Trans i18nKey="root.addFriendTip" />
          </Typography>
        </DialogContent>
        {isSmallMedia && (
          <DialogActions>
            <Button onClick={() => dispatch(toggleEmail())}>
              <Trans i18nKey="common.close" />
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <Snackbar
        autoHideDuration={3000}
        onClose={() => setSuccessCopyAlertOpen(false)}
        open={successCopyAlertOpen}
      >
        <Alert severity="success">
          <Trans i18nKey="common.success" />
          :&nbsp;
          <Trans i18nKey="root.copyEmailSuccessMessage" />
        </Alert>
      </Snackbar>
      <Snackbar
        autoHideDuration={3000}
        onClose={() => setFailCopyAlertOpen(false)}
        open={failCopyAlertOpen}
      >
        <Alert severity="error">
          <Trans i18nKey="common.fail" />
          :&nbsp;
          <Trans i18nKey="root.copyEmailFailMessage" />
        </Alert>
      </Snackbar>
    </>
  );
};

const PayDialog: React.FC = () => {
  const dispatch = useDispatch();
  const isSmallMedia = useSmallMedia();
  const isPayOpen = useSelector((state: RootState) => state.view.isPayOpen);

  return (
    <>
      <Dialog
        open={isPayOpen}
        fullScreen={isSmallMedia}
        onClose={() => dispatch(togglePay())}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "fontWeightBold",
          }}
        >
          <FlexBox gap={1} sx={{ alignItems: "center" }}>
            <RiMoneyCnyCircleFill size={28} color={red[600]} />
            Sponsor
          </FlexBox>
          <IconButton onClick={() => dispatch(togglePay())}>
            <AiFillCloseCircle />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Avatar src={qq_avatar} sx={icon128x} />
          <FlexBox sx={{ gap: 1, ...flexCenter, flexDirection: "column" }}>
            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
              {weixin_name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              <Trans i18nKey="root.sponsorMessage" />
            </Typography>
          </FlexBox>
          <QRCode
            value={qq_qrCode}
            bgColor={useThemeChoice("#fff", "#000")}
            fgColor={useThemeChoice("#000", "#fff")}
          />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            <Trans i18nKey="root.sponsorTip" />
          </Typography>
        </DialogContent>
        {isSmallMedia && (
          <DialogActions>
            <Button onClick={() => dispatch(toggleEmail())}>
              <Trans i18nKey="common.close" />
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export const Dialogs: React.FC = () => (
  <>
    <EmailDialog />
    <WeixinDialog />
    <PayDialog />
  </>
);

export default Dialogs;
