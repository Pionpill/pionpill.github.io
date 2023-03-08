import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import Svg from "../../../components/svg/Svg";
import TextRect from "../../../components/svg/TextRect";
import { spacing } from "../../../styles/measure";
import { common } from "../../../styles/themes";

type SkillReactTextProps = {
  x: string;
  y: string;
};

const SkillReactText: React.FC<SkillReactTextProps> = ({ x, y }) => {
  return (
    <TextRect
      x={x}
      y={y}
      width="30"
      height="30"
      size="sm"
      radius="ellipse"
      center
      indent="30"
      fill={common.x}
      text="废弃"
      icon={
        <path
          d="M145.2 96l66 746.6L512 928l299.6-85.4L878.9 96H145.2z m595 177.1l-4.8 47.2-1.7 19.5H382.3l8.2 94.2h335.1l-3.3 24.3-21.2 242.2-1.7 16.2-187 51.6v0.3h-1.2l-0.3 0.1v-0.1h-0.1l-188.6-52L310.8 572h91.1l6.5 73.2 102.4 27.7h0.4l102-27.6 11.4-118.6H510.9v-0.1H306l-22.8-253.5-1.7-24.3h460.3l-1.6 24.3z"
          p-id="3404"
          fill="white"
        />
      }
    />
  );
};

const StackSvg: React.FC = () => {
  const realWidth: string = "800";
  const svgWidth: number =
    document.body.clientWidth - 2 * Number(spacing.vpadding.replace("px", ""));
  const realHeight: string =
    svgWidth < Number(realWidth)
      ? String((800 * svgWidth) / Number(realWidth))
      : "800";

  return (
    <Svg width={realWidth} height={realHeight} style={{ maxWidth: "100%" }}>
      <TextRect
        x="30"
        y="30"
        width="30"
        height="30"
        size="sm"
        radius="ellipse"
        center
        indent="30"
        fill={common.x}
        text="废弃"
      />
      <TextRect
        x="30"
        y="70"
        width="30"
        height="30"
        size="sm"
        radius="ellipse"
        center
        indent="30"
        fill={common.xx}
        text="了解"
      />
      <TextRect
        x="30"
        y="110"
        width="30"
        height="30"
        size="sm"
        radius="ellipse"
        center
        indent="30"
        fill={common.xxx}
        text="熟悉"
      />
      <TextRect
        x="30"
        y="150"
        width="30"
        height="30"
        size="sm"
        radius="ellipse"
        center
        indent="30"
        fill={common.xxxx}
        text="掌握"
      />
      <TextRect
        x="30"
        y="190"
        width="30"
        height="30"
        size="sm"
        radius="ellipse"
        center
        indent="30"
        fill={common.xxxxx}
        text="精通"
      />
      <TextRect
        x="400"
        y="20"
        width="170"
        height="30"
        shadow
        indent="30"
        fill={common.xxxx}
        text="HTML5"
        center
        icon={
          <path
            d="M145.2 96l66 746.6L512 928l299.6-85.4L878.9 96H145.2z m595 177.1l-4.8 47.2-1.7 19.5H382.3l8.2 94.2h335.1l-3.3 24.3-21.2 242.2-1.7 16.2-187 51.6v0.3h-1.2l-0.3 0.1v-0.1h-0.1l-188.6-52L310.8 572h91.1l6.5 73.2 102.4 27.7h0.4l102-27.6 11.4-118.6H510.9v-0.1H306l-22.8-253.5-1.7-24.3h460.3l-1.6 24.3z"
            p-id="3404"
            fill="white"
          />
        }
      />
      <TextRect
        x="400"
        y="80"
        width="170"
        height="30"
        shadow
        center
        indent="30"
        fill={common.xxxx}
        text="CSS3"
        icon={
          <path
            d="M152.384 48.512 118.016 220.448 817.76 220.448 795.904 331.488 95.712 331.488 61.824 503.392 761.504 503.392 722.464 699.456 440.48 792.896 196.064 699.456 212.8 614.432 40.896 614.432 0 820.768 404.224 975.488 870.24 820.768 1024 48.512z"
            fill="#ffffff"
            p-id="5027"
          />
        }
      />
      <TextRect
        x="400"
        y="140"
        width="170"
        height="30"
        shadow
        center
        indent="20"
        fill={common.xxxx}
        text="JavaScript"
        icon={
          <path
            d="M0 0v1024h1024V0H0z m556.8 798.4c0 99.2-59.2 145.6-144 145.6-76.8 0-121.6-40-144-88l78.4-48c14.4 27.2 28.8 49.6 62.4 49.6 32 0 51.2-12.8 51.2-60.8V470.4h96v328zM785.6 944c-89.6 0-147.2-43.2-176-97.6L688 800c20.8 33.6 48 59.2 94.4 59.2 40 0 65.6-19.2 65.6-48 0-33.6-25.6-44.8-70.4-64l-24-9.6c-68.8-28.8-115.2-67.2-115.2-145.6 0-72 54.4-126.4 140.8-126.4 60.8 0 105.6 20.8 136 76.8l-75.2 48c-16-28.8-33.6-41.6-62.4-41.6-28.8 0-46.4 17.6-46.4 41.6 0 28.8 17.6 40 59.2 59.2l24 9.6c81.6 35.2 128 70.4 128 152 1.6 84.8-65.6 132.8-156.8 132.8z"
            p-id="2211"
            fill="white"
          />
        }
      />
    </Svg>
  );
};

const Front: React.FC = () => {
  return (
    <Flex bleed gap="xl" limitWidth column>
      <H2>前端技术栈</H2>
      <StackSvg />
    </Flex>
  );
};

export default Front;
