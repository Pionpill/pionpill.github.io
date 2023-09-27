import { Alert, AlertColor, AlertTitle, IconButton, Link, Snackbar, Typography, styled } from "@mui/material";
import { blue } from "@mui/material/colors";
import React, { MouseEventHandler, PropsWithChildren, ReactNode } from "react";
import { Trans } from "react-i18next";
import { BiCopy } from "react-icons/bi";
import { FaRegLightbulb } from "react-icons/fa";
import { TbMessageCheck } from "react-icons/tb";
import ReactMarkdown from "react-markdown";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import useThemeChoice from "../hooks/useThemeChoice";
import { blogTheme } from "../styles/theme";
import { getTocAnchor } from "../utils/toc";
import FlexBox from "./FlexBox";

const MarkdownContentWrapper = styled('div')`
  .katex-html {
    display: none
  }
  .hint {
    opacity: 0.75;
  }
  .markdown-code {
    position: relative;
    &:hover {
      .markdown-code-copy {
        background-color: grey;
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
    position: absolute;
    top: 12px;
    right: 12px;
    opacity: 0;
    color: white;
    z-index: 100;
  }

  .markdown-code-language {
    position: absolute;
    font-size: 0.75em;
    top: 16px;
    right: 16px;
    opacity: 0.5;
    color: grey;
  }

  tr {
    border-spacing: 0px;
  }

  th {
    border-top: 1px solid #555;
    border-bottom: 1px solid #555;
  }

  td {
    border-bottom: 1px solid #555;
  }
`

const MarkdownCode: React.FC<CodeProps & { setAlert: Function }> = ({ children, node, inline, className, setAlert, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  const codeColor = useThemeChoice(blogTheme[700], blogTheme['A400'])

  const handleClick: MouseEventHandler = () => {
    navigator.clipboard.writeText(String(children));
    setAlert(true);
  };

  return !inline && match ? (
    <FlexBox width="100%" className="markdown-code">
      <IconButton className="markdown-code-copy" onClick={handleClick}>
        <BiCopy />
      </IconButton>
      <Typography className="markdown-code-language">{match[1]}</Typography>
      <SyntaxHighlighter
        {...props}
        style={useThemeChoice(oneLight, vscDarkPlus)}
        customStyle={{
          width: "100%",
          fontSize: "0.85em",
          backgroundColor: useThemeChoice("#f6f8fa", "#161618"),
        }}
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
        color: codeColor,
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
        borderLeftColor: blue[500],
        paddingLeft: "1rem",
        opacity: 0.75,
      }}
    >
      {children}
    </Typography>
  );
};

const MarkdownAlert: React.FC<PropsWithChildren<{ severity: AlertColor, icon?: ReactNode }>> = ({ severity, children, icon }) => {
  if (!children) return;
  const text = children.toString();
  let content: string = text;
  let title: string | null = null;
  if (text.includes('|||')) {
    const textArray = text.split('|||');
    content = textArray[1];
    title = textArray[0];
  }
  return (
    <Alert severity={severity} icon={icon} sx={{ mt: 2, mb: 2 }}>
      {title && <AlertTitle sx={{ fontWeight: 'fontWeightBold' }}>{title}</AlertTitle>}
      {content}
    </Alert>)

}

const MarkdownContent: React.FC<{ children: string }> = ({ children }) => {
  const [successCopyAlertOpen, setSuccessCopyAlertOpen] = React.useState<boolean>(false);
  const lineColor = useThemeChoice("#e1e1e1", "#313131");
  const linkColor = useThemeChoice(blue[800], blue[300]);

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
          h2: ({ children }) => {
            const anchor = getTocAnchor(children);
            return <h2 id={anchor} style={{ borderTop: `1px solid ${lineColor}`, paddingTop: '16px' }}>{children}</h2>;
          },
          h3: ({ children }) => {
            const anchor = getTocAnchor(children);
            return <h3 id={anchor}>{children}</h3>;
          },
          img: ({ src, alt }) => (
            <img src={src} alt={alt} style={{ maxWidth: "100%", borderRadius: "0.3em" }} />
          ),
          a: ({ href, target, children }) => (
            <Link
              href={href}
              target={target}
              sx={{
                textDecoration: "none",
                color: linkColor,
              }}
            >
              {children}
            </Link>
          ),
          blockquote: ({ children }) => <MarkdownBlockquote children={children} />,
          code: ({ node, inline, className, children, ...props }) => <MarkdownCode node={node} inline={inline} className={className} children={children} {...props} setAlert={setSuccessCopyAlertOpen} />,
          p: ({ className, children }) => {
            if (!className) return <p>{children}</p>
            switch (className) {
              case 'warn':
                return <MarkdownAlert severity="error">{children}</MarkdownAlert>
              case 'version':
                return <MarkdownAlert severity="warning">{children}</MarkdownAlert>
              case 'tip':
                return <MarkdownAlert severity="info" icon={<FaRegLightbulb />}>{children}</MarkdownAlert>
              case 'discuss':
                return <MarkdownAlert severity="success" icon={<TbMessageCheck />}>{children}</MarkdownAlert>
            }
            return <p>{children}</p>;
          },
        }}
        children={children}
      />
    </MarkdownContentWrapper>
  );
};

export default MarkdownContent;
