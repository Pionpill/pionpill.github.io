import { faLeftLong, faUpLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import Brand from "../../../components/Brand";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import P from "../../../components/P";
import { isPhone } from "../../../utils/responsiveUtils";

const Li = styled.li`
  white-space: normal;
`;

const Ul = styled.ul`
  white-space: normal;
  padding-left: 0;
`;

export const Collage: React.FC = () => {
  return (
    <Flex column>
      <H2>大学时代</H2>
      <Flex phoneResponsive>
        <Flex style={{ width: "300px", height: "300px", position: "relative" }}>
          <span style={{ position: "absolute", bottom: 0, left: 0 }}>123</span>
        </Flex>
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
