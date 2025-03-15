"use client";
import { Avatar, Box, Button, Menu, MenuItem, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import styles from "./Navbar.module.css"
import { ModeContext } from '@/app/CustomThemeProvider'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { api } from '@/utils/apiFile';
import Cookies from 'js-cookie';
import { AccountCircle, Logout } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {

    const { mode, setMode } = useContext(ModeContext);
    const [userData, setUserData] = useState({});
    const [displayAvatar, setDisplayAvatar] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const router = useRouter();
    const pathname = usePathname();

    const toggleTheme = () => {
        setMode(mode === "light" ? "dark" : "light");
    }

    useEffect(() => {
        if (Cookies.get("isLoggedIn")) {
            setDisplayAvatar(true);
            api.get(`${process.env.NEXT_PUBLIC_API_URL}/get-user-data`).then((res) => {
                setUserData(res?.data);
            })
        }

    }, [])

    const randomColor = (string) => {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string?.length; i += 1) {
            hash = string?.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    const stringAvatar = (name) => {
        let initials = name?.toUpperCase()?.split(' ');
        if (initials?.length === 1)
            initials = initials[0]?.slice(0, 2);
        else if (initials?.length > 1)
            initials = initials[0][0] + initials[initials.length - 1][0];
        return {
            sx: {
                "&:hover": { cursor: "pointer" },
                bgcolor: randomColor(name),
            },
            children: initials,
        };
    }

    const handleLoginClick = () => {
        router.push(`/auth?redirect_url=${pathname}`);
    }

    const logout = () => {
        api.post("/logout").then((res) => {
            Cookies.remove("isLoggedIn");
            Cookies.remove("accessToken");
            router.push("/");
        })
            .catch((err) => {
                Cookies.remove("isLoggedIn");
                Cookies.remove("accessToken");
                router.push("/");
            })
    }

    return (
        <>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "background"
                    }
                }}
            >
                <MenuItem
                    onClick={() => {
                        router.push("/home/profile");
                        setAnchorEl(null);
                    }}
                    sx={{ display: "flex", gap: "10px" }}
                >
                    <AccountCircle />
                    <Typography>Profile</Typography>
                </MenuItem>
                <MenuItem onClick={() => logout()} sx={{ display: "flex", gap: "10px" }}>
                    <Logout />
                    <Typography>Logout</Typography>
                </MenuItem>
            </Menu>

            <Box className={styles.navbar}>
                <Typography variant="h4" sx={{ fontWeight: "900", color: "white", cursor: "pointer" }} onClick={() => router.push("/home")}>CoderRank</Typography>

                <Box className={styles.right_container}>
                    <Box onClick={toggleTheme}>
                        {mode === "light" ? <DarkModeIcon sx={{
                            color: "white", "&:hover": {
                                cursor: "pointer"
                            }
                        }} /> : <LightModeIcon sx={{
                            color: "white", "&:hover": {
                                cursor: "pointer"
                            }
                        }} />}
                    </Box>

                    {displayAvatar ?
                        <Avatar
                            {...stringAvatar(userData?.user_name)}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                        />
                        :
                        <Button variant="contained" sx={{ backgroundColor: "success.main", fontWeight: "bold" }} onClick={handleLoginClick}>Login</Button>
                    }
                </Box>

            </Box>

        </>

    )
}

export default Navbar