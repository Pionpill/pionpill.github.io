import {
  SiJava,
  SiJavascript,
  SiMysql,
  SiPython,
  SiTypescript,
} from "react-icons/si";
import Brand from "../../../../components/Brand";
import { common } from "../../../../styles/themes";

export const TagX: React.FC = () => {
  return <Brand style={{ backgroundColor: common.x }}>废弃</Brand>;
};
export const TagXX: React.FC = () => {
  return <Brand style={{ backgroundColor: common.xx }}>入门</Brand>;
};
export const TagXXX: React.FC = () => {
  return <Brand style={{ backgroundColor: common.xxx }}>进阶</Brand>;
};
export const TagXXXX: React.FC = () => {
  return <Brand style={{ backgroundColor: common.xxxx }}>源码</Brand>;
};
export const TagXXXXX: React.FC = () => {
  return <Brand style={{ backgroundColor: common.xxxxx }}>专项</Brand>;
};
export const TagShort: React.FC = () => {
  return <Brand style={{ backgroundColor: common.marine }}>短篇</Brand>;
};
export const TagMedium: React.FC = () => {
  return <Brand style={{ backgroundColor: common.nuist }}>中篇</Brand>;
};
export const TagLong: React.FC = () => {
  return <Brand style={{ backgroundColor: common.blue }}>长篇</Brand>;
};
export const TagJava: React.FC = () => {
  return (
    <Brand style={{ backgroundColor: common.red }}>
      <SiJava size="12" />
    </Brand>
  );
};
export const TagJs: React.FC = () => {
  return (
    <Brand style={{ backgroundColor: common.blue }}>
      <SiJavascript size="12" />
    </Brand>
  );
};
export const TagTs: React.FC = () => {
  return (
    <Brand style={{ backgroundColor: common.blue }}>
      <SiTypescript size="12" />
    </Brand>
  );
};
export const TagPy: React.FC = () => {
  return (
    <Brand style={{ backgroundColor: common.warning }}>
      <SiPython size="12" />
    </Brand>
  );
};
export const TagMysql: React.FC = () => {
  return (
    <Brand style={{ backgroundColor: common.warning }}>
      <SiMysql size="12" />
    </Brand>
  );
};
export const TagUpdate: React.FC = () => {
  return <Brand style={{ backgroundColor: common.yellow }}>更新中</Brand>;
};
export const TagComplete: React.FC = () => {
  return <Brand style={{ backgroundColor: common.orange }}>已写完</Brand>;
};
