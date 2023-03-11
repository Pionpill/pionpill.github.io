import { faWeixin } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import { QQ, Weixin } from "../../shared/info";
import Icon from "../Icon";
import P from "../P";
import Popup from "./Popup";
import QRCode from "./QRCode";

const PayCodePopup = React.forwardRef(({}, ref: any) => {
  return (
    <Popup title="Weixin PaymentCode" ref={ref}>
      <Icon width="64px" src={QQ.icon} alt="QQ 头像" />
      <P size="lg"> {Weixin.name} </P>
      <P> 感谢您的支持 </P>
      <QRCode url={Weixin.payCode} icon={faWeixin} />
    </Popup>
  );
});

export default PayCodePopup;
