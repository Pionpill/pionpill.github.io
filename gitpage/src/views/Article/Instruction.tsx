import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ReactNode } from "react";
import { Trans } from "react-i18next";
import { BsLightningFill } from "react-icons/bs";
import { FaBoxes, FaCopyright } from "react-icons/fa";
import { MdPreview } from "react-icons/md";
import FlexBox from "../../components/FlexBox";
import Wrapper from "../../components/Wrapper";
import useThemeChoice from "../../hooks/useThemeChoice";
import { articleTheme } from "../../styles/theme";

type InstructionItemProps = {
  icon: ReactNode;
  titleI18nKey: string;
  contentI18nKey: string;
};

const InstructionItem: React.FC<InstructionItemProps> = ({
  icon,
  titleI18nKey,
  contentI18nKey,
}) => {
  return (
    <FlexBox
      sx={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
      gap={1}
    >
      {icon}
      <Typography variant="h6" fontWeight="fontWeightBold">
        <Trans i18nKey={titleI18nKey} />
      </Typography>
      <Typography sx={{ maxWidth: "175px" }} align="center">
        <Trans i18nKey={contentI18nKey} />
      </Typography>
    </FlexBox>
  );
};

const Instruction: React.FC = () => (
  <Wrapper bgcolor={useThemeChoice(articleTheme[50], grey[900])}>
    <FlexBox
      width="100%"
      sx={{
        alignItems: "flex-start",
        flexWrap: "wrap",
        justifyContent: "space-around",
      }}
      gap={1}
    >
      <InstructionItem
        icon={<BsLightningFill size={32} color={articleTheme[800]} />}
        titleI18nKey="article.update-title"
        contentI18nKey="article.update-content"
      />
      <InstructionItem
        icon={<MdPreview size={32} color={articleTheme[800]} />}
        titleI18nKey="article.preview-title"
        contentI18nKey="article.preview-content"
      />
      <InstructionItem
        icon={<FaBoxes size={32} color={articleTheme[800]} />}
        titleI18nKey="article.category-title"
        contentI18nKey="article.category-content"
      />
      <InstructionItem
        icon={<FaCopyright size={32} color={articleTheme[800]} />}
        titleI18nKey="article.copyright-title"
        contentI18nKey="article.copyright-content"
      />
    </FlexBox>
  </Wrapper>
);

export default Instruction;
