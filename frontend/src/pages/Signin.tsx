"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define the schema for sign-in
const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create form
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const { handleSubmit, reset, control } = form;

  const handleSignInSubmit = async (data: SignInValues) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:8888/api/v1/user/signin",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Store token and navigate on success
      localStorage.setItem("token", response.data.token);
      reset();
      navigate("/email");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.msg || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.BaseSyntheticEvent) => {
    handleSubmit(handleSignInSubmit)(e);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Sign In"}
              </Button>
              {error && <FormMessage>{error}</FormMessage>}
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* Link to Sign Up Page */}
          <span className="text-sm">
            Don't have an account?
            <Button
              onClick={() => navigate("/signup")}
              variant="link" // Use a link variant for styling
              className=""
            >
              Sign Up
            </Button>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
