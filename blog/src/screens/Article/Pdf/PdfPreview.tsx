import {
  fa1,
  faLeftLong,
  faList,
  faMinus,
  faPlus,
  faRightLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { KeyboardEvent } from "react";
import { MdFitScreen, MdFullscreenExit } from "react-icons/md";
import { Document, Page, pdfjs } from "react-pdf";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button";
import Flex from "../../../components/Flex";
import Input from "../../../components/Input";
import P from "../../../components/P";
import { transformGithubLinkToDownload } from "../../../utils/urlUtils";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FunctionBar = styled(Flex)`
  background-color: #38383d;
  height: 30px;
  min-height: 30px;
`;

type Props = {
  reposUrl: string;
  setContent: Function;
};

const PdfPreview: React.FC<Props> = ({ reposUrl }) => {
  const [numPages, setNumPages] = React.useState<number>(0);
  const [params, setParams] = useSearchParams({ p: "1" });
  const getPage = (): number => {
    return Number(params.get("p"));
  };
  const setPage = (page: number) => {
    setParams({ p: String(page) });
  };
  const inputRef = React.useRef<any>(null);
  const initialHeight =
    window.innerWidth * 1.414 > window.innerHeight
      ? window.innerHeight - 140
      : window.innerWidth * 1.414;
  const [pageHeight, setPageHeight] = React.useState<any>(initialHeight);

  // const handlePdfContent = (date: Array<Object>) => {
  //   const contentData = {};
  //   for (const chapter of date) {
  //     let chapter = {};
  //   }
  // };

  const onDocLoadSuccess = (doc: any) => {
    setNumPages(doc.numPages);
    // doc.getOutline().then((response: any) => console.log(response));
  };

  const lastPage = () => {
    if (getPage() > 1) {
      setPage(getPage() - 1);
    }
  };
  const nextPage = () => {
    if (getPage() < numPages) {
      setPage(getPage() + 1);
    }
  };
  const pageZoomOut = () => {
    setPageHeight(pageHeight * 0.8);
  };
  const pageZoomIn = () => {
    setPageHeight(pageHeight * 1.2);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputRef.current) {
      const targetNumPage = Number(inputRef.current.value);
      if (targetNumPage >= 0 && targetNumPage <= numPages) {
        setPage(targetNumPage);
      } else {
        alert("页码超范围");
      }
    }
  };

  return (
    <Document
      file={transformGithubLinkToDownload(reposUrl)}
      onLoadSuccess={onDocLoadSuccess}
      loading="正在加载中"
      noData="抱歉，可能这个笔记的位置被我改动了，无法显示。"
    >
      <Flex
        style={{
          height: initialHeight,
          overflow: "auto",
        }}
      >
        <Page
          height={pageHeight}
          pageNumber={getPage()}
          loading={"加载中..."}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Flex>
      <FunctionBar>
        <Button title="放大" onClick={() => pageZoomIn()}>
          <FontAwesomeIcon icon={faPlus} />
        </Button>
        <Button title="缩小" onClick={() => pageZoomOut()}>
          <FontAwesomeIcon icon={faMinus} />
        </Button>
        <Button
          title="适应宽度"
          onClick={() => setPageHeight(window.innerWidth * 1.4 - 80)}
        >
          <MdFitScreen />
        </Button>
        <Button title="适应高度" onClick={() => setPageHeight(initialHeight)}>
          <MdFullscreenExit />
        </Button>
        <Button title="上一页" onClick={() => lastPage()}>
          <FontAwesomeIcon icon={faLeftLong} />
        </Button>
        <P color="white">
          <Input
            placeholder={String(getPage())}
            type="text"
            align="center"
            style={{ width: "36px", padding: "2px 8px" }}
            onKeyDown={(e) => onKeyDown(e)}
            ref={inputRef}
          />
          &nbsp; / {numPages}
        </P>
        <Button title="下一页" onClick={() => nextPage()}>
          <FontAwesomeIcon icon={faRightLong} />
        </Button>
        <Button title="目录页" onClick={() => setPage(3)}>
          <FontAwesomeIcon icon={faList} />
        </Button>
        <Button title="首页" onClick={() => setPage(1)}>
          <FontAwesomeIcon icon={fa1} />
        </Button>
      </FunctionBar>
    </Document>
  );
};

export default PdfPreview;
