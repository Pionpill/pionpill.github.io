import {
  FaCss3Alt,
  FaEarlybirds,
  FaJava,
  FaJs,
  FaPython,
  FaReact,
} from "react-icons/fa";
import { GiGearStickPattern } from "react-icons/gi";
import {
  SiMysql,
  SiSpring,
  SiSpringboot,
  SiSpringsecurity,
  SiTypescript,
} from "react-icons/si";

export type Article = {
  type: "front" | "back" | "sql" | "cs" | "lang";
  reposUrl: string;
  titleIcon: JSX.Element;
  title: string;
  reference?: string;
  abstract: string;
};

const CSS: Article = {
  type: "front",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/js/JavaScript/CSS/CSS.pdf",
  titleIcon: <FaCss3Alt size={36} />,
  title: "CSS",
  reference: "《CSS IN DEPTH》",
  abstract: "CSS3 深入解析，主要讲解布局，响应式",
};

const JavaScript: Article = {
  type: "front",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/js/JavaScript/JavaScript/ProfessionalJavaScript.pdf",
  titleIcon: <FaJs size={36} />,
  title: "JavaScript",
  reference: "《Professional JavaScript for Web Developers (4th Edition)》",
  abstract: "JavaScript 基础，ES6 语法，BOM，DOM",
};

const TypeScript: Article = {
  type: "front",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/js/JavaScript/TypeScript/TypeScript.pdf",
  titleIcon: <SiTypescript size="36" />,
  title: "TypeScript",
  reference: "TypeScript HandBook",
  abstract: "TypeScript 基础",
};

const React: Article = {
  type: "front",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/js/JavaScript/React/React.pdf",
  titleIcon: <FaReact size="36" />,
  title: "React",
  abstract: "React(hooks)基础, Redux 基础, axios, node-fetch 等常见前端组件",
};

const Java: Article = {
  type: "back",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/java/Java/JavaBasic/CoreJava.pdf",
  titleIcon: <FaJava size="36" />,
  title: "CoreJava",
  reference: "《Core Java》",
  abstract:
    "Java 基础入门，包含基础语法，OOP，多线程的基本介绍。本人认为这本书不适合入门。后续准备用其他书籍代替。",
};

const JavaLibrary: Article = {
  type: "back",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/java/Java/JavaLibrary/JavaLibrary.pdf",
  titleIcon: <FaJava size="36" />,
  title: "JavaLibrary",
  abstract: "Java 常用库源码解析，主要包括 lang, utils(不含并发)。",
};

const JUC: Article = {
  type: "back",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/java/Java/JUC/JUC.pdf",
  titleIcon: <FaJava size="36" />,
  title: "JUC",
  abstract:
    "Java util concurrent 包详细源码解析。包含多线程，并发集合，线程池化技术等。",
};

const SpringBoot: Article = {
  type: "back",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/java/Java/SpringBoot/SpringBoot.pdf",
  titleIcon: <SiSpring size="36" />,
  title: "SpringBoot",
  reference: "《看透 SpringMVC》 《Spring 揭秘》",
  abstract: "Spring,SpringMVC 源码与部分源码解析。",
};

const SpringLibrary: Article = {
  type: "back",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/java/Java/SpringLibrary/SpringLibrary.pdf",
  titleIcon: <SiSpringboot size="36" />,
  title: "SpringLibrary",
  abstract: "SpringBoot, Spring Data JPA，Lombok 等相关注解说明",
};

const SpringSecurity: Article = {
  type: "back",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/java/Java/SpringSecurity/SpringSecurity.pdf",
  titleIcon: <SiSpringsecurity size="36" />,
  title: "SpringSecurity",
  reference: "《深入浅出 Spring Security》",
  abstract: "SpringSecurity 原理与部分源码解读",
};

const MySQL: Article = {
  type: "sql",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/sql/SQL/MySQL/MySQL.pdf",
  titleIcon: <SiMysql size="36" />,
  title: "MySQL",
  abstract: "MySQL 入门，优化，索引解析，InnoDb 引擎介绍",
};

const MyBatis: Article = {
  type: "sql",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/sql/SQL/MyBatis/MyBatis.pdf",
  titleIcon: <FaEarlybirds size={36} />,
  title: "MyBatis",
  abstract: "MyBatis 入门，动态 SQL，高级查询，缓存等",
};

const FluentPython: Article = {
  type: "lang",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/python/Python/FluentPython/FluentPython.pdf",
  titleIcon: <FaPython size={36} />,
  title: "FluentPython",
  reference: "《Fluent Python》",
  abstract:
    "Python 进阶，讲述Python风格的写法，Python 语言设计，高性能Python 写法",
};

const PythonLibrary: Article = {
  type: "lang",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/python/Python/PythonLibrary/PythonLibrary.pdf",
  titleIcon: <FaPython size={36} />,
  title: "PythonLibrary",
  abstract: "Python 魔法函数，标准库的一些说明",
};
const DesignPattern: Article = {
  type: "cs",
  reposUrl:
    "https://github.com/Pionpill/Notebook-Code/blob/engineer/Engineer/DesignPatterns/DesignPatterns.pdf",
  titleIcon: <GiGearStickPattern size={36} />,
  title: "DesignPattern",
  reference: "《Design Pattern Element of Reusable Object-Oriented Software》",
  abstract: "23 种常见设计模式的总结梳理",
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
