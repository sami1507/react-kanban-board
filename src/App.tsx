import { Board } from "./components/Board";
import { useBoard } from "./state/useBoard";

export function App() {
  const { board, dispatch } = useBoard();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Team board</h1>
        <p>Plan and track work across four stages. Changes are saved in this browser.</p>
      </header>
      <Board board={board} dispatch={dispatch} />
    </div>
  );
}
