import { faReact } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TagXX, TagXXX } from "../screens/Article/components/ArticleTag";

type ArticleInfo = {
  type: string;
};

const articles = {
  React: {
    type: "front",
    reposUrl:
      "https://github.com/Pionpill/Notebook-Code/blob/main/JavaScript/React/React.pdf",
    titleIcon: <FontAwesomeIcon icon={faReact} />,
    title: "React",
    tag: (
      <>
        <TagXX />
        <TagXXX />
      </>
    ),
    abstract:
      "React(hooks)基础, Redux 基础, axios, node-fetch 等常见前端组件。",
  },
};

export default articles;
