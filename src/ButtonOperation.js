import { ACTIONS } from "./App";

export default function ButtonOperation({ dispatch, operation }) {
  return (
    <button onClick={() => dispatch({ type: ACTIONS.SELECT_OPERATION, payload: { operation } })}>
      {operation}
    </button>
  );
}