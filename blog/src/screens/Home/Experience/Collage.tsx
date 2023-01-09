import React from "react";
import styled from "styled-components";
import Flex from "../../../components/Flex";
import P from "../../../components/P";
import { ContextWrapper, TextWrapper } from "./Wrapper";

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

const Span = styled.span`
  cursor: pointer;
  padding: 0em 0.25em;
  color: ${(props) => props.theme.pointer};
  font-weight: 600;
`;

const Li = styled.li`
  white-space: normal;
`;

const Ul = styled.ul`
  white-space: normal;
  padding-left: 0;
`;

export const Collage: React.FC = () => {
  return (
    <ContextWrapper>
      {/* <ImgWrapper></ImgWrapper> */}
      <TextWrapper>
        <P type="reverse" size="2x" weight="bold" space="huge">
          大学时代
        </P>
        <Ul>
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
        </Ul>
      </TextWrapper>
    </ContextWrapper>
  );
};
