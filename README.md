# tisqleditor

## Usage

// TODO

## Contributing

### Setup

- node.js >18.16.0
- pnpm >8.6.12

### Build

- `pnpm i`
- `pnpm build`

### PR Commit Convention

Before you create a Pull Request, please check whether your commits comply with the commit conventions used in this repository. When you create a commit, you should follow the convention category(scope or module): message in your commit message while using one of the following categories:

- feat/feature: all changes that introduce completely new code or new features
- fix: changes that fix a bug (ideally you will additionally reference an issue if present)
- refactor: any code related change that is not a fix nor a feature
- chore: all changes to the repository that do not fit into any of the above categories

### Release

- Checkout from the latest main branch.
- Run `pnpm changeset` and follow the instructions, you will need to tell it the version and changelogs.
- Commit the generated changeset file (a markdown file in `.changeset` folder), create a pull request to main branch.
- After your pull request is merged, a new pull request will be created by a bot, you can review your release there.
- After that pull request is merged, a new release will be published automatically to github registry.
