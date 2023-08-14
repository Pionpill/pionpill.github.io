import {
  Button,
  Container,
  Drawer,
  Skeleton,
  SxProps,
  Typography
} from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";
import { Trans } from "react-i18next";
import { BiErrorCircle } from "react-icons/bi";
import { FaGithub } from "react-icons/fa";
import { TbArrowBigLeftLinesFilled, TbArrowBigRightLinesFilled } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import yaml from "yaml";
import { blogCommitApi } from "../../api/github/githubApi";
import FlexBox from "../../components/FlexBox";
import MarkdownContent from "../../components/MarkdownContent";
import {
  useLargeMedia,
  useSmallMedia,
  useXLargeMinMedia,
} from "../../hooks/useMedia";
import { RootState } from "../../stores";
import { toggleTocOpen } from "../../stores/blogSlice";
import { blogTheme } from "../../styles/theme";
import { getBlogFilePath, getBlogGithubPath, getRelatedBlogName, getRelatedBlogPath } from "../../utils/blog";
import { throttle } from "../../utils/optimize";
import { scrollToAnchor } from "../../utils/window";
import ContentBreadcrumbs from "./templates/ContentBreadcrumbs";
import ContentInfo, { ContentInfoType } from "./templates/ContentInfo";
import ContentTOC from "./templates/ContentTOC";

const RelatedBlogLink: React.FC<{ type: 'pre' | 'rear', link: string }> = ({ type, link }) => {
  const navigate = useNavigate();
  const blogName = getRelatedBlogName(link);
  const blogPath = getRelatedBlogPath(link, type);
  const wrapperSx: SxProps = {
    gap: 1,
    position: 'absolute',
    top: 1,
    left: type === 'pre' ? 0 : 'auto',
    right: type === 'rear' ? 0 : 'auto',
  }

  return (
    <FlexBox sx={wrapperSx}>
      <Button onClick={() => navigate(blogPath)} sx={{ gap: 1, color: blogTheme[600] }}>{type === 'pre' && <TbArrowBigLeftLinesFilled />}
        {blogName} {type === 'rear' && <TbArrowBigRightLinesFilled />}
      </Button>
    </FlexBox>
  )
}

