import {
  faCode,
  faDumbbell,
  faGraduationCap,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Brand } from "../../../components/Brand";
import Flex from "../../../components/Flex";
import { Img } from "../../../components/Img";
import P from "../../../components/P";
import { pionpill } from "../../../shared/img";
import { ContextWrapper, ImgWrapper, TextWrapper } from "./Wrapper";

export const Profile: React.FC = () => {
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
