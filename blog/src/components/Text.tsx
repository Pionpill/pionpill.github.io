import styled from "styled-components";

type Props = {
  type?: "second" | "third" | "danger" | "reverse";
  size?: "large" | "small" | "xsmall";
  weight?: "bold" | "thin" | "heavy";
  wrap?: boolean;
};

/**
 * Use this component for all interface text that should not be selectable
 * by the user, this is the majority of UI text explainers, notes, headings.
 */
const P = styled.p<Props>`
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
  display: inline;
  white-space: ${(props) => (props.wrap ? "normal" : "nowrap")};
  margin: 0.25em;
  flex-shrink: 1;
`;

export default P;
