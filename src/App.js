import "./styles.css";

function App() {
  return (
    <div className="calculator-bg">
      <div className="calculator-grid">
        <div className="logo">CHASIO</div>
        <div className="output">
          <div className="prev-operand">123,456.7890 +</div>
          <div className="curr-operand">123,456.7890</div>
        </div>
        <button className="span-two red">CLEAR</button>
        <button className="red">DEL</button>
        <button>÷</button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button>×</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>−</button>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>+</button>
        <button>0</button>
        <button>.</button>
        <button className="span-two">=</button>
      </div>
    </div>
  );
}

export default App;
