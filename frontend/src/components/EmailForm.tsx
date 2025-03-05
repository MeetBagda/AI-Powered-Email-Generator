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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmailContext } from "@/context/EmailContext";
import { apiClient } from "@/utils/api";

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

  const { incrementEmailCount } = useEmailContext();

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setError(null);
    setGeneratedEmail("");

    try {
      // Note: Using the actual endpoint as seen in the original code
      const response = await apiClient.post("/email/generate-email", {
        purpose: data.purpose,
        subjectLine: data.subjectLine,
        recipients: data.recipients,
        senders: data.senders,
        maxLength: data.maxLength,
        tone: data.tone,
      });

      setGeneratedEmail(response.data.email);
      // Call incrementEmailCount to update the email count
      incrementEmailCount();
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.response?.data?.error || "Failed to generate email. Please try again.");
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
    <>
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
                  {/* <OriginTextArea /> */}
                  <Textarea
                    id="purpose"
                    {...methods.register("purpose")}
                    required
                    placeholder="Example: I am writing an email to my boss for salary increment."
                    className="rounded-2xl"
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
                    className="rounded-2xl"
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
                    className="rounded-2xl"
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
                    className="rounded-2xl"
                  />
                </FormControl>
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
                    {...methods.register("maxLength", { valueAsNumber: true })}
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
              <Button type="submit" disabled={loading}>
                {loading ? "Generating..." : "Generate Email"}
              </Button>
              {error && <FormMessage>{error}</FormMessage>}
            </form>
          </FormProvider>
        </div>
      </div>
      <div className="p-5" style={{ width: "60%" }}>
        <div style={{ width: "100%" }}>
          {generatedEmail && (
            <div className="email-output">
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
          )}
        </div>
      </div>
    </>
  );
};

export default EmailForm;
