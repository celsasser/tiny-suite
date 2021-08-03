module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	parserOptions: {
		tsconfigRootDir: __dirname,
	},
	rules: {
		'@typescript-eslint/consistent-type-definitions': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-parameter-properties': 'off',
		'no-mixed-spaces-and-tabs': 'error',
		quotes: ['error', 'single'],
		'security/detect-object-injection': 'off',
	},
};
