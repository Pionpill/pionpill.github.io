import Flex from "../../components/Flex";
import RouteLink from "../../components/RouteLink";

export const Menu: React.FC = () => {
  return (
    <Flex black style={{ width: "100vw" }}>
      <RouteLink color="white" to="/brief">
        Brief (简介)
      </RouteLink>
      <RouteLink color="white" to="/experience">
        Experience (经历)
      </RouteLink>
      <RouteLink color="white" to="/skill">
        Skill (技能)
      </RouteLink>
    </Flex>
  );
};
