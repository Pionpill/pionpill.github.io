import Flex from "../../components/Flex";
import { Icon } from "../../components/Icon";
import { Github } from "../../shared/info";

export const Info: React.FC = () => {
  return (
    <Flex column={true}>
      <Icon src={Github.icon}></Icon>
    </Flex>
  );
};
