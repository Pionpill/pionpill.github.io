import {
  faCalculator,
  faComputer,
  faHouseFlag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Brand } from "../../../components/Brand";
import Flex from "../../../components/Flex";
import { Img } from "../../../components/Img";
import P from "../../../components/P";
import { pionpill } from "../../../shared/img";
import { ContextWrapper, ImgWrapper, TextWrapper } from "./Wrapper";

export const School: React.FC = () => {
  return (
    <ContextWrapper>
      <ImgWrapper>
        <Img
          src={pionpill["pionpill-2"]}
          size="200px"
          height="200px"
          border="8px"
        />
        <P type="reverse">明德格物，立己达人</P>
        <Flex gap="10px" wrap={true} justify="center">
          <Brand type="reverse" size="xsmall">
            <FontAwesomeIcon icon={faHouseFlag} /> 双一流
          </Brand>
          <Brand type="reverse" size="xsmall">
            <FontAwesomeIcon icon={faComputer} /> 软件工程
          </Brand>
          <Brand type="reverse" size="xsmall" color="red">
            <FontAwesomeIcon icon={faCalculator} /> 国赛一等奖
          </Brand>
        </Flex>
      </ImgWrapper>

      <TextWrapper>
        <P type="reverse" size="2x" weight="bold" space="huge">
          大学生活
        </P>
        <P type="reverse" wrap={true}>
          2019
          级南京信息工程大学软件工程系学生，在校任多项职务，大二加入学院课题组，在各方面均有一定建树。
        </P>
        <P type="reverse" wrap={true}>
          在校期间曾加入校社联设计部，院学生会学习部，院青年中心影像部。大二竞选成为院青新影像部部长，大三成为青新执行主席。在此期间图像，影像技能有所提升;
          学习如何处理人际关系，进行人员管理。
        </P>
        <ul>
          <li>
            大二寒假打数模美赛，取得一等奖;
            下学期带队打互联网+竞赛(由于名额内定未能入围，后来再没打过竞赛)。下学期加入课题组，参与中兴
            ARcore 室内导航试点项目。
          </li>
          <li>
            大三准备工作，先后系统地学习了 Python, Java, SpringBoot, TypeScript,
            React 并着手就业。
          </li>
          <li>
            大四上学期前往无锡国联证券技术总部实习。大四下学期准备完成毕业设计:
            基于 WebAR 的交互系统(React Native)。
          </li>
        </ul>
        <P type="reverse" wrap={true}>
          总的来说，吃饭的技能主要靠自学，学校里主要学习到一些理论知识，在竞赛和课题组项目中培养了一定的编程思维，数据分析能力，项目架构能力。
        </P>
        <P type="reverse" wrap={true}>
          必须吐槽大学的学阀风气，一类竞赛内定好了队伍还鼓励其他学生陪跑，带团队做了半个多月的项目全浪费了，真是世间险恶。
        </P>
      </TextWrapper>
    </ContextWrapper>
  );
};
