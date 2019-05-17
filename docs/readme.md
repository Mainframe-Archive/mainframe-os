## Mainframe OS Documentation
**powered by [Docusaurus](https://docusaurus.io/docs/en/installation)**

**hosted on [Github Pages](https://github.com/MainframeHQ/mainframe-os/settings)**

### Build & test locally

From console:
```
cd website
yarn start
```

From web browser navigate to: `http://localhost:3000`

### Publish to Github Pages

```
GIT_USER=<GIT_USER> \
  CURRENT_BRANCH=master \
  USE_SSH=true \
  yarn run publish-gh-pages
```

Published to `mainframehq.github.io/mainframe-os`

DNS record & github pages set up to redirect/publish to **`docs.mainframe.com`**
