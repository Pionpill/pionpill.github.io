const rules = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": "warn",
    /**
     * 布尔值类型的 propTypes 的 name 必须为 is 或 has 开头
     * @reason 类型相关的约束交给 TypeScript
     */
    "react/boolean-prop-naming": "warn",
    /**
     * <button> 必须有 type 属性
     */
    "react/button-has-type": "warn",
    /**
     * 一个 defaultProps 必须有对应的 propTypes
     * @reason 类型相关的约束交给 TypeScript
     */
    "react/default-props-match-prop-types": "warn",
    /**
     * props, state, context 必须用解构赋值
     */
    "react/destructuring-assignment": "warn",
    /**
     * 必须使用 <></> 而不是 React.Fragment
     * @reason <></> 不需要额外引入 Fragment 组件
     */
    "react/jsx-fragments": ["warn", "syntax"],
    /**
     * handler 的名称必须是 onXXX 或 handleXXX
     */
    "react/jsx-handler-names": "warn",
    /**
     * 数组中的 jsx 必须有 key
     */
    "react/jsx-key": [
      "error",
      {
        checkFragmentShorthand: true,
      },
    ],
    /**
     * 限制 jsx 层级
     */
    "react/jsx-max-depth": "warn",
    /**
     * 禁止使用未定义的组件
     */
    "react/jsx-no-undef": "error",
    /**
     * 禁止无意义的 Fragment 组件
     */
    "react/jsx-no-useless-fragment": "error",
    /**
     * 组件的名称必须符合 PascalCase
     */
    "react/jsx-pascal-case": "error",

    /**
     * 禁止将 children 作为一个 prop
     */
    "react/no-children-prop": "error",
    /**
     * 禁止使用已废弃的 api
     */
    "react/no-deprecated": "error",
    /**
     * 禁止使用字符串 ref
     */
    "react/no-string-refs": "error",
    /**
     * 禁止在函数组件中使用 this
     */
    "react/no-this-in-sfc": "error",
    /**
     * 禁止组件的属性或生命周期大小写错误
     */
    "react/no-typos": "error",
    /**
     * 禁止在组件的内部存在未转义的 >, ", ' 或 }
     */
    "react/no-unescaped-entities": "error",
    /**
     * 禁止出现 HTML 中的属性，如 class
     */
    "react/no-unknown-property": "error",
    /**
     * 禁止使用不安全的生命周期方法 componentWillMount, componentWillReceiveProps, componentWillUpdate
     */
    "react/no-unsafe": [
      "error",
      {
        checkAliases: true,
      },
    ],
    /**
     * 禁止在组件内使用不稳定的组件
     */
    "react/no-unstable-nested-components": "error",
    /**
     * 禁止在类组件中定义未使用的方法
     */
    "react/no-unused-class-component-methods": "off",
    /**
     * 必须使用函数式组件
     */
    "react/prefer-stateless-function": "warn",
    /**
     * 类的静态属性必须使用 static 关键字定义
     */
    "react/static-property-placement": "error",
    /**
     * style 属性的取值必须是 object
     */
    "react/style-prop-object": "error",
    /**
     * img, br 标签中禁止有 children
     */
    "react/void-dom-elements-no-children": "error",
  },
};

export default rules;
