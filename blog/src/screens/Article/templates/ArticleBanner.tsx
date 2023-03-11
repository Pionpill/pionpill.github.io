import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faBook, faCoffee, faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import A from "../../../components/A";
import Card from "../../../components/Card";
import Flex from "../../../components/Flex";
import H1 from "../../../components/H1";
import P from "../../../components/P";
import PayCodePopup from "../../../components/Popup/PayCodePopup";
import { Github } from "../../../shared/info";
import { common } from "../../../styles/themes";
import { toggleComponent } from "../../../utils/componentsUtils";
import { isPhone } from "../../../utils/responsiveUtils";

const LinkCard = styled(Card)`
  background: linear-gradient(135deg, #16222a, #3a6073);
  &:hover {
    background: linear-gradient(135deg, #3a6073, #16222a);
  }
`;

const ArticleBanner: React.FC = () => {
  const payCodePopupRef = React.useRef(null);

  return (
    <>
      <Flex fullWidth bgSecond>
        <Flex
          limitWidth
          tabletResponsive
          align="flex-start"
          bleed
          style={{
            background: !isPhone()
              ? "url(https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog/imgs/blog.svg) no-repeat 100% 50px"
              : "",
            backgroundSize: "30%",
          }}
        >
          <Flex column align="flex-start">
            <H1 space="0px">
              <FontAwesomeIcon icon={faBook} /> Articles and Notebooks
            </H1>
            <P weight="lg" shallow="sm">
              <FontAwesomeIcon icon={faSmile} color={common.nuist} />
              &nbsp;这里展示的所有文章都在我的
              <A inline color="link" href={Github.link}>
                Github
              </A>
              仓库中开源。 文章绝大部分使用
              <A inline color="link" href="https://zh.wikipedia.org/wiki/LaTeX">
                Latex
              </A>
              编写。
            </P>
            <Flex>
              <LinkCard
                cursor="pointer"
                style={{ flex: "auto" }}
                onClick={() => window.open(Github.link)}
              >
                <FontAwesomeIcon icon={faGithub} color="#fff" size="lg" />
                <Flex column align="flex-start" gap="xxs">
                  <P color="white" weight="lg" size="md">
                    Follow Me!
                  </P>
                </Flex>
              </LinkCard>
              <LinkCard
                cursor="pointer"
                style={{ flex: "auto" }}
                onClick={() => toggleComponent(payCodePopupRef)}
              >
                <FontAwesomeIcon icon={faCoffee} color="#fff" size="lg" />
                <Flex column align="flex-start" gap="xxs">
                  <P color="white" weight="lg" size="md">
                    Sponsor Me?
                  </P>
                </Flex>
              </LinkCard>
              <PayCodePopup ref={payCodePopupRef} />
            </Flex>
            <P weight="lg" shallow="md">
              如果您方便编译 Latex 文件，可以 clone
              各个笔记的仓库，获得最新的文章。
              <br />
              即使您不了解 Latex，我也在这里以及仓库中提供了稳定的 pdf 笔记。
            </P>
            <P size="sm" shallow="lg">
              得益于 Latex 技术与 TikZ 作图包，本人书写的 pdf 笔记每页不超过
              10kb 大小，如果图片少，甚至更小。
            </P>
          </Flex>
        </Flex>
      </Flex>
      <Flex padding="6px 0">
        <P shallow="sm">
          点击查看可直接在网页预览，文件来源于 Github 各仓库 main 分支下的稳定的
          pdf 文件。
        </P>
      </Flex>
    </>
  );
};

export default ArticleBanner;
