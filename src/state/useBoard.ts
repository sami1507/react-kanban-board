import { useEffect, useReducer } from "react";
import { boardReducer } from "./boardReducer";
import { loadBoard, saveBoard } from "./storage";

function browserStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    // Accessing localStorage can throw when the browser blocks site data.
    return undefined;
  }
}

/** Board state backed by a reducer and mirrored to localStorage. */
export function useBoard() {
  const storage = browserStorage();
  const [board, dispatch] = useReducer(boardReducer, storage, loadBoard);

  useEffect(() => {
    saveBoard(storage, board);
  }, [board, storage]);

  return { board, dispatch };
}
