import { useState, useEffect } from 'react';

/**
 * Custom hook to handle dark mode theme switching.
 * It uses localStorage to persist the theme and toggles between 'dark' and 'light' themes.
 *
 * @returns {[string, Function]} - An array with the opposite theme and a function to set the theme.
 */
function useDarkMode() {
    // Initialize theme state from localStorage or default to 'light'
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    // Determine the opposite theme
    const colorTheme = theme === 'dark' ? 'light' : 'dark';

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove the current theme and add the new theme
        root.classList.remove(colorTheme);
        root.classList.add(theme);

        // Save the theme to localStorage
        localStorage.setItem('theme', theme);
    }, [theme, colorTheme]);

    return [colorTheme, setTheme];
}

export default useDarkMode;
