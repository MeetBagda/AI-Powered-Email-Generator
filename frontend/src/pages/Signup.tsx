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

// Define the schema for sign-up
const signUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create form
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", username: "" },
    mode: "onBlur",
  });

  const { handleSubmit, reset, control } = form;

  const handleSignUpSubmit = async (data: SignUpValues) => {
    setLoading(true);
    setError(null);
    console.log("Attempting signup with:", data); // Check the data being sent
    try {
      const response = await axios.post(
        "http://localhost:8888/api/v1/user/signup",
        data
      );

      console.log("Response Status:", response.status); // check response status
      console.log("Response Data:", response.data); // Check the data from the server
      if (response.status !== 201 && response.status !== 200) {
        setError(response.data?.msg || "Signup Failed");
        console.error("Signup failed with status:", response.status);
      } else {
        console.log("Signup successful, navigating to /email");
        reset();
        navigate("/email");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.msg || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.BaseSyntheticEvent) => {
    handleSubmit(handleSignUpSubmit)(e);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Choose a username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
              {error && <FormMessage>{error}</FormMessage>}
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* Link to Sign In Page */}
          <span className="text-sm">
            Already have an account?
            <Button
              onClick={() => navigate("/signin")}
              variant="link" // Use a link variant for styling
              className=""
            >
              Sign In
            </Button>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
