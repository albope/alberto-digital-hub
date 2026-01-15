export default [
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Date: "readonly",
        Math: "readonly",
        gsap: "readonly",
        ScrollTrigger: "readonly"
      }
    },
    rules: {
      // Errores
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": ["warn", { allow: ["warn", "error", "log"] }],

      // Mejores practicas
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "no-eval": "error",

      // Estilo
      "semi": ["error", "always"],
      "quotes": ["warn", "single", { "allowTemplateLiterals": true }],
      "indent": ["warn", 4],
      "no-trailing-spaces": "warn",
      "comma-dangle": ["warn", "never"],

      // ES6+
      "arrow-spacing": "warn",
      "no-duplicate-imports": "error",
      "prefer-template": "warn"
    }
  }
];
