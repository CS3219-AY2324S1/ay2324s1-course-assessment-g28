module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react", "unused-imports"],
  root: true,
  rules: {
    "max-len": [
      1,
      {
        ignorePattern: "^import\\s.+\\sfrom\\s.+;$",
        ignoreUrls: true,
      },
    ],
    "no-tabs": 0,
    quotes: [1, "double"],
    semi: [1, "always"],
    "@typescript-eslint/semi": [1],
    "no-trailing-spaces": 1,
    "comma-dangle": [1, "always-multiline"],
    "object-curly-spacing": [1, "always"],
    "@typescript-eslint/no-unused-vars": 1,
    "@typescript-eslint/member-delimiter-style": [
      "warn",
      {
        multiline: {
          delimiter: "semi",
          requireLast: true,
        },
        singleline: {
          delimiter: "semi",
          requireLast: false,
        },
      },
    ],
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
};
