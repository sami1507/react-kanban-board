# react-kanban-board

[![CI](https://github.com/sami1507/react-kanban-board/actions/workflows/ci.yml/badge.svg)](https://github.com/sami1507/react-kanban-board/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)

A kanban board for planning team work across four stages: **Backlog → In progress → Review → Done**. Cards can be dragged with a mouse or moved with buttons, so the board works for keyboard and screen-reader users too. Everything is saved in the browser, with no backend.

## Live demo

**https://sami1507.github.io/react-kanban-board/**

The demo is deployed from `main` by the `Deploy live demo` workflow. Your board is saved in your own browser, so the demo has no shared state.

## Features

- Add, move and delete tasks; each task has a title, optional description and a priority
- Drag a card to another stage, or drop it in front of a specific card to reorder
- Keyboard-accessible move buttons on every card (`← Backlog`, `In progress →`)
- Board state persists in `localStorage`, with a fallback to seed data when storage is empty or corrupt
- Form validation: a task needs a non-blank title before it can be added
- Accessible structure: each stage is a labelled region, icon buttons have descriptive labels, and focus styles are visible

## Architecture

```text
src/
  types.ts                 Domain types (Task, ColumnId, BoardState)
  state/
    boardReducer.ts        Pure reducer: add, move, delete. No React, no I/O
    storage.ts             Seed data, load and save with defensive parsing
    useBoard.ts            Hook that connects the reducer to localStorage
  components/
    Board.tsx              Lays out the stages and dispatches actions
    Column.tsx             Stage container: drop target, add form, card list
    TaskCard.tsx           Draggable card with move and delete controls
    NewTaskForm.tsx        Controlled form for new tasks
  test/
    boardReducer.test.ts   Unit tests for every reducer transition
    Board.test.tsx        User-level tests with Testing Library
```

The reducer is the only place that changes board data. Components dispatch actions such as `task/move` with an optional `beforeTaskId`, which makes “insert before this card” work the same way for drag-and-drop and for buttons. Actions that would not change anything return the previous state object, so React skips needless renders.

## Getting started

```bash
npm ci
npm run dev        # http://localhost:5173
```

## Scripts

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Starts the Vite dev server with hot reload    |
| `npm test`          | Runs the Vitest suite in jsdom                |
| `npm run typecheck` | Type-checks the project with strict mode      |
| `npm run build`     | Type-checks, then produces an optimised bundle in `dist/` |
| `npm run preview`   | Serves the production build locally           |

## Testing approach

- **Reducer tests** cover each transition, including edge cases such as duplicate ids, reordering within a column, and no-op actions.
- **Component tests** use Testing Library and interact with the board the way a user would: clicking buttons, typing into the form, and reading the accessible names. They do not depend on CSS classes or implementation details.
- **Storage** is cleared between tests in `src/test/setup.ts`, and the persistence test checks that a saved board is restored on the next render.

Drag and drop is implemented with the native HTML5 API, which jsdom does not simulate, so it is not covered by automated tests. The button-based moves exercise the same reducer action, and the drag handlers are kept thin.

## Tech stack

React 19 · TypeScript (strict) · Vite · Vitest · Testing Library · jsdom

## License

MIT. See [LICENSE](LICENSE).
