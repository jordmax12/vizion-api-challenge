module.exports = {
  env: {
    es6: true,
    jest: true,
    node: true,
    commonjs: true,
  },
  extends: [
    "airbnb-base",
    "prettier",
    "plugin:node/recommended",
    "plugin:jest/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  plugins: ["jest", "prettier"],
  rules: {
    camelcase: ["error", { properties: "never" }],
    "class-methods-use-this": "off",
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        exports: "always-multiline",
        functions: "never",
        imports: "always-multiline",
        objects: "always-multiline",
      },
    ],
    complexity: ["error", 5],
    "eol-last": ["error", "always"],
    "func-names": "off",
    "import/extensions": "off",
    "import/no-extraneous-dependencies": "off",
    "max-len": ["error", { code: 150 }],
    "no-console": "off",
    "no-plusplus": "off",
    "no-process-exit": "off",
    "no-tabs": "warn",
    "no-unused-vars": "warn",
    "node/no-unpublished-require": "off",
    "node/no-extraneous-require": [
      "error",
      {
        allowModules: ["aws-sdk"],
      },
    ],
    "prettier/prettier": "error",
  },
};
