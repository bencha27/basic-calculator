import { useReducer } from "react";
import ButtonDigit from "./ButtonDigit";
import ButtonOperation from "./ButtonOperation";
import "./styles.css";

export const ACTIONS = {
  INSERT_DIGIT: "insert-digit",
  DELETE_DIGIT: "delete-digit",
  CLEAR: "clear",
  SELECT_OPERATION: "select-operation",
  EVALUATE: "evaluate"
}

function reducer(state, { type, payload }) {
  switch(type) {
    case ACTIONS.INSERT_DIGIT:
      if (!state.currOperand && payload.digit === "0") return state;
      if (!state.currOperand && payload.digit === ".") return {currOperand: `0${payload.digit}`};
      if (payload.digit === "." && state.currOperand.includes(".")) return state;
      // if (!state.prevOperand) {
      //   state.prevOperand = state.currOperand;
      //   state.currOperand = null;

      //   return {
      //     ...state,
      //     currOperand: `${state.currOperand || ""}${payload.digit}`
      //   }
      // }

      return {
        ...state,
        currOperand: `${state.currOperand || ""}${payload.digit}`
      };
    case ACTIONS.CLEAR: 
      return {};
    case ACTIONS.SELECT_OPERATION: 
      if (!state.currOperand && !state.prevOperand) return state;

      if (!state.currOperand) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (!state.prevOperand) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.currOperand,
          currOperand: null,
        };
      }

      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        currOperand: null,
      };
    case ACTIONS.EVALUATE:
      if (!state.operation || !state.prevOperand || !state.currOperand) return state;

      return {
        ...state,
        prevOperand: null,
        operation: null,
        currOperand: evaluate(state),
      }
  }
}

function evaluate({ currOperand, prevOperand, operation }) {
  const prev = parseFloat(prevOperand);
  const curr = parseFloat(currOperand);
  if (isNaN(prev) || isNaN(curr)) return "";

  let result = "";
  switch (operation) {
    case "+":
      result = prev + curr;
      break;
    case "−":
      result = prev - curr;
      break;
    case "×":
      result = prev * curr;
      break;
    case "÷":
      result = prev / curr;
  }

  return result.toString();
}

function App() {
  const [ { currOperand, prevOperand, operation }, dispatch ] = useReducer(reducer, {});

  return (
    <div className="calculator-bg">
      <div className="calculator-grid">
        <div className="logo">CHASIO</div>
        <div className="output">
          <div className="prev-operand">{prevOperand || "0"} {operation}</div>
          <div className="curr-operand">{currOperand || "0"}</div>
        </div>
        <button className="span-two red" 
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}>CLEAR</button>
        <button className="red">DEL</button>
        <ButtonOperation operation="÷" dispatch={dispatch} />
        <ButtonDigit digit="7" dispatch={dispatch} />
        <ButtonDigit digit="8" dispatch={dispatch} />
        <ButtonDigit digit="9" dispatch={dispatch} />
        <ButtonOperation operation="×" dispatch={dispatch} />
        <ButtonDigit digit="4" dispatch={dispatch} />
        <ButtonDigit digit="5" dispatch={dispatch} />
        <ButtonDigit digit="6" dispatch={dispatch} />
        <ButtonOperation operation="−" dispatch={dispatch} />
        <ButtonDigit digit="1" dispatch={dispatch} />
        <ButtonDigit digit="2" dispatch={dispatch} />
        <ButtonDigit digit="3" dispatch={dispatch} />
        <ButtonOperation operation="+" dispatch={dispatch} />
        <ButtonDigit digit="0" dispatch={dispatch} />
        <ButtonDigit digit="." dispatch={dispatch} />
        <button className="span-two" 
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </div>
  );
}

export default App;
