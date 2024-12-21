import React, { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormValues {
  purpose: string;
  subjectLine: string;
  recipients: string;
  senders: string;
  maxLength: number;
}

const EmailForm = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      maxLength: 50,
    },
  });

  const { handleSubmit, watch, formState: { errors } } = methods;
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setError(null);
    setGeneratedEmail("");

    try {
      const response = await fetch("http://localhost:3000/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          purpose: data.purpose,
          subjectLine: data.subjectLine,
          recipients: data.recipients,
          senders: data.senders,
          maxLength: data.maxLength, // Send as a number
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to generate email.");
      } else {
        const responseData = await response.json();
        setGeneratedEmail(responseData.email);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedEmail) return; // Prevent copying if no email generated

    try {
      await navigator.clipboard.writeText(generatedEmail);
      alert("Email copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Failed to copy email to clipboard.");
    }
  };

  return (
    <div style={{ width: "auto" }}>
      <div
        className="email-container"
        style={{ display: "flex", width: "100%" }}
      >
         <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="email-form">
            <FormItem>
              <FormLabel htmlFor="purpose">Purpose:</FormLabel>
              <FormControl>
                <Textarea
                  id="purpose"
                  {...methods.register("purpose")}
                  required
                  placeholder="Example: I am writing an email to my boss for salary increment."
                />
                
              </FormControl>
            </FormItem>
           <FormItem>
              <FormLabel htmlFor="subjectLine">Subject Line:</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="subjectLine"
                  {...methods.register("subjectLine")}
                  required
                  placeholder="Example: Product Review, etc..."
                />
                 
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="recipients">
                Recipients (comma-separated):
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="recipients"
                  {...methods.register("recipients")}
                  required
                  placeholder="Example: hr.department@gmail.com"
                />
                
              </FormControl>
             </FormItem>
            <FormItem>
              <FormLabel htmlFor="senders">
                Senders (comma-separated):
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="senders"
                  {...methods.register("senders")}
                  required
                  placeholder="Example: manager.department@gmail.com"
                />
                
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="maxLength">Max Length (words):</FormLabel>
              <FormControl>
                <Input
                  type="range"
                  id="maxLength"
                  min="50"
                  max="500"
                  step="10"
                  {...methods.register("maxLength", { valueAsNumber: true })}
                />
               
              </FormControl>
              <span>{watch("maxLength")}</span>
            </FormItem>
            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate Email"}
            </Button>
            {error && <FormMessage>{error}</FormMessage>}
              
             
          </form>
        </FormProvider> 

        {generatedEmail && (
          <div className="email-output">
            <h2>Generated Email:</h2>
            <pre>{generatedEmail}</pre>
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailForm;


















