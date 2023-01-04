import { IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QRCodeSVG } from "qrcode.react";
import styled from "styled-components";
import { base } from "../../styles/themes";
import Flex from "../Flex";

const IconWrapper = styled.div<{
  size?: string;
  border?: "circle" | "round";
  type?: "second" | "third" | "danger" | "reverse";
}>`
  position: absolute;
  display: flex;
  background-color: ${(props) =>
    props.type === "second"
      ? props.theme.text_second
      : props.type === "third"
      ? props.theme.text_third
      : props.type === "danger"
      ? props.theme.danger
      : props.type === "reverse"
      ? props.theme.text_reverse
      : props.theme.text};
  border-radius: ${(props) =>
    props.border === "circle"
      ? "100%"
      : props.border === "round"
      ? "10%"
      : "0%"};
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  align-items: center;
  justify-content: center;
`;

type Props = {
  url: string;
  icon: IconDefinition;
};

export const QRCode: React.FC<Props> = ({ url, icon }) => {
  return (
    <Flex align="center" justify="center">
      <QRCodeSVG value={url} size={192} />
      <IconWrapper size="48px" type="reverse">
        <IconWrapper size="36px" border="round">
          <FontAwesomeIcon icon={icon} color={base.white} size="xl" />
        </IconWrapper>
      </IconWrapper>
    </Flex>
  );
};
