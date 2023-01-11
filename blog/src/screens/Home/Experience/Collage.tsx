import React from "react";
import styled from "styled-components";
import { EChart } from "../../../components/EChart";
import Flex from "../../../components/Flex";
import P from "../../../components/P";
import { ContextWrapper, ImgWrapper, TextWrapper } from "./Wrapper";

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
  const data = [
    {
      name: "任职",
      itemStyle: {
        color: "#775039",
      },
      children: [
        {
          name: "院学生会",
          value: 1,
          itemStyle: {
            color: "#984f31",
          },
          children: [
            {
              name: "大一·干事",
              value: 1,
              itemStyle: {
                color: "#ecb0c1",
              },
            },
          ],
        },
        {
          name: "院团委",
          value: 1,
          itemStyle: {
            color: "#9a6655",
          },
          children: [
            {
              name: "大一·干事",
              value: 1,
              itemStyle: {
                color: "#d2af9d",
              },
            },
          ],
        },
        {
          name: "院新闻中心",
          value: 3,
          itemStyle: {
            color: "##903754",
          },
          children: [
            {
              name: "大一·干事",
              value: 1,
              itemStyle: {
                color: "#d2af9d",
              },
            },
            {
              name: "大二·影像部部长",
              value: 1,
              itemStyle: {
                color: "#ed6d3d",
              },
            },
            {
              name: "大三·执行主席",
              value: 1,
              itemStyle: {
                color: "#e94829",
              },
            },
          ],
        },
        {
          name: "校社联",
          value: 1,
          itemStyle: {
            color: "#b49273",
          },
          children: [
            {
              name: "大一·干事",
              value: 1,
              itemStyle: {
                color: "#f5b087",
              },
            },
          ],
        },
      ],
    },
    {
      name: "竞赛",
      itemStyle: {
        color: "#b1d5c8",
      },
      children: [
        {
          name: "数模",
          itemStyle: {
            color: "#c0d695",
          },
          children: [
            {
              name: "校赛一等奖",
              value: 1,
              itemStyle: {
                color: "#a8bf8f",
              },
            },
            {
              name: "美赛一等奖",
              value: 1,
              itemStyle: {
                color: "#bed2bb",
              },
            },
            {
              name: "华东杯",
              value: 1,
              itemStyle: {
                color: "优秀奖",
              },
            },
          ],
        },
        {
          name: "荣誉",
          itemStyle: {
            color: "#2a6e3f",
          },
          children: [
            {
              name: "优秀共青团员",
              value: 1,
              itemStyle: {
                color: "#4f794a",
              },
            },
            {
              name: "优秀共青团干部",
              value: 1,
              itemStyle: {
                color: "#5d8351",
              },
            },
            {
              name: "校三好学生",
              value: 1,
              itemStyle: {
                color: "#6a8d52",
              },
            },
            {
              name: "三下乡一等奖",
              value: 1,
              itemStyle: {
                color: "#84a729",
              },
            },
            {
              name: "一等奖学金",
              value: 1,
              itemStyle: {
                color: "#779649",
              },
            },
          ],
        },
        {
          name: "其他",
          itemStyle: {
            color: "#a9be7b",
          },
          children: [
            {
              name: "创新促进就业竞赛三等奖",
              value: 1,
              itemStyle: {
                color: "#779649",
              },
            },
            {
              name: "互联网+校赛",
              value: 1,
              itemStyle: {
                color: "#a8b78c",
              },
            },
          ],
        },
      ],
    },
    {
      name: "项目",
      itemStyle: {
        color: "#007175",
      },
      children: [
        {
          name: "课题组",
          itemStyle: {
            color: "#108b96",
          },
          children: [
            {
              name: "中兴 ARCore 室内导航",
              value: 1,
              itemStyle: {
                color: "#5aa4ae",
              },
            },
            {
              name: "华为 openGauss 内核测试",
              value: 1,
              itemStyle: {
                color: "#87c0ca",
              },
            },
          ],
        },
        {
          name: "个人",
          itemStyle: {
            color: "#6ca8af",
          },
          children: [
            {
              name: "Minecraft 模组开发",
              value: 1,
              itemStyle: {
                color: "#5da39d",
              },
            },
            {
              name: "Minecraft 服务器维护",
              value: 1,
              itemStyle: {
                color: "#a4c9cc",
              },
            },
            {
              name: "天莱环保网站与OA系统",
              value: 1,
              itemStyle: {
                color: "#88bfb8",
              },
            },
          ],
        },
      ],
    },
    {
      name: "兴趣",
      itemStyle: {
        color: "#674598",
      },
      children: [
        {
          name: "图像处理",
          itemStyle: {
            color: "#a59aca",
          },
          children: [
            {
              name: "学生组织海报",
              value: 1,
              itemStyle: {
                color: "#bbbcde",
              },
            },
            {
              name: "学院视频剪辑",
              value: 1,
              itemStyle: {
                color: "#8491c3",
              },
            },
            {
              name: "项目宣传海报",
              value: 1,
              itemStyle: {
                color: "#867ba9",
              },
            },
          ],
        },
        {
          name: "排版",
          itemStyle: {
            color: "#274a78",
          },
          children: [
            {
              name: "竞赛计划书",
              value: 1,
              itemStyle: {
                color: "#007bbb",
              },
            },
            {
              name: "Latex 论文",
              value: 1,
              itemStyle: {
                color: "#2a83a2",
              },
            },
          ],
        },
      ],
    },
  ];

  const options = {
    title: {
      text: "大学主要事迹",
      subtext: "详细参考 Project/Work 界面",
      textStyle: {
        fontSize: 14,
        align: "center",
      },
      subtextStyle: {
        align: "center",
      },
    },
    series: {
      type: "sunburst",

      data: data,
      radius: [0, "95%"],
      sort: undefined,

      emphasis: {
        focus: "ancestor",
      },

      levels: [
        {},
        {
          r0: "15%",
          r: "35%",
          itemStyle: {
            borderWidth: 1,
          },
          label: {
            rotate: "tangential",
          },
        },
        {
          r0: "35%",
          r: "70%",
          label: {
            align: "right",
          },
        },
        {
          r0: "70%",
          r: "72%",
          label: {
            position: "outside",
            padding: 3,
            silent: false,
          },
          itemStyle: {
            borderWidth: 1,
          },
        },
      ],
    },
  };

  return (
    <ContextWrapper>
      <ImgWrapper>
        <EChart options={options} />
      </ImgWrapper>
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
