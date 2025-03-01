"use client";
import { Alert, Box, Snackbar } from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";
import styles from "./page.module.css";
import SignUp from "../components/SignUp/SignUp";
import Login from "../components/Login/Login";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const page = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [open, setOpen] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");

    const router = useRouter();

    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={(e) => setOpen(false)}
            >
                <Alert
                    variant="filled"
                    severity={isError === true ? "error" : "success"}
                >
                    {message}
                </Alert>
            </Snackbar>

            <Box className={styles.codeAnimation}>
                {isLogin ? (
                    <Suspense>
                        <Login
                            setIsError={setIsError}
                            setMessage={setMessage}
                            setOpen={setOpen}
                            setIsLogin={setIsLogin}
                        />
                    </Suspense>
                ) : (
                    <SignUp
                        setIsError={setIsError}
                        setMessage={setMessage}
                        setOpen={setOpen}
                        setIsLogin={setIsLogin}
                    />
                )}
            </Box>
        </>
    );
};
export default page;
