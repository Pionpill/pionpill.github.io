import { Link } from "react-router-dom";
import styled from "styled-components";

export const RouteLink = styled(Link)`
  color: ${(props) => props.theme.text_reverse};
  font-size: initial;
  font-weight: 400;
  padding: 0.5em 0.75em;
  justify-content: center;
  align-items: center;
  text-decoration: none;

  &:hover {
    color: ${(props) => props.theme.blue};
    transition: all 0.5s;
  }
`;
