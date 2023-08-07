import { Button, Skeleton, Typography } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import { Trans } from "react-i18next";
import { AiFillTags } from "react-icons/ai";
import { BsCalendarDateFill, BsStars } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import { MdCategory, MdTextSnippet, MdTimelapse, MdUpdate } from "react-icons/md";
import { useLocation, useNavigate } from "react-router";
import FlexBox from "../../../components/FlexBox";

// 后续持续增加 meta
export type ContentInfoType = {
  difficulty?: string;
  pre?: string;
  type?: "note" | "organize" | "origin"
};

const ContentInfo: React.FC<{
  meta: ContentInfoType;
  wordCount: number;
  createData: string;
  updateDate: string;
}> = ({ meta, wordCount, createData, updateDate }) => {
  const { difficulty, type, pre } = meta;
  const navigate = useNavigate();
  const locationPath = useLocation().pathname;
  const preList = pre?.split(" ");
  console.log(preList);

  const difficultyTextSelector = () => {
    return difficulty === "easy"
      ? "简单"
      : difficulty === "medium"
        ? "进阶"
        : difficulty === "hard"
          ? "底层"
          : difficulty
  }
  const typeTextSelector = () => {
    return type === "note"
      ? "笔记"
      : type === "organize"
        ? "整理"
        : "原创"
  }
  const calculateReadTime = () => {
    const multiple = difficulty === "easy"
      ? 1
      : difficulty === "medium"
        ? 1.2
        : difficulty === "hard"
          ? 1.5
          : 1
    return Math.ceil(wordCount / 200 * multiple);
  }

  const ContentTag: React.FC<
    PropsWithChildren<{ icon: ReactNode; title: string }>
  > = ({ icon, title, children }) => {
    return (
      <FlexBox alignItems="center" gap={1} sx={{ opacity: 0.75 }} title={title}>
        {icon}
        {
          children ?
            <Typography variant="subtitle2">{children}</Typography> : <Skeleton width={50} />
        }
      </FlexBox>
    );
  };

  return (
    <FlexBox flexDirection="column">
      <FlexBox alignItems="center" flexWrap="wrap" columnGap={1.5}>
        {type ? (
          <ContentTag icon={<BsStars />} title="类型">
            {typeTextSelector()}
          </ContentTag>
        ) : <Skeleton width={50} />}
        {difficulty ? (
          <ContentTag icon={<MdCategory />} title="难度">
            {difficultyTextSelector()}
          </ContentTag>
        ) : <Skeleton width={50} />}
        <ContentTag icon={<AiFillTags />} title="类型"><Trans i18nKey={`blog.${locationPath.split("/")[2]}`} />
        </ContentTag>
        <ContentTag icon={<MdTextSnippet />} title="字数">
          约 {wordCount} 字
        </ContentTag>
        <ContentTag icon={<MdTimelapse />} title="阅读时间">
          约 {calculateReadTime()} 分钟
        </ContentTag>
        <ContentTag icon={<BsCalendarDateFill />} title="创建时间">
          {createData}
        </ContentTag>
        <ContentTag icon={<MdUpdate />} title="更新时间">
          {updateDate}
        </ContentTag>
      </FlexBox>
      {
        preList &&
        <FlexBox alignItems="center" gap={1} sx={{ opacity: 0.75 }}>
          <FaClipboardList />
          <Typography variant="subtitle2">前置博客: </Typography>
          {
            preList.map((item) => {
              const preType = item[0] === "-" ? "optional" : item[0] === "+" ? "necessary" : "common";
              const blogName = item.split("/").pop()?.split("_").pop();
              const path = preType === "common" ? `/blog${item}` : `/blog${item.substring(1)}`
              return (
                <Button onClick={() => navigate(path)} color={preType === "necessary" ? "error" : preType === "optional" ? "success" : "primary"} sx={{ textTransform: 'none'}} size="small">
                  {blogName}
                </Button>)
            })
          }
        </FlexBox>
      }
    </FlexBox>
  );
};

export default ContentInfo;