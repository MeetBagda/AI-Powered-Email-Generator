import "./App.css";
import EmailForm from "./components/EmailForm";
import Layout from "./components/layout";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
              <LandingPage />
          }
        />
         <Route
          path="/email"
          element={
            <Layout>
                <div className="flex flex-col w-full h-auto gap-2">
                    <Header />
                    <div className="flex flex-row">
                      <EmailForm />
                    </div>
                 </div>
             </Layout>
          }
        />
        {/* Add more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;