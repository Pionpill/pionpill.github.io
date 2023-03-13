import ArticleBanner from "./ArticleBanner";
import BackArticles from "./BackArticles";
import FrontArticles from "./FrontArticles";
import OtherArticles from "./OtherArticles";

const Article: React.FC = () => {
  return (
    <>
      <ArticleBanner />
      <FrontArticles />
      <BackArticles />
      <OtherArticles />
    </>
  );
};

export default Article;
