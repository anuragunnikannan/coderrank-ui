"use client";
import { Button } from '@mui/material'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React from 'react'

const Buttons = () => {
    const router = useRouter();

    const handleLoginClick = () => {
        if (Cookies.get("isLoggedIn"))
            router.push("/home");
        else
            router.push("/auth");
    }

    return (
        <>
            <Button variant="contained" sx={{ fontSize: '20px', height: "48px", fontWeight: "bold" }} onClick={() => router.push("/home")}>Try Now</Button>
            <Button variant="contained" sx={{ backgroundColor: "success.main", fontSize: '20px', height: "48px", fontWeight: "bold" }} onClick={handleLoginClick}>Login</Button>
        </>
    )
}

export default Buttons