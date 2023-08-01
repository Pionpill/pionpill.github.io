import { Skeleton, Typography } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import { Trans } from "react-i18next";
import { AiFillTags } from "react-icons/ai";
import { BsCalendarDateFill } from "react-icons/bs";
import { MdCategory, MdTextSnippet, MdTimelapse, MdUpdate } from "react-icons/md";
import { useLocation } from "react-router";
import FlexBox from "../../../components/FlexBox";

// 后续持续增加 meta
export type ContentInfoType = {
  difficulty?: string;
};

const ContentInfo: React.FC<{
  meta: ContentInfoType;
  wordCount: number;
  createData: string;
  updateDate: string;
}> = ({ meta, wordCount, createData, updateDate }) => {
  const { difficulty } = meta;
  const locationPath = useLocation().pathname;

  const difficultyTextSelector = () => {
    return difficulty === "easy"
      ? "简单"
      : difficulty === "medium"
        ? "进阶"
        : difficulty === "hard"
          ? "底层"
          : difficulty
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
    <FlexBox alignItems="center" flexWrap="wrap" columnGap={1.5}>
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
      <ContentTag icon={<BsCalendarDateFill />} title="创建事件">
        {createData}
      </ContentTag>
      <ContentTag icon={<MdUpdate />} title="更新时间">
        {updateDate}
      </ContentTag>
    </FlexBox>
  );
};

export default ContentInfo;