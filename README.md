# KEFCA P3 Simulator

A browser-based practice simulator for **Futures Rewritten (Ultimate) Phase 3**.

This project focuses on the sequence from **Vacuum Wave** through **Ultima Blaster** dice spread resolution. It is designed for image training and movement practice: handling **Headwind / Tailwind**, joining the stack after knockback, tracking the rotating Ultima Blaster pattern, and moving to the correct final spread position based on the assigned dice marker.

## Features

- Keyboard movement with `WASD` or arrow keys
- Click-to-move support
- Facing-based **Headwind / Tailwind** resolution
- Randomized **8-direction Ultima Blaster** start pattern
- Randomized clockwise / counterclockwise rotation
- Randomized dice assignment for the controlled player and party members
- Stack handling, final spread handling, and collision checks for the last simultaneous Ultima Blasters
- On-screen timeline and hint panel
- Optional guide toggle
- Result modal with success / failure feedback

## Controls

- `W`, `A`, `S`, `D` or arrow keys: move your character
- Mouse click on the arena: set a movement target
- `Guide ON/OFF`: toggle helper UI
- `Retry`: restart the simulation

Your character's facing is determined by the last movement direction.

## Run Locally

### Requirements

- Node.js

### Start

```bash
npm install
npm start
```

Then open the local URL printed by `server.js`.

## Test

```bash
npm test
```

## GitHub Pages / Cache Busting

This repository includes a simple deploy-version updater to reduce stale JS/CSS issues on GitHub Pages.

Before deploying, run:

```bash
npm run deploy:prepare
```

This updates the version query string used by `index.html` for:

- `styles.css`
- `app.js`

## License

This project is released under the **MIT License**.

That means you can freely:

- use it
- fork it
- modify it
- redistribute it
- include it in your own projects

as long as the original copyright and license notice are kept.
