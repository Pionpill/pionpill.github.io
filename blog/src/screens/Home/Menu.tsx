import styled from "styled-components";
import Flex from "../../components/Flex";
import { RouteLink } from "../../components/RouteLink";

const Wrapper = styled(Flex)`
  background-color: ${(props) => props.theme.assist};
  justify-content: center;
  align-items: center;
  gap: 1em;
`;

const SubRouteLink = styled(RouteLink)`
  &:hover {
    background-color: ${(props) => props.theme.main};
    color: ${(props) => props.theme.blue};
    transition: all 0.5s;
  }
`;

export const Menu: React.FC = () => {
  return (
    <Wrapper>
      <SubRouteLink to="/home/brief">Brief (简介)</SubRouteLink>
      <SubRouteLink to="/home/experience"> Experience (经历) </SubRouteLink>
      <SubRouteLink to="/home/skill"> Skill (技能) </SubRouteLink>
    </Wrapper>
  );
};
