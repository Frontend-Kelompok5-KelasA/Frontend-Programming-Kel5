
"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import LoginFirst from "./LoginFirst";

interface AuthPromptContextType {
    requireLogin: () => Promise<boolean>;
}

const AuthPromptContext = createContext<AuthPromptContextType | null>(null);

export function useAuthPrompt() {
    const context = useContext(AuthPromptContext);

    if (!context) {
        throw new Error("useAuthPrompt harus digunakan di dalam AuthPromptProvider");
    }

    return context;
}

export default function AuthPromptProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const [showModal, setShowModal] = useState(false);

    const requireLogin = useCallback(async () => {
        try {
            const response = await fetch("/api/session", {
                cache: "no-store"
            });

            const session = await response.json();

            if (session) {
                return true;
            }

            setShowModal(true);
            return false;

        } catch (error) {
            console.error("Gagal memeriksa session:", error);
            return false;
        }
    }, []);

    // Memungkinkan script TypeScript biasa memanggil modal ini.
    useEffect(() => {
        const handleRequireLogin = () => {
            requireLogin();
        };

        window.addEventListener("require-login", handleRequireLogin);

        return () => {
            window.removeEventListener("require-login", handleRequireLogin);
        };
    }, [requireLogin]);

    return (
        <AuthPromptContext.Provider value={{ requireLogin }}>
            {children}

            <LoginFirst
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </AuthPromptContext.Provider>
    );
}
