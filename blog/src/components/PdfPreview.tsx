import {
  faLeftLong,
  faMinus,
  faPlus,
  faRightLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Button from "./Button";
import Flex from "./Flex";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  url: string;
};

const PdfPreview: React.FC<Props> = ({ url }) => {
  const onDocLoadSuccess = () => {};

  return (
    <Flex column shadow>
      <Document
        file={url}
        onLoadSuccess={onDocLoadSuccess}
        loading="正在加载中"
        noData="抱歉，可能这个笔记的位置被我改动了，无法显示。"
        renderMode="svg"
      >
        <Page
          pageNumber={3}
          loading={"加载中..."}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
        <Flex>
          <Button>
            <FontAwesomeIcon icon={faLeftLong} />
          </Button>
          <Button>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          <Button>
            <FontAwesomeIcon icon={faMinus} />
          </Button>
          <Button>
            <FontAwesomeIcon icon={faRightLong} />
          </Button>
        </Flex>
      </Document>
    </Flex>
  );
};

export default PdfPreview;
