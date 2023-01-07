import { faJava, faReact } from "@fortawesome/free-brands-svg-icons";
import {
  faCalculator,
  faCode,
  faComputer,
  faDumbbell,
  faGraduationCap,
  faHouseFlag,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { Brand } from "../../components/Brand";
import Flex from "../../components/Flex";
import { Img } from "../../components/Img";
import P from "../../components/P";
import { pionpill } from "../../shared/img";

const Wrapper = styled(Flex)`
  justify-content: center;
  background-color: ${(props) => props.theme.main};
  color: ${(props) => props.theme.text_reverse};
  gap: 50px;
  padding: 1em 5%;
  flex-direction: column;
`;

const ContextWrapper = styled(Flex)`
  padding: 1em;
  width: 100%;
  gap: 5%;
  @media screen and (max-width: 1080px) {
    flex-direction: column;
    align-items: center;
    gap: 25px;
  }
`;

const ImgWrapper = styled(Flex)`
  flex-direction: column;
  gap: 1em;
  width: 25%;
  align-items: center;
  @media screen and (max-width: 1080px) {
    width: 75%;
  }
`;

const TextWrapper = styled(Flex)`
  flex-direction: column;
  width: 70%;
  @media screen and (max-width: 1080px) {
    width: 95%;
    align-items: center;
  }
`;

const Profile: React.FC = () => {
  return (
    <ContextWrapper>
      <ImgWrapper>
        <Img
          src={pionpill["pionpill-1"]}
          size="200px"
          height="200px"
          border="8px"
        />
        <P type="reverse">Talk is easy, Show me your code</P>
        <Flex gap="10px" wrap={true} justify="center">
          <Brand type="reverse" size="xsmall">
            <FontAwesomeIcon icon={faGraduationCap} /> 大学生
          </Brand>
          <Brand type="reverse" size="xsmall" color="red">
            <FontAwesomeIcon icon={faStar} /> 中共党员
          </Brand>
          <Brand type="reverse" size="xsmall">
            <FontAwesomeIcon icon={faCode} /> 技术宅
          </Brand>
          <Brand type="reverse" size="xsmall">
            <FontAwesomeIcon icon={faDumbbell} /> 健身
          </Brand>
        </Flex>
      </ImgWrapper>

      <TextWrapper>
        <P type="reverse" size="2x" weight="bold" space="huge">
          个人简介
        </P>
        <P type="reverse" wrap={true}>
          南京信息工程大学大四在校生，中共党员，目前正准备2023年春招找工作。主要方向为
          Java后端开发，TypeScript
          前端开发。平时在网易我的世界开发一些模组，在学校课题组参与过多个华为与中兴的试点项目。技能点较广，对
          Java(SpringBoot)，TypeScript(React)，Python，C#(Unity)，LaTex
          均有一定了解。
        </P>
        <P type="reverse" wrap={true}>
          在校期间获得过 <strong>美国大学生数学建模竞赛</strong> Meritorious
          Winner(一等奖) 等奖项，参与过中兴 ARCore 等企业
          试点项目，带队参与过多项竞赛，在学生组织任主席团成员承办过各类活动。
        </P>
        <P type="reverse" wrap={true}>
          平时喜欢自学一些技术软件，在校期间出于兴趣自学了 PhotoShop, LightRoom,
          Illustrator, InDeign, Premiere Pro, Blender 等影像处理软件。为了做 MC
          开发学习了 Gaea(地形创作软件), BlockBench(体素) 等软件。
        </P>
        <P type="reverse" wrap={true}>
          生活中比较宅，没事喜欢打游戏，做点小项目；拒绝逛街，讨厌市中心，喜欢乡下。喜欢摄影，有一台单反(Sony
          A7m3)，坚持健身，喜欢打羽毛球，游泳。
        </P>
        <P type="reverse" wrap={true}>
          喜欢玩 Minecraft,
          RimWorld，帝国时代4，战地系列，巫师3。不喜欢王者荣耀，吃鸡。
        </P>
        <P type="reverse" wrap={true}>
          具体项目/作品内容在对应界面下有展示
        </P>
      </TextWrapper>
    </ContextWrapper>
  );
};

const School: React.FC = () => {
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

const Future: React.FC = () => {
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

export const BriefContext: React.FC = () => {
  return (
    <Wrapper gap="1em">
      <Profile />
      <School />
      <Future />
    </Wrapper>
  );
};
