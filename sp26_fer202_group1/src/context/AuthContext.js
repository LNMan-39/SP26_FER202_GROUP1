import { createContext, useState } from "react";

export const AuthorContext = createContext();

function AuthorProvider({ children }) {

    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const isAdmin = () => {
        return user && user.role === "admin";
    };

    return (
        <AuthorContext.Provider value={{ user, login, logout, isAdmin }}>
            {children}
        </AuthorContext.Provider>
    );
}

export default AuthorProvider;