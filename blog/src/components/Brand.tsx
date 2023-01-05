import styled from "styled-components";

type Props = {
  color?: "marine" | "blue" | "red" | "orange" | "purple" | "green" | "yellow";
  size?: "huge" | "large" | "small" | "xsmall" | "2x" | "3x";
  type?: "second" | "third" | "danger" | "reverse";
};

export const Brand = styled.span<Props>`
  border-radius: 10%;
  padding: 3px 5px;
  font-size: ${(props) =>
    props.size === "large"
      ? "18px"
      : props.size === "small"
      ? "14px"
      : props.size === "xsmall"
      ? "12px"
      : props.size === "huge"
      ? "24px"
      : props.size === "2x"
      ? "2em"
      : props.size === "3x"
      ? "3em"
      : "inherit"};
  text-shadow: 1px 0px ${(props) => props.theme.text};
  color: ${(props) =>
    props.type === "second"
      ? props.theme.text_second
      : props.type === "third"
      ? props.theme.text_third
      : props.type === "danger"
      ? props.theme.danger
      : props.type === "reverse"
      ? props.theme.text_reverse
      : props.theme.text};
  background-color: ${(props) =>
    props.color ? props.theme[props.color] : props.theme.blue};
`;
