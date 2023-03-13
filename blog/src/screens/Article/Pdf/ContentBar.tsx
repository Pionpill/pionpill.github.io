import Flex from "../../../components/Flex";
import P from "../../../components/P";

const ContentBar: React.FC = () => {
  return (
    <Flex
      column
      bg
      style={{ maxWidth: "200px", height: "calc(100vh - 110px)" }}
    >
      <P>123</P>
    </Flex>
  );
};

export default ContentBar;
