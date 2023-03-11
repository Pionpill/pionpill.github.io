import { faWeixin } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import { QQ, Weixin } from "../../shared/info";
import Icon from "../Icon";
import P from "../P";
import Popup from "./Popup";
import QRCode from "./QRCode";

const WeixinPopup = React.forwardRef(({}, ref: any) => {
  return (
    <Popup title="Weixin" ref={ref}>
      <Icon width="64px" src={QQ.icon} alt="QQ 头像" />
      <P size="lg"> {Weixin.name} </P>
      <P> {Weixin.id} </P>
      <QRCode url={Weixin.qr} icon={faWeixin} />
      <P size="sm" shallow="md">
        请注明来意，非必要不加好友
      </P>
    </Popup>
  );
});

export default WeixinPopup;
