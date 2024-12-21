import { useState } from "react";

import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
          <Button variant="link" onClick={()=>{setCount(c=>c+1)}}>Count : {count}</Button>
        </div>
    </>
  );
}

export default App;
