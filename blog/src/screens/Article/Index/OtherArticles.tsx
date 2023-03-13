import React from "react";
import Flex from "../../../components/Flex";
import H2 from "../../../components/H2";
import articles from "../../../shared/articles";
import { noteCardSelector } from "./components/NoteCard";

const OtherArticles: React.FC = () => {
  return (
    <Flex fullWidth>
      <Flex bleed column limitWidth gap="lg">
        <H2 space="6px">其他笔记</H2>
        <Flex wrap align="flex-start">
          {Object.values(articles).map((article) =>
            noteCardSelector(article, "lang")
          )}
          {Object.values(articles).map((article) =>
            noteCardSelector(article, "other")
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default OtherArticles;
