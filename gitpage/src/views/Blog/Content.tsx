import { Breadcrumbs, Container, Link, Typography } from "@mui/material";
import React, { PropsWithChildren, ReactNode } from "react";
import { Trans } from "react-i18next";
import { AiFillTags } from "react-icons/ai";
import { BsCalendarDateFill } from "react-icons/bs";
import { FcDocument } from "react-icons/fc";
import {
  MdCategory,
  MdTextSnippet,
  MdTimelapse,
  MdUpdate,
} from "react-icons/md";
import { useLocation } from "react-router";
import yaml from "yaml";
import { blogCommitApi } from "../../api/github/githubApi";
import FlexBox from "../../components/FlexBox";
import MarkdownContent from "../../components/MarkdownContent";
import {
  useLargeMedia,
  useSmallMedia,
  useXLargeMinMedia,
} from "../../hooks/useMedia";
import { headerHeight } from "../../shared/config";
import { blogTheme } from "../../styles/theme";

const DefaultContent: React.FC = () => {
  return (
    <FlexBox>
      <Typography variant="h1">123</Typography>
    </FlexBox>
  );
};

type MetaInfo = {
  difficulty?: string;
};

const MetaInfo: React.FC<{
  meta: MetaInfo;
  wordCount: number;
  createData: string;
  updateDate: string;
}> = ({ meta, wordCount, createData, updateDate }) => {
  const { difficulty } = meta;
  const location = useLocation().pathname;

  const ContentTag: React.FC<
    PropsWithChildren<{ icon: ReactNode; title: string }>
  > = ({ icon, title, children }) => {
    return (
      <FlexBox alignItems="center" gap={1} sx={{ opacity: 0.75 }} title={title}>
        {icon}
        <Typography variant="subtitle2">{children}</Typography>
      </FlexBox>
    );
  };

  return (
    <FlexBox alignItems="center" flexWrap="wrap" columnGap={1}>
      {difficulty && (
        <ContentTag icon={<MdCategory />} title="难度">
          {difficulty === "easy"
            ? "简单"
            : difficulty === "medium"
            ? "进阶"
            : difficulty === "hard"
            ? "底层"
            : difficulty}
        </ContentTag>
      )}
      <ContentTag icon={<AiFillTags />} title="类型">
        <Trans i18nKey={`blog.${location.split("/")[2]}`} />
      </ContentTag>
      <ContentTag icon={<MdTextSnippet />} title="字数">
        约 {wordCount} 字
      </ContentTag>
      <ContentTag icon={<MdTimelapse />} title="阅读时间">
        约 {Math.ceil(wordCount / 200)} 分钟
      </ContentTag>
      <ContentTag icon={<BsCalendarDateFill />} title="创建事件">
        {createData}
      </ContentTag>
      <ContentTag icon={<MdUpdate />} title="更新时间">
        {updateDate}
      </ContentTag>
    </FlexBox>
  );
};

const Content: React.FC = () => {
  const [content, setContent] = React.useState<string>("");
  const [meta, setMeta] = React.useState<MetaInfo>({});
  const [wordCount, setWordCount] = React.useState<number>(0);
  const [createDate, setCreateDate] = React.useState<string>("");
  const [updateDate, setUpdateDate] = React.useState<string>("");
  const [toc, setToc] = React.useState<
    Array<{ hierarchy: number; title: string }>
  >([]);
  const isSmallMedia = useSmallMedia();
  const isLargeMedia = useLargeMedia();
  const locationPath = decodeURIComponent(useLocation().pathname);
  const locationHash = decodeURIComponent(useLocation().hash);

  const getData = (obj: any) =>
    obj["commit"]["author"]["date"].substring(0, 10);

  const fetchMarkdownContent = () => {
    return fetch(
      `https://raw.githubusercontent.com/Pionpill/pionpill.github.io/main/${locationPath}.md`
    )
      .then(async (response) => response.text())
      .then((text: string) => {
        // 设置内容与 meta 信息
        const textArray = text.split("---\n").filter(Boolean);
        setContent(textArray[1]);
        setMeta(yaml.parse(textArray[0]));
        // 获取 toc
        const dirRegex = /^#{2,3}\s+(.*)$/gm;
        const tocList: Array<{ hierarchy: number; title: string }> = [];
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
        setWordCount(matches ? matches.length : 0);
      });
  };

  const fetchMarkdownInfo = () => {
    return blogCommitApi(`${locationPath.substring(1)}.md`)
      .then((response) => response.json())
      .then((response) => {
        setCreateDate(getData(response[0]));
        setUpdateDate(getData(response[response.length - 1]));
      });
  };

  const scrollToAnchor = (anchor: string) => {
    const element: HTMLElement | null = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  React.useEffect(() => {
    if (locationPath.substring(6)) {
      const contentFetch = fetchMarkdownContent();
      const infoFetch = fetchMarkdownInfo();
      Promise.all([contentFetch, infoFetch]).then(() => {
        setTimeout(() => scrollToAnchor(locationHash.substring(1)), 300);
      });
    }
  }, [locationPath]);

  return (
    <>
      <FlexBox width="100%">
        <Container
          maxWidth={isLargeMedia ? "lg" : isSmallMedia ? "sm" : "md"}
          component="main"
          sx={{ p: 2, pt: 4, pb: 4, width: "100vw", gap: 2 }}
        >
          <FlexBox flexDirection="column" width="100%" gap={1}>
            <FlexBox
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
            >
              <FlexBox alignItems="center">
                <FcDocument />
                <Breadcrumbs>
                  {locationPath
                    .replace("/blog", "")
                    .split("/")
                    .map((path) => (
                      <Typography>
                        {path.includes("_") ? path.split("_")[1] : path}
                      </Typography>
                    ))}
                </Breadcrumbs>
              </FlexBox>
              <Link
                href={`https://github.com/Pionpill/pionpill.github.io/blob/main${locationPath}.md`}
                sx={{
                  textDecoration: "none",
                  alignItems: "center",
                }}
              >
                在 Github 上编辑
              </Link>
            </FlexBox>
            <MetaInfo
              meta={meta}
              wordCount={wordCount}
              createData={createDate}
              updateDate={updateDate}
            />
          </FlexBox>
          {locationPath ? (
            <MarkdownContent children={content} />
          ) : (
            <DefaultContent />
          )}
        </Container>
      </FlexBox>
      {toc && useXLargeMinMedia() && (
        <FlexBox
          flexDirection="column"
          sx={{
            p: 4,
            top: headerHeight,
            height: `calc(100vh - ${headerHeight})`,
          }}
          width="300px"
          position="sticky"
        >
          {toc.map((item) => {
            return (
              <Link
                sx={{
                  color: blogTheme[700],
                  fontSize: "0.875em",
                  fontWeight: item.hierarchy === 2 ? 600 : 400,
                  pl: item.hierarchy === 2 ? 0 : 2,
                  pb: item.hierarchy === 2 ? 1 : 0.5,
                  textDecoration: "none",
                  cursor: "pointer",
                  opacity: 0.75,
                }}
                onClick={() => {
                  console.log(item.title.replace(/\s/g, ""));
                  scrollToAnchor(item.title.replace(/\s/g, ""));
                }}
              >
                {item.title}
              </Link>
            );
          })}
        </FlexBox>
      )}
    </>
  );
};

export default Content;
