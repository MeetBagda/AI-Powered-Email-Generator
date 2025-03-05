"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Star } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useEmailContext } from '@/context/EmailContext';

interface Email {
    _id: string;
    purpose: string;
    subjectLine: string;
    recipients: string;
    senders: string;
    maxLength: number;
    tone: string;
    generatedEmail: string;
    createdAt: Date;
    isFavorite: boolean;
}

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);
    const [previousEmails, setPreviousEmails] = useState<Email[]>([]);
    const [favoriteEmails, setFavoriteEmails] = useState<Email[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { emailCount } = useEmailContext();
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const fetchEmails = useCallback(async () => {
        if(!userId || !token) {
            setPreviousEmails([])
            return;
        }
        setLoading(true);
        setError(null);

        try {
            // const response = await fetch(`https://ai-powered-email-generator.onrender.com/api/v1/email/emails/user/${userId}`, {
            const response = await fetch(`http://localhost:8888/api/v1/email/emails/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                     'Content-Type': 'application/json',
                },
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || `Failed to fetch emails: ${response.status}`);
            }
            const data = await response.json();
           setPreviousEmails(data.emails || []);

        } catch (err: any) {
            console.error("Error fetching emails:", err);
            setError(err.message || "Failed to fetch emails, please try again");
        } finally {
            setLoading(false);
        }
    }, [userId, token]);

    const fetchFavoriteEmails = useCallback(async () => {
           if(!userId || !token) {
            setFavoriteEmails([])
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://ai-powered-email-generator.onrender.com/api/v1/email/emails/user/${userId}/favorites`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                     'Content-Type': 'application/json',
                },
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || `Failed to fetch emails: ${response.status}`);
            }
            const data = await response.json();
           setFavoriteEmails(data.emails || []);
        } catch (err: any) {
            console.error("Error fetching favorite emails:", err);
            setError(err.message || "Failed to fetch favorite emails, please try again");
        } finally {
           setLoading(false);
        }
     }, [userId, token]);


    useEffect(() => {
        fetchEmails();
    }, [fetchEmails, emailCount]);

    useEffect(() => {
        fetchFavoriteEmails();
    }, [fetchFavoriteEmails, emailCount]);

    const reversedEmails = [...previousEmails].reverse();
    const reversedFavoriteEmails = [...favoriteEmails].reverse();


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/signin");
    };

    const copyToClipboard = async (emailText: string) => {
        if (!emailText) return;

        try {
            await navigator.clipboard.writeText(emailText);
            alert("Email copied to clipboard!");
        } catch (error) {
            console.error("Error copying to clipboard:", error);
            alert("Failed to copy email to clipboard.");
        }
    };
   const handleFavorite = async (emailId:string) => {
        try {
            const response = await fetch(`https://ai-powered-email-generator.onrender.com/api/v1/email/emails/${emailId}/favorite`, {
                  method: 'PUT',
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                  },
               });

            if(!response.ok){
                const errorData = await response.json()
                throw new Error(errorData.msg || "Error while changing favorite state")
            }
             fetchEmails();
             fetchFavoriteEmails()

        } catch (err: any) {
            console.error("Error during changing favorites:", err);
            setError(err.message || "Failed to update favorites, please try again");
        }
    };


    return (
        <div className="flex flex-row items-center w-full h-14 border-b-2 text-xl font-bold text-slate-700 pt-3 pl-5 justify-between">
            <div className="flex flex-row gap-3 items-center">
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="30"
                        height="30"
                        viewBox="0 0 48 48"
                    >
                        <path
                            fill="#4caf50"
                            d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"
                        ></path>
                        <path
                            fill="#1e88e5"
                            d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"
                        ></path>
                        <polygon
                            fill="#e53935"
                            points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"
                        ></polygon>
                        <path
                            fill="#c62828"
                            d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"
                        ></path>
                        <path
                            fill="#fbc02d"
                            d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"
                        ></path>
                    </svg>
                </div>
                <div>Email Generator</div>
            </div>
            <div className="pr-5 flex items-center gap-4">

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history"><path d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0"/><polyline points="12 8 12 12 14 14"/></svg>
                            History
                        </Button>

                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                            <DialogTitle>Previous Emails ({previousEmails.length})</DialogTitle>
                            <DialogDescription>
                               Here is list of your previous emails
                            </DialogDescription>
                        </DialogHeader>
                        {loading ? (
                            <div className="flex justify-center items-center">Loading...</div>
                        ) : error ? (
                            <div className="text-red-500">{error}</div>
                        ) : (
                            <div className="max-h-[400px] overflow-y-auto">
                                {reversedEmails.map((email) => (
                                    <div key={email._id} className="border-b pb-4 mb-4 flex flex-col gap-2">
                                        <div>
                                            <div className='flex flex-row justify-between items-center gap-2'>
                                                <div className='flex flex-col '>
                                                    <p className="font-bold">To: {email.recipients}</p>
                                                    <p className="font-semibold">From: {email.senders}</p>
                                                </div>
                                                <div className="flex flex-row items-center gap-2">
                                                    <TooltipProvider delayDuration={0}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="disabled:opacity-100"
                                                                    onClick={()=>copyToClipboard(email.generatedEmail)}
                                                                >
                                                                    <Copy size={16} strokeWidth={2} aria-hidden="true" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="px-2 py-1 text-xs">
                                                                Click to copy
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <TooltipProvider delayDuration={0}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="disabled:opacity-100"
                                                                    onClick={() => handleFavorite(email._id)}
                                                                >
                                                                    <Star size={16} strokeWidth={2} aria-hidden="true" fill={email.isFavorite ? "#ffc107" : "none"}  />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="px-2 py-1 text-xs">
                                                                 {email.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                            <p className="font-semibold">Subject: {email.subjectLine}</p>
                                            <p>Purpose: {email.purpose}</p>
                                        </div>
                                        <div className="flex flex-row justify-between items-center">
                                            <pre className="text-slate-700" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", width: '80%' }}>
                                                {email.generatedEmail}
                                            </pre>


                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}

                    </DialogContent>
                </Dialog>
                 <Dialog open={isFavoriteOpen} onOpenChange={setIsFavoriteOpen}>
                    <DialogTrigger asChild>
                         <Button variant="outline">
                                <Star size={20} /> Favorites
                          </Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                            <DialogTitle>Favorite Emails ({favoriteEmails.length})</DialogTitle>
                           <DialogDescription>
                                Here is list of your favorited emails
                            </DialogDescription>
                        </DialogHeader>
                      {loading ? (
                            <div className="flex justify-center items-center">Loading...</div>
                         ) : error ? (
                            <div className="text-red-500">{error}</div>
                        ) : (
                            <div className="max-h-[400px] overflow-y-auto">
                                {reversedFavoriteEmails.map((email) => (
                                    <div key={email._id} className="border-b pb-4 mb-4 flex flex-col gap-2">
                                        <div>
                                            <div className='flex flex-row justify-between items-center gap-2'>
                                                <div className='flex flex-col '>
                                                    <p className="font-bold">To: {email.recipients}</p>
                                                    <p className="font-semibold">From: {email.senders}</p>
                                                </div>
                                                <div className="flex flex-row items-center gap-2">
                                                    <TooltipProvider delayDuration={0}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="disabled:opacity-100"
                                                                    onClick={()=>copyToClipboard(email.generatedEmail)}
                                                                >
                                                                    <Copy size={16} strokeWidth={2} aria-hidden="true" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="px-2 py-1 text-xs">
                                                                Click to copy
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <TooltipProvider delayDuration={0}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="disabled:opacity-100"
                                                                    onClick={() => handleFavorite(email._id)}
                                                                >
                                                                    <Star size={16} strokeWidth={2} aria-hidden="true" fill={email.isFavorite ? "#ffc107" : "none"}  />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="px-2 py-1 text-xs">
                                                                  {email.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                            <p className="font-semibold">Subject: {email.subjectLine}</p>
                                            <p>Purpose: {email.purpose}</p>
                                        </div>
                                        <div className="flex flex-row justify-between items-center">
                                            <pre className="text-slate-700" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", width: '80%' }}>
                                                {email.generatedEmail}
                                            </pre>


                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}

                    </DialogContent>
                </Dialog>
                <Button variant="destructive" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </div>
    );
}

export default Header;