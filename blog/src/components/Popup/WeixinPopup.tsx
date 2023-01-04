import { faWeixin } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import { QQ, Weixin } from "../../shared/info";
import { Icon } from "../Icon";
import P from "../Text";
import { Popup } from "./Popup";
import { QRCode } from "./QRCode";

export const WeixinPopup = React.forwardRef(({}, ref: any) => {
  return (
    <Popup title="Weixin" ref={ref}>
      <Icon size="64px" src={QQ.icon} border="circle" />
      <P size="large"> {Weixin.name} </P>
      <P> {Weixin.id} </P>
      <QRCode url={Weixin.qr} icon={faWeixin} />
      <P size="small" type="third">
        请注明来意，非必要不加好友
      </P>
    </Popup>
  );
});
