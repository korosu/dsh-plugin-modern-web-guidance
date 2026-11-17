# dsh-plugin-modern-web-guidance

DeepSeek Harness (`dsh`) plugin that gives the agent Google Chrome's
[Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance):
curated, token-efficient guides on modern web platform APIs, so the agent stops
writing legacy HTML/CSS/JS.

The guides ship **inside the npm package `modern-web-guidance`**, which this
plugin depends on. Nothing needs to be copied from the GitHub repo. Search is
local and offline.

Tools: `modern_web_search`, `modern_web_retrieve`, `modern_web_list`.

## Install

    dsh plugin --profile web add link:C:\path\to\dsh-plugin-modern-web-guidance
    # or from a packed tarball
    dsh plugin --profile web add C:\path\to\dsh-plugin-modern-web-guidance-0.1.0.tgz

Restart the dsh process afterwards.

## Disable / remove

Disable without uninstalling (profile `cordis.patch.yml`):

    - id: modern-web-guidance
      disabled: true

Remove: `dsh plugin --profile web remove dsh-plugin-modern-web-guidance`

## Test without dsh

    npm install && npm test

Telemetry of the upstream CLI is disabled by default (`DISABLE_TELEMETRY=1`);
set `DISABLE_TELEMETRY=0` in the environment to re-enable it.
