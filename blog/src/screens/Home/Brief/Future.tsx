import { faJava, faReact } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Brand } from "../../../components/Brand";
import Flex from "../../../components/Flex";
import { Img } from "../../../components/Img";
import P from "../../../components/P";
import { pionpill } from "../../../shared/img";
import { ContextWrapper, ImgWrapper, TextWrapper } from "./Wrapper";

export const Future: React.FC = () => {
  return (
    <ContextWrapper>
      <ImgWrapper>
        <Img
          src={pionpill["pionpill-3"]}
          size="200px"
          height="200px"
          border="8px"
        />
        <P type="reverse">上班! 上班! 上班!</P>
        <Flex gap="10px" wrap={true} justify="center">
          <Brand type="reverse" size="xsmall">
            <FontAwesomeIcon icon={faJava} /> Java 后端
          </Brand>
          <Brand type="reverse" size="xsmall">
            <FontAwesomeIcon icon={faReact} /> TypeScript 前端
          </Brand>
        </Flex>
      </ImgWrapper>

      <TextWrapper>
        <P type="reverse" size="2x" weight="bold" space="huge">
          未来打算
        </P>
        <P type="reverse" wrap={true}>
          准备在长三角找一份工作，优先选择:
          无锡，苏州，上海，杭州，南京。以后准备在无锡定居。
        </P>
        <P type="reverse" wrap={true}>
          期望的职业类型: 能学到东西，接受加班，不局限于前/后端。
        </P>
        <P type="reverse" wrap={true}>
          期望薪资:
          12-18k(看城市)。五险一金交全，至多接受10105，周末还是要有的。
        </P>
        <P type="reverse" wrap={true}>
          如果您是HR，请查看技能页查看我的技术栈，Project
          页查看我做过的项目，Article 页查看我的一些笔记和文章。
        </P>
      </TextWrapper>
    </ContextWrapper>
  );
};
