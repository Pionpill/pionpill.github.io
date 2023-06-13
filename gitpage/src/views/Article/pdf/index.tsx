import {
  IconButton,
  Link,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { KeyboardEvent } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  FaBook,
  FaDownload,
  FaGithub,
  FaList,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { MdFitScreen, MdFullscreenExit } from "react-icons/md";
import { RxDividerVertical } from "react-icons/rx";
import { TbArrowBigLeftFilled, TbArrowBigRightFilled } from "react-icons/tb";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import FlexBox from "../../../components/FlexBox";
import Wrapper from "../../../components/Wrapper";
import { useSmallMedia } from "../../../hooks/useMedia";
import useThemeChoice from "../../../hooks/useThemeChoice";
import articles, { Article } from "../../../shared/article";
import { transformGithubReposToDownload } from "../../../utils/url";
import PdfError from "./PdfError";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const TitleBar: React.FC<{ article: Article }> = ({ article }) => {
  const downloadUrl = transformGithubReposToDownload(article.reposUrl);
  const isSmallMedia = useSmallMedia();

  return (
    <FlexBox
      sx={{ pt: 2, pb: 2, height: "62px" }}
      width="100%"
      alignItems="center"
      justifyContent="space-between"
    >
      <FlexBox gap={1} alignItems="center">
        <FaBook size={24} />
        <Typography variant="h6" fontWeight="fontWeightBold" align="center">
          {article.title}
        </Typography>
        {!isSmallMedia && (
          <>
            <RxDividerVertical size={28} />
            <Link href={article.reposUrl} underline="none">
              <Typography variant="h6" fontWeight="fontWeightBold">
                <Trans i18nKey="article.pdfReposMessage" />
              </Typography>
            </Link>
          </>
        )}
      </FlexBox>
      <FlexBox gap={2} alignItems="center">
        {!isSmallMedia && (
          <Typography color="text.secondary" variant="body2">
            <Trans i18nKey="article.pdfDownloadMessage" />
          </Typography>
        )}
        {isSmallMedia && (
          <Link href={article.reposUrl} underline="none">
            <FaGithub />
          </Link>
        )}
        <Link href={downloadUrl}>
          <FaDownload />
        </Link>
      </FlexBox>
    </FlexBox>
  );
};

const PdfPreview: React.FC<{ reposUrl: string }> = ({ reposUrl }) => {
  const { t } = useTranslation();

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
      ? window.innerHeight - 152
      : window.innerWidth * 1.414;
  const [pageHeight, setPageHeight] = React.useState<any>(initialHeight);

  const handleDocLoadSuccess = (doc: any) => {
    setNumPages(doc.numPages);
    doc.getOutline().then((response: any) => console.log(response));
  };
  const handleLastPage = () => {
    if (getPage() > 1) {
      setPage(getPage() - 1);
    }
  };
  const handleNextPage = () => {
    if (getPage() < numPages) {
      setPage(getPage() + 1);
    }
  };
  const handlePageZoomOut = () => {
    setPageHeight(pageHeight * 0.8);
  };
  const handlePageZoomIn = () => {
    setPageHeight(pageHeight * 1.2);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && inputRef.current) {
      const targetNumPage = Number(inputRef.current.value);
      console.log(targetNumPage);
      if (targetNumPage >= 0 && targetNumPage <= numPages) {
        setPage(targetNumPage);
      } else {
        alert("页码超范围");
      }
    }
  };

  return (
    <FlexBox
      justifyContent="center"
      sx={{
        width: "100%",
        height: "100%",
        pt: 0.25,
      }}
    >
      <Document
        file={transformGithubReposToDownload(reposUrl)}
        onLoadSuccess={handleDocLoadSuccess}
        loading={<Skeleton width="200px" height="calc(100vh - 112px)" />}
        noData="抱歉，可能这个笔记的位置被我改动了，无法显示。"
      >
        <FlexBox sx={{ height: initialHeight, overflow: "auto" }}>
          <Page
            height={pageHeight}
            pageNumber={getPage()}
            loading={"加载中..."}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </FlexBox>
        <FlexBox
          sx={{ backgroundColor: "#38383d", minHeight: "30px" }}
          alignItems="center"
          justifyContent="center"
          gap={0.5}
        >
          <IconButton
            title={t("article.magnify") as string}
            onClick={handlePageZoomIn}
          >
            <FaPlus color="white" size={16} />
          </IconButton>
          <IconButton
            title={t("article.shrink") as string}
            onClick={handlePageZoomOut}
          >
            <FaMinus color="white" size={16} />
          </IconButton>
          <IconButton
            title={t("article.applyWidth") as string}
            onClick={() => setPageHeight(window.innerWidth * 1.4 - 80)}
          >
            <MdFitScreen color="white" size={16} />
          </IconButton>
          <IconButton
            title={t("article.applyHeight") as string}
            onClick={() => setPageHeight(initialHeight)}
          >
            <MdFullscreenExit color="white" size={16} />
          </IconButton>
          <IconButton
            title={t("article.lastPage") as string}
            onClick={handleLastPage}
          >
            <TbArrowBigLeftFilled color="white" size={16} />
          </IconButton>

          <FlexBox alignItems="center">
            <TextField
              placeholder={String(getPage())}
              size="small"
              inputProps={{
                ref: inputRef,
                onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  return handleKeyDown(e);
                },
                sx: {
                  p: 0,
                  textAlign: "center",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  maxWidth: "40px",
                },
              }}
            />
            <Typography color="white">&nbsp;/ {numPages}</Typography>
          </FlexBox>
          <IconButton
            title={t("article.nextPage") as string}
            onClick={handleNextPage}
          >
            <TbArrowBigRightFilled color="white" size={16} />
          </IconButton>
          <IconButton
            title={t("article.directoryPage") as string}
            onClick={() => setPage(3)}
          >
            <FaList color="white" size={16} />
          </IconButton>
          <IconButton
            title={t("article.homePage") as string}
            onClick={() => setPage(1)}
          >
            <Typography color="white" variant="h6" fontWeight="fontWeightBold">
              1
            </Typography>
          </IconButton>
        </FlexBox>
      </Document>
    </FlexBox>
  );
};

const Pdf: React.FC = () => {
  const articleName = useParams().articleName?.slice(4);
  const article = articles[articleName as keyof typeof articles];
  if (article)
    return (
      <>
        <Wrapper outerSx={{ pt: 0, pb: 0 }}>
          <TitleBar article={article} />
        </Wrapper>
        <Wrapper
          outerSx={{ pt: 0, pb: 0 }}
          bgcolor={useThemeChoice("#f1f2f6", "#252526")}
        >
          <PdfPreview reposUrl={article.reposUrl} />
        </Wrapper>
      </>
    );
  else return <PdfError />;
};

export default Pdf;
