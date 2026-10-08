# Casio fx-991EX Calculator

## Run locally

Requirements: Node.js 18 or newer. No npm packages or Firebase account are needed.

From the project folder, run:

```sh
npm start
```

Then open [http://localhost:3000](http://localhost:3000). To use another port, set
the `PORT` environment variable before starting the server.

The calculator is served from `frontend/`. Calculator history and game scores are
stored in the browser using IndexedDB, with localStorage as a fallback. This
local setup does not connect to Firebase; Google sign-in is unavailable.