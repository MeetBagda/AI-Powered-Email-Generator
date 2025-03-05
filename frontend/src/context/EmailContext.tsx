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
  emailCount: number;
  incrementEmailCount: () => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

interface EmailProviderProps {
  children: ReactNode;
}

export const EmailProvider: React.FC<EmailProviderProps> = ({ children }) => {
    const [previousEmails, setPreviousEmails] = useState<Email[]>([]);
    const [emailCount, setEmailCount] = useState(0);

    const addEmail = (newEmail: Email) => {
        setPreviousEmails((prevEmails) => [newEmail, ...prevEmails]);
    };

    const incrementEmailCount = () => {
        setEmailCount((prevCount) => prevCount + 1);
    };

    return (
        <EmailContext.Provider value={{ previousEmails, addEmail, emailCount, incrementEmailCount }}>
            {children}
        </EmailContext.Provider>
    );
};

// Changed from useEmail to useEmailContext for consistency
export const useEmailContext = (): EmailContextType => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmailContext must be used within an EmailProvider');
  }
  return context;
};