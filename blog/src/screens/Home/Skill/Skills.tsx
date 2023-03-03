import { faJava } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Flex from "../../../components/Flex";
import P from "../../../components/P";

const Card = styled(Flex)`
  background-color: ${(props) => props.theme.assist};
`;

export const Skills: React.FC = () => {
  return (
    <Flex>
      <Card column>
        <P>
          <FontAwesomeIcon icon={faJava} />
        </P>
      </Card>
    </Flex>
  );
};
