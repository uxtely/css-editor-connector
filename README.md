# External CSS Editor Connector for UI Drafter

This program is for styling UI Drafter files
from standalone editors, and the changes get hot-reloaded.

Supports `.css`, `.less`, and `.scss`

More details: [docs.uidrafter.com/css-editor](https://docs.uidrafter.com/css-editor)


## Install
```shell script
git clone https://github.com/uxtely/css-editor-connector.git
cd uidrafter-uxtely-css-editor-connector
npm install
```

## Usage Example
```shell script
./connect.js my-styles.less
```
Then click **Connect External Editor** in App
Drafter's **CSS Editor** panel (in Previewer).

You can connect many UI Drafter's, in different browsers
or sizes, and changes will be pushed to all of them.

### Details
The program watches for stylesheet changes, and for changes within
the stylesheet directory. Therefore, imported sheets can trigger
live-updates too, as long as they're within that directory.


## Troubleshooting
Error Code `EADDRINUSE` means conflict.
- Is another instance running? Only one active connector is supported.
- Is another program using port `29924` on your `localhost`?

Syntax Errors
- UI Drafter shows _"Error with the stylesheet on the
External Editor Connector. Most likely is a syntax error."_
  - If you're using `.less` or `.scss` check the
  console, it will indicate where the error is.

## License
This program is [ISC licensed](./LICENSE).
