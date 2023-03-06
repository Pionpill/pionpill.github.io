import {
  faGraduationCap,
  faLeftLong,
  faTrophy,
  faUpLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import Absolute from "../../../components/Absolute";
import Board from "../../../components/Board";
import Brand from "../../../components/Brand";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import P from "../../../components/P";
import { useThemeChoice } from "../../../hooks/useThemeChoice";
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

export const Collage: React.FC = () => {
  return (
    <Flex column>
      <H2>大学时代</H2>
      <Flex phoneResponsive>
        <Board width="300px" height="300px">
          <Absolute x="150px" y="150px">
            <CircleIcon>
              <FontAwesomeIcon icon={faGraduationCap} color="#fc9588" />
            </CircleIcon>
          </Absolute>
          <Absolute x="150px" y="50px">
            <Flex column>
              <CircleIcon>
                <FontAwesomeIcon icon={faTrophy} color="#94e6fe" />
              </CircleIcon>
              <P size="xs" shallow="md" style={{ width: "100px" }}>
                数模美赛 · 一等奖
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
      {/* <Ul>
          <Li>
            任职:
            第一次上大学，加入了院青年新闻中心，院学生会，校社联等组织。之后留任青年新闻中心，任职至执行主席。
          </Li>
          <Li>
            竞赛:
            大二打了数模美赛，拿了一等奖。之后参加了一些小型赛事，参加互联网+陪跑后不再打比赛。认识到学术圈的现实并不打算考研。
          </Li>
          <Li>
            技能:
            大二陆续学习了图像处理方面的技能，不准备竞赛后学习专业技能，主要专业方向为
            React 前端，SpringBoot 后端。
          </Li>
        </Ul> */}
    </Flex>
  );
};
