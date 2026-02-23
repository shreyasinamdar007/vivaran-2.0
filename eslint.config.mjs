// @ts-check
import antfu from "@antfu/eslint-config";

import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  antfu(
    {
      type: "app",
      vue: true,
      typescript: true,
      formatters: true, // Antfu uses Prettier internally
      stylistic: {
        indent: 2,
        semi: true,
        quotes: "double",
      },
    },
    {
      rules: {
        /* ---------------------------
         * TypeScript
         * --------------------------- */
        "ts/no-redeclare": "off",
        "ts/consistent-type-definitions": ["error", "type"],

        // 🔧 Fix: "Function type accepts any function-like value"
        "ts/no-unsafe-function-type": "off",

        /* ---------------------------
         * Vue template formatting
         * --------------------------- */
        // 🔧 Fix: "Expected a linebreak before this attribute"
        "vue/first-attribute-linebreak": [
          "error",
          {
            singleline: "ignore",
            multiline: "below",
          },
        ],

        "vue/max-attributes-per-line": [
          "error",
          {
            singleline: 3,
            multiline: {
              max: 1,
            },
          },
        ],

        /* ---------------------------
         * General rules
         * --------------------------- */
        "no-console": ["warn"],
        "antfu/no-top-level-await": "off",

        /* ---------------------------
         * Node
         * --------------------------- */
        "node/prefer-global/process": "off",
        "node/no-process-env": "error",

        /* ---------------------------
         * Imports & filenames
         * --------------------------- */
        "perfectionist/sort-imports": [
          "error",
          {
            tsconfigRootDir: ".",
          },
        ],

        "unicorn/filename-case": [
          "error",
          {
            case: "kebabCase",
            ignore: ["README.md"],
          },
        ],
      },
    },
  ),

  // ✅ Flat-config override replacement
  {
    files: ["nuxt.config.ts", "server/plugins/mongodb.ts"],
    rules: {
      "node/no-process-env": "off",
    },
  },
);
