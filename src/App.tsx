import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p className="bg-blue-400">test 123 {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>count</button>
    </>
  );
}

export default App;
