import styled from "@emotion/styled";
import { Alert, IconButton, Link, Snackbar, Typography } from "@mui/material";
import React, { MouseEventHandler, PropsWithChildren } from "react";
import { Trans } from "react-i18next";
import { BiCopy } from "react-icons/bi";
import ReactMarkdown from "react-markdown";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import useThemeChoice from "../hooks/useThemeChoice";
import { getTocAnchor } from "../utils/toc";
import FlexBox from "./FlexBox";

const MarkdownContentWrapper = styled('div')`
  .katex-html {
    display: none
  }
  .warn {
    border-left: 5px solid #ff6666;
    padding-left: 16px;
  }
  .discuss {
    border-left: 5px solid #0091ea;
    padding-left: 16px;
  }
  .tip {
    border-left: 5px solid #33691e;
    padding-left: 16px;
  }
  .hint {
    opacity: 0.75;
  }
  .markdown-code {
    position: relative;
    &:hover {
      .markdown-code-copy {
        opacity: 0.5;
        transition: opacity 0.3s ease;
      }
      .markdown-code-language {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }
  }
  .markdown-code-copy {
    transition: opacity 0.3s ease;
    transition: background-color 0.3s ease;
    position: absolute;
    top: 16px;
    right: 16px;
    opacity: 0;
    color: white;
    &:hover {
      background-color: #555;
    }
  }

  .markdown-code-language {
    transition: opacity 0.3s ease;
    transition: background-color 0.3s ease;
    position: absolute;
    top: 16px;
    right: 16px;
    opacity: 0.5;
    color: white;
    &:hover {
      background-color: #555;
    }
  }
`

const MarkdownCode: React.FC<CodeProps & { setAlert: Function }> = ({ children, node, inline, className, setAlert, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  
  const handleClick: MouseEventHandler = () => {
    navigator.clipboard.writeText(String(children));
    setAlert(true);
  };

  return !inline && match ? (
    <FlexBox width="100%" className="markdown-code">
      <IconButton className="markdown-code-copy" onClick={handleClick}>
        <BiCopy />
      </IconButton>
      <Typography className="markdown-code-language">
        {match[1]}
      </Typography>
      <SyntaxHighlighter
        {...props}
        style={oneDark}
        customStyle={{ width: "100%" }}
        language={match[1]}
        PreTag="div"
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </FlexBox>
  ) : (
    <Typography
      style={{
        fontSize: "14px",
        fontFamily: "consolas",
        padding: "2px 4px",
        borderRadius: 4,
        background: useThemeChoice("#f1f1f1", "#2f2f2f"),
        color: useThemeChoice("#1f1f1f", "#aac8e4"),
        display: "inline",
      }}
    >
      {children}
    </Typography>
  );
}

const MarkdownBlockquote: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Typography
      component="div"
      sx={{
        borderLeftWidth: "0.25rem",
        borderLeftStyle: "solid",
        borderLeftColor: (theme) => `${theme.palette.primary.main}80`,
        paddingLeft: "0.5rem",
        opacity: 0.75,
      }}
    >
      {children}
    </Typography>
  );
};

const MarkdownContent: React.FC<{ children: string }> = ({ children }) => {
  const [successCopyAlertOpen, setSuccessCopyAlertOpen] = React.useState<boolean>(false);

  return (
    <MarkdownContentWrapper>
      <Snackbar
        autoHideDuration={3000}
        onClose={() => setSuccessCopyAlertOpen(false)}
        open={successCopyAlertOpen}
      >
        <Alert severity="success">
          <Trans i18nKey="common.success" />
          :&nbsp;
          <Trans i18nKey="blog.copyCodeSuccessMessage" />
        </Alert>
      </Snackbar>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          h2: ({children}) => {
            const anchor = getTocAnchor(children);
            return <h2 id={anchor}>{children}</h2>;
          },
          h3: ({children}) => {
            const anchor = getTocAnchor(children);
            return <h3 id={anchor}>{children}</h3>;
          },
          img: ({src, alt}) => (
            <img src={src} alt={alt} style={{ maxWidth: "100%" }} />
          ),
          a: ({ href, target, children }) => (
            <Link
              href={href}
              target={target}
              sx={{
                textDecoration: "none",
              }}
            >
              {children}
            </Link>
          ),
          blockquote: ({ children }) => <MarkdownBlockquote children={children} />,
          code: ({ node, inline, className, children, ...props }) => <MarkdownCode node={node} inline={inline} className={className} children={children} {...props} setAlert={setSuccessCopyAlertOpen} />,
        }}
        children={children}
      />
    </MarkdownContentWrapper>
  );
};

export default MarkdownContent;
