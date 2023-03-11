import { faReact } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import { TagXX, TagXXX } from "../components/ArticleTag";
import NoteCard from "../components/NoteCard";

const FrontArticles: React.FC = () => {
  return (
    <Flex fullWidth>
      <Flex bleed column gap="lg">
        <H2 space="6px">前端笔记</H2>
        <Flex>
          <NoteCard
            reposUrl="https://github.com/Pionpill/Notebook-Code/blob/main/JavaScript/React/React.pdf"
            titleIcon={<FontAwesomeIcon icon={faReact} />}
            title="React"
            tag={
              <>
                <TagXX />
                <TagXXX />
              </>
            }
            abstract="React(hooks)基础, Redux 基础, axios, node-fetch 等常见前端组件。"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FrontArticles;
