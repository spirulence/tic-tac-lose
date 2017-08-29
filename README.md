## Tic-Tac-Lose

An implementation of tic-tac-toe, against the computer, where the only outcomes possible are that the human player
loses or forces a draw.

## The Important Bits

The guts of the project reside in src/App.js. The project uses React as a framework, and React-Konva in order to display
graphics.

The AI is programmed as a set of states and transitions, where all states eventually lead to an AI win or to a draw.
You can view the large array with these states at `src/App.js`, line 121.

## Building

After you install all dependencies with `npm install`, you can use `npm build` to build a production copy of the site.
Place it at some top-level domain, and you should be good to go. Alternatively, use `npm start` for a quick development
cycle if you want to hack on it some more.