import { Drawer, IconButton } from "@mui/material";
import React from "react";
import { FaList } from "react-icons/fa";
import FlexBox from "../../components/FlexBox";
import { useLargeMinMedia } from "../../hooks/useMedia";
import { blogTheme } from "../../styles/theme";
import Aside from "./Aside";
import Content from "./Content";

const Blog: React.FC = () => {
  const [show, setShow] = React.useState(false);

  return (
    <FlexBox
      bgcolor="background.paper"
      color="text.primary"
      justifyContent="space-between"
      flexDirection={useLargeMinMedia() ? "row" : "column"}
    >
      {useLargeMinMedia() ? (
        <Aside side={false} />
      ) : (
        <>
          <IconButton
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              p: 2,
              bgcolor: blogTheme[600],
            }}
            onClick={() => setShow(!show)}
          >
            <FaList style={{ color: "white" }} />
          </IconButton>
          <Drawer anchor="left" open={show} onClose={() => setShow(!show)}>
            <Aside side={true} />
          </Drawer>
        </>
      )}
      <Content />
    </FlexBox>
  );
};

export default Blog;
