import { Box, SxProps, Typography, TypographyProps } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Trans } from "react-i18next";
import { BiChevronDown } from "react-icons/bi";
import { Link, To } from "react-router-dom";
import FlexBox from "./FlexBox";

type Props = {
  to: To;
  i18nKey: string;
  expand?: boolean;
  id?: string;
  onMouseEnter?: Function;
  onMouseOut?: Function;
} & TypographyProps;

const RouteLink: React.FC<Props> = ({
  id,
  to,
  i18nKey,
  expand,
  onMouseEnter,
  onMouseOut,
  ...props
}) => {
  const presetWrapperSx: SxProps = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
    color: "text.primary",
    "& > p": {
      textDecoration: "none",
    },
    "&:hover > *": {
      color: blue[500],
      transition: "color 0.5s",
    },
    "& > div": {
      transition: "transform 0.2s",
    },
    "&:hover > div": {
      transform: "rotateZ(180deg)",
      transition: "transform 0.2s",
    },
  };

  return (
    <Box
      component={Link}
      to={to}
      sx={presetWrapperSx}
      id={id}
      onMouseEnter={onMouseEnter}
      onMouseOut={onMouseOut}
    >
      <Typography {...props}>
        <Trans i18nKey={i18nKey} />
        {props.children}
      </Typography>
      <FlexBox sx={{ color: "text.primary" }}>
        {expand && <BiChevronDown />}
      </FlexBox>
    </Box>
  );
};

export default RouteLink;
