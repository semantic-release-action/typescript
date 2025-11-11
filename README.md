# semantic-release-action/typescript

[![Build Status]](https://github.com/semantic-release-action/typescript/actions/workflows/host_release.yml)

[build status]: https://github.com/semantic-release-action/typescript/actions/workflows/host_release.yml/badge.svg?event=push

This repository contains _extremely opinionated_ reusable GitHub Actions workflows providing CI and CD for TypeScript projects.

This GitHub Action is intended to reduce duplication among very rigidly organized projects.
These are not general-purpose workflows.
You may find that they work for you and your development workflows out of the box, or they may not.

Continuous deployments brought to you by [semantic-release].

[semantic-release]: https://github.com/semantic-release/semantic-release

## CI

Continuous integration is provided by `.github/workflows/ci.yml`.

CI runs Rust tests on an `ubuntu-latest` [runner].

[runner]: https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners#supported-runners-and-hardware-resources

### Use

```yaml
---
name: CI

on:
  pull_request:

jobs:
  test:
    uses: semantic-release-action/typescript/.github/workflows/ci.yml@v3
```

### Inputs

|      Input Parameter      |              Default              | Description                                                                            |
| :-----------------------: | :-------------------------------: | -------------------------------------------------------------------------------------- |
|       node-versions       | `'["lts/-2", "lts/-1", "lts/*"]'` | Node.js versions to use for testing. [Details](#node-versions)                         |
|       test-command        |    `npm run --if-present test`    | Shell command used to provide confidence in proposed changes. [Details](#test-command) |
| allow-postinstall-scripts |              `false`              | If false, uses `--ignore-scripts` with `npm ci`. [Details](#allow-postinstall-scripts) |

#### node-versions

The matrix of Node.js versions on which to run tests.
Due to limitations of GitHub Actions, this must be expressed as a stringified JSON array.

See [here] for supported version syntax.

[here]: https://github.com/actions/setup-node#supported-version-syntax

#### test-command

The shell command used to provide confidence in the proposed changes.
Defaults to `npm run --if-present test`, but you can override this to any shell command.

#### allow-postinstall-scripts

Runtime flag to control execution of [post-install scripts].

[post-install scripts]: https://docs.npmjs.com/cli/v9/commands/npm-ci?v=true#ignore-scripts

## Release

Continuous deployments for TypeScript packages are provided by `.github/workflows/release.yml`.

Each deploy:

- publishes your package

  The target registry is [configured] in your package manifest.

- updates a CHANGELOG.md in your git repository

[configured]: https://docs.npmjs.com/cli/v9/commands/npm-publish#configuration

### Limitations

This workflow currently only supports single-package repositories.
Monorepo support has not been considered.

### Use

```yaml
---
name: Release

on:
  push:
    branches:
      - master
      - next
      - next-major
      - beta
      - alpha
      - "[0-9]+.[0-9]+.x"
      - "[0-9]+.x"

jobs:
  release:
    uses: semantic-release-action/typescript/.github/workflows/release.yml@v3
    secrets:
      npm-token: ${{ secrets.NPM_TOKEN }}
```

### Inputs

|       Input Parameter        |              Default              |                                          Description                                           |
| :--------------------------: | :-------------------------------: | :--------------------------------------------------------------------------------------------: |
|      test-node-versions      | `'["lts/-2", "lts/-1", "lts/*"]'` |                 Node.js versions to use for testing. [Details](#node-versions)                 |
|         test-command         |    `npm run --if-present test`    |     Shell command used to provide confidence in proposed changes. [Details](#test-command)     |
|     release-node-version     |              `lts/*`              |             Node.js version to use for releasing. [Details](#release-node-version)             |
|  allow-postinstall-scripts   |              `false`              |     If false, uses `--ignore-scripts` with `npm ci`. [Details](#allow-postinstall-scripts)     |
| disable-semantic-release-git |              `false`              | Disable [@semantic-release/git] in your release flow. [Details](#disable-semantic-release-git) |
|         environment          |              `false`              | Required: `false`. Allows repositories to use GitHub Environments for OIDC Trusted Publishing, if provided when calling. [Details](#environment) |

#### release-node-version

Singular Node.js version on which to invoke semantic-release.

#### disable-semantic-release-git

Runtime option controlling the use of [@semantic-release/git].
Set to `true` to prevent semantic-release from pushing artifacts to your repository.
This may be required with certain repository settings, for example when requiring signed commits.

[@semantic-release/git]: https://github.com/semantic-release/git

#### environment

Runtime option controlling the use of GitHub [Environments].
Required is set to `false` in the case that a repository is not using an Environment setup.
This input will be required inside of repositories that are publishing using OIDC Trusted Publishing.

[Environments]: https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments

### Secrets

|  Secret   | Required | Description                                   |
| :-------: | :------: | --------------------------------------------- |
| npm-token |   false   | npm registry API token. [Details](#npm-token) |

#### npm-token

API token with write permission for publishing your package to your target registry.
