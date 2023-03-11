import {
  faCode,
  faDumbbell,
  faGraduationCap,
  faStar,
  faUpLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Brand from "../../../components/Brand";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import { Img } from "../../../components/Img";
import P from "../../../components/P";
import { pionpill } from "../../../shared/img";

const Profile: React.FC = () => {
  return (
    <Flex bleed gap="xl" limitWidth column fullWidth>
      <H2>个人简介</H2>
      <Flex tabletResponsive>
        <Flex style={{ maxWidth: "300px" }} column>
          <Img
            src={`${pionpill["collage"]}?imageMogr2/thumbnail/200x`}
            size="200px"
            height="200px"
            alt="大二办公抓拍"
          />
          <P>
            完成一份工作后 <FontAwesomeIcon icon={faUpLong} />
          </P>
          <Flex style={{ gap: "10px" }} wrap justify="center">
            <Brand>
              <FontAwesomeIcon icon={faGraduationCap} /> 大学生
            </Brand>
            <Brand color="red">
              <FontAwesomeIcon icon={faStar} /> 中共党员
            </Brand>
            <Brand>
              <FontAwesomeIcon icon={faCode} /> 技术宅
            </Brand>
            <Brand>
              <FontAwesomeIcon icon={faDumbbell} /> 健身
            </Brand>
          </Flex>
        </Flex>
        <Flex column align="flex-start" gap="xxs">
          <P>
            南京信息工程大学大四在校生，中共党员，找工作中。主要方向为
            Java后端开发，TypeScript
            前端开发。我的世界开发者，在学校课题组参与过多个华为与中兴的试点项目。
          </P>
          <P>
            打过一些比赛，拿得出手的由 <strong>美国大学生数学建模竞赛</strong>{" "}
            Meritorious Winner(一等奖) ，参与过中兴 ARCore 等企业
            试点项目，带队参与过多项竞赛，在学生组织任主席团成员承办过各类活动。
          </P>
          <P>
            平时喜欢自学一些技术软件，在校期间出于兴趣自学了 PhotoShop,
            LightRoom, Illustrator, InDeign, Premiere Pro, Blender
            等影像处理软件。为了做 MC 开发学习了 Gaea(地形创作软件),
            BlockBench(体素) 等软件。
          </P>
          <P>
            生活中比较宅，没事喜欢打游戏，做点小项目；喜欢乡下，喜欢摄影，有一台单反(Sony
            A7m3)，坚持健身，喜欢打羽毛球，游泳。
          </P>
          <P>喜欢玩 Minecraft, RimWorld，帝国时代4，战地系列，巫师3。</P>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Profile;
