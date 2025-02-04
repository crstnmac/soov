<h1 align="center">soov</h1>

## Content

- [About project](#about-project)
  - [Built with](#built-with)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [File structure](#file-structure)
  - [Usage](#usage)
- [Contact](#Contact)

## About project

An app which reminds you, your loved ones on their special days.

### Built with

This project use:

- [React Native](http://facebook.github.io/react-native/)
- [Typescript](https://www.typescriptlang.org/)
- [Atomic Design](https://atomicdesign.bradfrost.com/)
- [React Navigation](https://reactnavigation.org/)
- [Styled-components](https://styled-components.com/)
- [Storybook](https://storybook.js.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [EditorConfig](https://editorconfig.org/)

## Getting started

### Prerequisites

You need have React Native Environment configured.

[React Native Environment (Android/iOS)](https://reactnative.dev/docs/getting-started)

### File structure

```bash
my-app
├── .vscode/
│   └── settings.json
├── android/
├── ios/
├── src/
│   ├── @types/
│   ├── components/
│   │   └── atoms/
│   │       └── flex/
│   │       └── space/
│   │       └── index.ts
│   │   └── pages/
│   │       └── home/
│   │       └── index.ts
│   ├── navigator/
│   ├── theme/
│   ├── index.tsx
├── storybook/
├── .buckconfig
├── .editorconfig
├── .eslintrc.js
├── .gitattributes
├── .gitignore
├── .prettierrc.js
├── .watchmanconfig
├── app.json
├── babel.config.js
├── index.js
├── metro.config.js
├── package.json
├── README.md
├── tsconfig.js
```

### Usage

1. Clone the repo:

```sh
https://github.com/crstnmac/soov
cd ./soov
```

2. Install npm dependencies:

```sh
yarn
```

3. Install pod dependencies:

```sh
npx pod-install ios
```

4. Run:

```sh
yarn android
yarn ios
```

## Contact

My name - [Github](https://github.com/crstnmac)
