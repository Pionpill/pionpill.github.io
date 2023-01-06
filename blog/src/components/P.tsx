import styled from "styled-components";

type Props = {
  type?: "second" | "third" | "danger" | "reverse" | "reverse-second";
  size?: "huge" | "large" | "small" | "xsmall" | "2x" | "3x";
  weight?: "bold" | "thin" | "heavy";
  space?: "small" | "large" | "huge";
  indent?: boolean;
  wrap?: boolean;
};

/**
 * Use this component for all interface text that should not be selectable
 * by the user, this is the majority of UI text explainers, notes, headings.
 */
export const P = styled.p<Props>`
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
      ? "12px"
      : props.size === "huge"
      ? "24px"
      : props.size === "2x"
      ? "2em"
      : props.size === "3x"
      ? "3em"
      : "inherit"};
  font-weight: ${(props) =>
    props.weight === "bold"
      ? "600"
      : props.weight === "thin"
      ? "200"
      : props.weight === "heavy"
      ? "800"
      : "inherit"};
  display: inline;
  white-space: ${(props) => (props.wrap ? "normal" : "nowrap")};
  margin: 0.25em;
  flex-shrink: 1;
  letter-spacing: ${(props) =>
    props.space === "small"
      ? "0.1em"
      : props.space === "large"
      ? "0.2em"
      : props.space === "huge"
      ? "0.3em"
      : "inherit"};
  text-indent: ${(props) => (props.indent ? "2em" : "initial")};
`;

export default P;
