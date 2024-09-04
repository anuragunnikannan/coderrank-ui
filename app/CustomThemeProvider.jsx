"use client";
import { createTheme, ThemeProvider } from '@mui/material';
import React, { createContext, useState } from 'react'
export const ModeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
    const [mode, setMode] = useState("light");

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
            textColor: "#111111",
            primary: {
                main: "#1a5fb4",
            },
            success: {
                main: '#26a269',
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
            textColor: "#eeeeee",
            primary: {
                main: "#1a5fb4",
            },
            success: {
                main: "#26a269",
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