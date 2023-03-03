import { IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QRCodeSVG } from "qrcode.react";
import styled from "styled-components";
import { common } from "../../styles/themes";
import Flex from "../Flex";

const IconWrapper = styled.div<{
  size?: string;
  border?: "circle" | "round";
  type?: "second" | "third" | "danger" | "reverse";
}>`
  position: absolute;
  display: flex;
  background-color: ${(props) => props.theme.text};
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
      <IconWrapper size="38px">
        <IconWrapper size="30px">
          <FontAwesomeIcon icon={icon} color={common.white} size="lg" />
        </IconWrapper>
      </IconWrapper>
    </Flex>
  );
};
