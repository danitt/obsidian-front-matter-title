# Front Matter Title

This is a plugin for [Obsidian](https://obsidian.md).

> **This is a fork of [snezhig/obsidian-front-matter-title](https://github.com/snezhig/obsidian-front-matter-title), updated to fix two issues present in the original:**
> - Tab bar titles revert to the filename after switching tabs or losing focus
> - A "Loaded" notice appears on every startup

---

Why this plugin exists: the zettelkasten method names files as timestamps (e.g. `202208251731`). This plugin displays a value from the YAML front matter block in place of the filename, without renaming any files.

---

- [Installation](#installation)
- [Development](#development)
- [Get started](#get-started)
- [Template Examples](./docs/TemplateExamples.md)
- [Features](./docs/Features.md)
- [Processor](./docs/Processor.md)
- [Api](#api)

---

# Installation

This fork is not listed in the Obsidian community plugin registry. Install it manually using the steps below.

## Desktop

1. Go to the [latest release](https://github.com/danitt/obsidian-front-matter-title/releases/latest/) and download the `obsidian-front-matter-title-#LAST_RELEASE#.zip` file.
2. Unzip it. You should have a folder containing `main.js`, `manifest.json`, and `styles.css`.
3. Move that folder into your vault at `.obsidian/plugins/obsidian-front-matter-title/`.
4. In Obsidian, open **Settings → Community plugins**, find **Front Matter Title** in the list, and enable it.

If you previously had the original plugin installed, disable and remove it first, then follow the steps above.

## Obsidian Sync (shared across devices)

Obsidian Sync replicates the `.obsidian/` folder, which includes plugins. Install the plugin on one device using the desktop steps above, then let Sync propagate it to your other devices.

On each device, after Sync has transferred the files:

1. Open **Settings → Community plugins**.
2. If prompted to reload plugins, do so.
3. Confirm **Front Matter Title** appears in the list and enable it.

> Plugin binaries synced this way are the desktop (`main.js`) build. They run fine on all platforms via Obsidian's bundled runtime.

## Mobile (iOS / Android) — direct install without Sync

If you are not using Obsidian Sync, you can install the plugin directly on mobile.

### iOS (via Files app)

1. On your desktop, download and unzip the [latest release](https://github.com/danitt/obsidian-front-matter-title/releases/latest/) as described above.
2. Connect your iPhone or iPad to your computer and open Finder (macOS) or iTunes (Windows).
3. Copy the plugin folder into your vault's `.obsidian/plugins/` directory using the Files app or the device file transfer interface.
4. Alternatively, use a cloud service (iCloud Drive, Dropbox, etc.) to copy the folder into your vault location on the device.
5. In Obsidian on iOS, open **Settings → Community plugins**, reload if prompted, and enable **Front Matter Title**.

### Android (via file manager)

1. Download the [latest release](https://github.com/danitt/obsidian-front-matter-title/releases/latest/) zip to your Android device, or transfer the unzipped folder from your desktop via USB or a cloud service.
2. Use a file manager app to place the plugin folder at `<vault>/.obsidian/plugins/obsidian-front-matter-title/`.
3. In Obsidian, open **Settings → Community plugins**, reload if prompted, and enable **Front Matter Title**.

---

# Development

## Prerequisites

- Node.js 16+
- npm

## Setup

```sh
git clone git@github.com:danitt/obsidian-front-matter-title.git
cd obsidian-front-matter-title
git submodule update --init
npm install
```

The `git submodule update --init` step is required. The `modules/api-provider` submodule is referenced by a TypeScript path alias; without it, compilation and tests will fail.

## Commands

```sh
npm run dev      # watch build — rebuilds main.js on every source change
npm run build    # type-check + production build
npm test         # run all tests
npm run eslint   # lint
npm run pretty   # format with Prettier
```

Run a single test file:

```sh
npx jest test/unit/Resolver/Resolver.spec.ts
npx jest --testPathPattern=TabManager
```

## Loading the plugin in Obsidian during development

The simplest approach is to symlink (or copy) the repository into your vault's plugin directory, then use watch mode so changes are picked up immediately.

**Symlink (macOS / Linux):**

```sh
ln -s /path/to/obsidian-front-matter-title ~/.obsidian/plugins/obsidian-front-matter-title
```

Replace `~/.obsidian` with the path to your vault's `.obsidian` folder.

**Watch mode:**

```sh
npm run dev
```

After each rebuild, reload the plugin in Obsidian without restarting the app:

1. Open **Settings → Community plugins**.
2. Disable **Front Matter Title**, then re-enable it.

Or install the [Hot Reload](https://github.com/pjeby/hot-reload) community plugin, which watches for changes to `main.js` and reloads automatically.

## Building for release

```sh
npm run build
```

This type-checks the project and writes a production `main.js` to the repository root. That file is the build artefact committed to the repo and included in releases — do not edit it directly.

---

# Get started

The plugin **does not rename files**. It uses a specific value from the front matter block of a Markdown file as the displayed filename in the explorer, graph, tab bar, and other views.

> The value at your chosen key must be a string, number, or array.

After installation, open the plugin's settings page and set your `Template`. The default value is `title`, meaning the plugin looks for a `title` key in the YAML front matter of each `.md` file and uses its value as the displayed title.

You can also use dot-notation: setting `foo.bar` will look for the `bar` key inside `foo`.

```yaml
title: 'A new shown title'   # used when template is "title"
foo:
  bar: 'Dot-notation title'  # used when template is "foo.bar"
```

[**See more**](./docs/TemplateExamples.md)

## Api

Looking to integrate? Try the [API provider](https://github.com/Snezhig/front-matter-plguin-api-provider).

## Note

Feel free to report bugs or ideas for this fork at [danitt/obsidian-front-matter-title](https://github.com/danitt/obsidian-front-matter-title/issues).
