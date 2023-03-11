import Page from "../../components/Flexed/Page";
import ArticleBanner from "./templates/ArticleBanner";
import FrontArticles from "./templates/FrontArticles";

const Article: React.FC = () => {
  return (
    <Page>
      <ArticleBanner />
      <FrontArticles />
    </Page>
  );
};

export default Article;
