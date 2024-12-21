import { useState } from "react";

import "./App.css";
import { Button } from "./components/ui/button";
import EmailForm from "./components/EmailForm";
import Layout from "./components/layout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Layout>
        <EmailForm/>
      </Layout>
    </>
  );
}

export default App;
