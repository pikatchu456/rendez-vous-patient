import { Children, createContext, useState } from "react";

export const ThemeContext = createContext()

const ThemeContextProvider = ({Children}) => {

    const [theme, setTheme] = useState("light")

    const toggleTheme = () => {
        if (theme === 'light') {
            document.body.classList.remove('light')
            document.body.classList.add("dark");
            setTheme('dark');}
        else {
             document.body.classList.remove("dark");
             document.body.classList.add("light");            
            setTheme("light");}
    }

    return <ThemeContext.Provider value={{theme, toggleTheme}}>
        {Children}
    </ThemeContext.Provider>
}

export default ThemeContextProvider