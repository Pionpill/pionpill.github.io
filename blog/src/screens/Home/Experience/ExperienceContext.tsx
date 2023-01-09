import React from "react";
import { MapContainer } from "../../../charts/MapContainer";
import P from "../../../components/P";
import { ContextWrapper, ImgWrapper, TextWrapper, Wrapper } from "./Wrapper";

const Teen: React.FC = () => {
  return (
    <ContextWrapper>
      <ImgWrapper>
        <MapContainer
          coordinate={[120.282231, 31.494045]}
          zoom={15}
          cube={true}
        />
      </ImgWrapper>
      <TextWrapper>
        <P type="reverse" weight="bold">
          <ul>
            <li>2000 年出生于湖北省天门市 </li>
            <li>2006 年来到江苏省无锡市</li>
          </ul>
        </P>
      </TextWrapper>
    </ContextWrapper>
  );
};

export const ExperienceContext: React.FC = () => {
  return (
    <Wrapper>
      <Teen />
    </Wrapper>
  );
};
