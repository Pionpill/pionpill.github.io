import styled from "styled-components";

type Props = {
  border?: "circle" | "round" | string;
  size?: string;
  height?: string;
  clip?: string;
};

export const Img = styled.img<Props>`
  width: ${(props) => (props.size ? props.size : "24px")};
  height: ${(props) => (props.height ? props.height : "auto")};
  border-radius: ${(props) =>
    props.border === "circle"
      ? "100%"
      : props.border === "round"
      ? "10%"
      : props.border
      ? props.border
      : "0%"};
  white-space: nowrap;
  object-fit: cover;
  overflow: hidden;
`;
