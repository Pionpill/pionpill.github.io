import ArticleCategory from "./ArticleCategory";
import Banner from "./Banner";
import Instruction from "./Instruction";

const Article: React.FC = () => {
  const config = [
    {
      titleI18nKey: "article.front",
      abstractI18nKey: "article.frontAbstract",
      type: "front",
      id: "article-front",
      url: "/blog/readme?category=front",
    },
    {
      titleI18nKey: "article.back",
      abstractI18nKey: "article.backAbstract",
      type: "back",
      id: "article-back",
    },
    {
      titleI18nKey: "article.sql",
      abstractI18nKey: "article.sqlAbstract",
      type: "sql",
      id: "article-sql",
      url: "/blog/readme?category=sql",
    },
    {
      titleI18nKey: "article.lang",
      abstractI18nKey: "article.langAbstract",
      type: "lang",
      id: "article-lang",
    },
    {
      titleI18nKey: "article.cs",
      abstractI18nKey: "article.csAbstract",
      type: "cs",
      id: "article-cs",
    },
  ];

  return (
    <>
      <Banner />
      {config.map(({ titleI18nKey, abstractI18nKey, type, id, url }) => (
        <ArticleCategory
          titleI18nKey={titleI18nKey}
          abstractI18nKey={abstractI18nKey}
          type={type}
          id={id}
          url={url}
          key={id}
        />
      ))}
      <Instruction />
    </>
  );
};

export default Article;
