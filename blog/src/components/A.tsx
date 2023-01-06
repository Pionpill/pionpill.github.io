import styled from "styled-components";

type Props = {
  type?: "second" | "third" | "danger" | "reverse" | "reverse-second";
  size?: "large" | "small" | "xsmall";
  weight?: "bold" | "thin" | "heavy";
  padding?: string;
  wrap?: boolean;
  align?: string;
};

export const A = styled.a<Props>`
  color: ${(props) =>
    props.type === "second"
      ? props.theme.text_second
      : props.type === "third"
      ? props.theme.text_third
      : props.type === "danger"
      ? props.theme.danger
      : props.type === "reverse"
      ? props.theme.text_reverse
      : props.type === "reverse-second"
      ? props.theme.text_reverse_second
      : props.theme.text};
  font-size: ${(props) =>
    props.size === "large"
      ? "18px"
      : props.size === "small"
      ? "14px"
      : props.size === "xsmall"
      ? "13px"
      : "inherit"};
  font-weight: ${(props) =>
    props.weight === "bold"
      ? "600"
      : props.weight === "thin"
      ? "200"
      : props.weight === "heavy"
      ? "800"
      : "inherit"};
  padding: ${(props) => (props.padding ? props.padding : "initial")};
  cursor: pointer;
  white-space: ${(props) => (props.wrap ? "wrap" : "nowrap")};
  justify-content: center;
  align-items: center;
  text-align: ${(props) => props.align};
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.blue};
    text-decoration: underline;
    /* transition: all 0.5s; */
  }
  display: inline;
`;
