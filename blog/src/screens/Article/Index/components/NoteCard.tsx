import { faGit } from "@fortawesome/free-brands-svg-icons";
import { faDownload, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import styled from "styled-components";
import A from "../../../../components/A";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Flex from "../../../../components/Flex";
import P from "../../../../components/P";
import RouteLink from "../../../../components/RouteLink";
import useThemeChoice from "../../../../hooks/useThemeChoice";
import { ArticleInfo } from "../../../../shared/articles";
import { gapSelector, radiusSelector } from "../../../../utils/styledUtils";
import { transformGithubLinkToDownload } from "../../../../utils/urlUtils";

const NoteCardWrapper = styled(Card)<{ bgColor?: string }>`
  padding: 16px;
  border-radius: ${radiusSelector("md")};
  flex-direction: column;
  gap: ${gapSelector("xs")};
  align-items: flex-start;
  max-width: 350px;
  min-width: 300px;
  &:hover {
    box-shadow: 0px 0px 5px #444;
  }
`;

const FuncButton = styled(Button)<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 20px;
  padding: 4px 12px;
`;

type Props = {
  reposUrl: string;
  previewUrl: string;
  titleIcon?: ReactNode;
  title: string;
  tag: ReactNode;
  abstract: ReactNode;
};

const NoteCard: React.FC<Props> = ({
  reposUrl,
  previewUrl,
  titleIcon,
  title,
  tag,
  abstract,
}) => {
  const bgColor = useThemeChoice("#eaf4fe", "#41423c");
  const buttonColor = useThemeChoice("#222", "#ddd");
  const downLoadUrl = transformGithubLinkToDownload(reposUrl);

  return (
    <>
      <NoteCardWrapper bgColor={bgColor}>
        <Flex>
          <FuncButton bgColor={buttonColor}>
            <A weight="xl" shallow="md" color="reverse" href={reposUrl}>
              <FontAwesomeIcon icon={faGit} /> &nbsp;仓库
            </A>
          </FuncButton>
          <FuncButton bgColor={buttonColor}>
            <RouteLink
              to={previewUrl}
              color="reverse"
              shallow="md"
              weight="xl"
              style={{ padding: 0 }}
            >
              <FontAwesomeIcon icon={faEye} /> &nbsp;查看
            </RouteLink>
          </FuncButton>
          <FuncButton bgColor={buttonColor}>
            <A weight="xl" shallow="md" color="reverse" href={downLoadUrl}>
              <FontAwesomeIcon icon={faDownload} /> &nbsp;下载
            </A>
          </FuncButton>
        </Flex>
        <P size="xl" weight="xxl">
          {titleIcon && titleIcon} &nbsp;{title}
        </P>
        <P>
          <Flex gap="xs">{tag}</Flex>
        </P>
        <P>{abstract}</P>
      </NoteCardWrapper>
      {/* <PdfPreview url={downLoadUrl} /> */}
    </>
  );
};

export const noteCardSelector = (article: ArticleInfo, type: string) => {
  return (
    article.type === type && (
      <NoteCard
        key={article.title}
        reposUrl={article.reposUrl}
        previewUrl={`/article/${article.title}`}
        titleIcon={article.titleIcon}
        title={article.title}
        tag={article.tag}
        abstract={article.abstract}
      />
    )
  );
};

export default NoteCard;
