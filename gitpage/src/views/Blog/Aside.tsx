import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import { BiChevronDown, BiChevronRight, BiCode, BiSolidChevronDown, BiSolidChevronRight } from "react-icons/bi";
import { FaBlog, FaCss3Alt, FaVuejs } from "react-icons/fa";
import { SiD3Dotjs, SiJavascript, SiMicrosoft, SiPython, SiReact, SiTypescript } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { blogContentApi } from "../../api/github/githubApi";
import FlexBox from "../../components/FlexBox";
import { BlogCategories, BlogCategory } from "../../models/blog";
import { headerHeight } from "../../shared/config";
import { RootState } from "../../stores";
import { changeBlogCategory } from "../../stores/blogSlice";
import { singleOmit } from "../../styles/macro";
import { blogTheme } from "../../styles/theme";

const Category: React.FC = () => {
  const dispatch = useDispatch();
  const handleChange = (event: SelectChangeEvent) => {
    dispatch(changeBlogCategory(event.target.value as BlogCategory));
  };
  const category = useSelector((state: RootState) => state.blog.category);

  return (
    <FlexBox flexDirection="column" gap={1}>
      <FlexBox gap={1}>
        <FaBlog color={blogTheme[500]} size={24} />
        <Typography variant="h6">
          <Trans i18nKey="blog.category" />
        </Typography>
      </FlexBox>
      <Select value={category} size="small" onChange={handleChange}>
        {BlogCategories.map((value) => {
          return (
            <MenuItem value={value} key={value}>
              <Trans i18nKey={`blog.${value}`} />
            </MenuItem>
          );
        })}
      </Select>
    </FlexBox>
  );
};

const formatReposContent = (json: any) => {
  const tempDirs = [];
  for (const dirInfo of json) {
    tempDirs.push({
      type: dirInfo.type,
      downloadUrl: dirInfo.download_url,
      path: dirInfo.path,
    });
  }
  return tempDirs;
};

const DirList: React.FC<{ path: string }> = ({ path }) => {
  const iconMap: Map<string, ReactNode> = new Map([
    ["react", <SiReact />],
    ["d3", <SiD3Dotjs />],
    ["javascript", <SiJavascript />],
    ["ts", <SiTypescript />],
    ["vue", <FaVuejs />],
    ["css", <FaCss3Alt />],
    ["bedrock", <SiMicrosoft />],
    ["python", <SiPython/>]
  ]);
  const navigate = useNavigate();
  const title = path.split("/").pop() as string;
  const [open, setOpen] = React.useState<boolean>(false);
  const [dirs, setDirs] = React.useState<
    Array<{ type: string; downloadUrl: string; path: string }>
  >([]);
  const locationPath = decodeURIComponent(useLocation().pathname);
  const isTopDir = path.split("/").length === 3;
  const handleClick = (filePath: string) => {
    navigate(`/${filePath}`);
  };

  React.useEffect(() => {
    blogContentApi(path)
      .then((response) => response.json())
      .then((json) => formatReposContent(json))
      .then((result) => setDirs(result));
  }, []);

  return (
    <>
      <ListItemButton
        sx={{ p: 0, pl: 0.5, gap: 1, opacity: isTopDir ? 1 : 0.8 }}
        onClick={() => setOpen(!open)}
      >
        {isTopDir && (
          <ListItemIcon sx={{ minWidth: "auto" }}>
            {iconMap.get(title.toLowerCase()) || <BiCode />}
          </ListItemIcon>
        )}
        <ListItemText
          sx={singleOmit}
          title={title}
          primary={title}
          primaryTypographyProps={{ fontWeight: isTopDir ? "fontWeightBold" : "auto" }}
        />
        {open ?
          isTopDir ? <BiSolidChevronDown /> : <BiChevronDown /> :
          isTopDir ? <BiSolidChevronRight /> : <BiChevronRight />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            ml: 1,
            pl: 0.5,
            borderLeftWidth: "1px",
            borderLeftStyle: "solid",
            borderLeftColor: "line",
          }}
        >
          {dirs ? (
            dirs.map((item) => {
              return item.type === "dir" ?
                <DirList path={item.path} key={item.path} /> : (
                  <ListItemButton
                    sx={{
                      p: 0,
                      pl: 0.5,
                      borderRadius: "4px",
                      bgcolor:
                        `/${item.path.split(".")[0]}` === locationPath
                          ? "line"
                          : "auto",
                    }}
                    key={item.path}
                    onClick={() => handleClick(item.path.replace(".md", ""))}
                  >
                    <ListItemText
                      sx={{ opacity: 0.8, ...singleOmit }}
                      primaryTypographyProps={{ fontSize: "0.8em" }}
                      title={item.path.split("/").pop()?.split(".")[0].split("_")[1]}
                      primary={
                        item.path.split("/").pop()?.split(".")[0].split("_")[1]
                      }
                    />
                  </ListItemButton>
                )
            })
          ) : (
            <Skeleton width="100%" />
          )}
        </List>
      </Collapse>
    </>
  );
};

const BlogList: React.FC = () => {
  const category = useSelector((state: RootState) => state.blog.category);
  const [topDirs, setTopDirs] = React.useState<
    Array<{ type: string; downloadUrl: string; path: string }>
  >([]);

  React.useEffect(() => {
    blogContentApi(`blog/${category}`)
      .then((response) => response.json())
      .then((json) => {
        return formatReposContent(json);
      })
      .then((result) => {
        setTopDirs(result);
      });
  }, [category]);

  return (
    <FlexBox flexDirection="column" gap={1} overflow="auto">
      <List component="aside">
        {topDirs ? (
          topDirs.map((item) => <DirList key={item.path} path={item.path} />)
        ) : (
          <Skeleton width="100%" />
        )}
      </List>
    </FlexBox>
  );
};

const Aside: React.FC<{ side: boolean }> = ({ side }) => {
  return (
    <FlexBox
      flexDirection="column"
      gap={1}
      minWidth={"250px"}
      position="sticky"
      sx={{
        p: 2,
        pt: 4,
        pb: 4,
        height: side ? "100vh" : `calc(100vh - ${headerHeight})`,
        top: headerHeight,
        bgcolor: "aside",
      }}
    >
      <Category />
      <BlogList />
    </FlexBox>
  );
};

export default Aside;
