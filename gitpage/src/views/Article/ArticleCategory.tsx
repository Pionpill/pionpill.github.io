import { Button, Link, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { FaDownload, FaEye, FaGithub } from "react-icons/fa";
import FlexBox from "../../components/FlexBox";
import Wrapper from "../../components/Wrapper";
import { useMiddleMaxMedia, useSmallMedia } from "../../hooks/useMedia";
import useThemeChoice from "../../hooks/useThemeChoice";
import articles, { Article } from "../../shared/article";
import { singleOmit } from "../../styles/macro";
import { transformGithubReposToDownload } from "../../utils/url";

const ContentItem: React.FC<{ article: Article }> = ({ article }) => {
  const isSmallMedia = useSmallMedia();
  const downloadUrl = transformGithubReposToDownload(article.reposUrl);

  return (
    <FlexBox sx={{ alignItems: "center", flexWrap: "wrap" }} gap={2}>
      <FlexBox gap={2}>
        {article.titleIcon}
        <FlexBox sx={{ flexDirection: "column", width: "280px" }}>
          <Typography variant="h6" fontWeight="fontWeightBold">
            {article.title}
          </Typography>
          <Typography color="text.secondary" sx={singleOmit}>
            {article.abstract}
          </Typography>
        </FlexBox>
      </FlexBox>
      <FlexBox sx={{ alignItems: "center" }} gap={2}>
        {!isSmallMedia && (
          <Typography width="150px" sx={singleOmit}>
            {article.reference}
          </Typography>
        )}
        <FlexBox sx={{ alignItems: "center" }} gap={2}>
          <Link href={article.reposUrl} underline="none">
            <FaGithub />
            &nbsp;
            <Trans i18nKey="article.repository" />
          </Link>
          <Link href={`/article/pdf=${article.title}`} underline="none">
            <FaEye />
            &nbsp;
            <Trans i18nKey="article.see" />
          </Link>
          <Link href={downloadUrl} underline="none">
            <FaDownload />
            &nbsp;
            <Trans i18nKey="article.download" />
          </Link>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

type Props = {
  titleI18nKey: string;
  abstractI18nKey: string;
  type: string;
  id: string;
};

const ArticleCategory: React.FC<Props> = ({
  titleI18nKey,
  abstractI18nKey,
  type,
  id,
}) => {
  const isMiddleMedia = useMiddleMaxMedia();

  return (
    <Wrapper bgcolor="background.paper">
      <FlexBox
        sx={{
          width: "100%",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
        gap={3}
      >
        <FlexBox
          sx={{
            flexDirection: "column",
            width: isMiddleMedia ? "100%" : "350px",
          }}
          gap={1}
        >
          <Typography variant="h5" fontWeight="fontWeightBold" id={id}>
            <Trans i18nKey={titleI18nKey} />
          </Typography>
          <Typography color="text.secondary">
            <Trans i18nKey={abstractI18nKey} />
          </Typography>
          <FlexBox gap={2} sx={{ alignItems: "center" }}>
            <Link
              href="https://github.com/Pionpill/Notebook-Code"
              underline="none"
            >
              <Trans i18nKey="article.repository" />
            </Link>
            <Button variant="contained" size="small" color="secondary">
              <Trans i18nKey="article.relatedBlog" />
            </Button>
          </FlexBox>
        </FlexBox>
        <FlexBox
          sx={{
            backgroundColor: useThemeChoice("#f3f5f7", "#191f28"),
            flexDirection: "column",
          }}
          gap={4}
          p={3}
        >
          {Object.values(articles).map(
            (article) =>
              article.type === type && (
                <ContentItem article={article} key={article.title} />
              )
          )}
        </FlexBox>
      </FlexBox>
    </Wrapper>
  );
};

export default ArticleCategory;
