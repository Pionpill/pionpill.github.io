import { Box, styled } from "@mui/material";

// @mui 和 @react-three 的 Box 冲突，项目统一使用 FlexBox
const FlexBox = styled(Box)`
  display: flex;
`;

export default FlexBox;
