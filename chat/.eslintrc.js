module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import', 'jsx-a11y'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/typescript',
      'plugin:jsx-a11y/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
    rules: {
        // Dodaj własne reguły
    },
    settings: {
        // Konfiguracja dla modułów importowanych
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        react: {
            version: 'detect',
        },
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'], // Your TypeScript files extension

            // As mentioned in the comments, you should extend TypeScript plugins here,
            // instead of extending them outside the `overrides`.
            // If you don't want to extend any rules, you don't need an `extends` attribute.
            

            parserOptions: {
              project: "tsconfig.json",
              tsconfigRootDir: __dirname,
              sourceType: "module",
            },
        },
    ],
};