const Content: React.FC = () => {
  const tocOpen = useSelector((state: RootState) => state.blog.tocOpen);

  const [content, setContent] = React.useState<string>("");
  const [meta, setMeta] = React.useState<ContentInfoType>({});
  const [wordCount, setWordCount] = React.useState<number>(0);
  const [createDate, setCreateDate] = React.useState<string>("");
  const [updateDate, setUpdateDate] = React.useState<string>("");
  const [toc, setToc] = React.useState<
    Array<{ hierarchy: number; title: string }>
  >([]);
  const [fetchResult, setFetchResult] = React.useState<boolean>(true);
  const [preBlogMetaInfo, setPreBlogMetaInfo] = React.useState<string | undefined>();
  const [rearBlogMetaInfo, setRearBlogMetaInfo] = React.useState<string | undefined>();

  const isSmallMedia = useSmallMedia();
  const isLargeMedia = useLargeMedia();
  const locationPath = decodeURIComponent(useLocation().pathname);
  const locationHash = decodeURIComponent(useLocation().hash);
  const isXLargeMinMedia = useXLargeMinMedia();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = (obj: any) =>
    obj["commit"]["author"]["date"].substring(0, 10);

  const fetchMarkdownContent = async () => {
    const response = await fetch( getBlogFilePath(locationPath) );
    const text = await response.text();
    // 设置内容与 meta 信息
    const textArray = text.split("---\n").filter(Boolean);
    setContent(textArray[1]);
    setMeta(yaml.parse(textArray[0]));
    setPreBlogMetaInfo(getStrongRelatedBlog(yaml.parse(textArray[0]).pre));
    setRearBlogMetaInfo(getStrongRelatedBlog(yaml.parse(textArray[0]).rear));
    // 获取 toc
    const dirRegex = /^#{2,3}\s+(.*)$/gm;
    const tocList: Array<{ hierarchy: number; title: string; }> = [];
    let match;
    while ((match = dirRegex.exec(textArray[1])) !== null) {
      const hie = match[0][2] === "#" ? 3 : 2;
      const headingContent = match[1];
      tocList.push({ hierarchy: hie, title: headingContent });
    }
    setToc(tocList);
    // 统计字数
    const textRegex = /[\u4e00-\u9fa5]|(\b[A-Za-z]+\b)/g;
    const matches = textArray[1].match(textRegex);
    setWordCount((matches && matches.length) ? matches.length : 0);
  };

  const fetchMarkdownInfo = async () => {
    return blogCommitApi(`${locationPath.substring(1)}.md`)
      .then((response) => response.json())
      .then((response) => {
        setCreateDate(getData(response[response.length - 1]));
        setUpdateDate(getData(response[0]));
      }).catch(() => setFetchResult(false));
  };

  const highlightToc = (
    sectionElementOffsetTopList: Array<number>,
    tocElementList: NodeListOf<HTMLElement>
  ) => {
    const currentScroll = window.scrollY;
    let currentElementIndex = 0;

    for (const [index, offsetTop] of sectionElementOffsetTopList.entries()) {
      tocElementList[index].style.opacity = "0.75";
      tocElementList[index].style.borderLeft = "0px";
      tocElementList[index].style.zIndex = "100";
      const distance = currentScroll - offsetTop + 1;
      if (distance >= 0) {
        currentElementIndex = index;
      }
    }
    tocElementList[
      currentElementIndex
    ].style.borderLeft = `3px solid ${blogTheme[700]}`;
    tocElementList[currentElementIndex].style.opacity = "1";
  };

  const getStrongRelatedBlog = (blogs: string | undefined) => {
    if (!blogs) return;
    const blogList = blogs.split(" ");
    console.log(blogList);
    for (let i = 0; i < blogList.length; i++)
      if (blogList[i][0] === "+")
        return blogList[i];
  };

  React.useEffect(() => {
    if (locationPath.substring(6)) {
      const contentFetch = fetchMarkdownContent();
      const infoFetch = fetchMarkdownInfo();
      Promise.all([contentFetch, infoFetch]).then(() => {
        setTimeout(() => scrollToAnchor(locationHash.substring(1)), 1000);
      });
    }
    setTimeout(() => {
      const tocElementList: NodeListOf<HTMLElement> = document.querySelectorAll(".toc");
      const sectionElementList: NodeListOf<HTMLElement> = document.querySelectorAll("h2[id], h3[id]");
      // scrollIntoView 后 offsetTop 会出错，因此提前获取 offSet 列表
      let sectionElementOffsetTopList: Array<number> = [];
      for (const sectionElement of sectionElementList) {
        sectionElementOffsetTopList.push(sectionElement.offsetTop);
      }
      if (tocElementList.length !== 0) {
        highlightToc(sectionElementOffsetTopList, tocElementList);
        window.addEventListener(
          "scroll",
          throttle(
            () => highlightToc(sectionElementOffsetTopList, tocElementList),
            100
          )
        );
      }
    }, 2000);
  }, [locationPath]);

  return (
    <>
      <FlexBox width="100%" sx={{bgcolor: "content"}}>
        <Container
          maxWidth={isLargeMedia ? "lg" : isSmallMedia ? "sm" : "md"}
          component="main"
          sx={{ p: 2, pt: 4, pb: 4, width: "100vw", gap: 2 }}
        >
          <FlexBox flexDirection="column" width="100%" gap={1}>
            <ContentBreadcrumbs />
            <ContentInfo
              meta={meta}
              wordCount={wordCount}
              createData={createDate}
              updateDate={updateDate}
            />
          </FlexBox>
          {!fetchResult ? <>
            <FlexBox
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ width: "100%", height: "100%" }}
              gap={2}
            >
              <BiErrorCircle color={red[500]} size={52} />
              <Typography variant="h4" fontWeight="fontWeightBold">
                <Trans i18nKey="blog.errorTitle" />
              </Typography>
              <Typography color="text.secondary" align="center">
                <Trans i18nKey="blog.errorMessage" />
              </Typography>
              <Button variant="contained" size="large" onClick={() => navigate("/blog")}>
                <Trans i18nKey="root.errorJump" />
              </Button>
            </FlexBox>
          </> : content ? <MarkdownContent children={content} /> : <>
            <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="rounded" width="100%" height={500} />
          </>
          }
          <FlexBox alignContent="flex-end" justifyContent="flex-end" sx={{ mb: 1 }}>
            <Button variant="text" sx={{ gap: 1 }} onClick={() => {
              window.open( getBlogGithubPath(locationPath) );
            }}>
              <FaGithub /> <Trans i18nKey="common.editOnGithub" />
            </Button>
          </FlexBox>
          {
            (preBlogMetaInfo || rearBlogMetaInfo) &&
            <FlexBox sx={{ position: 'relative', height: '40px', borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: 'divider' }}>
              {preBlogMetaInfo && <RelatedBlogLink type="pre" link={preBlogMetaInfo} />}
              {rearBlogMetaInfo && <RelatedBlogLink type="rear" link={rearBlogMetaInfo} />}
            </FlexBox>
          }
        </Container>
      </FlexBox>
      {isXLargeMinMedia ? (
        <ContentTOC toc={toc} />
      ) : (
        <Drawer anchor="right" open={tocOpen} onClose={() => dispatch(toggleTocOpen())}>
          <ContentTOC toc={toc} side />
        </Drawer>
      )}
    </>
  );
};

export default Content;
