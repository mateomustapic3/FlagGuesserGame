# FlagGuesserGame
Guess the Flag Quiz is a simple web game where players identify country flags from multiple-choice options. It tracks score, lives, and time per question, and works fully offline with local assets.
# Guess the Flag Quiz

A browser-based quiz game where players identify country flags from multiple-choice options. The app tracks score, lives, and time per question, and runs entirely in the browser with local assets (no backend required).

## Features
- Randomized flag questions with four multiple-choice answers.
- Score tracking and lives system (3 lives).
- Countdown timer per question.
- Progress bar for total questions.
- Game-over and completion states.
- Retry button to start a new session.
- Local assets for offline use (flags + local jQuery).

## How it works
- The game loads `flags.json`, which contains the list of countries and corresponding image files.
- At the start of each session, the flags are shuffled and then served one by one without repetition.
- Each round:
  - A flag image is shown.
  - Four answer options are generated (1 correct + 3 random incorrect).
  - A 10-second timer counts down.
- Correct answers increase the score.
- Wrong answers or timeouts reduce lives.
- The game ends when:
  - The player finishes all questions, or
  - Lives reach zero.

## Project structure
- `index.html` — Main page layout.
- `style.css` — Visual styling.
- `script.js` — Game logic (quiz flow, timer, scoring).
- `flags.json` — Data source for flags.
- `flags/` — Folder with flag images.
- `heart.png` — Icon used for lives.
- `jquery-3.6.0.min.js` — Local jQuery dependency (offline-friendly).
