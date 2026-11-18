# dsh-plugin-modern-web-guidance

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) plugin that gives the agent
Google Chrome's [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance): short, curated
guides on modern web platform APIs. The agent looks up the current native solution before writing
HTML/CSS/client-side JS, instead of reproducing legacy patterns from its training data.

This is an unofficial community plugin. It is not affiliated with Google or DeepSeek.

## Tools

| Tool | What it does |
| --- | --- |
| `modern_web_search` | Searches the guides by a short English query and returns matching guide ids with descriptions. |
| `modern_web_retrieve` | Returns the full text of one or more guides (code patterns, gotchas, fallbacks) by id. |
| `modern_web_list` | Lists every available guide. A fallback when search finds nothing useful. |

The guides ship inside the npm package [`modern-web-guidance`](https://www.npmjs.com/package/modern-web-guidance),
which this plugin depends on. Search is local and works offline. Nothing needs to be copied from Google's repository.

## Install

```sh
dsh plugin --profile web add dsh-plugin-modern-web-guidance
```

Restart `dsh` afterwards. Replace `web` with the name of your profile. Check that the plugin is registered:

```sh
dsh plugin --profile web list
```

### Install from a release tarball

Download `dsh-plugin-modern-web-guidance-<version>.tgz` from the
[Releases](https://github.com/korosu/dsh-plugin-modern-web-guidance/releases) page and install it by path:

```sh
dsh plugin --profile web add ./dsh-plugin-modern-web-guidance-<version>.tgz
```

## Usage

Nothing to configure. When you ask the agent for frontend work, it should call `modern_web_search`, then
`modern_web_retrieve`, and apply the guide. Try: "Make a modal dialog that closes on outside click and Esc, with a
smooth open/close animation."

If your model skips the tools, add a line to your project's `AGENTS.md`:

```
Before any HTML/CSS/client-side JS task, call modern_web_search, then modern_web_retrieve.
```

## Updating

The guides come from the `modern-web-guidance` npm package, whose version is fixed when the plugin is installed.
To get newer guides, update this plugin to its latest version (remove and add it again if your `dsh` has no
update command), then restart `dsh`.

## Disable or remove

Disable without uninstalling by adding this to your profile's `cordis.patch.yml`:

```yaml
- id: modern-web-guidance
  disabled: true
```

Remove it completely:

```sh
dsh plugin --profile web remove dsh-plugin-modern-web-guidance
```

## Telemetry

The upstream CLI sends anonymous usage telemetry. This plugin turns it off by default (`DISABLE_TELEMETRY=1`).
Set `DISABLE_TELEMETRY=0` in your environment to turn it back on.

## Development

```sh
git clone https://github.com/korosu/dsh-plugin-modern-web-guidance
cd dsh-plugin-modern-web-guidance
npm install --legacy-peer-deps
npm test
```

`npm test` runs the real `search`, `retrieve` and `list` commands against the bundled guides and does not need `dsh`.

To try a local checkout inside a profile, pack it and install the tarball:

```sh
npm pack
dsh plugin --profile web add ./dsh-plugin-modern-web-guidance-<version>.tgz
```

### Updating the Google package

```sh
npm install modern-web-guidance@latest --no-package-lock --legacy-peer-deps
npm test
```

If the test fails, the CLI output format changed and `lib/cli.js` needs a fix. Otherwise bump the version in
`package.json` and publish a new release.

## License

MIT. The guides themselves are part of Google's `modern-web-guidance` package and are covered by its license.
