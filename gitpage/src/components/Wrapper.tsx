import { Container, SxProps } from "@mui/material";
import { PropsWithChildren } from "react";
import { footerHeight, headerHeight } from "../shared/config";
import FlexBox from "./FlexBox";

type Props = {
  bgcolor?: string;
  fillHeight?: boolean;
  outerSx?: SxProps;
  sx?: SxProps;
};

const Wrapper: React.FC<PropsWithChildren<Props>> = ({
  bgcolor = "background.default",
  fillHeight,
  sx,
  outerSx,
  children,
}) => {
  return (
    <FlexBox
      sx={{
        pt: 8,
        pb: 8,
        minHeight: fillHeight
          ? `calc(100vh - ${headerHeight} - ${footerHeight})`
          : "auto",
        ...outerSx,
      }}
      bgcolor={bgcolor}
    >
      <Container>
        <FlexBox
          gap={4}
          sx={{
            alignItems: "center",
            flexWrap: "wrap",
            color: "text.primary",
            ...sx,
          }}
        >
          {children}
        </FlexBox>
      </Container>
    </FlexBox>
  );
};

export default Wrapper;
