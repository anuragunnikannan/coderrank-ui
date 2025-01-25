"use client";
import { createTheme, ThemeProvider, useMediaQuery } from '@mui/material';
import React, { createContext, useEffect, useState } from 'react'
export const ModeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");

    useEffect(() => {
        setMode(prefersDarkMode ? "dark" : "light");
    }, [prefersDarkMode]);

    const lightTheme = createTheme({
        typography: {
            fontFamily: "system-ui, sans-serif",
            button: {
                textTransform: "none"
            },
        },
        palette: {
            mode: "light",
            background: "#fafafa",
            secondaryBackground: "#efefef",
            textColor: "#111111",

            primary: {
                main: "#1a5fb4",
            },
            success: {
                main: '#26a269',
            },
            warning: {
                main: '#e66100'
            },
            error: {
                main: "#c01c28"
            }
        }
    })

    const darkTheme = createTheme({
        typography: {
            fontFamily: "system-ui, sans-serif",
            button: {
                textTransform: "none"
            },
        },
        palette: {
            mode: "dark",
            background: "#242424",
            secondaryBackground: "#303030",
            textColor: "#eeeeee",
            primary: {
                main: "#66a1d1",
            },
            success: {
                main: "#26a269",
            },
            warning: {
                main: '#e66100'
            },
            error: {
                main: "#c01c28"
            }
        }
    })
    return (
        <>
            <ModeContext.Provider value={{ mode, setMode }}>
                <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
                    {children}
                </ThemeProvider>
            </ModeContext.Provider>
        </>
    )
}