import { createContext, useContext, useState, useEffect, use } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

    const [dark, setDark] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {

        if(dark) {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }

    }, [dark]);

    const toggleTheme = () => setDark(prev => !prev);


    return (
        <ThemeContext.Provider value={{dark, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}