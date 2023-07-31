import { Link, Typography } from "@mui/material";
import React, { PropsWithChildren } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import useThemeChoice from "../hooks/useThemeChoice";

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
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h2: (props) => {
          const anchor = String(props.children).replace(/\s/g, "");
          return <h2 id={anchor}>{props.children}</h2>;
        },
        h3: (props) => {
          const anchor = String(props.children).replace(/\s/g, "");
          return <h3 id={anchor}>{props.children}</h3>;
        },
        img: (props) => (
          <img src={props.src} alt={props.alt} style={{ maxWidth: "100%" }} />
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
        blockquote: (props) => <MarkdownBlockquote children={props.children} />,
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              children={String(children).replace(/\n$/, "")}
              style={oneDark}
              language={match[1]}
              PreTag="div"
            />
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
        },
      }}
      children={children}
    />
  );
};

export default MarkdownContent;
