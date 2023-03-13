import styled, { CSSProperties } from "styled-components";
import { RadiusType } from "../styles";
import { radiusSelector } from "../utils/styledUtils";

type Props = {
  radius?: RadiusType;
  align?: CSSProperties["textAlign"];
};

const Input = styled.input<Props>`
  border-radius: ${({ radius }) =>
    radius ? radiusSelector(radius) : radiusSelector("xs")};
  outline: none;
  padding: 2px 4px;
  border: 0;
  text-align: ${({ align }) => align};
`;

export default Input;
