//authContext.tsx
import React, { createContext, useState, useContext } from 'react';
interface User {
    username?: string;
    email?: string;
    _id?: string;
    __v?: number
}
interface AuthContextType{
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextType>({user: null, setUser: ()=>null});
export const AuthProvider = ({children}: {children: React.ReactNode})=>{
    const [user, setUser] = useState<User | null>(null);
    return (
        <AuthContext.Provider value = {{user, setUser}}>
          {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);