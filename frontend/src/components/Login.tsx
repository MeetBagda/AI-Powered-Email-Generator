// Login.tsx
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const methods = useForm({
    mode: "onBlur",
  });
  const { register, handleSubmit, reset } = methods;

  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth()

  const handleSignUpSubmit = async (data: any) => {
      setLoading(true);
      setError(null);
      try {
          const response = await fetch("http://localhost:8888/api/v1/user/signup", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
          });

          const responseData = await response.json()
          if (!response.ok) {
              setError(responseData.msg)
             return; // early return
          }else{
             reset()
             alert("user created")
          }
      } catch (err: any) {
          console.error(err);
          setError("An error occurred. Please try again.");
      } finally {
          setLoading(false);
      }
    };

  const handleSignInSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8888/api/v1/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

       if (!response.ok) {
         setError(responseData.msg);
          return; // early return
        }
      setUser(responseData.user);
    //   alert("logged in");
      navigate("/email");
    } catch (err: any) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleToggle = (mode: "signin" | "signup") => {
    setAuthMode(mode);
  };


  return (
    <div className="min-h-screen flex items-center justify-center">
      <FormProvider {...methods}>
        <div className="w-full flex flex-col justify-center items-center">
          <div className="flex gap-2 mb-4">
            <Button
              variant={authMode == "signin" ? "default" : "outline"}
              onClick={() => handleToggle("signin")}
            >
              Sign In
            </Button>
            <Button
              variant={authMode == "signup" ? "default" : "outline"}
              onClick={() => handleToggle("signup")}
            >
              Sign Up
            </Button>
          </div>
          <form
            onSubmit={authMode == 'signup' ? handleSubmit(handleSignUpSubmit) : handleSubmit(handleSignInSubmit)}
            className="email-form w-full max-w-xl  h-auto flex flex-col gap-5"
          >
            {authMode === "signup" && (
              <FormItem>
                <FormLabel htmlFor="username">Username:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="username"
                    {...register("username")}
                    required
                    placeholder="Example: myusername123"
                    className="rounded-2xl"
                  />
                </FormControl>
              </FormItem>
            )}
            <FormItem>
              <FormLabel htmlFor="email">Email:</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  id="email"
                  {...register("email")}
                  required
                  placeholder="Example: user@example.com"
                  className="rounded-2xl"
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="password">Password:</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  id="password"
                  {...register("password")}
                  required
                  placeholder="Enter your password"
                  className="rounded-2xl"
                />
              </FormControl>
            </FormItem>

            <Button type="submit" disabled={loading}>
              {loading
                ? authMode == "signup"
                  ? "Signing up..."
                  : "Logging in..."
                : authMode == "signup"
                ? "Sign Up"
                : "Sign In"}
            </Button>
            {error && <FormMessage>{error}</FormMessage>}
          </form>
        </div>
      </FormProvider>
    </div>
  );
};

export default Login;