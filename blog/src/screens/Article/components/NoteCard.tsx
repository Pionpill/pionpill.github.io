import { faGit } from "@fortawesome/free-brands-svg-icons";
import { faDownload, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import styled from "styled-components";
import A from "../../../components/A";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Flex from "../../../components/Flex";
import P from "../../../components/P";
import PdfPreview from "../../../components/PdfPreview";
import useThemeChoice from "../../../hooks/useThemeChoice";
import { gapSelector, radiusSelector } from "../../../utils/styledUtils";

const NoteCardWrapper = styled(Card)<{ bgColor?: string }>`
  padding: 16px;
  border-radius: ${radiusSelector("md")};
  flex-direction: column;
  gap: ${gapSelector("xs")};
  align-items: flex-start;
  max-width: 350px;
  min-width: 300px;
`;

const FuncButton = styled(Button)<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 20px;
  padding: 4px 12px;
`;

type Props = {
  reposUrl: string;
  titleIcon: ReactNode;
  title: string;
  tag: ReactNode;
  abstract: ReactNode;
};

const NoteCard: React.FC<Props> = ({
  reposUrl,
  titleIcon,
  title,
  tag,
  abstract,
}) => {
  const bgColor = useThemeChoice("#eaf4fe", "#354e6b");
  const buttonColor = useThemeChoice("#222", "#ddd");
  const downLoadUrl = reposUrl
    .replace("github.com", "raw.githubusercontent.com")
    .replace("blob/", "");

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
            <A weight="xl" shallow="md" color="reverse">
              <FontAwesomeIcon icon={faEye} /> &nbsp;预览
            </A>
          </FuncButton>
          <FuncButton bgColor={buttonColor}>
            <A weight="xl" shallow="md" color="reverse" href={downLoadUrl}>
              <FontAwesomeIcon icon={faDownload} /> &nbsp;下载
            </A>
          </FuncButton>
        </Flex>
        <P size="xl" weight="xl">
          {titleIcon} &nbsp;{title}
        </P>
        <Flex>{tag}</Flex>
        <Flex column gap="xxs" align="flex-start">
          <P>{abstract}</P>
        </Flex>
      </NoteCardWrapper>
      <PdfPreview url={downLoadUrl} />
    </>
  );
};

export default NoteCard;
