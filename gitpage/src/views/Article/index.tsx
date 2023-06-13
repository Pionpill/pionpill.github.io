import ArticleCategory from "./ArticleCategory";
import Banner from "./Banner";
import Instruction from "./Instruction";

const Article: React.FC = () => {
  return (
    <>
      <Banner />
      <ArticleCategory
        titleI18nKey="article.front"
        abstractI18nKey="article.frontAbstract"
        type="front"
        id="article-front"
      />
      <ArticleCategory
        titleI18nKey="article.back"
        abstractI18nKey="article.backAbstract"
        type="back"
        id="article-back"
      />
      <ArticleCategory
        titleI18nKey="article.sql"
        abstractI18nKey="article.sqlAbstract"
        type="sql"
        id="article-sql"
      />
      <ArticleCategory
        titleI18nKey="article.lang"
        abstractI18nKey="article.langAbstract"
        type="lang"
        id="article-lang"
      />
      <ArticleCategory
        titleI18nKey="article.cs"
        abstractI18nKey="article.csAbstract"
        type="cs"
        id="article-cs"
      />
      <Instruction />
    </>
  );
};

export default Article;
