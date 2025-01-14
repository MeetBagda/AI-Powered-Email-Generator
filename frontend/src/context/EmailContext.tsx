// frontend/src/context/EmailContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Email {
    from: string;
    to: string;
    subject: string;
    body: string;
    timestamp: Date;
    isRead?: boolean; // Optional property if needed
    id: string // Example of adding an ID
}


interface EmailContextType {
  previousEmails: Email[];
  addEmail: (newEmail: Email) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);


interface EmailProviderProps {
  children: ReactNode;
}

export const EmailProvider: React.FC<EmailProviderProps> = ({ children }) => {
    const [previousEmails, setPreviousEmails] = useState<Email[]>([]);

    const addEmail = (newEmail: Email) => {
        setPreviousEmails((prevEmails) => [newEmail, ...prevEmails]);
    };

    return (
        <EmailContext.Provider value={{ previousEmails, addEmail }}>
            {children}
        </EmailContext.Provider>
    );
};

export const useEmail = (): EmailContextType => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};