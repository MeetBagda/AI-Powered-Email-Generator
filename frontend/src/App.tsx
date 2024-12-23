import "./App.css";
import EmailForm from "./components/EmailForm";
import Layout from "./components/layout";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <>
      {/* <Layout>
        <div className="flex flex-col w-full h-auto gap-2">
          <Header />
          <div className="flex flex-row">
            <EmailForm />
          </div>
        </div>
      </Layout> */}
      <LandingPage/>
    </>
  );
}

export default App;
