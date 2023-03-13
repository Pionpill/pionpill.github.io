import {
  faCss3,
  faJava,
  faJs,
  faPython,
  faReact,
} from "@fortawesome/free-brands-svg-icons";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  SiMysql,
  SiSpring,
  SiSpringboot,
  SiSpringsecurity,
  SiTypescript,
} from "react-icons/si";
import {
  TagComplete,
  TagJava,
  TagJs,
  TagLong,
  TagMedium,
  TagMysql,
  TagPy,
  TagShort,
  TagTs,
  TagUpdate,
  TagX,
  TagXX,
  TagXXX,
  TagXXXX,
  TagXXXXX,
} from "../screens/Article/Index/components/ArticleTag";

export type ArticleInfo = {
  type: "front" | "back" | "sql" | "lang" | "other";
  reposUrl: string;
  titleIcon: JSX.Element;
  title: string;
  tag: JSX.Element;
  abstract: string;
};

const CSS: ArticleInfo = {
  type: "front",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/js/JavaScript/CSS/CSS.pdf",
  titleIcon: <FontAwesomeIcon icon={faCss3} />,
  title: "CSS",
  tag: (
    <>
      <TagMedium /> |
      <TagXX />
      <TagXXX /> | <TagComplete />
    </>
  ),
  abstract: "CSS3 深入解析，主要讲解布局，响应式。参考《CSS IN DEPTH》",
};

const JavaScript: ArticleInfo = {
  type: "front",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/js/JavaScript/JavaScript/ProfessionalJavaScript.pdf",
  titleIcon: <FontAwesomeIcon icon={faJs} />,
  title: "JavaScript",
  tag: (
    <>
      <TagJs />
      <TagLong /> |
      <TagXX />
      <TagXXX /> | <TagUpdate />
    </>
  ),
  abstract:
    "JavaScript 基础，ES6 语法，BOM，DOM。主要参考 《JavaScript 高级程序设计》",
};

const TypeScript: ArticleInfo = {
  type: "front",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/js/JavaScript/TypeScript/TypeScript.pdf",
  titleIcon: <SiTypescript size="20" />,
  title: "TypeScript",
  tag: (
    <>
      <TagTs />
      <TagShort /> |
      <TagXX />
      <TagXXX /> | <TagUpdate />
    </>
  ),
  abstract: "TypeScript 基础, 参考 TypeScript HandBook",
};

const React: ArticleInfo = {
  type: "front",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/js/JavaScript/React/React.pdf",
  titleIcon: <FontAwesomeIcon icon={faReact} />,
  title: "React",
  tag: (
    <>
      <TagTs />
      <TagLong /> |
      <TagXX />
      <TagXXX /> | <TagUpdate />
    </>
  ),
  abstract:
    "React(hooks)基础, Redux 基础, axios, node-fetch 等常见前端组件。主要参考各组件官方文档",
};

