import styled from "styled-components";

type Props = {
  border?: "circle" | "round";
  size?: string;
};

export const Icon = styled.img<Props>`
  width: ${(props) => (props.size ? props.size : "24px")};
  height: ${(props) => (props.size ? props.size : "24px")};
  border-radius: ${(props) =>
    props.border === "circle"
      ? "100%"
      : props.border === "round"
      ? "10%"
      : "0%"};
  white-space: nowrap;
`;
