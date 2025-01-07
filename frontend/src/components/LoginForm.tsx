'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/authContext";
import React from 'react';
import axios from "axios";

// Define the schema for sign-in
const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

// Define the schema for sign-up
const signUpSchema = signInSchema.extend({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
})

type SignInValues = z.infer<typeof signInSchema>
type SignUpValues = z.infer<typeof signUpSchema>

type FormValues = SignInValues | SignUpValues;

export default function LoginForm() {
    const navigate = useNavigate();
    const { setUser } = useAuth()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState<boolean>(false)

  // Create forms
  const form = useForm<FormValues>({
        resolver: isSignUp ? zodResolver(signUpSchema) : zodResolver(signInSchema),
        defaultValues: { email: '', password: '', username: '' },
        mode: "onBlur",
    })

  const { register, handleSubmit, reset, control } = form;
    
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
               navigate("/email");
            }
        } catch (err: any) {
            console.error(err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignInSubmit = async (data: any) => {
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      setLoading(true);
      setError(null);
      try {
       
        const response = await axios.post(
          "http://localhost:8888/api/v1/user/signin",
          {
            username,
            password,
          }
        );
       
      localStorage.setItem("token", response.data.token);
        navigate("/email");
      } catch (err: any) {
        console.error(err);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

 const onSubmit = async (e: React.BaseSyntheticEvent) => {
        if (isSignUp) {
            handleSubmit(handleSignUpSubmit)(e)
        }else{
             handleSubmit(handleSignInSubmit)(e)
        }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Create a new account'
              : 'Sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
             <FormProvider {...form}>
                <form onSubmit={onSubmit} className="space-y-4">
                  {isSignUp && (
                      <FormField
                          control={control}
                          name="username"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                      <Input placeholder="Choose a username"  {...register("username")} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      )}
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...register("email")} />
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
                          <Input type="password" placeholder="Enter your password" {...register("password")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                      {loading
                          ? isSignUp
                              ? "Signing up..."
                              : "Logging in..."
                          : isSignUp
                              ? "Sign Up"
                              : "Sign In"}
                  </Button>
                    {error && <FormMessage>{error}</FormMessage>}
                </form>
             </FormProvider>
        </CardContent>
        <CardFooter>
          <Button variant="link" onClick={() => setIsSignUp(!isSignUp)} className="w-full">
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}