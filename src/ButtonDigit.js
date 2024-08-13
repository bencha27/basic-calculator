import { ACTIONS } from "./App";

export default function ButtonDigit({ dispatch, digit }) {
  return (
    <button onClick={() => dispatch({ type: ACTIONS.INSERT_DIGIT, payload: { digit } })}>
      {digit}
    </button>
  );
}