import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
 import { Loader2 } from "lucide-react";


interface FormValues {
  purpose: string;
  subjectLine: string;
  recipients: string;
  senders: string;
  maxLength: number;
  tone?: string;
}

const EmailForm = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      maxLength: 100,
    },
  });

  const {
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = methods;
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setError(null);
    setGeneratedEmail("");

    try {
      const response = await fetch(`${apiUrl}/email/generate-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          purpose: data.purpose,
          subjectLine: data.subjectLine,
          recipients: data.recipients,
          senders: data.senders,
          maxLength: data.maxLength,
          tone: data.tone,
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
    <div className="flex flex-row gap-3 w-full h-full">
      <div className="pl-5" style={{ width: "40%" }}>
        <div
          className="email-container w-full h-full flex flex-row justify-center items-center"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="email-form w-full h-auto flex flex-col gap-5"
            >
              <FormItem className="w-full">
                <FormLabel htmlFor="purpose">Purpose:</FormLabel>
                <FormControl>
                  <Textarea
                    id="purpose"
                    {...register("purpose")}
                    required
                    placeholder="Example: I am writing an email to my boss for salary increment."
                    className={`rounded-md  ${
                      errors.purpose ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </FormControl>
                {errors.purpose && (
                  <FormMessage>{errors.purpose?.message}</FormMessage>
                )}
              </FormItem>
              <FormItem>
                <FormLabel htmlFor="subjectLine">Subject Line:</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="subjectLine"
                    {...register("subjectLine")}
                    required
                    placeholder="Example: Product Review, etc..."
                    className={`rounded-md  ${
                      errors.subjectLine ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </FormControl>
                {errors.subjectLine && (
                  <FormMessage>{errors.subjectLine?.message}</FormMessage>
                )}
              </FormItem>
              <FormItem>
                <FormLabel htmlFor="recipients">
                  Recipients (comma-separated):
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="recipients"
                    {...register("recipients")}
                    required
                    placeholder="Example: hr.department@gmail.com"
                    className={`rounded-md  ${
                      errors.recipients ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </FormControl>
                {errors.recipients && (
                  <FormMessage>{errors.recipients?.message}</FormMessage>
                )}
              </FormItem>
              <FormItem>
                <FormLabel htmlFor="senders">
                  Senders (comma-separated):
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="senders"
                    {...register("senders")}
                    required
                    placeholder="Example: manager.department@gmail.com"
                    className={`rounded-md  ${
                      errors.senders ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </FormControl>
                {errors.senders && (
                  <FormMessage>{errors.senders?.message}</FormMessage>
                )}
              </FormItem>
              <FormItem>
                <FormLabel htmlFor="maxLength">Max Length (words):</FormLabel>
                <br />
                <span>{watch("maxLength")}</span>
                <FormControl>
                  <Input
                    type="range"
                    id="maxLength"
                    min="50"
                    max="500"
                    step="10"
                    {...register("maxLength", { valueAsNumber: true })}
                  />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormControl>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tone</SelectLabel>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="funny">Funny</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="excited">Excited</SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="dramatic">Dramatic</SelectItem>
                        <SelectItem value="masculine">Masculine</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
              <Button type="submit" disabled={loading} className="relative">
                  {loading ? (
                     <>
                         Generating...
                         <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 animate-spin h-4 w-4" />
                     </>
                 ) : (
                     "Generate Email"
                 )}
                </Button>
              {error && <FormMessage>{error}</FormMessage>}
            </form>
          </FormProvider>
        </div>
      </div>
       <div className="bg-slate-200 h-full w-1"></div>
       <div className="p-2" style={{ width: "60%" }}>
       <div
         style={{
           width: "100%",
           backgroundColor: generatedEmail ? "white" : "white",
         }}
         className={`p-3 rounded-md ${generatedEmail ? "shadow-sm" : ""}`}
       >
         {generatedEmail ? (
<div className="email-output bg-slate-100 p-3 rounded-2xl">
<pre
className="text-slate-700"
style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
>
{generatedEmail}
</pre>
<div className="mt-5">
<Button onClick={copyToClipboard}>Copy</Button>
</div>
</div>

): (
      <div 
        className="h-full flex items-center justify-center" 
        style={{ backgroundColor: 'white' }} // Added for explicit white background
      >
        {/* Empty space with white background */}
      </div>)}
    </div>
  </div>
</div>
  );
};

export default EmailForm;