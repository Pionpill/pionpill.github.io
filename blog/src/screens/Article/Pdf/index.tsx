import React from "react";
import { pdfjs } from "react-pdf";
import { useParams } from "react-router";
import Flex from "../../../components/Flex";
import articles from "../../../shared/articles";
import { isPhone } from "../../../utils/responsiveUtils";
import PdfError from "./PdfError";
import PdfPreview from "./PdfPreview";
import TitleBar from "./TitleBar";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Pdf: React.FC = () => {
  // TODO 侧边栏，参考: https://docs.github.com/en
  const [content, setContent] = React.useState<any>(null);
  const articleName = useParams().articleName;
  const article = articles[articleName as keyof typeof articles];
  if (articleName && article) {
    return (
      <Flex fullWidth bgSecond full={isPhone() ? false : true}>
        <Flex column gap="xxs">
          <TitleBar article={article} />
          <Flex align="flex-start" limitWidth gap="xxs">
            {/* <ContentBar /> */}
            <PdfPreview reposUrl={article.reposUrl} setContent={setContent} />
          </Flex>
        </Flex>
      </Flex>
    );
  } else {
    return <PdfError />;
  }
};

export default Pdf;
