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
      // If immediately after an evaluation
      if (state.overwrite) {
        return {
          currOperand: payload.digit,
          operation: null,
          overwrite: false,
        }
      }
      // If there is no operand and 0 is pressed
      if (!state.currOperand && payload.digit === "0") return state;
      // If there is no operand and decimal is pressed
      if (!state.currOperand && payload.digit === ".") return {currOperand: `0${payload.digit}`};
      // If there is already a decimal and decimal is pressed
      if (payload.digit === "." && state.currOperand.includes(".")) return state;

      return {
        ...state,
        currOperand: `${state.currOperand || ""}${payload.digit}`
      };
    case ACTIONS.CLEAR: 
      return {};
    case ACTIONS.SELECT_OPERATION: 
      // If an operation is selected immediately after an evaluation, use the result as the new operand
      if (state.overwrite) {
        return {
          prevOperand: `${formatOperand(state.currOperand)}`,
          operation: payload.operation,
          overwrite: false,
        }
      }
      
      // If there are no operands
      if (!state.currOperand && !state.prevOperand) return state;

      // If another operation is selected before a new operand is inserted, change the operation
      if (!state.currOperand) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      // 2 OPERANDS: If there was no previous operand, update its value
      if (!state.prevOperand) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: formatOperand(state.currOperand),
          currOperand: null,
        };
      }

      // 3+ OPERANDS: If there was a previous operand, update its value to the evaluated result
      return {
        ...state,
        prevOperand: formatOperand(evaluate(state)),
        operation: payload.operation,
        currOperand: null,
      };
    case ACTIONS.EVALUATE:
      // If an operand or operation is missing
      if (!state.operation || !state.prevOperand || !state.currOperand) return state;

      return {
        ...state,
        overwrite: true,
        prevOperand: `${state.prevOperand} ${state.operation} ${formatOperand(state.currOperand)} =`,
        operation: null,
        currOperand: evaluate(state),
      };
    case ACTIONS.DELETE_DIGIT:
      // If immediately after an evaluation
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currOperand: null
        }
      }
      // If there is no current operand
      if (state.currOperand == null) return state;
      // If the current operand has only 1 digit
      if (state.currOperand.length === 1) return { ...state, currOperand: null };

      return {
        ...state,
        currOperand: state.currOperand.slice(0, -1)
      };
  }
}

// Evaluate (calculate)
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

// Format operand (add commas)
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");

  // No decimal
  if (decimal == null) return INTEGER_FORMATTER.format(integer);

  // With decimal
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [ { currOperand, prevOperand, operation }, dispatch ] = useReducer(reducer, {});

  return (
    <div className="calculator-bg">
      <div className="calculator-grid">
        <div className="logo">CHASIO</div>
        <div className="output">
          {prevOperand ? 
            <div className="prev-operand">{prevOperand} {operation}</div> :
            <div style={{visibility: "hidden"}} className="prev-operand">0</div>
          }
          <div className="curr-operand">{formatOperand(currOperand) || "0"}</div>
        </div>
        <button className="span-two red" 
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}>CLEAR</button>
        <button className="red"
          onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
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
