import { useParams } from "react-router";
import Flex from "../../../components/Flex";
import H1 from "../../../components/H1";
import P from "../../../components/P";
import RouteLink from "../../../components/RouteLink";
import articles, { ArticleInfo } from "../../../shared/articles";

const PdfError: React.FC = () => {
  const articleName = useParams().articleName;
  const getArticleLink = (article: ArticleInfo): string => {
    const name = article.title;
    return `/article/${name}`;
  };
  return (
    <Flex
      column
      gap="xxs"
      padding="48px 0"
      style={{ width: "100%", minHeight: "500px" }}
    >
      <H1>Sorry</H1>
      <P isTitle>Article not found</P>
      <P size="lg" center>
        没有找到文章: {articleName}，请重新回到 Article 页
      </P>
      <P size="lg">目前可参阅的文章如下</P>
      {Object.keys(articles).map((article) => (
        <RouteLink
          color="blue"
          to={getArticleLink(articles[article as keyof typeof articles])}
        >
          {articles[article as keyof typeof articles].title}
        </RouteLink>
      ))}
      <P size="lg" shallow="md" center>
        =.= 开发阶段 URL 变化频繁，请谅解 =.=
      </P>
    </Flex>
  );
};

export default PdfError;
