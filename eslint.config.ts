import js from "@eslint/js";
import tailwind from "eslint-plugin-better-tailwindcss";
import { getDefaultSelectors } from "eslint-plugin-better-tailwindcss/defaults";
import {
  MatcherType,
  SelectorKind,
} from "eslint-plugin-better-tailwindcss/types";
import prettier from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tslint from "typescript-eslint";

const tailwindSelectors = [
  ...getDefaultSelectors(),
  {
    kind: SelectorKind.Callee,
    name: "^column$",
    match: [{ type: MatcherType.ObjectValue, path: "^className$" }],
  },
];

export default defineConfig([
  globalIgnores(["dist", "public"]),

  {
    name: "TypeScript",
    extends: tslint.configs.recommended,
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { caughtErrors: "none" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },

  {
    name: "JavaScript",
    files: ["**/*.{ts,tsx,js,jsx}"],
    ...js.configs.recommended,
    rules: {
      "prefer-const": ["error", { destructuring: "all" }],
    },
  },

  {
    name: "React Hooks",
    extends: [reactHooks.configs.flat.recommended],
  },

  {
    name: "Prettier",
    extends: [prettier],
    rules: {
      "prettier/prettier": "warn",
    },
  },

  {
    name: "Tailwind",
    files: ["**/*.{ts,tsx,js,jsx}"],
    extends: [tailwind.configs.recommended],
    rules: {
      "better-tailwindcss/enforce-consistent-class-order": [
        "warn",
        { selectors: tailwindSelectors },
      ],
      "better-tailwindcss/enforce-consistent-line-wrapping": [
        "warn",
        {
          preferSingleLine: true,
          group: "never",
          printWidth: 0,
          selectors: tailwindSelectors,
        },
      ],
      "better-tailwindcss/no-unknown-classes": [
        "warn",
        { ignore: ["^animate-"], selectors: tailwindSelectors },
      ],
      "better-tailwindcss/no-unnecessary-whitespace": [
        "warn",
        { selectors: tailwindSelectors },
      ],
    },
    settings: {
      "better-tailwindcss": { entryPoint: "./src/styles.css" },
    },
  },

  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2020,
    },
  },
]);
