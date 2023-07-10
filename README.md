# asdb-ui

The web UI for the antiSMASH database

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

or

```sh
pnpm test:unit:watch
```

to keep watching the source files for changes.

### Run End-to-End Tests with [Nightwatch](https://nightwatchjs.org/)

```sh
# When using CI, the project must be built first.
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chrome
pnpm test:e2e --env chrome
# Runs the tests of a specific file
pnpm test:e2e tests/e2e/example.ts
# Runs the tests in debug mode
pnpm test:e2e --debug
```

### Run Headed Component Tests with [Nightwatch Component Testing](https://nightwatchjs.org/guide/component-testing/introduction.html)

```sh
pnpm test:unit
pnpm test:unit -- --headless # for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## License

The antiSMASH database UI is an open source tool available under the GNU Affero General Public License version 3.0 or greater.
See the [`LICENSE` file](LICENSE) for details.
