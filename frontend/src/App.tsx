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
import { Children, useEffect } from "react";
import axios from "axios";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/email"
          element={
            <ProtectedRoute>
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
        <Route path="/signin" element={<AuthRoute> <SignIn /> </AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
      </Routes>
    </Router>
  );
}

const AuthRoute = ({ children }: any) => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        await axios.get("https://ai-powered-email-generator.onrender.com/api/v1/user/me", {
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
  }, [navigate]);
  return children;
};

const ProtectedRoute = ({ children }: any) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!token) {
          navigate("/signin");
        }
        await axios.get("https://ai-powered-email-generator.onrender.com/api/v1/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        navigate("/signin");
      }
    };
    checkAuth();
  }, [navigate, token]);
  return children;
};

export default App;
