import { faJava, faReact } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Brand from "../../../components/Brand";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import { Img } from "../../../components/Img";
import P from "../../../components/P";
import { pionpill } from "../../../shared/img";

const Future: React.FC = () => {
  return (
    <Flex bgSecond style={{ width: "100vw" }}>
      <Flex bleed gap="xl" limitWidth column>
        <H2>未来打算</H2>
        <Flex tabletResponsive gap="xl">
          <Flex style={{ maxWidth: "300px" }} column>
            <Img src={pionpill["pionpill-3"]} size="200px" height="200px" />
            <P>上班! 上班! 上班!</P>
            <Flex style={{ gap: "10px" }} wrap justify="center">
              <Brand>
                <FontAwesomeIcon icon={faJava} /> Java 后端
              </Brand>
              <Brand>
                <FontAwesomeIcon icon={faReact} /> TypeScript 前端
              </Brand>
            </Flex>
          </Flex>
          <Flex column align="flex-start" gap="xxs">
            <P>
              准备在长三角找一份工作，优先选择:
              无锡，苏州，上海，杭州，南京。以后准备在无锡定居。期望的职业类型:
              能学到东西，接受加班，不局限于前/后端。
            </P>
            <P>
              期望薪资:
              13-18k(看城市)。五险一金交全，至多接受10105，周末还是要有的。
            </P>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Future;
