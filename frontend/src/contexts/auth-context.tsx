import { createContext, useCallback, useEffect, useState } from "react";
import type { JwtDto } from "../libs/dto/JwtDto";

interface AuthContextType {
    state: JwtDto | null;
    // Used for loading to fetch auth config
    isAuthenticated: boolean | null;
    saveState: (jwtDto: JwtDto) => void;
    clearState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<JwtDto | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const fetchAuthConfig = useCallback(async () => {
        const store: JwtDto = JSON.parse(localStorage.getItem("CART_SHOP") || `{ 
            id: 0,
            name: "",
            email: "",
            token: ""
        }`);
        setState(store);
        setIsAuthenticated(true);
    }, []);

    useEffect(() => {
        void fetchAuthConfig();
    }, []);

    const saveState = (jwtDto: JwtDto) => {
        localStorage.setItem("CART_SHOP", JSON.stringify(jwtDto));
        setState(jwtDto);
    }

    const clearState = () => {

    }

    return (
        <AuthContext.Provider value={{
            state,
            isAuthenticated,
            saveState,
            clearState,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider };