import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCropAlt,
  faFeather,
  faGamepad,
  faGears,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import P from "../../../components/P";

type LifeCardProps = {
  icon: IconProp;
  title: string;
  subTitle?: ReactNode;
  children: ReactNode;
};

const LifeCard: React.FC<LifeCardProps> = ({
  icon,
  title,
  subTitle,
  children,
}) => {
  return (
    <Flex
      align="flex-start"
      gap="md"
      style={{ maxWidth: "500px", padding: "16px", minWidth: "300px" }}
    >
      <FontAwesomeIcon
        icon={icon}
        color="#99bcac"
        style={{ padding: "8px 0 8px 8px" }}
      />
      <Flex column gap="xxs" align="flex-start">
        <P isTitle>{title}</P>
        <P style={{ color: "#ff6348" }}>{subTitle && subTitle}</P>
        <P>{children}</P>
      </Flex>
    </Flex>
  );
};

const Life: React.FC = () => {
  return (
    <Flex bleed gap="xl" limitWidth column>
      <H2>关于我</H2>
      <Flex gap="sm" align="flex-start" wrap>
        <LifeCard
          icon={faFeather}
          title="性格"
          subTitle={<>直接，谨慎，技术力</>}
        >
          非常直的性格，不喜欢拐弯抹角，别整那些没用的，除非你是老板，呜呜呜。
          <br />
          做事比较谨慎，一般先考虑最坏情况。
          <br />
          喜欢和有能力(各方面)的人打交道。
        </LifeCard>
        <LifeCard
          icon={faCropAlt}
          title="生活"
          subTitle={<>运动，健身，打游戏，休闲</>}
        >
          不抽烟，很少喝酒，闲暇时间喜欢打游戏，或者出去爬山，打球。
          <br />
          没事喜欢种田，提前过老年人生活。
          <br />
          坚持健身，三天不去健身房就难受。
          <br />
          随性，夏天只穿背心短裤，冬天只穿两套衣服(佛)。
        </LifeCard>
        <LifeCard
          icon={faGears}
          title="工作"
          subTitle={<>敲代码，洁癖，颜值主义</>}
        >
          非常适应敲代码的活，投入后忘记时间。没事喜欢重构项目，写的乱看着不舒服。
          <br />
          非常注重颜值，因为 React 图标好看选择了 React，因为 VsCode 美观选择了
          VsCode，对前端好看的外观非常执着。
        </LifeCard>
        <LifeCard icon={faGamepad} title="兴趣" subTitle={<>我的世界，动</>}>
          Minecraft 一生所爱，从生存到建筑到地形到开发，搞起！
          <br />
          喜欢活跃的事务，要么脑子动，要么身体动。
          <br />
          帝国时代4 自定义打到过世界前 50，小牛。
        </LifeCard>
        <LifeCard icon={faPlane} title="梦想" subTitle={<>房子，种田</>}>
          去二线城市买个小别墅过上天天晒太阳，种菜聊天的日子。
          <br />
          非常讨厌汽车，晕车！以后要买个能敞篷的车。
        </LifeCard>
      </Flex>
    </Flex>
  );
};

export default Life;
