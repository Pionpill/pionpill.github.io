import Flex from "../../../components/Flex";
import RouteLink from "../../../components/RouteLink";

const Menu: React.FC = () => {
  return (
    <Flex black style={{ width: "100%" }}>
      <RouteLink color="white" to="/index">
        Profile (简历)
      </RouteLink>
      <RouteLink color="white" to="/index/experience">
        Experience (经历)
      </RouteLink>
      <RouteLink color="white" to="/index/skill">
        Skill (技术)
      </RouteLink>
    </Flex>
  );
};

export default Menu;
