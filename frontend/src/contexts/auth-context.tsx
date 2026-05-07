import { createContext, useCallback, useEffect, useState } from "react";
import type { JwtDto } from "../libs/dto/JwtDto";

const STORAGE_KEY = "CART_SHOP";

interface AuthContextType {
    state: JwtDto | null;
    /** null = đang load, true = đã xác thực, false = chưa đăng nhập */
    isAuthenticated: boolean | null;
    saveState: (jwtDto: JwtDto) => void;
    clearState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<JwtDto | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const fetchAuthConfig = useCallback(async () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                setIsAuthenticated(false);
                return;
            }
            const store: JwtDto = JSON.parse(raw);
            // Coi là đăng nhập nếu có token
            if (store?.token) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
                setState(store);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch {
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        void fetchAuthConfig();
    }, [fetchAuthConfig]);

    const saveState = (jwtDto: JwtDto) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jwtDto));
        setState(jwtDto);
        setIsAuthenticated(true);
    };

    const clearState = () => {
        localStorage.removeItem(STORAGE_KEY);
        setState(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            state,
            isAuthenticated,
            saveState,
            clearState,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };