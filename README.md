# Hangman

A responsive word game built with vanilla JavaScript and Vite. Includes three difficulty levels, clues, physical and on-screen keyboards, win/loss states, and browser-local statistics. No credentials or backend required.

## Play directly — no installation needed

Download `index.html` and double-click it to open the game in your browser. All game code and styles are included in this single file, so it also works offline. Statistics are stored when browser storage is available.

## Development

Edit the files in `src/`, then run `npm run build:page` to update the standalone `index.html`. This command only needs Node.js; it does not require installing dependencies. Both `npm run dev` and `npm run build` regenerate the page automatically. After editing source files during development, run `npm run build:page` again to refresh the page.

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

## Checks

```sh
npm test
npm run build
```

`npm run preview` serves the production build. The game uses system fonts and needs no external services.
