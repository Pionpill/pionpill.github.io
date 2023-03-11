import { faJava, faJs, faPython } from "@fortawesome/free-brands-svg-icons";
import {
  faBook,
  faDumbbell,
  faGraduationCap,
  faLeftLong,
  faNewspaper,
  faStar,
  faSwimmer,
  faTrophy,
  faUpLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { MdOutlineSportsTennis } from "react-icons/md";
import {
  SiAdobeillustrator,
  SiAdobelightroom,
  SiAdobephotoshop,
  SiBlender,
  SiLatex,
} from "react-icons/si";
import Absolute from "../../../components/Absolute";
import Board from "../../../components/Board";
import Brand from "../../../components/Brand";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import P from "../../../components/P";
import useThemeChoice from "../../../hooks/useThemeChoice";
import { isPhone } from "../../../utils/responsiveUtils";

type Props = { children: ReactNode };

const CircleIcon: React.FC<Props> = ({ children }) => {
  const bgColor = useThemeChoice("#f1f2f6", "#2a2a2a");
  return (
    <Flex
      radius="circle"
      style={{ backgroundColor: bgColor, minWidth: "36px", minHeight: "36px" }}
    >
      {children}
    </Flex>
  );
};

const Collage: React.FC = () => {
  const color = useThemeChoice("#bdc3c7", "#636e72");
  return (
    <Flex column bleed limitWidth gap="xl" fullWidth>
      <H2>大学生活</H2>
      <Flex phoneResponsive gap="xl">
        <Board width="300px" height="300px">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1942"
            width="300"
            height="300"
          >
            <path d="M150 75 L150 225" stroke={color}></path>
            <path d="M75 150 L226 150" stroke={color}></path>
          </svg>
          <Absolute x="150px" y="150px">
            <CircleIcon>
              <FontAwesomeIcon
                icon={faGraduationCap}
                color="#fc9588"
                size="xl"
              />
            </CircleIcon>
          </Absolute>
          <Absolute x="150px" y="50px">
            <CircleIcon>
              <FontAwesomeIcon icon={faTrophy} color="#94e6fe" />
            </CircleIcon>
          </Absolute>
          <Absolute x="150px" y="20px">
            <P size="xxs" shallow="lg">
              数模美赛 · 一等奖
            </P>
          </Absolute>
          <Absolute x="50px" y="150px">
            <CircleIcon>
              <FontAwesomeIcon icon={faStar} color="#db225d" />
            </CircleIcon>
          </Absolute>
          <Absolute x="50px" y="180px">
            <P size="xxs" shallow="lg">
              共产党员
            </P>
          </Absolute>
          <Absolute x="150px" y="250px">
            <CircleIcon>
              <FontAwesomeIcon icon={faNewspaper} color="#2fb87e" />
            </CircleIcon>
          </Absolute>
          <Absolute x="150px" y="280px">
            <P size="xxs" shallow="lg">
              新闻中心 · 执行主席
            </P>
          </Absolute>
          <Absolute x="250px" y="150px">
            <CircleIcon>
              <FontAwesomeIcon icon={faBook} color="#5b4d96" />
            </CircleIcon>
          </Absolute>
          <Absolute x="250px" y="180px">
            <P size="xxs" shallow="lg">
              课题组
            </P>
          </Absolute>
          <Absolute
            x="75px"
            y="75px"
            radius="circle"
            style={{
              width: "60px",
              height: "60px",
              border: `1px dashed ${useThemeChoice("#2a2a2a", "#f1f2f6")}`,
            }}
          >
            <Flex radius="rectangle" wrap gap="xs" style={{ padding: "10px" }}>
              <FontAwesomeIcon icon={faJava} color="#954024" />
              <FontAwesomeIcon icon={faJs} color="#12507b" />
              <FontAwesomeIcon icon={faPython} color="#3271ae" />
              <SiLatex color="#ef845d" />
            </Flex>
          </Absolute>
          <Absolute
            x="225px"
            y="75px"
            radius="circle"
            style={{
              width: "60px",
              height: "60px",
              border: `1px dashed ${useThemeChoice("#2a2a2a", "#f1f2f6")}`,
            }}
          >
            <Flex radius="rectangle" wrap gap="xxs" style={{ padding: "10px" }}>
              <SiAdobephotoshop color="#a67eb7" />
              <SiAdobeillustrator color="#4c8045" />
              <SiAdobelightroom color="#68945c" />
              <SiBlender color="#bba1cb" />
            </Flex>
          </Absolute>
          <Absolute
            x="225px"
            y="225px"
            radius="circle"
            style={{
              width: "60px",
              height: "60px",
              border: `1px dashed ${useThemeChoice("#2a2a2a", "#f1f2f6")}`,
            }}
          >
            <Flex radius="rectangle" wrap gap="xxs" style={{ padding: "6px" }}>
              <FontAwesomeIcon icon={faSwimmer} color="#779649" />
              <FontAwesomeIcon icon={faDumbbell} color="#e18a3b" />
              <MdOutlineSportsTennis color="#dc6b82" />
            </Flex>
          </Absolute>
          <Absolute
            x="75px"
            y="225px"
            radius="circle"
            style={{
              width: "60px",
              height: "60px",
              border: `1px dashed ${useThemeChoice("#2a2a2a", "#f1f2f6")}`,
            }}
          >
            <Flex radius="rectangle" wrap gap="xxs" style={{ padding: "6px" }}>
              <svg
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1942"
                width="16"
                height="16"
              >
                <path
                  d="M170.666667 85.333333h682.666666a85.333333 85.333333 0 0 1 85.333334 85.333334v682.666666a85.333333 85.333333 0 0 1-85.333334 85.333334H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333334V170.666667a85.333333 85.333333 0 0 1 85.333334-85.333334m85.333333 170.666667v170.666667h170.666667v85.333333H341.333333v256h85.333334v-85.333333h170.666666v85.333333h85.333334v-256h-85.333334v-85.333333h170.666667V256h-170.666667v170.666667h-170.666666V256H256z"
                  fill="#1296db"
                  p-id="1943"
                ></path>
              </svg>
              <P size="xxs" shallow="sm">
                BF AOE
              </P>
            </Flex>
          </Absolute>
        </Board>
        <Flex column align="flex-start">
          <P isTitle>庆幸大学没有荒废，学到很多</P>
          <Flex column align="flex-start" gap="xs">
            <P>
              大学期间学了很多以前想学的技术(PS, PR,
              Blender)；同时修好专业课，主要关注前后端开发方向，在课题组加入了几个华为，中兴的试点项目；仍然喜欢玩我的世界，成为了一名开发者，小有收益；出于兴趣报了几个竞赛，获得了不错的成绩。
            </P>
            <P>
              同时也看到了学术圈的背面，圈子固化，关系最大。大三放弃考研，准备成为一名靠技术吃饭的打工人。
            </P>
          </Flex>
          <Brand color="green">
            {isPhone() ? (
              <FontAwesomeIcon icon={faUpLong} />
            ) : (
              <FontAwesomeIcon icon={faLeftLong} />
            )}
            &nbsp; 我的所学
          </Brand>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Collage;
