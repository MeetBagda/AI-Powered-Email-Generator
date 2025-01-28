import "./App.css";
import EmailForm from "./components/EmailForm";
import Layout from "./components/layout";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import {  useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
      if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
             if (hostname === "localhost") {
               setApiUrl(import.meta.env.VITE_API_URL_LOCAL)
             } else {
               setApiUrl(import.meta.env.VITE_API_URL_PRODUCTION)
            }
         }
      }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/email"
          element={
            <ProtectedRoute apiUrl={apiUrl}>
            <Layout>
              <div className="flex flex-col w-full h-auto gap-2">
                <Header />
                <div className="flex flex-row">
                  <EmailForm />
                </div>
              </div>
            </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<AuthRoute apiUrl={apiUrl}> <SignIn /> </AuthRoute>} />
        <Route path="/signup" element={<AuthRoute apiUrl={apiUrl}><SignUp /></AuthRoute>} />
      </Routes>
    </Router>
  );
}

const AuthRoute = ({ children, apiUrl }: any) => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        await axios.get(`${apiUrl}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/email");
      } catch (err) {
        console.error("Error checking auth:", err);
      }
    };

    checkAuth();
  }, [navigate, apiUrl]);
  return children;
};

const ProtectedRoute = ({ children, apiUrl }: any) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!token) {
          navigate("/signin");
        }
         await axios.get(`${apiUrl}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        navigate("/signin");
      }
    };
    checkAuth();
  }, [navigate, token, apiUrl]);
  return children;
};

export default App;