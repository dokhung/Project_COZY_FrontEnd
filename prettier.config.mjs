const prettierConfig = {
  printWidth: 200,
  endOfLine: "auto",
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: "as-needed",
  trailingComma: "all",
  bracketSpacing: true,
  jsxSingleQuote: true,
  jsxBracketSameLine: false,
  arrowParens: "always",
  parser: "typescript",
  plugins: ["prettier-plugin-tailwindcss"],
};

export default prettierConfig;
