import { Breadcrumbs, Typography } from "@mui/material";
import { FcDocument } from "react-icons/fc";
import { useLocation } from "react-router";
import FlexBox from "../../../components/FlexBox";

const ContentBreadcrumbs: React.FC = () => {
  const locationPath = decodeURIComponent(useLocation().pathname);

  return (
    <FlexBox
      alignItems="center"
      flexWrap="wrap"
    >
      <FcDocument />
      <Breadcrumbs>
        {locationPath
          .replace("/blog", "")
          .split("/")
          .map((path) => (
            <Typography key={path}>
              {path.includes("_") ? path.split("_")[1] : path}
            </Typography>
          ))}
      </Breadcrumbs>
    </FlexBox>
  )
}

export default ContentBreadcrumbs;