const Java: ArticleInfo = {
  type: "back",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/java/Java/JavaBasic/CoreJava.pdf",
  titleIcon: <FontAwesomeIcon icon={faJava} />,
  title: "CoreJava",
  tag: (
    <>
      <TagJava />
      <TagMedium /> |
      <TagXX />
      <TagXXX /> | <TagX />
    </>
  ),
  abstract:
    "Java 基础入门，包含基础语法，OOP，多线程的基本介绍。主要参考《Java 核心卷》。本人认为这本书不适合入门。后续准备用其他书籍代替。",
};
const JavaLibrary: ArticleInfo = {
  type: "back",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/java/Java/JavaLibrary/JavaLibrary.pdf",
  titleIcon: <FontAwesomeIcon icon={faJava} />,
  title: "JavaLibrary",
  tag: (
    <>
      <TagJava />
      <TagLong /> |
      <TagXXX /> <TagXXXX /> | <TagComplete />
    </>
  ),
  abstract: "Java 常用库源码解析，主要包括 lang, utils(不含并发)。",
};
const JUC: ArticleInfo = {
  type: "back",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/java/Java/JUC/JUC.pdf",
  titleIcon: <FontAwesomeIcon icon={faJava} />,
  title: "JUC",
  tag: (
    <>
      <TagJava />
      <TagLong /> |
      <TagXXXX /> <TagXXXXX /> | <TagComplete />
    </>
  ),
  abstract:
    "Java util concurrent 包详细源码解析。包含多线程，并发集合，线程池化技术等。",
};
const SpringBoot: ArticleInfo = {
  type: "back",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/java/Java/SpringBoot/SpringBoot.pdf",
  titleIcon: <SiSpring />,
  title: "SpringBoot",
  tag: (
    <>
      <TagJava />
      <TagLong /> |
      <TagXXXX /> <TagXXXXX /> | <TagComplete />
    </>
  ),
  abstract:
    "Spring,SpringMVC 源码与部分源码解析，参考: 《Spring 揭秘》, 《看透 Spring MVC》",
};
const SpringLibrary: ArticleInfo = {
  type: "back",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/java/Java/SpringLibrary/SpringLibrary.pdf",
  titleIcon: <SiSpringboot />,
  title: "SpringLibrary",
  tag: (
    <>
      <TagJava />
      <TagMedium /> |
      <TagXX /> <TagXXX /> | <TagUpdate />
    </>
  ),
  abstract: "SpringBoot, Spring Data JPA，Lombok 等相关注解说明",
};
const SpringSecurity: ArticleInfo = {
  type: "back",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/java/Java/SpringSecurity/SpringSecurity.pdf",
  titleIcon: <SiSpringsecurity />,
  title: "SpringSecurity",
  tag: (
    <>
      <TagJava />
      <TagMedium /> |
      <TagXXXX /> <TagXXXXX /> | <TagUpdate />
    </>
  ),
  abstract:
    "SpringSecurity 原理与部分源码解读，主要参考 《深入浅出 Spring Security》",
};
const MySQL: ArticleInfo = {
  type: "sql",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/sql/SQL/MySQL/MySQL.pdf",
  titleIcon: <SiMysql />,
  title: "MySQL",
  tag: (
    <>
      <TagMysql />
      <TagLong /> |
      <TagXX /> <TagXXX /> <TagXXXX /> | <TagUpdate />
    </>
  ),
  abstract:
    "MySQL 入门，优化，索引解析，InnoDb 引擎介绍。主要参考 《MySQL 必知必会》《高性能 MySQL》",
};
const MyBatis: ArticleInfo = {
  type: "sql",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/sql/SQL/MyBatis/MyBatis.pdf",
  titleIcon: <></>,
  title: "MyBatis",
  tag: (
    <>
      <TagMysql />
      <TagMedium /> |
      <TagXX /> <TagXXX /> | <TagComplete />
    </>
  ),
  abstract:
    "MyBatis 入门，动态 SQL，高级查询，缓存等。主要参考 《MyBatis 从入门到精通》",
};
const FluentPython: ArticleInfo = {
  type: "lang",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/python/Python/FluentPython/FluentPython.pdf",
  titleIcon: <FontAwesomeIcon icon={faPython} />,
  title: "Fluent Python",
  tag: (
    <>
      <TagPy />
      <TagLong /> |
      <TagXXX /> <TagXXXX /> | <TagUpdate />
    </>
  ),
  abstract:
    "Python 进阶，讲述Python风格的写法，Python 语言设计，高性能Python 写法。主要参考《Fluent Python》",
};
const PythonLibrary: ArticleInfo = {
  type: "lang",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/python/Python/PythonLibrary/PythonLibrary.pdf",
  titleIcon: <FontAwesomeIcon icon={faPython} />,
  title: "PythonLibrary",
  tag: (
    <>
      <TagPy />
      <TagShort /> |
      <TagXX /> <TagXXX /> | <TagUpdate />
    </>
  ),
  abstract: "Python 魔法函数，标准库的一些说明",
};
const DesignPattern: ArticleInfo = {
  type: "other",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/engineer/Engineer/DesignPatterns/DesignPatterns.pdf",
  titleIcon: <FontAwesomeIcon icon={faCode} />,
  title: "DesignPattern",
  tag: (
    <>
      <TagLong /> | <TagXXX /> <TagXXXXX /> | <TagComplete />
    </>
  ),
  abstract:
    "23 种常见设计模式的总结梳理，主要参考《Design Pattern Element of Reusable Object-Oriented Software》",
};

const articles = {
  CSS,
  JavaScript,
  TypeScript,
  React,
  Java,
  JavaLibrary,
  JUC,
  SpringBoot,
  SpringLibrary,
  SpringSecurity,
  MySQL,
  MyBatis,
  FluentPython,
  PythonLibrary,
  DesignPattern,
};

export default articles;
