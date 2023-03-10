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
import useThemeChoice from "../../../hooks/useThemeChoice";

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
      <H2>????????????</H2>
      <Flex gap="sm" wrap align="flex-start">
        <Flex phoneResponsive>
          <SkillCard
            icon={<FontAwesomeIcon icon={faJava} color="#c0392b" size="2x" />}
            title="????????????"
            color="#c0392b"
            icons={
              <>
                <SiSpring size="12px" color="#4f6f46" />
                <SiSpringboot size="12px" color="#4f6f46" />
                <SiSpringsecurity size="12px" color="#4f6f46" />
              </>
            }
          >
            ???????????????????????????????????????????????????(utils, juc)????????? JVM
            ????????????????????? Spring ??????(SpringMVC, SpringBoot,
            SpringSecurity)??????????????? Minecraft Java ????????????
          </SkillCard>
          <SkillCard
            icon={<FontAwesomeIcon icon={faJs} color="#2980b9" size="2x" />}
            title="????????????"
            icons={
              <>
                <SiTypescript size="12px" color="#2980b9" />
                <SiReact size="12px" color="#2980b9" />
                <SiRedux size="12px" color="#764abc" />
              </>
            }
          >
            ??????????????????????????????????????? TypeScript??? React???Redux ????????? UI
            ??????????????? styled-components, amap, echarts
            ???????????????????????????????????????????????????
          </SkillCard>
        </Flex>
        <Flex phoneResponsive>
          <SkillCard
            icon={<FontAwesomeIcon icon={faPython} color="#fa8231" size="2x" />}
            title="????????????"
            icons={
              <>
                <SiNumpy size="12px" color="#2980b9" />
                <SiPlotly size="12px" color="#2980b9" />
                <SiJupyter size="12px" color="#fa8231" />
              </>
            }
          >
            ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            Minecraft Netease ????????????
          </SkillCard>
          <SkillCard
            icon={<SiMysql color="#079992" size="32px" />}
            title="????????????"
            icons={
              <>
                <SiLatex size="12px" color="#079992" />
                <SiCsharp size="12px" color="#079992" />
                <SiCplusplus size="12px" color="#079992" />
              </>
            }
          >
            <strong>MySQL: </strong> ????????????????????? <br />
            <strong>Latex: </strong> ???????????? tikz ??????????????????????????????
            <br />
            <strong>C#: </strong> Unity ???????????? &nbsp;
            <strong>C++: </strong> ???????????????
          </SkillCard>
        </Flex>
      </Flex>
      <Flex wrap style={{ gap: "12px 24px", width: "100%" }}>
        <AppCard
          icon={<SiVisualstudiocode color={iconColor} />}
          degree={90}
          title="VsCode"
          label="???????????? 'IDE' ?????? Java"
        />
        <AppCard
          icon={<SiIntellijidea color={iconColor} />}
          degree={60}
          title="IDEA"
          label="Java ?????? IDE"
        />
        <AppCard
          icon={<SiUbuntu color={iconColor} />}
          degree={40}
          title="Ubuntu"
          label="???????????????????????????"
        />
        <AppCard degree={40} title="NaviCat" label="???????????????" />
        <AppCard
          icon={<SiAdobephotoshop color={iconColor} />}
          degree={40}
          title="PhotoShop"
          label="???????????????"
        />
        <AppCard
          icon={<SiTableau color={iconColor} />}
          degree={30}
          title="Tableau"
          label="???????????????"
        />
        <AppCard
          degree={50}
          icon={<SiAdobeillustrator color={iconColor} />}
          title="Illustrator"
          label="????????????????????????????????????"
        />
        <AppCard
          icon={<SiAdobelightroom color={iconColor} />}
          degree={70}
          title="LightRoom"
          label="?????????????????????"
        />
        <AppCard
          icon={<SiAdobepremierepro color={iconColor} />}
          degree={30}
          title="PremierePro"
          label="?????????????????????????????????"
        />
        <AppCard
          icon={<SiAdobeindesign color={iconColor} />}
          degree={60}
          title="InDeisgn"
          label="????????????????????????????????? Latex"
        />
        <AppCard
          icon={<SiBlender color={iconColor} />}
          degree={20}
          title="Blender"
          label="?????????????????????????????????"
        />
        <AppCard degree={60} title="Blockbench" label="????????????????????????" />
      </Flex>
    </Flex>
  );
};

export default Skill;
