import { faJava, faJs, faPython } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import {
  SiAdobeillustrator,
  SiAdobeindesign,
  SiAdobelightroom,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiBlender,
  SiCplusplus,
  SiCsharp,
  SiIntellijidea,
  SiJupyter,
  SiLatex,
  SiMysql,
  SiNumpy,
  SiPlotly,
  SiReact,
  SiRedux,
  SiSpring,
  SiSpringboot,
  SiSpringsecurity,
  SiTableau,
  SiTypescript,
  SiUbuntu,
  SiVisualstudiocode,
} from "react-icons/si";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import P from "../../../components/P";
import { useThemeChoice } from "../../../hooks/useThemeChoice";

type SkillCardProps = {
  icon: ReactNode;
  icons?: ReactNode;
  title: string;
  color?: string;
  children: ReactNode;
};

const SkillCard: React.FC<SkillCardProps> = ({
  icon,
  icons,
  title,
  children,
}) => {
  const bgColor = useThemeChoice("#f1f2f6", "#3d3d3d");
  return (
    <Flex
      radius="sm"
      align="flex-start"
      gap="md"
      style={{
        backgroundColor: bgColor,
        padding: "16px",
        minWidth: "300px",
      }}
    >
      {icon}
      <Flex column align="flex-start" gap="xxs">
        <Flex align="flex-end">
          <P isTitle>{title}</P>
          <Flex padding="6px 0" gap="xs">
            {icons}
          </Flex>
        </Flex>
        <P>{children}</P>
      </Flex>
    </Flex>
  );
};

type AppCardProps = {
  degree: number;
  title: string;
  icon?: ReactNode;
  label: string;
};

const AppCard: React.FC<AppCardProps> = ({ degree, label, title, icon }) => {
  const lineColor =
    degree >= 80
      ? "#c12c1f"
      : degree >= 60
      ? "#354e6b"
      : degree >= 40
      ? "#446a37"
      : "#984f31";

  const bgColor = useThemeChoice("#cdcdcd", "#e1e2e6");
  return (
    <Flex column gap="xs" align="flex-start" style={{ minWidth: "300px" }}>
      <Flex align="flex-end">
        {icon && <Flex style={{ padding: "6px 0" }}>{icon}</Flex>}
        <P isTitle>{title}</P>
        <P shallow="md">{label}</P>
      </Flex>
      <Flex
        justify="flex-start"
        style={{
          width: "100%",
          minHeight: "3px",
          backgroundColor: bgColor,
          position: "relative",
        }}
      >
        <Flex
          style={{
            maxWidth: `${degree}%`,
            minHeight: "3px",
            backgroundColor: lineColor,
            position: "relative",
          }}
        />
      </Flex>
    </Flex>
  );
};

const Skill: React.FC = () => {
  const iconColor = useThemeChoice("#3d3d3d", "#f1f2f6");
  return (
    <Flex bleed gap="xl" limitWidth column fullWidth>
      <H2>技术简述</H2>
      <Flex gap="sm" wrap align="flex-start">
        <Flex phoneResponsive>
          <SkillCard
            icon={<FontAwesomeIcon icon={faJava} color="#c0392b" size="2x" />}
            title="后端开发"
            color="#c0392b"
            icons={
              <>
                <SiSpring size="12px" color="#4f6f46" />
                <SiSpringboot size="12px" color="#4f6f46" />
                <SiSpringsecurity size="12px" color="#4f6f46" />
              </>
            }
          >
            了解最深入的编程语言，看过部分源码(utils, juc)，了解 JVM
            执行过程。熟悉 Spring 框架(SpringMVC, SpringBoot,
            SpringSecurity)。同时用于 Minecraft Java 版开发。
          </SkillCard>
          <SkillCard
            icon={<FontAwesomeIcon icon={faJs} color="#2980b9" size="2x" />}
            title="前端开发"
            icons={
              <>
                <SiTypescript size="12px" color="#2980b9" />
                <SiReact size="12px" color="#2980b9" />
                <SiRedux size="12px" color="#764abc" />
              </>
            }
          >
            敲代码时间最长的语言，采用 TypeScript， React，Redux 框架写 UI
            组件，常用 styled-components, amap, echarts
            等组件。同时用于一些小型脚本编写。
          </SkillCard>
        </Flex>
        <Flex phoneResponsive>
          <SkillCard
            icon={<FontAwesomeIcon icon={faPython} color="#fa8231" size="2x" />}
            title="辅助开发"
            icons={
              <>
                <SiNumpy size="12px" color="#2980b9" />
                <SiPlotly size="12px" color="#2980b9" />
                <SiJupyter size="12px" color="#fa8231" />
              </>
            }
          >
            获奖最多的语言，作为辅助工具在各项比赛中使用，主要用于数据处理，可视化。小型工具首选语言，同时用于
            Minecraft Netease 版开发。
          </SkillCard>
          <SkillCard
            icon={<SiMysql color="#079992" size="32px" />}
            title="其他技术"
            icons={
              <>
                <SiLatex size="12px" color="#079992" />
                <SiCsharp size="12px" color="#079992" />
                <SiCplusplus size="12px" color="#079992" />
              </>
            }
          >
            <strong>MySQL: </strong> 最常用的数据库 <br />
            <strong>Latex: </strong> 熟练使用 tikz 包，排版与绘图神器。
            <br />
            <strong>C#: </strong> Unity 开发用过 &nbsp;
            <strong>C++: </strong> 还给老师力
          </SkillCard>
        </Flex>
      </Flex>
      <Flex wrap style={{ gap: "12px 24px", width: "100%" }}>
        <AppCard
          icon={<SiVisualstudiocode color={iconColor} />}
          degree={90}
          title="VsCode"
          label="最常用的 'IDE' 除了 Java"
        />
        <AppCard
          icon={<SiIntellijidea color={iconColor} />}
          degree={60}
          title="IDEA"
          label="Java 专属 IDE"
        />
        <AppCard
          icon={<SiUbuntu color={iconColor} />}
          degree={40}
          title="Ubuntu"
          label="服务器得部署在上面"
        />
        <AppCard degree={40} title="NaviCat" label="懒人数据库" />
        <AppCard
          icon={<SiAdobephotoshop color={iconColor} />}
          degree={40}
          title="PhotoShop"
          label="常用来修图"
        />
        <AppCard
          icon={<SiTableau color={iconColor} />}
          degree={30}
          title="Tableau"
          label="懒人可视化"
        />
        <AppCard
          degree={50}
          icon={<SiAdobeillustrator color={iconColor} />}
          title="Illustrator"
          label="常用来画矢量图，做点排版"
        />
        <AppCard
          icon={<SiAdobelightroom color={iconColor} />}
          degree={70}
          title="LightRoom"
          label="处理下相机照骗"
        />
        <AppCard
          icon={<SiAdobepremierepro color={iconColor} />}
          degree={30}
          title="PremierePro"
          label="做点剪辑，后来不怎么用"
        />
        <AppCard
          icon={<SiAdobeindesign color={iconColor} />}
          degree={60}
          title="InDeisgn"
          label="本来挺喜欢的，后来有了 Latex"
        />
        <AppCard
          icon={<SiBlender color={iconColor} />}
          degree={20}
          title="Blender"
          label="做点模型，渲染，非常菜"
        />
        <AppCard degree={60} title="Blockbench" label="做点我的世界模型" />
      </Flex>
    </Flex>
  );
};

export default Skill;
